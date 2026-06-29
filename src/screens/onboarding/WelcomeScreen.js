/*
 * DESIGN DIRECTION: Landing / handshake screen. The user just picked a role.
 *   Emotion: confident, premium, ready-to-work.
 * SIGNATURE ELEMENT: Oversized pulsing mic glyph inside stacked glow rings,
 *   floating above a dense feature chip row.
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated, Pressable, StatusBar, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const FEATURES = [
  { icon: 'mic',      color: colors.blue,  bg: colors.blueTint,  label: 'Voice Reports' },
  { icon: 'zap',      color: colors.red,   bg: colors.redTint,   label: 'Instant Alerts' },
  { icon: 'cpu',      color: colors.green, bg: colors.greenTint, label: 'AI Structured' },
];

export default function WelcomeScreen({ navigation, route }) {
  const role = route?.params?.role || 'worker';
  const slideY  = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const ring1   = useRef(new Animated.Value(1)).current;
  const ring2   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY,  { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    const pulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ring1, { toValue: 1.18, duration: 1000, useNativeDriver: true }),
          Animated.timing(ring1, { toValue: 1,    duration: 1000, useNativeDriver: true }),
        ]),
      ).start();
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(ring2, { toValue: 1.35, duration: 1000, useNativeDriver: true }),
            Animated.timing(ring2, { toValue: 1,    duration: 1000, useNativeDriver: true }),
          ]),
        ).start();
      }, 300);
    };
    pulse();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />

      {/* Hero — glow rings + mic icon */}
      <View style={styles.heroArea}>
        <Animated.View style={[styles.ring2, { transform: [{ scale: ring2 }] }]} />
        <Animated.View style={[styles.ring1, { transform: [{ scale: ring1 }] }]} />
        <View style={styles.iconCircle}>
          <Feather name="mic" size={48} color={colors.blue} />
        </View>

        {/* Floating tag */}
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Field reporting, reinvented</Text>
        </View>
      </View>

      {/* Content */}
      <Animated.View style={[styles.bottom, { opacity, transform: [{ translateY: slideY }] }]}>
        <Text style={styles.heading}>Voice-first{'\n'}field ops</Text>
        <Text style={styles.subtext}>
          Record issues in seconds. AI turns your voice into structured reports — hands-free.
        </Text>

        {/* Feature chips */}
        <View style={styles.chips}>
          {FEATURES.map((f, i) => (
            <View key={i} style={[styles.chip, { backgroundColor: f.bg }]}>
              <Feather name={f.icon} size={13} color={f.color} />
              <Text style={[styles.chipText, { color: f.color }]}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Nav row */}
        <View style={styles.navRow}>
          <Pressable style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={18} color={colors.textSecondary} />
          </Pressable>
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Pressable
            style={styles.goBtn}
            onPress={() => {
              if (role === 'manager') {
                navigation.reset({ index: 0, routes: [{ name: 'ManagerTabs' }] });
              } else {
                navigation.reset({ index: 0, routes: [{ name: 'WorkerTabs' }] });
              }
            }}
          >
            <Feather name="arrow-right" size={20} color="white" />
          </Pressable>
        </View>

        <Text style={styles.powered}>Powered by OpenAI Whisper · GPT-4o</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },

  heroArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring2: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(74,106,247,0.06)',
  },
  ring1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(74,106,247,0.10)',
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderEmphasis,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  badge: {
    position: 'absolute',
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  badgeDot: {
    width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green,
  },
  badgeText: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 12,
    color: colors.textSecondary,
  },

  bottom: {
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 8,
  },
  heading: {
    fontFamily: fonts.inter.bold,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -1,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  subtext: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
    maxWidth: 300,
  },

  chips: { flexDirection: 'row', gap: 8, marginBottom: 28, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: { fontFamily: fonts.inter.semiBold, fontSize: 12 },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderEmphasis,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.borderEmphasis,
  },
  dotActive: {
    width: 22, borderRadius: 4, backgroundColor: colors.blue,
  },
  goBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },

  powered: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
    letterSpacing: 0.2,
    paddingBottom: 4,
  },
});
