import React, { useState } from 'react';
import {
  View, Text, Pressable, StatusBar, StyleSheet,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export default function SignInScreen({ navigation, route }) {
  const role = route?.params?.role || 'worker';
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    if (role === 'manager') {
      navigation.reset({ index: 0, routes: [{ name: 'ManagerTabs' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'WorkerTabs' }] });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <View style={styles.input}>
                <Feather name="mail" size={16} color={colors.textTertiary} />
                <TextInput
                  placeholder="you@company.com"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.inputText}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.fieldLabel}>Password</Text>
                <Pressable>
                  <Text style={styles.forgotLink}>Forgot password?</Text>
                </Pressable>
              </View>
              <View style={styles.input}>
                <Feather name="lock" size={16} color={colors.textTertiary} />
                <TextInput
                  placeholder="Your password"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={!showPassword}
                  style={styles.inputText}
                />
                <Pressable onPress={() => setShowPassword(v => !v)}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={16}
                    color={colors.textTertiary}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable style={styles.signInBtn} onPress={handleSignIn}>
            <Text style={styles.signInBtnText}>Sign In</Text>
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
    marginBottom: 32,
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
    borderColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputText: {
    fontSize: 15,
    fontFamily: fonts.inter.regular,
    color: colors.textPrimary,
    flex: 1,
  },
  signInBtn: {
    width: '100%',
    backgroundColor: colors.blue,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
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
