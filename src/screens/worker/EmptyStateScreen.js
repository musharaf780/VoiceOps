import {
  StatusBar, StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MetricCard from '../../components/MetricCard';
import RecordButton from '../../components/RecordButton';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export default function EmptyStateScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <View style={styles.container}>
        <Text style={styles.greeting}>Good morning, James</Text>
        <Text style={styles.date}>TUE · JUN 24, 2026</Text>

        <View style={styles.statsRow}>
          <MetricCard value={0} label="TODAY" valueColor={colors.textTertiary} />
          <MetricCard value={0} label="THIS WEEK" valueColor={colors.textTertiary} />
          <MetricCard value="—" label="STREAK" valueColor={colors.textTertiary} />
        </View>

        <View style={styles.recordArea}>
          <RecordButton state="idle" />
          <Text style={styles.hintLabel}>Hold to </Text>
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIllustration}>
            <Text style={styles.emptyIcon}>🎙</Text>
            <Text style={styles.emptyArrow}>─ ─ ─▶</Text>
            <Text style={styles.emptyIcon}>📄</Text>
          </View>
          <Text style={styles.emptyHeading}>No reports yet</Text>
          <Text style={styles.emptySubtext}>
            Hold the button above to record your first field report. It only takes seconds.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
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
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  emptyIllustration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.6,
    marginBottom: 4,
  },
  emptyIcon: { fontSize: 32 },
  emptyArrow: {
    fontSize: 16,
    color: colors.blue,
    letterSpacing: 2,
  },
  emptyHeading: {
    fontFamily: fonts.inter.bold,
    fontSize: 18,
    letterSpacing: -0.18,
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21.7,
    maxWidth: 260,
    marginTop: 8,
  },
});
