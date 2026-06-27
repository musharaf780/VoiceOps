import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default function MetricCard({ value, label, valueColor, large }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.value, { color: valueColor || colors.textPrimary, fontSize: large ? 20 : 18 }]}>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  value: {
    fontFamily: fonts.mono.medium,
  },
  label: {
    fontFamily: fonts.inter.regular,
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 2,
    letterSpacing: 0.2,
  },
});
