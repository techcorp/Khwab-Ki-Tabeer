'use client';

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors, spacing, borderRadius, typography, shadows } from '@/config/theme';
import { dreamTopics, type DreamTopic } from '@/data/encyclopedia';

export default function EncyclopediaScreen() {
  const { t, language, isRTL } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return dreamTopics;
    
    const query = searchQuery.toLowerCase();
    return dreamTopics.filter((topic) => {
      const titleEn = topic.titleEn.toLowerCase();
      const titleUr = topic.titleUr;
      const descEn = topic.descriptionEn.toLowerCase();
      const descUr = topic.descriptionUr;
      
      return (
        titleEn.includes(query) ||
        titleUr.includes(searchQuery) ||
        descEn.includes(query) ||
        descUr.includes(searchQuery)
      );
    });
  }, [searchQuery]);

  const handleTopicPress = (topic: DreamTopic) => {
    router.push({
      pathname: '/encyclopedia-detail',
      params: { id: topic.id },
    });
  };

  const renderItem = ({ item }: { item: DreamTopic }) => {
    const title = language === 'ur' ? item.titleUr : item.titleEn;
    const description = language === 'ur' ? item.descriptionUr : item.descriptionEn;

    return (
      <TouchableOpacity
        style={styles.topicCard}
        onPress={() => handleTopicPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon as any} size={24} color={colors.primary} />
        </View>
        <View style={styles.topicContent}>
          <Text style={[styles.topicTitle, isRTL && styles.rtlText]}>{title}</Text>
          <Text style={[styles.topicDescription, isRTL && styles.rtlText]} numberOfLines={2}>
            {description}
          </Text>
        </View>
        <Ionicons
          name={isRTL ? 'chevron-back' : 'chevron-forward'}
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={colors.textMuted} />
      <Text style={[styles.emptyText, isRTL && styles.rtlText]}>{t('noResults')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title={t('encyclopediaTitle')} />

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, isRTL && styles.searchContainerRTL]}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, isRTL && styles.rtlText]}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Topics List */}
      <FlatList
        data={filteredTopics}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredTopics.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchSection: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchContainerRTL: {
    flexDirection: 'row-reverse',
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  topicCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicContent: {
    flex: 1,
    gap: spacing.xs,
  },
  topicTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  topicDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
