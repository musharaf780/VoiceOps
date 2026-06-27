import React, { useState } from 'react';
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

export default function ManagerFeedScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const critical = REPORTS[0];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Reports</Text>
          <Pressable style={styles.filterBtn}>
            <Feather name="filter" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {FILTERS.map(f => (
            <Pressable
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.chip, f === activeFilter && styles.chipActive]}
            >
              <Text style={[styles.chipText, f === activeFilter && styles.chipTextActive]}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Metric strip */}
        <View style={styles.metricStrip}>
          <MetricCard
            value={MANAGER.stats.todayTotal}
            label="TODAY"
            large
          />
          <MetricCard
            value={MANAGER.stats.unread}
            label="UNREAD"
            valueColor={colors.blue}
            large
          />
          <MetricCard
            value={MANAGER.stats.critical}
            label="CRITICAL"
            valueColor={colors.red}
            large
          />
        </View>

        {/* Critical pinned card */}
        <Pressable
          style={styles.criticalCard}
          onPress={() => navigation.navigate('ManagerDetail', { report: critical })}
        >
          <View style={styles.criticalHeader}>
            <UrgencyBadge urgency="CRITICAL" />
            <Text style={styles.criticalTime}>{critical.timestamp}</Text>
          </View>
          <Text style={styles.criticalWorker}>
            {critical.workerName} · {critical.site}
          </Text>
          <Text style={styles.criticalSummary} numberOfLines={2}>
            {critical.summary}
          </Text>
          <View style={styles.criticalActions}>
            <Pressable
              style={styles.viewBtn}
              onPress={() => navigation.navigate('ManagerDetail', { report: critical })}
            >
              <Text style={styles.viewBtnText}>View report</Text>
            </Pressable>
            <Pressable style={styles.callBtn}>
              <Feather name="phone" size={13} color={colors.textSecondary} />
              <Text style={styles.callBtnText}>Call worker</Text>
            </Pressable>
          </View>
        </Pressable>

        {/* Report list */}
        <View style={styles.reportList}>
          {REPORTS.slice(1).map(r => (
            <ReportCard
              key={r.id}
              report={r}
              showAvatar
              onPress={() => navigation.navigate('ManagerDetail', { report: r })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heading: {
    fontFamily: fonts.inter.bold,
    fontSize: 22,
    letterSpacing: -0.44,
    color: colors.textPrimary,
  },
  filterBtn: {
    width: 36,
    height: 36,
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipScroll: { marginBottom: 14 },
  chipRow: { gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  chipActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  chipText: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  chipTextActive: { fontFamily: fonts.inter.semiBold, color: 'white' },
  metricStrip: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  criticalCard: {
    backgroundColor: 'rgba(247,90,90,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(247,90,90,0.2)',
    borderLeftWidth: 6,
    borderLeftColor: colors.red,
    padding: 13,
    paddingBottom: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  criticalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  criticalTime: {
    fontFamily: fonts.mono.regular,
    fontSize: 11,
    color: colors.textTertiary,
  },
  criticalWorker: {
    fontFamily: fonts.inter.bold,
    fontSize: 15,
    letterSpacing: -0.15,
    color: colors.textPrimary,
  },
  criticalSummary: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 5,
    lineHeight: 19.5,
  },
  criticalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  viewBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewBtnText: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 12,
    color: colors.blue,
  },
  callBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnText: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  reportList: { gap: 10 },
});
