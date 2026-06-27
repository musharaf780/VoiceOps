import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const TAB_ICONS = {
  Home:    'home',
  Reports: 'file-text',
  Alerts:  'bell',
  Profile: 'user',
};

export default function BottomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconName = TAB_ICONS[route.name] || 'circle';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            <Feather
              name={iconName}
              size={22}
              color={isFocused ? colors.blue : colors.textTertiary}
            />
            {isFocused && (
              <Text style={styles.label}>{route.name}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.inter.semiBold,
    color: colors.blue,
  },
});
