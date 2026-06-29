import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { URGENCY } from '../data';
import UrgencyBadge from './UrgencyBadge';

export default function ReportCard({ report, onPress, showAvatar }) {
  const urgencyCfg = URGENCY[report.urgency] || URGENCY.LOW;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.outer, pressed && { backgroundColor: colors.bgElevated }]}
    >
      {showAvatar && !report.isRead && (
        <View style={styles.unreadDot} />
      )}
      <View style={styles.card}>
        <View style={[styles.stripe, { backgroundColor: urgencyCfg.stripe }]} />
        <View style={styles.content}>
          {showAvatar && (
            <View style={styles.avatarRow}>
              <View style={[styles.avatar, { backgroundColor: urgencyCfg.bg }]}>
                <Text style={[styles.avatarText, { color: urgencyCfg.color }]}>
                  {report.workerInitials}
                </Text>
              </View>
              <View>
                <Text style={styles.workerName}>{report.workerName}</Text>
                <Text style={styles.siteMeta}>{report.site} · {report.timestampFull}</Text>
              </View>
            </View>
          )}
          {!showAvatar && (
            <View style={styles.topRow}>
              <Text style={styles.siteName}>{report.site}</Text>
              <Text style={styles.timestamp}>{report.timestamp}</Text>
            </View>
          )}
          <Text style={styles.summary} numberOfLines={1} ellipsizeMode="tail">
            {report.summary}
          </Text>
          <View style={styles.bottomRow}>
            <UrgencyBadge urgency={report.urgency} />
            <View style={styles.issueChip}>
              <Text style={styles.issueText}>{report.issueType}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: colors.bgSurface,
  },
  stripe: {
    width: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 11,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontFamily: fonts.inter.bold,
  },
  workerName: {
    fontFamily: fonts.inter.bold,
    fontSize: 13,
    color: colors.navy,
  },
  siteMeta: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    color: colors.textTertiary,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  siteName: {
    fontFamily: fonts.inter.bold,
    fontSize: 14,
    color: colors.navy,
  },
  timestamp: {
    fontFamily: fonts.mono.regular,
    fontSize: 11,
    color: colors.textTertiary,
  },
  summary: {
    fontSize: 13,
    fontFamily: fonts.inter.regular,
    color: colors.textSecondary,
    marginTop: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 9,
    alignItems: 'center',
  },
  issueChip: {
    backgroundColor: colors.borderSubtle,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  issueText: {
    fontSize: 10,
    fontFamily: fonts.inter.regular,
    color: colors.textSecondary,
  },
  unreadDot: {
    position: 'absolute',
    left: -4,
    top: '50%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blue,
    zIndex: 10,
    marginTop: -3,
  },
});
