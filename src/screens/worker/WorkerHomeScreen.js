import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Animated, Pressable, StatusBar,
  ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { WORKER, REPORTS } from '../../data';
import RecordButton from '../../components/RecordButton';
import WaveformVisualizer from '../../components/WaveformVisualizer';
import MetricCard from '../../components/MetricCard';
import ReportCard from '../../components/ReportCard';

export default function WorkerHomeScreen({ navigation }) {
  const [recordingState, setRecordingState] = useState('idle');
  const [elapsed, setElapsed] = useState(0);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  const startRecording = () => {
    setRecordingState('recording');
    setElapsed(0);
    Animated.timing(contentOpacity, {
      toValue: 0.25,
      duration: 300,
      useNativeDriver: true,
    }).start();
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    setRecordingState('processing');
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setRecordingState('idle');
      navigation.navigate('ReportPreview', { report: REPORTS[0] });
    }, 1500);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const progressWidth = Math.min((elapsed / 60) * 280, 280);
  const minutes = Math.floor(elapsed / 60).toString().padStart(1, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');
  const timerStr = `${minutes}:${seconds}`;

  const isRecording = recordingState === 'recording';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        scrollEnabled={!isRecording}
      >
        <Animated.View style={{ opacity: contentOpacity }}>
          <Text style={styles.greeting}>Good morning, {WORKER.name.split(' ')[0]}</Text>
          <Text style={styles.date}>TUE · JUN 24, 2026</Text>

          <View style={styles.statsRow}>
            <MetricCard value={WORKER.stats.today} label="TODAY" />
            <MetricCard value={WORKER.stats.thisWeek} label="THIS WEEK" />
            <MetricCard value={`${WORKER.stats.streak}🔥`} label="STREAK" valueColor={colors.green} />
          </View>
        </Animated.View>

        <View style={styles.recordArea}>
          <RecordButton
            state={recordingState}
            onPressIn={startRecording}
            onPressOut={isRecording ? stopRecording : undefined}
          />
          {!isRecording && recordingState !== 'processing' && (
            <Text style={styles.hintLabel}>Hold to record</Text>
          )}
          {isRecording && (
            <>
              <Text style={styles.hintLabel}>Release to process</Text>
              <WaveformVisualizer animated style={styles.waveform} />
              <View style={styles.timerRow}>
                <Text style={styles.timerMain}>{timerStr}</Text>
                <Text style={styles.timerMax}>/1:00</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
            </>
          )}
          {recordingState === 'processing' && (
            <Text style={styles.hintLabel}>Processing…</Text>
          )}
        </View>

        <Animated.View style={{ opacity: contentOpacity }}>
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
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  greeting: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  date: {
    fontFamily: fonts.mono.regular,
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: 16,
  },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  recordArea: { alignItems: 'center', paddingVertical: 8, paddingBottom: 24 },
  hintLabel: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 0.13,
    marginTop: 4,
  },
  waveform: { marginTop: 16 },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
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
