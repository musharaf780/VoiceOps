import React, { useState } from 'react';
import {
  View, Text, Pressable, StatusBar, StyleSheet,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { supabase } from '../../lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInScreen({ navigation, route }) {
  const role = route?.params?.role || 'worker';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');

  function validate() {
    const e = {};

    if (!email.trim()) {
      e.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      e.email = 'Enter a valid email address';
    }

    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignIn() {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login')) {
          setErrors({ general: 'Incorrect email or password. Please try again.' });
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          navigation.navigate('VerifyPhone', {
            role,
            email: email.trim().toLowerCase(),
          });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      const userRole = data.user?.user_metadata?.role || role;
      navigation.reset({
        index: 0,
        routes: [{ name: userRole === 'manager' ? 'ManagerTabs' : 'WorkerTabs' }],
      });
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    const trimmed = resetEmail.trim().toLowerCase();
    if (!trimmed) {
      setResetError('Please enter your email address');
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setResetError('Enter a valid email address');
      return;
    }
    setResetLoading(true);
    setResetError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: 'voiceops://',
      });
      if (error) {
        setResetError(error.message);
      } else {
        setResetSent(true);
      }
    } catch {
      setResetError('Something went wrong. Please try again.');
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.blue} />
          </Pressable>

          <View style={styles.roleBadge}>
            <View style={styles.roleDot} />
            <Text style={styles.roleBadgeText}>
              {role === 'manager' ? 'MANAGER' : 'FIELD WORKER'}
            </Text>
          </View>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your VoiceOps account.</Text>

          {errors.general ? (
            <View style={styles.errorBanner}>
              <Feather name="alert-circle" size={14} color={colors.red} />
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <View style={[styles.input, errors.email && styles.inputError]}>
                <Feather
                  name="mail"
                  size={16}
                  color={errors.email ? colors.red : colors.textTertiary}
                />
                <TextInput
                  placeholder="you@company.com"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.inputText}
                  value={email}
                  onChangeText={v => {
                    setEmail(v);
                    if (errors.email) setErrors(e => ({ ...e, email: null }));
                  }}
                  returnKeyType="next"
                />
              </View>
              {errors.email ? (
                <Text style={styles.fieldError}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.fieldLabel}>Password</Text>
                <Pressable
                  onPress={() => {
                    setShowForgot(v => !v);
                    setResetSent(false);
                    setResetError('');
                    setResetEmail('');
                  }}
                >
                  <Text style={styles.forgotLink}>
                    {showForgot ? 'Cancel' : 'Forgot password?'}
                  </Text>
                </Pressable>
              </View>
              <View style={[styles.input, errors.password && styles.inputError]}>
                <Feather
                  name="lock"
                  size={16}
                  color={errors.password ? colors.red : colors.textTertiary}
                />
                <TextInput
                  placeholder="Your password"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={!showPassword}
                  style={styles.inputText}
                  value={password}
                  onChangeText={v => {
                    setPassword(v);
                    if (errors.password) setErrors(e => ({ ...e, password: null }));
                  }}
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                />
                <Pressable onPress={() => setShowPassword(v => !v)}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={16}
                    color={colors.textTertiary}
                  />
                </Pressable>
              </View>
              {errors.password ? (
                <Text style={styles.fieldError}>{errors.password}</Text>
              ) : null}
            </View>
          </View>

          {/* Forgot password panel */}
          {showForgot && (
            <View style={styles.forgotPanel}>
              {resetSent ? (
                <View style={styles.resetSuccess}>
                  <Feather name="check-circle" size={18} color={colors.green} />
                  <Text style={styles.resetSuccessText}>
                    Reset link sent! Check your inbox for {resetEmail || 'your email'}.
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.forgotPanelTitle}>Reset your password</Text>
                  <Text style={styles.forgotPanelSubtitle}>
                    Enter the email associated with your account and we'll send a reset link.
                  </Text>
                  <View style={[styles.input, resetError && styles.inputError, { marginTop: 10 }]}>
                    <Feather
                      name="mail"
                      size={16}
                      color={resetError ? colors.red : colors.textTertiary}
                    />
                    <TextInput
                      placeholder="you@company.com"
                      placeholderTextColor={colors.textTertiary}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.inputText}
                      value={resetEmail}
                      onChangeText={v => {
                        setResetEmail(v);
                        setResetError('');
                      }}
                      returnKeyType="send"
                      onSubmitEditing={handleResetPassword}
                    />
                  </View>
                  {resetError ? (
                    <Text style={styles.fieldError}>{resetError}</Text>
                  ) : null}
                  <Pressable
                    style={[styles.resetBtn, resetLoading && styles.resetBtnDisabled]}
                    onPress={handleResetPassword}
                    disabled={resetLoading}
                  >
                    {resetLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.resetBtnText}>Send Reset Link</Text>
                    )}
                  </Pressable>
                </>
              )}
            </View>
          )}

          <Pressable
            style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signInBtnText}>Sign In</Text>
            )}
          </Pressable>

          <Text style={styles.createRow}>
            Don't have an account?{' '}
            <Text
              style={styles.createLink}
              onPress={() => navigation.navigate('CreateAccount', { role })}
            >
              Create account
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },
  backBtn: { paddingTop: 12, paddingBottom: 20 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(74,106,247,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(74,106,247,0.18)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  roleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.blue },
  roleBadgeText: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 11,
    color: colors.blue,
    letterSpacing: 0.44,
  },
  title: {
    fontFamily: fonts.inter.bold,
    fontSize: 26,
    letterSpacing: -0.52,
    lineHeight: 31.2,
    color: colors.navy,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.redTint,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.18)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorBannerText: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.red,
    flex: 1,
  },
  form: { gap: 14 },
  fieldGroup: {},
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  forgotLink: {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    color: colors.blue,
  },
  input: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputError: {
    borderColor: colors.red,
    borderWidth: 1.5,
    backgroundColor: colors.redTint,
  },
  inputText: {
    fontSize: 15,
    fontFamily: fonts.inter.regular,
    color: colors.navy,
    flex: 1,
  },
  fieldError: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.red,
    marginTop: 5,
  },
  forgotPanel: {
    marginTop: 16,
    backgroundColor: colors.bgSurface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    padding: 16,
  },
  forgotPanelTitle: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 14,
    color: colors.navy,
    marginBottom: 4,
  },
  forgotPanelSubtitle: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  resetBtn: {
    backgroundColor: colors.navy,
    borderRadius: 10,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  resetBtnDisabled: { opacity: 0.6 },
  resetBtnText: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 14,
    color: 'white',
  },
  resetSuccess: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  resetSuccessText: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    flex: 1,
  },
  signInBtn: {
    width: '100%',
    backgroundColor: colors.navy,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  signInBtnDisabled: { opacity: 0.6 },
  signInBtnText: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: 'white',
  },
  createRow: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  createLink: { color: colors.blue, fontFamily: fonts.inter.medium },
});
