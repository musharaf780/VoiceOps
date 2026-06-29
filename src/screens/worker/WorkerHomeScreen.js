import { Feather } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MetricCard from '../../components/MetricCard';
import RecordButton from '../../components/RecordButton';
import ReportCard from '../../components/ReportCard';
import WaveformVisualizer from '../../components/WaveformVisualizer';
import { useAuth } from '../../context/AuthProvider';
import { REPORTS, WORKER } from '../../data';
import { transcribeAudio } from '../../lib/whisper';
import { extractFieldReport } from '../../lib/voiceReportExtractor';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

// In dev, send the bundled sample instead of the actual recording
async function getAudioUriForTranscription(recordedUri) {
  if (__DEV__) {
    const asset = Asset.fromModule(require('../../../assets/sample-audio.mp3'));
    await asset.downloadAsync();
    return asset.localUri;
  }
  return recordedUri;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTodayLabel() {
  return new Date()
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase()
    .replace(',', ' ·')
    .replace(',', '');
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString();
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function WorkerHomeScreen({ navigation }) {
  const [recordingState, setRecordingState] = useState('idle');
  const [elapsed, setElapsed] = useState(0);
  const [recordingUri, setRecordingUri] = useState(null);
  const [savedDuration, setSavedDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [audioUri, setAudioUri] = useState(null);

  const contentOpacity = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);
  const elapsedRef = useRef(0);
  const isStopping = useRef(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);
  const samplePlayer = useAudioPlayer(
    require('../../../assets/sample-audio.mp3'),
    { downloadFirst: true },
  );
  const sampleStatus = useAudioPlayerStatus(samplePlayer);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, shouldRouteThroughEarpiece: false });
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (recordingState === 'idle') {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [recordingState]);

  const doFadeIn = useCallback(() => {
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [contentOpacity]);

  const stopRecording = useCallback(async () => {
    if (isStopping.current) return;
    isStopping.current = true;

    clearInterval(timerRef.current);
    setSavedDuration(elapsedRef.current);
    setRecordingState('processing');
    doFadeIn();

    let uri = null;
    try {
      await audioRecorder.stop();
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        shouldRouteThroughEarpiece: false,
      });
      uri = audioRecorder.uri ?? null;
      if (uri) {
        setRecordingUri(uri);
        player.replace({ uri });
      }
    } catch { }

    setRecordingState('recorded');

    // Transcribe in background after UI transitions to recorded state
    setTranscription('');
    setTranscribeError('');
    setAudioUri(null);
    setTranscribing(true);
    try {
      const resolvedAudioUri = await getAudioUriForTranscription(uri);
      const text = await transcribeAudio(resolvedAudioUri);
      setTranscription(text);
      setAudioUri(resolvedAudioUri);
    } catch (e) {
      setTranscribeError(e.message ?? 'Transcription failed');
    } finally {
      setTranscribing(false);
    }
  }, [audioRecorder, doFadeIn, player]);



  useEffect(() => {
    if (elapsed >= 60 && recordingState === 'recording') {
      stopRecording();
    }
  }, [elapsed]);

  const startRecording = useCallback(async () => {
    const { granted } = await requestRecordingPermissionsAsync();
    if (!granted) return;

    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true,
      shouldRouteThroughEarpiece: false,
    });

    isStopping.current = false;
    setElapsed(0);
    elapsedRef.current = 0;
    setTranscription('');
    setTranscribeError('');
    setRecordingState('recording');

    Animated.timing(contentOpacity, {
      toValue: 0.25,
      duration: 300,
      useNativeDriver: true,
    }).start();

    timerRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        elapsedRef.current = next;
        return next;
      });
    }, 1000);

    try {
      await audioRecorder.prepareToRecordAsync();
    } catch { }
    audioRecorder.record();
  }, [audioRecorder, contentOpacity]);

  const discard = useCallback(() => {
    player.pause();
    samplePlayer.pause();
    setRecordingUri(null);
    setSavedDuration(0);
    setElapsed(0);
    elapsedRef.current = 0;
    setTranscription('');
    setTranscribeError('');
    setAudioUri(null);
    setExtracting(false);
    setRecordingState('idle');
  }, [player, samplePlayer]);

  const progressWidth = Math.min((elapsed / 60) * 280, 280);

  const { user } = useAuth();
  const fullName = user?.user_metadata?.full_name || WORKER.name;
  const firstName = fullName.split(' ')[0];

  const isRecording = recordingState === 'recording';
  const isProcessing = recordingState === 'processing';
  const isRecorded = recordingState === 'recorded';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        scrollEnabled={!isRecording}
      >
        <Animated.View
          style={{ opacity: contentOpacity }}
          pointerEvents={isRecording ? 'none' : 'auto'}
        >
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greetingLabel}>{getGreeting()}</Text>
              <Text style={styles.greetingName}>{firstName}</Text>
            </View>
            <View style={styles.datePill}>
              <Text style={styles.dateText}>{getTodayLabel()}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <MetricCard value={WORKER.stats.today} label="TODAY" />
            <MetricCard value={WORKER.stats.thisWeek} label="THIS WEEK" />
            <MetricCard value={`${WORKER.stats.streak}🔥`} label="STREAK" valueColor={colors.green} />
          </View>
        </Animated.View>

        <View style={styles.recordArea}>
          {!isRecorded ? (
            <>
              <RecordButton
                state={recordingState}
                onPressIn={!isProcessing ? startRecording : undefined}
                onPressOut={isRecording ? stopRecording : undefined}
              />

              {!isRecording && !isProcessing && (
                <View style={styles.hintRow}>
                  <Text style={styles.hintLabel}>Hold to </Text>
                  <Text style={styles.hintLabelBold}>record</Text>
                </View>
              )}

              {isRecording && (
                <>
                  <Text style={[styles.hintLabel, { color: colors.blue }]}>Release to process</Text>
                  <WaveformVisualizer animated style={styles.waveform} />
                  <View style={styles.timerRow}>
                    <Text style={styles.timerMain}>{formatTime(elapsed)}</Text>
                    <Text style={styles.timerMax}> / 1:00</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: progressWidth }]} />
                  </View>
                </>
              )}

              {isProcessing && (
                <Text style={[styles.hintLabel, { color: colors.amber }]}>Processing…</Text>
              )}
            </>
          ) : (
            <View style={styles.playbackCard}>
              <View style={styles.playbackHeader}>
                <Feather name="mic" size={14} color={colors.blue} />
                <Text style={styles.playbackTitle}>Voice note · {formatTime(savedDuration)}</Text>
              </View>

              <Pressable
                style={styles.playButton}
                onPress={async () => {
                  if (sampleStatus.playing) {
                    samplePlayer.pause();
                  } else {
                    try { await samplePlayer.seekTo(0); } catch { }
                    samplePlayer.play();
                  }
                }}
              >
                <Feather
                  name={sampleStatus.playing ? 'pause-circle' : 'play-circle'}
                  size={56}
                  color={colors.blue}
                />
                <Text style={styles.playButtonText}>
                  {sampleStatus.playing ? 'Pause' : 'Play sample'}
                </Text>
              </Pressable>

              {/* Transcription area */}
              <View style={styles.transcriptBox}>
                {transcribing && (
                  <View style={styles.transcriptRow}>
                    <Feather name="loader" size={13} color={colors.textTertiary} />
                    <Text style={styles.transcriptLoading}>Transcribing…</Text>
                  </View>
                )}
                {!!transcription && (
                  <Text style={styles.transcriptText}>{transcription}</Text>
                )}
                {!!transcribeError && (
                  <Text style={styles.transcriptError}>{transcribeError}</Text>
                )}
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  style={[styles.submitBtn, extracting && { opacity: 0.6 }]}
                  disabled={extracting}
                  onPress={async () => {
                    setExtracting(true);
                    try {
                      const workerInfo = {
                        workerId: user?.id ?? WORKER.id,
                        workerName: fullName,
                        workerInitials: fullName
                          .split(' ')
                          .map(w => w[0])
                          .join('')
                          .toUpperCase(),
                      };
                      const report = await extractFieldReport(transcription, workerInfo);
                      navigation.navigate('ReportPreview', { report, audioUri });
                    } catch (e) {
                      setTranscribeError(e.message ?? 'Failed to build report');
                    } finally {
                      setExtracting(false);
                    }
                  }}
                >
                  <Text style={styles.submitText}>
                    {extracting ? 'Building report…' : 'Submit report'}
                  </Text>
                </Pressable>
                <Pressable style={styles.rerecordBtn} onPress={discard}>
                  <Text style={styles.rerecordText}>Re-record</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <Animated.View
          style={{ opacity: contentOpacity }}
          pointerEvents={isRecording ? 'none' : 'auto'}
        >
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent reports</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>
          {REPORTS.slice(0, 2).map(r => (
            <ReportCard
              key={r.id}
              report={r}
              onPress={() => navigation.navigate('ReportPreview', { report: r })}
            />
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },

  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingLabel: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  greetingName: {
    fontFamily: fonts.inter.bold,
    fontSize: 26,
    letterSpacing: -0.6,
    color: colors.navy,
  },
  datePill: {
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 1,
  },
  dateText: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    color: colors.textTertiary,
    letterSpacing: 0.3,
  },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },

  recordArea: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingBottom: 28,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  hintLabel: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 0.13,
    marginTop: 4,
  },
  hintLabelBold: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 13,
    color: colors.navy,
    marginTop: 4,
  },
  waveform: { marginTop: 16 },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
  },
  timerMain: {
    fontFamily: fonts.mono.medium,
    fontSize: 32,
    color: colors.navy,
    letterSpacing: -0.64,
  },
  timerMax: {
    fontFamily: fonts.mono.regular,
    fontSize: 16,
    color: colors.textTertiary,
  },
  progressTrack: {
    marginTop: 10,
    width: 280,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.blue,
  },

  playbackCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: colors.bgSurface,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 3,
  },
  playbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  playbackTitle: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 15,
    letterSpacing: -0.15,
    color: colors.navy,
  },
  playButton: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  playButtonText: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 14,
    color: colors.blue,
    letterSpacing: -0.14,
  },

  transcriptBox: {
    width: '100%',
    marginTop: 16,
    minHeight: 40,
  },
  transcriptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transcriptLoading: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textTertiary,
  },
  transcriptText: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  transcriptError: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.red,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  submitBtn: {
    backgroundColor: colors.navy,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 26,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitText: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 14,
    color: '#fff',
    letterSpacing: -0.14,
  },
  rerecordBtn: {
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  rerecordText: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },

  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontFamily: fonts.inter.bold,
    fontSize: 17,
    letterSpacing: -0.3,
    color: colors.navy,
  },
  seeAll: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.blue,
  },
});
