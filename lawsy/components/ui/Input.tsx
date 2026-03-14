import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { Colors } from '../../constants/colors';

export const Input = forwardRef<TextInput, TextInputProps>(function Input(props, ref) {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={Colors.textMuted}
      style={styles.input}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: Colors.textPrimary,
    fontSize: 16,
    minHeight: 44,
    paddingHorizontal: 14,
  },
});
