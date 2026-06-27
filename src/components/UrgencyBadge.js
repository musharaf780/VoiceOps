import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { URGENCY } from '../data';
import { fonts } from '../theme/typography';

export default function UrgencyBadge({ urgency }) {
  const cfg = URGENCY[urgency] || URGENCY.LOW;
  return (
    <View style={[styles.container, { backgroundColor: cfg.bg }]}>
      <View style={[styles.dot, { backgroundColor: cfg.color }]} />
      <Text style={[styles.label, { color: cfg.color }]}>{urgency}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  label: {
    fontFamily: fonts.inter.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
