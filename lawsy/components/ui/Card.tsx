import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../../constants/colors';

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 1,
  },
});
