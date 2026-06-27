import React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { WORKER } from '../../data';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <View style={styles.container}>
        <Text style={styles.heading}>Profile</Text>
        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{WORKER.initials}</Text>
          </View>
          <Text style={styles.name}>{WORKER.name}</Text>
          <Text style={styles.company}>{WORKER.company}</Text>
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
    color: colors.textPrimary,
    marginBottom: 32,
  },
  avatarBlock: { alignItems: 'center', gap: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.blue,
  },
  avatarText: {
    fontFamily: fonts.inter.bold,
    fontSize: 24,
    color: colors.blue,
  },
  name: {
    fontFamily: fonts.inter.bold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  company: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
