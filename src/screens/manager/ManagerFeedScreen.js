import React, { useMemo, useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StatusBar, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { MANAGER, REPORTS } from '../../data';
import MetricCard from '../../components/MetricCard';
import ReportCard from '../../components/ReportCard';
import UrgencyBadge from '../../components/UrgencyBadge';

const FILTERS = ['All', 'Urgent', 'Medium', 'Resolved'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTodayLabel() {
  return new Date()
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase()
    .replace(',', ' ·')
    .replace(',', '');
}

function filterReports(reports, filter) {
  switch (filter) {
    case 'Urgent':
      return reports.filter(r => r.urgency === 'CRITICAL' || r.urgency === 'HIGH');
    case 'Medium':
      return reports.filter(r => r.urgency === 'MEDIUM' || r.urgency === 'LOW');
    case 'Resolved':
      return reports.filter(r => r.actionItems.every(a => a.done));
    default:
      return reports;
  }
}

export default function ManagerFeedScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const critical = REPORTS[0];

  const filtered = useMemo(() => filterReports(REPORTS, activeFilter), [activeFilter]);

  // Pinned critical card only visible for All and Urgent filters
  const showPinned = (activeFilter === 'All' || activeFilter === 'Urgent');
  // In the list, exclude the critical report when it's already shown as pinned
  const listReports = showPinned ? filtered.filter(r => r.id !== critical.id) : filtered;

  const firstName = MANAGER.name.split(' ')[0];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingLabel}>{getGreeting()}</Text>
            <Text style={styles.greetingName}>{firstName}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.datePill}>
              <Text style={styles.dateText}>{getTodayLabel()}</Text>
            </View>
            <Pressable style={styles.filterBtn}>
              <Feather name="sliders" size={15} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {FILTERS.map(f => {
            const count = filterReports(REPORTS, f).length;
            const isActive = f === activeFilter;
            return (
              <Pressable
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {f}
                </Text>
                <View style={[styles.chipBadge, isActive && styles.chipBadgeActive]}>
                  <Text style={[styles.chipBadgeText, isActive && styles.chipBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Metric strip */}
        <View style={styles.metricStrip}>
          <MetricCard value={MANAGER.stats.todayTotal} label="TODAY" large />
          <MetricCard value={MANAGER.stats.unread} label="UNREAD" valueColor={colors.blue} large />
          <MetricCard value={MANAGER.stats.critical} label="CRITICAL" valueColor={colors.red} large />
        </View>

        {/* Pinned critical alert */}
        {showPinned && (
          <>
            <View style={styles.sectionRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionLabel}>PINNED · CRITICAL ALERT</Text>
            </View>

            <Pressable
              style={styles.criticalCard}
              onPress={() => navigation.navigate('ManagerDetail', { report: critical })}
            >
              <View style={styles.criticalHeader}>
                <UrgencyBadge urgency="CRITICAL" />
                <View style={styles.criticalMeta}>
                  <Feather name="clock" size={11} color={colors.textTertiary} />
                  <Text style={styles.criticalTime}>{critical.timestamp}</Text>
                </View>
              </View>

              <Text style={styles.criticalWorker}>
                {critical.workerName}
              </Text>
              <Text style={styles.criticalSite}>
                {critical.site} · {critical.component}
              </Text>
              <Text style={styles.criticalSummary} numberOfLines={2}>
                {critical.summary}
              </Text>

              <View style={styles.criticalDivider} />

              <View style={styles.criticalActions}>
                <Pressable
                  style={styles.viewBtn}
                  onPress={() => navigation.navigate('ManagerDetail', { report: critical })}
                >
                  <Feather name="eye" size={13} color="white" />
                  <Text style={styles.viewBtnText}>View report</Text>
                </Pressable>
                <Pressable style={styles.callBtn}>
                  <Feather name="phone" size={13} color={colors.textSecondary} />
                  <Text style={styles.callBtnText}>Call worker</Text>
                </Pressable>
              </View>
            </Pressable>
          </>
        )}

        {/* Report list */}
        {listReports.length > 0 ? (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>
                {activeFilter === 'All' ? 'ALL REPORTS' : `${activeFilter.toUpperCase()} REPORTS`}
              </Text>
              <Text style={styles.sectionCount}>{listReports.length}</Text>
            </View>
            <View style={styles.reportList}>
              {listReports.map(r => (
                <ReportCard
                  key={r.id}
                  report={r}
                  showAvatar
                  onPress={() => navigation.navigate('ManagerDetail', { report: r })}
                />
              ))}
            </View>
          </>
        ) : (
          !showPinned && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Feather name="inbox" size={26} color={colors.textTertiary} />
              </View>
              <Text style={styles.emptyTitle}>No {activeFilter.toLowerCase()} reports</Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'Resolved'
                  ? 'Reports with all action items completed will appear here.'
                  : 'No reports match this filter right now.'}
              </Text>
            </View>
          )
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
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
    letterSpacing: -0.5,
    color: colors.navy,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  datePill: {
    backgroundColor: colors.bgSurface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  dateText: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    color: colors.textTertiary,
    letterSpacing: 0.3,
  },
  filterBtn: {
    width: 34,
    height: 34,
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipScroll: { marginBottom: 16 },
  chipRow: { gap: 8, paddingRight: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: colors.bgSurface,
  },
  chipActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  chipText: {
    fontFamily: fonts.inter.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  chipTextActive: { color: 'white' },
  chipBadge: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  chipBadgeActive: { backgroundColor: 'rgba(255,255,255,0.70)' },
  chipBadgeText: {
    fontFamily: fonts.inter.bold,
    fontSize: 10,
    color: colors.textSecondary,
  },
  chipBadgeTextActive: { color: 'white' },

  metricStrip: { flexDirection: 'row', gap: 8, marginBottom: 20 },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.red,
  },
  sectionLabel: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 10,
    letterSpacing: 0.6,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    flex: 1,
  },
  sectionCount: {
    fontFamily: fonts.mono.regular,
    fontSize: 11,
    color: colors.textTertiary,
  },

  criticalCard: {
    backgroundColor: 'rgba(239,68,68,0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
    borderLeftWidth: 4,
    borderLeftColor: colors.red,
    padding: 16,
    marginBottom: 20,
  },
  criticalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  criticalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  criticalTime: {
    fontFamily: fonts.mono.regular,
    fontSize: 11,
    color: colors.textTertiary,
  },
  criticalWorker: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    letterSpacing: -0.2,
    color: colors.navy,
  },
  criticalSite: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
    marginBottom: 6,
  },
  criticalSummary: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19.5,
  },
  criticalDivider: {
    height: 1,
    backgroundColor: 'rgba(239,68,68,0.10)',
    marginVertical: 12,
  },
  criticalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingVertical: 9,
  },
  viewBtnText: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 13,
    color: 'white',
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    borderRadius: 8,
    paddingVertical: 9,
    backgroundColor: colors.bgSurface,
  },
  callBtnText: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },

  reportList: { gap: 0 },

  emptyState: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 15,
    color: colors.navy,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 260,
  },
});
