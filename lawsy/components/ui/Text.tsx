import { PropsWithChildren } from 'react';
import { StyleSheet, Text as RNText, TextProps } from 'react-native';

import { Colors } from '../../constants/colors';

type Variant = 'titleXl' | 'title' | 'sectionTitle' | 'body' | 'caption' | 'label';

type AppTextProps = PropsWithChildren<
  TextProps & {
    variant?: Variant;
    color?: string;
  }
>;

export function Text({ children, variant = 'body', color, style, ...rest }: AppTextProps) {
  return (
    <RNText style={[styles.base, styles[variant], color ? { color } : null, style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  titleXl: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
});
