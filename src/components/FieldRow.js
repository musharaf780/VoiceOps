import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import UrgencyBadge from './UrgencyBadge';

export default function FieldRow({ label, value, urgency, onPress, isLast }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, !isLast && styles.border]}
    >
      <View style={styles.left}>
        <Text style={styles.label}>{label}</Text>
        {urgency ? (
          <UrgencyBadge urgency={urgency} />
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
      {onPress && (
        <Feather name="chevron-right" size={14} color={colors.textTertiary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  border: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderSubtle,
  },
  left: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.inter.semiBold,
    color: colors.textTertiary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontFamily: fonts.inter.medium,
    color: colors.textPrimary,
  },
});
