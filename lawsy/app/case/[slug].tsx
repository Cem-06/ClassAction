import { Link, useLocalSearchParams } from 'expo-router';
import { Bookmark } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/ui/Text';
import { Colors } from '../../constants/colors';
import { getCaseBySlug } from '../../lib/cases';
import { useCasesStore } from '../../stores/cases-store';

export default function CaseDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const record = getCaseBySlug(slug);
  const { savedCaseIds, toggleSaved } = useCasesStore();

  if (!record) {
    return (
      <Screen>
        <Text variant="title">Case not found</Text>
        <Text color={Colors.textSecondary}>This case may have been removed or renamed.</Text>
        <Link href="/(tabs)" asChild>
          <Button label="Back to Home" />
        </Link>
      </Screen>
    );
  }

  const isSaved = savedCaseIds.includes(record.id);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.logoCircle}>
          <Text variant="label" color={Colors.primary}>
            {record.company[0]}
          </Text>
        </View>
        <View style={styles.headerCopy}>
          <Text variant="sectionTitle">{record.title}</Text>
          <View style={styles.tagRow}>
            <View style={styles.categoryTag}>
              <Text variant="caption" color="#334155">
                {record.category}
              </Text>
            </View>
            <View style={styles.statusTag}>
              <Text variant="caption" color={Colors.success}>
                Active
              </Text>
            </View>
          </View>
        </View>
        <Pressable onPress={() => toggleSaved(record.id)} style={styles.bookmarkButton}>
          <Bookmark
            color={isSaved ? Colors.primary : Colors.textMuted}
            fill={isSaved ? Colors.primary : 'transparent'}
            size={18}
          />
        </Pressable>
      </View>

      <Card>
        <Text variant="sectionTitle">Who May Qualify</Text>
        {record.qualifyRules.map((rule) => (
          <Text key={rule} color={Colors.textSecondary}>
            - {rule}
          </Text>
        ))}
      </Card>

      <Card>
        <Text variant="sectionTitle">Important Dates</Text>
        <Text color={Colors.textSecondary}>Purchase Window: {record.purchaseWindow}</Text>
        <Text color={Colors.textSecondary}>Claim Deadline: {record.deadlineLabel}</Text>
      </Card>

      <Card>
        <Text variant="sectionTitle">Estimated Payout</Text>
        <Text variant="title" color={Colors.primary}>
          {record.payout}
        </Text>
        <Link href={`/eligibility/${record.id}`} asChild>
          <Button label="Check Eligibility" />
        </Link>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bookmarkButton: {
    alignItems: 'center',
    borderColor: Colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  categoryTag: {
    backgroundColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerCopy: {
    flex: 1,
    gap: 8,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  logoCircle: {
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  statusTag: {
    backgroundColor: '#EAFBF0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
