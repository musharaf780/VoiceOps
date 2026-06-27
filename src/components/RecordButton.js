import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Easing,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

function SonarRing({ delay }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 2.9,
            duration: 1600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.sonarRing,
        { transform: [{ scale }], opacity },
      ]}
    />
  );
}

export default function RecordButton({ state = 'idle', onPressIn, onPressOut }) {
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (state === 'idle') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 1.0,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseOpacity.setValue(0.6);
    }
  }, [state]);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
    }).start();
    onPressIn && onPressIn();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1.0,
      useNativeDriver: true,
      speed: 50,
    }).start();
    onPressOut && onPressOut();
  };

  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';

  return (
    <View style={styles.wrapper}>
      {/* Static concentric rings (idle) */}
      {!isRecording && (
        <>
          <Animated.View style={[styles.ring1, { opacity: pulseOpacity }]} />
          <View style={styles.ring2} />
          <View style={styles.ring3} />
        </>
      )}

      {/* Sonar rings (recording) */}
      {isRecording && (
        <>
          <SonarRing delay={0} />
          <SonarRing delay={400} />
          <SonarRing delay={800} />
          <SonarRing delay={1200} />
        </>
      )}

      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View
          style={[
            styles.button,
            isRecording && styles.buttonRecording,
            isProcessing && styles.buttonProcessing,
            { transform: [{ scale: buttonScale }] },
          ]}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" size="large" />
          ) : (
            <Feather
              name="mic"
              size={36}
              color={isRecording ? 'white' : '#4F8EF7'}
            />
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(79,142,247,0.12)',
  },
  ring2: {
    position: 'absolute',
    width: 186,
    height: 186,
    borderRadius: 93,
    borderWidth: 1,
    borderColor: 'rgba(79,142,247,0.07)',
  },
  ring3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(79,142,247,0.04)',
  },
  sonarRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: '#4F8EF7',
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(79,142,247,0.12)',
    borderWidth: 2,
    borderColor: '#4F8EF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRecording: {
    backgroundColor: '#4F8EF7',
    borderWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#4F8EF7',
        shadowRadius: 20,
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 0 },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  buttonProcessing: {
    opacity: 0.5,
  },
});
