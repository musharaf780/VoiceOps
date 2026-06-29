import React from 'react';
import {
  View, Text, Pressable, ScrollView, StatusBar, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import WaveformVisualizer from '../../components/WaveformVisualizer';

export default function ErrorStateScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />

      <View style={styles.topNav}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color={colors.blue} />
        </Pressable>
        <Text style={styles.navTitle}>Processing Error</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Error card */}
        <View style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <Feather name="alert-triangle" size={18} color={colors.red} />
            <Text style={styles.errorTitle}>Processing failed</Text>
          </View>
          <Text style={styles.errorSubtext}>
            We couldn't process your recording automatically. Your audio has been saved safely below. You can try again or submit the raw transcript.
          </Text>
          <View style={styles.errorBtns}>
            <Pressable style={styles.tryAgainBtn}>
              <Text style={styles.tryAgainText}>Try again</Text>
            </Pressable>
            <Pressable style={styles.rawBtn}>
              <Text style={styles.rawBtnText}>Submit raw</Text>
            </Pressable>
          </View>
        </View>

        {/* Raw transcript card */}
        <View style={styles.transcriptCard}>
          <View style={styles.transcriptHeader}>
            <Feather name="mic" size={13} color={colors.textSecondary} />
            <Text style={styles.transcriptHeaderText}>YOUR RECORDING — SAVED</Text>
            <View style={styles.savedDot} />
          </View>
          <View style={styles.transcriptBody}>
            <Text style={styles.transcriptText}>
              "Generator at Building C has been making a loud noise since this morning. Cooling fan looks damaged. Someone should check before end of shift."
            </Text>
          </View>
        </View>

        {/* Playback row */}
        <View style={styles.recordingRow}>
          <Pressable style={styles.playBtn}>
            <Feather name="play" size={16} color={colors.blue} />
          </Pressable>
          <WaveformVisualizer animated={false} style={{ flex: 1, height: 28 }} />
          <Text style={styles.duration}>0:18</Text>
        </View>

        {/* Reassurance note */}
        <View style={styles.reassuranceNote}>
          <Feather name="info" size={14} color={colors.green} style={{ marginTop: 1 }} />
          <Text style={styles.reassuranceText}>
            Your recording is safely stored and won't be lost. You can submit it manually and a manager will review it directly.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  topNav: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navTitle: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 16,
    color: colors.navy,
  },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, gap: 14, paddingBottom: 24 },
  errorCard: {
    backgroundColor: 'rgba(239,68,68,0.07)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.22)',
    borderLeftWidth: 4,
    borderLeftColor: colors.red,
    padding: 16,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  errorTitle: {
    fontFamily: fonts.inter.bold,
    fontSize: 15,
    color: colors.red,
  },
  errorSubtext: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20.15,
    marginBottom: 14,
  },
  errorBtns: { flexDirection: 'row', gap: 8 },
  tryAgainBtn: {
    flex: 1,
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tryAgainText: {
    fontFamily: fonts.inter.bold,
    fontSize: 13,
    color: 'white',
  },
  rawBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rawBtnText: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  transcriptCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  transcriptHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transcriptHeaderText: {
    fontFamily: fonts.inter.bold,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.44,
    textTransform: 'uppercase',
    flex: 1,
  },
  savedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  transcriptBody: { paddingHorizontal: 14, paddingVertical: 14 },
  transcriptText: {
    fontFamily: fonts.mono.regular,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 20.4,
  },
  recordingRow: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74,106,247,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(74,106,247,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    fontFamily: fonts.mono.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  reassuranceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(16,185,129,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.14)',
    borderRadius: 10,
    padding: 12,
  },
  reassuranceText: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.green,
    lineHeight: 18,
    flex: 1,
  },
});
