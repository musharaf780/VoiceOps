import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StatusBar, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const ROLES = [
  {
    id: 'worker',
    icon: 'tool',
    label: 'Field Worker',
    desc: 'Record and submit voice reports from the field',
    accent: colors.blue,
    bg: colors.blueTint,
  },
  {
    id: 'manager',
    icon: 'bar-chart-2',
    label: 'Manager',
    desc: 'Review reports, assign tasks, manage your team',
    accent: colors.green,
    bg: colors.greenTint,
  },
];

export default function RoleSelectScreen({ navigation }) {
  const [selected, setSelected] = useState('worker');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Feather name="mic" size={20} color="white" />
          </View>
          <Text style={styles.appName}>VoiceOps</Text>
        </View>

        <Text style={styles.heading}>How will you{'\n'}use VoiceOps?</Text>
        <Text style={styles.sub}>Choose your role to get started.</Text>

        <View style={styles.cards}>
          {ROLES.map(r => {
            const active = selected === r.id;
            return (
              <Pressable
                key={r.id}
                onPress={() => setSelected(r.id)}
                style={[styles.card, active && { borderColor: r.accent, borderWidth: 2 }]}
              >
                <View style={[styles.iconCircle, { backgroundColor: r.bg }]}>
                  <Feather name={r.icon} size={22} color={r.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleLabel}>{r.label}</Text>
                  <Text style={styles.roleDesc}>{r.desc}</Text>
                </View>
                <View style={[styles.radioOuter, active && { borderColor: r.accent }]}>
                  {active && <View style={[styles.radioInner, { backgroundColor: r.accent }]} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={styles.cta}
          onPress={() => navigation.navigate('CreateAccount', { role: selected })}
        >
          <Text style={styles.ctaText}>Continue</Text>
          <Feather name="arrow-right" size={18} color="white" />
        </Pressable>

        <Pressable onPress={() => navigation.navigate('SignIn', { role: selected })}>
          <Text style={styles.signInLink}>
            Already have an account?{' '}
            <Text style={{ color: colors.blue, fontFamily: fonts.inter.semiBold }}>Sign in</Text>
          </Text>
        </Pressable>

        <Text style={styles.powered}>Powered by OpenAI Whisper</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
    marginBottom: 36,
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontFamily: fonts.inter.bold,
    fontSize: 20,
    color: colors.navy,
    letterSpacing: -0.4,
  },

  heading: {
    fontFamily: fonts.inter.bold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: colors.navy,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  sub: {
    fontFamily: fonts.inter.regular,
    fontSize: 15,
    color: colors.textSecondary,
    alignSelf: 'flex-start',
    marginBottom: 32,
  },

  cards: { width: '100%', gap: 12, marginBottom: 32 },
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(74,106,247,0.12)',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleLabel: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: colors.navy,
    marginBottom: 3,
  },
  roleDesc: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(27,45,107,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },

  cta: {
    width: '100%',
    backgroundColor: colors.navy,
    borderRadius: 16,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaText: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: 'white',
  },

  signInLink: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  powered: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    color: colors.textTertiary,
    letterSpacing: 0.2,
  },
});
