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
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
} from 'expo-audio';
import { Feather } from '@expo/vector-icons';
import MetricCard from '../../components/MetricCard';
import RecordButton from '../../components/RecordButton';
import ReportCard from '../../components/ReportCard';
import WaveformVisualizer from '../../components/WaveformVisualizer';
import { useAuth } from '../../context/AuthProvider';
import { REPORTS, WORKER } from '../../data';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

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

  // Reset opacity when returning to idle
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

    try {
      await audioRecorder.stop();
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        shouldRouteThroughEarpiece: false,
      });
      if (audioRecorder.uri) {
        setRecordingUri(audioRecorder.uri);
        player.replace({ uri: audioRecorder.uri });
      }
    } catch {}

    setRecordingState('recorded');
  }, [audioRecorder, doFadeIn, player]);

  // Auto-stop at the 60-second limit
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

    // useAudioRecorder auto-prepares on mount and remains prepared after stop(),
    // so prepareToRecordAsync will throw if called twice — safe to ignore
    try {
      await audioRecorder.prepareToRecordAsync();
    } catch {}
    audioRecorder.record();
  }, [audioRecorder, contentOpacity]);

  useEffect(() => {
    // Route audio to speaker on both platforms
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldRouteThroughEarpiece: false,
    });
    return () => clearInterval(timerRef.current);
  }, []);

  const discard = useCallback(() => {
    player.pause();
    samplePlayer.pause();
    setRecordingUri(null);
    setSavedDuration(0);
    setElapsed(0);
    elapsedRef.current = 0;
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
        {/* Top section — fades during recording */}
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

        {/* Record area — always fully visible */}
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
                    try { await samplePlayer.seekTo(0); } catch {}
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

              <View style={styles.actionRow}>
                <Pressable
                  style={styles.submitBtn}
                  onPress={() => navigation.navigate('ReportPreview', { report: REPORTS[0] })}
                >
                  <Text style={styles.submitText}>Submit report</Text>
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
    fontSize: 24,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  datePill: {
    backgroundColor: colors.bgSurface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 4,
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
    color: colors.textPrimary,
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
    color: colors.textPrimary,
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
    backgroundColor: 'rgba(0,0,0,0.07)',
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
    color: colors.textPrimary,
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
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  submitBtn: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 22,
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
    fontFamily: fonts.inter.semiBold,
    fontSize: 15,
    letterSpacing: -0.15,
    color: colors.textPrimary,
  },
  seeAll: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.blue,
  },
});
