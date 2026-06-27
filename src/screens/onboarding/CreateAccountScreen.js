import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StatusBar,
  TextInput, KeyboardAvoidingView, Platform, StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { supabase } from '../../lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLOR = ['', colors.red, colors.amber, colors.amber, colors.green];

export default function CreateAccountScreen({ navigation, route }) {
  const role = route?.params?.role || 'worker';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = getStrength(password);

  function validate() {
    const e = {};
    const name = fullName.trim();

    if (!name) {
      e.fullName = 'Full name is required';
    } else if (name.length < 2) {
      e.fullName = 'Name must be at least 2 characters';
    } else if (/\d/.test(name)) {
      e.fullName = 'Name cannot contain numbers';
    }

    if (!email.trim()) {
      e.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      e.email = 'Enter a valid email address';
    }

    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 8) {
      e.password = 'Password must be at least 8 characters';
    } else if (strength < 2) {
      e.password = 'Add uppercase letters, numbers, or symbols to strengthen your password';
    }

    if (!agreed) {
      e.terms = 'You must agree to the Terms of Service to continue';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleCreateAccount() {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: 'voiceops://',
          data: { full_name: fullName.trim(), role },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit') || error.status === 429) {
          setErrors({ general: 'Too many sign-up attempts. Please wait a few minutes and try again.' });
        } else if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already been registered')) {
          setErrors({ email: 'An account with this email already exists. Try signing in instead.' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      if (!data.session) {
        navigation.navigate('VerifyPhone', {
          role,
          email: email.trim().toLowerCase(),
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: role === 'manager' ? 'ManagerTabs' : 'WorkerTabs' }],
        });
      }
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
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

          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Get started with VoiceOps in under 2 minutes.</Text>

          {errors.general ? (
            <View style={styles.errorBanner}>
              <Feather name="alert-circle" size={14} color={colors.red} />
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={[styles.input, errors.fullName && styles.inputError]}>
                <Feather name="user" size={16} color={errors.fullName ? colors.red : colors.textTertiary} />
                <TextInput
                  placeholder="James Torres"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.inputText}
                  value={fullName}
                  onChangeText={v => {
                    setFullName(v);
                    if (errors.fullName) setErrors(e => ({ ...e, fullName: null }));
                  }}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
              {errors.fullName ? (
                <Text style={styles.fieldError}>{errors.fullName}</Text>
              ) : null}
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <View style={[styles.input, errors.email && styles.inputError]}>
                <Feather name="mail" size={16} color={errors.email ? colors.red : colors.textTertiary} />
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
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[styles.input, errors.password && styles.inputError]}>
                <Feather name="lock" size={16} color={errors.password ? colors.red : colors.textTertiary} />
                <TextInput
                  placeholder="Create a strong password"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={!showPassword}
                  style={styles.inputText}
                  value={password}
                  onChangeText={v => {
                    setPassword(v);
                    if (errors.password) setErrors(e => ({ ...e, password: null }));
                  }}
                  returnKeyType="done"
                />
                <Pressable onPress={() => setShowPassword(v => !v)}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={16}
                    color={colors.textTertiary}
                  />
                </Pressable>
              </View>

              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  {[0, 1, 2, 3].map(i => (
                    <View
                      key={i}
                      style={[
                        styles.strengthBar,
                        i < strength && { backgroundColor: STRENGTH_COLOR[strength] },
                      ]}
                    />
                  ))}
                </View>
              )}

              {password.length > 0 && (
                <Text style={[styles.strengthLabel, { color: STRENGTH_COLOR[strength] }]}>
                  {STRENGTH_LABEL[strength]}
                </Text>
              )}

              {errors.password ? (
                <Text style={styles.fieldError}>{errors.password}</Text>
              ) : null}
            </View>
          </View>

          {/* Terms */}
          <View style={styles.termsRow}>
            <Pressable
              onPress={() => {
                setAgreed(!agreed);
                if (errors.terms) setErrors(e => ({ ...e, terms: null }));
              }}
              style={[styles.checkbox, agreed && styles.checkboxChecked]}
            >
              {agreed && <Feather name="check" size={11} color="white" />}
            </Pressable>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
          {errors.terms ? (
            <Text style={[styles.fieldError, { marginTop: 4 }]}>{errors.terms}</Text>
          ) : null}

          <Pressable
            style={[styles.continueBtn, loading && styles.continueBtnDisabled]}
            onPress={handleCreateAccount}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.continueBtnText}>Create Account</Text>
            )}
          </Pressable>

          <Text style={styles.signInRow}>
            Already have an account?{' '}
            <Text
              style={styles.signInLink}
              onPress={() => navigation.navigate('SignIn', { role })}
            >
              Sign in
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
  backBtn: { paddingHorizontal: 0, paddingTop: 12, paddingBottom: 20 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(79,142,247,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(79,142,247,0.2)',
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
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
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
  fieldLabel: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
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
    color: colors.textPrimary,
    flex: 1,
  },
  fieldError: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.red,
    marginTop: 5,
  },
  strengthRow: { flexDirection: 'row', gap: 4, marginTop: 8 },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  strengthLabel: {
    fontFamily: fonts.inter.regular,
    fontSize: 11,
    marginTop: 4,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: colors.blue, borderWidth: 0 },
  termsText: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  termsLink: { color: colors.blue },
  continueBtn: {
    width: '100%',
    backgroundColor: colors.blue,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  continueBtnDisabled: { opacity: 0.6 },
  continueBtnText: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: 'white',
  },
  signInRow: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 14,
  },
  signInLink: { color: colors.blue, fontFamily: fonts.inter.medium },
});
