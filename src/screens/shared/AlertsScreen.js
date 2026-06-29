import React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <View style={styles.container}>
        <Text style={styles.heading}>Alerts</Text>
        <View style={styles.empty}>
          <Feather name="bell" size={40} color={colors.textTertiary} />
          <Text style={styles.emptyText}>No alerts yet</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  heading: {
    fontFamily: fonts.inter.bold,
    fontSize: 22,
    letterSpacing: -0.44,
    color: colors.navy,
    marginBottom: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontFamily: fonts.inter.regular,
    fontSize: 15,
    color: colors.textTertiary,
  },
});
