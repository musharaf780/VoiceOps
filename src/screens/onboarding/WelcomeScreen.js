import React, { useEffect, useRef } from 'react';
import {
  View, Text, Pressable, StatusBar, Animated, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const FEATURES = [
  {
    icon: 'mic',
    iconColor: colors.blue,
    iconBg: colors.blueTint,
    title: 'Voice Reports',
    subtitle: 'Record issues hands-free in seconds',
  },
  {
    icon: 'bell',
    iconColor: colors.red,
    iconBg: colors.redTint,
    title: 'Instant Alerts',
    subtitle: 'Critical issues escalated automatically',
  },
  {
    icon: 'activity',
    iconColor: colors.green,
    iconBg: colors.greenTint,
    title: 'AI Structured Data',
    subtitle: 'Reports formatted and prioritised by AI',
  },
];

export default function WelcomeScreen({ navigation, route }) {
  const role = route?.params?.role || 'worker';
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <View style={styles.container}>
        <Animated.View style={[styles.circleWrapper, { transform: [{ scale }], opacity }]}>
          <View style={styles.glowRing1} />
          <View style={styles.glowRing2} />
          <View style={styles.mainCircle}>
            <Feather name="check" size={52} color={colors.green} />
          </View>
        </Animated.View>

        <Text style={styles.heading}>You're all set!</Text>
        <Text style={styles.subtext}>
          VoiceOps is ready. Start capturing field issues with your voice.
        </Text>

        <View style={styles.featureCards}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={[styles.featureIconBox, { backgroundColor: f.iconBg }]}>
                <Feather name={f.icon} size={16} color={f.iconColor} />
              </View>
              <View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSubtitle}>{f.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.dashBtn}
          onPress={() => {
            if (role === 'manager') {
              navigation.reset({ index: 0, routes: [{ name: 'ManagerTabs' }] });
            } else {
              navigation.reset({ index: 0, routes: [{ name: 'WorkerTabs' }] });
            }
          }}
        >
          <Text style={styles.dashBtnText}>Go to Dashboard</Text>
        </Pressable>

        <Text style={styles.powered}>Powered by OpenAI Whisper</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  circleWrapper: {
    width: 144,
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  glowRing1: {
    position: 'absolute',
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: 'rgba(79,191,133,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(79,191,133,0.15)',
  },
  glowRing2: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(79,191,133,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(79,191,133,0.20)',
  },
  mainCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(79,191,133,0.15)',
    borderWidth: 2,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: fonts.inter.bold,
    fontSize: 28,
    letterSpacing: -0.56,
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: fonts.inter.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
    marginBottom: 40,
  },
  featureCards: { width: '100%', gap: 10 },
  featureCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  featureSubtitle: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dashBtn: {
    width: '100%',
    backgroundColor: colors.blue,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
    marginBottom: 16,
  },
  dashBtnText: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: 'white',
  },
  powered: {
    fontFamily: fonts.mono.regular,
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 0.22,
  },
});
