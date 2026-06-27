import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default function ActionItemRow({ item, onToggle }) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onToggle && onToggle(item.id)}
        style={[styles.checkbox, item.done && styles.checkboxDone]}
      >
        {item.done && <Feather name="check" size={11} color="white" />}
      </Pressable>
      <Text
        style={[
          styles.text,
          item.done && styles.textDone,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.14)',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.blue,
    borderWidth: 0,
  },
  text: {
    fontFamily: fonts.inter.regular,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
    flex: 1,
  },
  textDone: {
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
});
