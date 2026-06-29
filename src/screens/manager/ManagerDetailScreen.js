import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StatusBar, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { URGENCY } from '../../data';
import UrgencyBadge from '../../components/UrgencyBadge';
import FieldRow from '../../components/FieldRow';
import ActionItemRow from '../../components/ActionItemRow';
import WaveformVisualizer from '../../components/WaveformVisualizer';

export default function ManagerDetailScreen({ navigation, route }) {
  const report = route?.params?.report || {};
  const urgencyCfg = URGENCY[report.urgency] || URGENCY.LOW;
  const [items, setItems] = useState(report.actionItems || []);
  const [resolved, setResolved] = useState(false);

  const toggleItem = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const handleResolve = () => {
    setResolved(true);
    setTimeout(() => {
      navigation.goBack();
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />

      {/* Top nav */}
      <View style={styles.topNav}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color={colors.blue} />
        </Pressable>
        <Text style={styles.navTitle}>Report detail</Text>
        <Feather name="share-2" size={22} color={colors.blue} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Worker identity row */}
        <View style={styles.workerRow}>
          <View style={styles.workerAvatar}>
            <Text style={styles.workerAvatarText}>{report.workerInitials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.workerName}>{report.workerName}</Text>
            <Text style={styles.workerRole}>Field Worker · ConstructCo Ltd.</Text>
          </View>
          <Text style={styles.workerTime}>{report.timestampFull}</Text>
        </View>

        {/* Urgency banner */}
        <View style={[styles.urgencyBanner, {
          backgroundColor: urgencyCfg.bg,
          borderColor: 'rgba(239,68,68,0.18)',
          borderLeftColor: urgencyCfg.stripe,
        }]}>
          <UrgencyBadge urgency={report.urgency} />
          <Text style={[styles.urgencyText, { color: urgencyCfg.color }]}>
            {report.urgency} PRIORITY
          </Text>
          <Feather name="chevron-down" size={16} color={urgencyCfg.color} />
        </View>

        {/* Data table */}
        <View style={styles.dataTable}>
          <FieldRow label="Site" value={report.site} />
          <FieldRow label="Issue Type" value={report.issueType} />
          <FieldRow label="Component" value={report.component} />
          <FieldRow label="Reported at" value={report.timestampFull} isLast />
        </View>

        {/* AI Summary card */}
        <View style={[styles.card, { marginTop: 12 }]}>
          <View style={styles.cardHeader}>
            <Feather name="star" size={14} color={colors.blue} />
            <Text style={[styles.cardHeaderText, { color: colors.blue, marginLeft: 4 }]}>AI Summary</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.summaryText}>{report.summary}</Text>
          </View>
        </View>

        {/* Action items */}
        <View style={[styles.card, { marginTop: 12 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>ACTION ITEMS</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{items.length}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 14 }}>
            {items.map(item => (
              <ActionItemRow key={item.id} item={item} onToggle={toggleItem} />
            ))}
          </View>
        </View>

        {/* Notifications sent */}
        {report.automations && report.automations.length > 0 && (
          <View style={[styles.card, { marginTop: 12 }]}>
            <View style={styles.cardHeader}>
              <Feather name="activity" size={13} color={colors.textSecondary} />
              <Text style={[styles.cardHeaderText, { marginLeft: 4 }]}>NOTIFICATIONS SENT</Text>
            </View>
            {report.automations.map((a, i) => (
              <View
                key={i}
                style={[
                  styles.notifRow,
                  i < report.automations.length - 1 && styles.notifRowBorder,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifEmoji}>{a.emoji}</Text>
                  <Text style={styles.notifLabel}>{a.label}</Text>
                  <Text style={styles.notifTime}>{a.time}</Text>
                </View>
                <View style={styles.sentBadge}>
                  <Feather name="check" size={9} color={colors.green} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recording playback */}
        <View style={styles.recordingRow}>
          <Pressable style={styles.playBtn}>
            <Feather name="play" size={16} color={colors.blue} />
          </Pressable>
          <WaveformVisualizer animated={false} style={styles.waveform} />
          <Text style={styles.duration}>{report.audioDuration}</Text>
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={styles.stickyBottom}>
        <Text style={styles.assignLink}>Assign to team</Text>
        <Pressable
          style={[styles.resolveBtn, resolved && styles.resolveBtnDone]}
          onPress={handleResolve}
        >
          <Text style={styles.resolveBtnText}>
            {resolved ? 'Resolved ✓' : 'Mark as resolved'}
          </Text>
        </Pressable>
      </View>
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 16 },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  workerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74,106,247,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerAvatarText: {
    fontFamily: fonts.inter.bold,
    fontSize: 14,
    color: colors.blue,
  },
  workerName: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    letterSpacing: -0.16,
    color: colors.navy,
  },
  workerRole: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  workerTime: {
    fontFamily: fonts.mono.regular,
    fontSize: 11,
    color: colors.textTertiary,
  },
  urgencyBanner: {
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  urgencyText: {
    fontFamily: fonts.inter.bold,
    fontSize: 13,
    letterSpacing: 0.52,
    flex: 1,
  },
  dataTable: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  cardHeaderText: {
    fontFamily: fonts.inter.bold,
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.48,
    textTransform: 'uppercase',
  },
  cardBody: { paddingHorizontal: 14, paddingVertical: 14 },
  summaryText: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20.8,
  },
  countBadge: {
    backgroundColor: 'rgba(74,106,247,0.14)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  countText: {
    fontFamily: fonts.inter.bold,
    fontSize: 11,
    color: colors.blue,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  notifRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  notifEmoji: { fontSize: 14 },
  notifLabel: {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    color: colors.navy,
  },
  notifTime: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 2,
  },
  sentBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(16,185,129,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingRow: {
    marginTop: 12,
    marginBottom: 4,
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
  waveform: { flex: 1, height: 28 },
  duration: {
    fontFamily: fonts.mono.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  stickyBottom: {
    padding: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  assignLink: {
    fontFamily: fonts.inter.medium,
    fontSize: 13,
    color: colors.blue,
    textAlign: 'center',
    marginBottom: 10,
  },
  resolveBtn: {
    width: '100%',
    backgroundColor: colors.green,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resolveBtnDone: { backgroundColor: colors.textTertiary },
  resolveBtnText: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: 'white',
  },
});
