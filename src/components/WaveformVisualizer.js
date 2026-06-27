import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const BAR_COUNT = 40;

function getBaseHeight(index) {
  return Math.round(8 + Math.abs(Math.sin(index * 0.42 + 0.6)) * 30 + (index % 5) * 3.5);
}

function AnimatedBar({ index }) {
  const anim = useRef(new Animated.Value(getBaseHeight(index))).current;
  const base = getBaseHeight(index);

  useEffect(() => {
    const delay = (index * 30) % 500;
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: base * 1.5,
            duration: 220 + (index % 7) * 38,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: base * 0.25,
            duration: 220 + (index % 7) * 38,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.bar,
        { height: anim },
      ]}
    />
  );
}

export default function WaveformVisualizer({ animated = true, style }) {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: BAR_COUNT }, (_, i) => {
        if (animated) {
          return <AnimatedBar key={i} index={i} />;
        }
        return (
          <View
            key={i}
            style={[styles.bar, { height: getBaseHeight(i) }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    width: 280,
    height: 60,
    overflow: 'hidden',
  },
  bar: {
    width: 2,
    borderRadius: 1,
    backgroundColor: '#4F8EF7',
  },
});
