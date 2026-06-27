import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StatusBar, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export default function RoleSelectScreen({ navigation }) {
  const [selected, setSelected] = useState('manager');

  const roles = [
    {
      id: 'worker',
      title: 'Field Worker',
      subtitle: 'Record and submit voice reports from the field',
      icon: 'tool',
      iconBg: 'rgba(79,142,247,0.10)',
    },
    {
      id: 'manager',
      title: 'Manager',
      subtitle: 'Review reports, assign tasks, and manage your team',
      icon: 'grid',
      iconBg: 'rgba(79,142,247,0.15)',
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoSection}>
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <Feather name="mic" size={22} color="white" />
            </View>
            <Text style={styles.appName}>VoiceOps</Text>
          </View>
          <Text style={styles.tagline}>Voice-first operations for field teams</Text>
        </View>

        <View style={styles.cardsSection}>
          {roles.map(role => {
            const isSelected = selected === role.id;
            return (
              <Pressable
                key={role.id}
                onPress={() => setSelected(role.id)}
                style={[styles.roleCard, isSelected && styles.roleCardSelected]}
              >
                <View style={[styles.roleIconBox, { backgroundColor: role.iconBg }]}>
                  <Feather name={role.icon} size={24} color={colors.blue} />
                </View>
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                </View>
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Feather name="check" size={12} color="white" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={() => navigation.navigate('SignIn', { role: selected })}>
          <Text style={styles.signInLink}>Sign in with existing account</Text>
        </Pressable>

        <Pressable
          style={styles.continueBtn}
          onPress={() => navigation.navigate('CreateAccount', { role: selected })}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </Pressable>

        <Text style={styles.poweredBy}>Powered by OpenAI Whisper</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 32,
  },
  logoSection: { marginTop: 24, alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: {
    width: 42, height: 42,
    backgroundColor: colors.blue,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontFamily: fonts.inter.bold,
    fontSize: 28,
    letterSpacing: -0.84,
    color: colors.textPrimary,
  },
  tagline: {
    fontFamily: fonts.inter.regular,
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 10,
    letterSpacing: -0.15,
  },
  cardsSection: { width: '100%', marginTop: 44, gap: 12 },
  roleCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  roleCardSelected: {
    borderWidth: 2,
    borderColor: colors.blue,
  },
  roleIconBox: {
    width: 48, height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextContainer: { flex: 1 },
  roleTitle: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    letterSpacing: -0.16,
    color: colors.textPrimary,
  },
  roleSubtitle: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  checkBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInLink: {
    fontSize: 14,
    fontFamily: fonts.inter.medium,
    color: colors.blue,
    marginTop: 28,
  },
  continueBtn: {
    width: '100%',
    backgroundColor: colors.blue,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  continueBtnText: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: 'white',
    letterSpacing: -0.16,
  },
  poweredBy: {
    fontFamily: fonts.mono.regular,
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 0.22,
    marginTop: 32,
  },
});
