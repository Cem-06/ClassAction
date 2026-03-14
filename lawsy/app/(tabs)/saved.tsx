import { Link } from 'expo-router';
import { BookmarkCheck } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { TabSwipeContainer } from '../../components/navigation/TabSwipeContainer';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/ui/Text';
import { Colors } from '../../constants/colors';
import { caseRecords } from '../../lib/cases';
import { useCasesStore } from '../../stores/cases-store';

export default function SavedScreen() {
  const { savedCaseIds, toggleSaved } = useCasesStore();
  const savedCases = caseRecords.filter((item) => savedCaseIds.includes(item.id));

  return (
    <TabSwipeContainer>
      <Screen>
        <Text variant="title">Saved</Text>

        {!savedCases.length ? (
          <Card>
            <View style={styles.emptyIcon}>
              <BookmarkCheck color={Colors.textMuted} size={20} />
            </View>
            <Text variant="sectionTitle">No saved cases yet</Text>
            <Text color={Colors.textSecondary}>
              Bookmark cases on Home and they will show up here.
            </Text>
            <Link href="/(tabs)" asChild>
              <Button label="Browse Cases" />
            </Link>
          </Card>
        ) : null}

        {savedCases.map((item) => (
          <Card key={item.id}>
            <View style={styles.caseHeader}>
              <View style={styles.logoCircle}>
                <Text variant="label" color={Colors.primary}>
                  {item.company[0]}
                </Text>
              </View>
              <View style={styles.caseCopy}>
                <Link href={`/case/${item.slug}`} asChild>
                  <Pressable>
                    <Text variant="sectionTitle">{item.title}</Text>
                  </Pressable>
                </Link>
                <Text color={Colors.textSecondary}>{item.description}</Text>
                <Text variant="caption" color="#92400E">
                  Deadline {item.deadlineLabel}
                </Text>
              </View>
            </View>
            <Button label="Remove from Saved" onPress={() => toggleSaved(item.id)} variant="secondary" />
          </Card>
        ))}
      </Screen>
    </TabSwipeContainer>
  );
}

const styles = StyleSheet.create({
  caseCopy: {
    flex: 1,
    gap: 6,
  },
  caseHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  logoCircle: {
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
