import { useMemo, useState } from 'react';
import { Link } from 'expo-router';
import { Bell, Bookmark, Search } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { TabSwipeContainer } from '../../components/navigation/TabSwipeContainer';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/ui/Text';
import { Colors } from '../../constants/colors';
import { caseRecords, categories, type Category } from '../../lib/cases';
import { useCasesStore } from '../../stores/cases-store';

export default function DiscoverScreen() {
  const { savedCaseIds, toggleSaved } = useCasesStore();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return caseRecords.filter((item) => {
      const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
      const queryMatch =
        normalizedQuery.length === 0 ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.company.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery);

      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query]);

  return (
    <TabSwipeContainer>
      <Screen>
        <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text variant="titleXl">Lawsy</Text>
          <Text color={Colors.textSecondary}>Class Action Lawsuit Finder</Text>
        </View>
        <Pressable style={styles.iconButton}>
          <Bell color={Colors.textPrimary} size={20} />
        </Pressable>
      </View>

        <View style={styles.searchContainer}>
        <Search color={Colors.textMuted} size={18} />
        <TextInput
          onChangeText={setQuery}
          placeholder="Search companies, products, cases"
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
          value={query}
        />
      </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.chipRow}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <Pressable
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
              >
                <Text
                  variant="caption"
                  color={isActive ? Colors.white : '#334155'}
                  style={styles.chipText}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.caseList}>
          {filteredCases.map((item) => {
            const isSaved = savedCaseIds.includes(item.id);

            return (
              <Card key={item.id}>
              <View style={styles.caseHeader}>
                <View style={styles.logoCircle}>
                  <Text variant="label" color={Colors.primary}>
                    {item.company[0]}
                  </Text>
                </View>
                <View style={styles.caseTitleWrap}>
                  <Link href={`/case/${item.slug}`} asChild>
                    <Pressable>
                      <Text variant="sectionTitle">{item.title}</Text>
                    </Pressable>
                  </Link>
                  <View style={styles.metaRow}>
                    <View style={styles.categoryTag}>
                      <Text variant="caption" color="#334155">
                        {item.category}
                      </Text>
                    </View>
                    <View style={styles.deadlineTag}>
                      <Text variant="caption" color="#92400E">
                        Deadline {item.deadlineLabel}
                      </Text>
                    </View>
                  </View>
                </View>
                <Pressable onPress={() => toggleSaved(item.id)} style={styles.iconButton}>
                  <Bookmark
                    color={isSaved ? Colors.primary : Colors.textMuted}
                    fill={isSaved ? Colors.primary : 'transparent'}
                    size={18}
                  />
                </Pressable>
              </View>

              <Text color={Colors.textSecondary}>{item.description}</Text>
              <Text variant="label">Estimated payout: {item.payout}</Text>

              <Link href={`/eligibility/${item.id}`} asChild>
                <Button label="Check Eligibility" />
              </Link>
              </Card>
            );
          })}

          {!filteredCases.length ? (
            <Card>
              <Text variant="sectionTitle">No matching cases</Text>
              <Text color={Colors.textSecondary}>Try another category or search term.</Text>
            </Card>
          ) : null}
        </View>
      </Screen>
    </TabSwipeContainer>
  );
}

const styles = StyleSheet.create({
  caseHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  caseList: {
    gap: 16,
  },
  caseTitleWrap: {
    flex: 1,
    gap: 8,
  },
  categoryTag: {
    backgroundColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chip: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipInactive: {
    backgroundColor: Colors.border,
  },
  chipRow: {
    gap: 8,
    paddingRight: 20,
  },
  chipText: {
    fontWeight: '600',
  },
  deadlineTag: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    borderColor: Colors.border,
    borderRadius: 999,
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
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  searchInput: {
    color: Colors.textPrimary,
    flex: 1,
    fontSize: 16,
    minHeight: 44,
  },
});
