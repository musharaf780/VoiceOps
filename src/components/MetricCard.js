import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default function MetricCard({ value, label, valueColor, large }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.value, { color: valueColor || colors.navy, fontSize: large ? 22 : 20 }]}>
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
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 2,
  },
  value: {
    fontFamily: fonts.inter.bold,
    letterSpacing: -0.3,
  },
  label: {
    fontFamily: fonts.inter.regular,
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 3,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
