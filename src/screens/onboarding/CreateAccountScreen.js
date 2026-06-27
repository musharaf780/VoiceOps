import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StatusBar,
  TextInput, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export default function CreateAccountScreen({ navigation, route }) {
  const role = route?.params?.role || 'worker';
  const [agreed, setAgreed] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.blue} />
          </Pressable>

          <View style={styles.roleBadge}>
            <View style={styles.roleDot} />
            <Text style={styles.roleBadgeText}>{role === 'manager' ? 'MANAGER' : 'FIELD WORKER'}</Text>
          </View>

          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Get started with VoiceOps in under 2 minutes.</Text>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.input}>
                <Feather name="user" size={16} color={colors.textTertiary} />
                <TextInput
                  placeholder="James Torres"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.inputText}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <View style={styles.input}>
                <Feather name="mail" size={16} color={colors.textTertiary} />
                <TextInput
                  placeholder="you@company.com"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="email-address"
                  style={styles.inputText}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[styles.input, styles.inputFocused]}>
                <Feather name="lock" size={16} color={colors.textTertiary} />
                <TextInput
                  placeholder="Create a strong password"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry
                  style={styles.inputText}
                />
              </View>
              <View style={styles.strengthRow}>
                {[0, 1, 2, 3].map(i => (
                  <View
                    key={i}
                    style={[styles.strengthBar, i < 4 && styles.strengthBarFilled]}
                  />
                ))}
              </View>
              <Text style={styles.strengthLabel}>Strong</Text>
            </View>
          </View>

          <View style={styles.termsRow}>
            <Pressable
              onPress={() => setAgreed(!agreed)}
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

          <Pressable
            style={styles.continueBtn}
            onPress={() => navigation.navigate('VerifyPhone', { role })}
          >
            <Text style={styles.continueBtnText}>Create Account</Text>
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
    marginBottom: 28,
  },
  form: { gap: 12 },
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
  inputFocused: { borderWidth: 2, borderColor: colors.blue },
  inputText: {
    fontSize: 15,
    fontFamily: fonts.inter.regular,
    color: colors.textPrimary,
    flex: 1,
  },
  strengthRow: { flexDirection: 'row', gap: 4, marginTop: 6 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.08)' },
  strengthBarFilled: { backgroundColor: colors.green },
  strengthLabel: {
    fontFamily: fonts.inter.regular,
    fontSize: 11,
    color: colors.green,
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
