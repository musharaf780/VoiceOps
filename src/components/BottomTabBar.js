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
            <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
              <Feather
                name={iconName}
                size={20}
                color={isFocused ? colors.navy : colors.textTertiary}
              />
            </View>
            <Text style={[styles.label, isFocused && styles.labelActive]}>{route.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSurface,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.blueTint,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.inter.regular,
    color: colors.textTertiary,
    letterSpacing: 0.2,
  },
  labelActive: {
    fontFamily: fonts.inter.semiBold,
    color: colors.navy,
  },
});
