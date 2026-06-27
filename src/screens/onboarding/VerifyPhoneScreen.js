import React, { useState } from 'react';
import {
  View, Text, Pressable, StatusBar, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const CODE = ['1', '2', '3', '4', '', ''];

export default function VerifyPhoneScreen({ navigation, route }) {
  const role = route?.params?.role || 'worker';
  const digits = CODE;
  const filled = digits.filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <View style={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.blue} />
        </Pressable>

        <View style={styles.stepIndicator}>
          {[colors.green, colors.blue, 'rgba(0,0,0,0.08)'].map((c, i) => (
            <View key={i} style={[styles.stepBar, { backgroundColor: c }]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>Step 2 of 3</Text>
        <Text style={styles.title}>Verify your phone</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{' '}
          <Text style={styles.phone}>+1 (555) 012-3456</Text>
        </Text>

        <View style={styles.otpRow}>
          {digits.map((digit, i) => (
            <View
              key={i}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : styles.otpBoxEmpty]}
            >
              <Text style={digit ? styles.otpDigit : styles.otpCursor}>
                {digit || '_'}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.resendRow}>
          Didn't receive it?{' '}
          <Text style={styles.resendLink}>Resend code</Text>
        </Text>
        <Text style={styles.countdown}>Resend in 0:42</Text>

        <Pressable
          style={[styles.verifyBtn, filled < 6 && styles.verifyBtnDisabled]}
          onPress={() => {
            if (role === 'manager') {
              navigation.navigate('TeamSetup');
            } else {
              navigation.navigate('Welcome', { role });
            }
          }}
        >
          <Text style={[styles.verifyBtnText, filled < 6 && styles.verifyBtnTextDisabled]}>
            Verify Code
          </Text>
        </Pressable>

        <View style={styles.callCard}>
          <View style={styles.callIconBox}>
            <Feather name="phone" size={18} color={colors.textSecondary} />
          </View>
          <View>
            <Text style={styles.callTitle}>Call me instead</Text>
            <Text style={styles.callSubtitle}>Get the code via automated call</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: { flex: 1, paddingHorizontal: 24 },
  backBtn: { paddingTop: 12, paddingBottom: 20 },
  stepIndicator: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  stepBar: { flex: 1, height: 3, borderRadius: 2 },
  stepLabel: {
    fontFamily: fonts.inter.regular,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.inter.bold,
    fontSize: 26,
    letterSpacing: -0.52,
    lineHeight: 31.2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 28,
  },
  phone: { fontFamily: fonts.inter.medium, color: colors.textPrimary },
  otpRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 28 },
  otpBox: {
    width: 52,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    backgroundColor: colors.bgSurface,
    borderWidth: 2,
    borderColor: colors.blue,
  },
  otpBoxEmpty: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  otpDigit: {
    fontFamily: fonts.mono.medium,
    fontSize: 24,
    color: colors.textPrimary,
  },
  otpCursor: {
    fontFamily: fonts.mono.regular,
    fontSize: 24,
    color: colors.textTertiary,
  },
  resendRow: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  resendLink: { color: colors.blue, fontFamily: fonts.inter.medium },
  countdown: {
    fontFamily: fonts.mono.regular,
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: 28,
  },
  verifyBtn: {
    backgroundColor: colors.blue,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'auto',
  },
  verifyBtnDisabled: { backgroundColor: 'rgba(79,142,247,0.4)' },
  verifyBtnText: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: 'white',
  },
  verifyBtnTextDisabled: { color: 'rgba(0,0,0,0.35)' },
  callCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 'auto',
    marginBottom: 20,
  },
  callIconBox: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callTitle: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  callSubtitle: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
