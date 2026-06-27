import React, { useState } from 'react';
import {
  View, Text, Pressable, StatusBar, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { supabase } from '../../lib/supabase';

export default function VerifyPhoneScreen({ navigation, route }) {
  const role = route?.params?.role || 'worker';
  const email = route?.params?.email || '';

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendError, setResendError] = useState('');

  async function handleResend() {
    if (!email) return;
    setResendLoading(true);
    setResendError('');
    setResendSent(false);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) {
        setResendError(error.message);
      } else {
        setResendSent(true);
      }
    } catch {
      setResendError('Failed to resend. Please try again.');
    } finally {
      setResendLoading(false);
    }
  }

  function handleContinue() {
    if (role === 'manager') {
      navigation.navigate('TeamSetup');
    } else {
      navigation.navigate('Welcome', { role });
    }
  }

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

        <View style={styles.iconCircle}>
          <Feather name="mail" size={32} color={colors.blue} />
        </View>

        <Text style={styles.title}>Check your inbox</Text>
        <Text style={styles.subtitle}>
          We sent a confirmation link to{'\n'}
          <Text style={styles.emailHighlight}>{email || 'your email address'}</Text>
        </Text>

        <View style={styles.stepsCard}>
          {[
            { icon: 'inbox', text: 'Open the email from VoiceOps' },
            { icon: 'mouse-pointer', text: 'Click the confirmation link' },
            { icon: 'check-circle', text: 'Come back and tap Continue' },
          ].map((step, i) => (
            <View key={i} style={[styles.stepRow, i < 2 && styles.stepRowBorder]}>
              <View style={styles.stepIcon}>
                <Feather name={step.icon} size={15} color={colors.blue} />
              </View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        {resendSent && (
          <View style={styles.successBanner}>
            <Feather name="check-circle" size={14} color={colors.green} />
            <Text style={styles.successBannerText}>Confirmation email resent!</Text>
          </View>
        )}

        {resendError ? (
          <View style={styles.errorBanner}>
            <Feather name="alert-circle" size={14} color={colors.red} />
            <Text style={styles.errorBannerText}>{resendError}</Text>
          </View>
        ) : null}

        <Text style={styles.resendRow}>
          Didn't receive it?{' '}
          {resendLoading ? (
            <ActivityIndicator size="small" color={colors.blue} />
          ) : (
            <Text style={styles.resendLink} onPress={handleResend}>
              Resend email
            </Text>
          )}
        </Text>

        <View style={{ flex: 1 }} />

        <Pressable style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>I've verified my email</Text>
          <Feather name="arrow-right" size={18} color="white" />
        </Pressable>

        <Pressable
          style={styles.signInLink}
          onPress={() => navigation.navigate('SignIn', { role })}
        >
          <Text style={styles.signInLinkText}>Back to Sign In</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
  backBtn: { paddingTop: 12, paddingBottom: 20 },
  stepIndicator: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  stepBar: { flex: 1, height: 3, borderRadius: 2 },
  stepLabel: {
    fontFamily: fonts.inter.regular,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(79,142,247,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.inter.bold,
    fontSize: 26,
    letterSpacing: -0.52,
    lineHeight: 31.2,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 28,
  },
  emailHighlight: {
    fontFamily: fonts.inter.semiBold,
    color: colors.textPrimary,
  },
  stepsCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    overflow: 'hidden',
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stepRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(79,142,247,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.greenTint,
    borderWidth: 1,
    borderColor: 'rgba(79,191,133,0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  successBannerText: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.green,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.redTint,
    borderWidth: 1,
    borderColor: 'rgba(247,90,90,0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  errorBannerText: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.red,
    flex: 1,
  },
  resendRow: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resendLink: {
    color: colors.blue,
    fontFamily: fonts.inter.medium,
  },
  continueBtn: {
    width: '100%',
    backgroundColor: colors.blue,
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  continueBtnText: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: 'white',
  },
  signInLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  signInLinkText: {
    fontFamily: fonts.inter.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
