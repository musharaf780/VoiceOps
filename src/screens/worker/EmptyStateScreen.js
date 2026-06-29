/*
 * DESIGN DIRECTION: Zero-state for workers who haven't submitted anything yet.
 *   Emotion: calm invitation, not failure.
 * SIGNATURE ELEMENT: Large hollow mic icon on dark card with a faint glow halo.
 */
import {
  StatusBar, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import MetricCard from '../../components/MetricCard';
import RecordButton from '../../components/RecordButton';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export default function EmptyStateScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <View style={styles.container}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, James</Text>
            <Text style={styles.date}>TUE · JUN 24, 2026</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>JT</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <MetricCard value={0} label="TODAY" valueColor={colors.textTertiary} />
          <MetricCard value={0} label="THIS WEEK" valueColor={colors.textTertiary} />
          <MetricCard value="—" label="STREAK" valueColor={colors.textTertiary} />
        </View>

        <View style={styles.emptyCard}>
          <View style={styles.iconHalo}>
            <Feather name="mic-off" size={44} color={colors.blue} />
          </View>
          <Text style={styles.emptyHeading}>No reports yet</Text>
          <Text style={styles.emptySubtext}>
            Hold the mic button to record your{'\n'}first field report. Takes just seconds.
          </Text>
        </View>

        <View style={styles.recordArea}>
          <RecordButton state="idle" />
          <Text style={styles.hintLabel}>
            Hold to <Text style={styles.hintBold}>record</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: fonts.inter.bold,
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  date: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.blueTint,
    borderWidth: 1.5,
    borderColor: colors.borderEmphasis,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.inter.bold,
    fontSize: 13,
    color: colors.blue,
  },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },

  emptyCard: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    marginBottom: 20,
  },
  iconHalo: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 4,
  },
  emptyHeading: {
    fontFamily: fonts.inter.bold,
    fontSize: 20,
    letterSpacing: -0.4,
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 240,
    marginTop: 8,
  },

  recordArea: {
    alignItems: 'center',
    paddingBottom: 8,
    gap: 8,
  },
  hintLabel: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  hintBold: {
    fontFamily: fonts.inter.semiBold,
    color: colors.blue,
  },
});
