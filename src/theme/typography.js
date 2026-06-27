import { Platform } from 'react-native';

export const fonts = {
  inter: {
    regular:  Platform.select({ ios: undefined, android: 'sans-serif' }),
    medium:   Platform.select({ ios: undefined, android: 'sans-serif-medium' }),
    semiBold: Platform.select({ ios: undefined, android: 'sans-serif-medium' }),
    bold:     Platform.select({ ios: undefined, android: 'sans-serif' }),
  },
  mono: {
    regular: Platform.select({ ios: 'Courier New', android: 'monospace' }),
    medium:  Platform.select({ ios: 'Courier New', android: 'monospace' }),
  },
};

export const spacing = {
  xs:    4,
  sm:    8,
  md:    12,
  base:  16,
  lg:    20,
  xl:    24,
  xxl:   32,
  xxxl:  40,
  xxxxl: 48,
};

export const radius = {
  card:      12,
  input:     12,
  badge:     6,
  pill:      999,
  button:    12,
  avatar:    999,
  recordBtn: 60,
};
