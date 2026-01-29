'use client';

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { BannerAd } from '@/components/BannerAd';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors, spacing, borderRadius, typography, shadows } from '@/config/theme';
import { duas, duaCategories, type Dua } from '@/data/duas';

export default function DuasScreen() {
  const { t, language, isRTL } = useLanguage();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredDuas = useMemo(() => {
    if (!selectedCategory) return duas;
    return duas.filter((dua) => dua.category === selectedCategory);
  }, [selectedCategory]);

  const handleDuaPress = (dua: Dua) => {
    router.push({
      pathname: '/dua-detail',
      params: { id: dua.id },
    });
  };

  const renderCategoryItem = ({ item }: { item: typeof duaCategories[0] }) => {
    const isActive = selectedCategory === item.en;
    const label = language === 'ur' ? item.ur : item.en;

    return (
      <TouchableOpacity
        style={[styles.categoryChip, isActive && styles.categoryChipActive]}
        onPress={() => setSelectedCategory(isActive ? null : item.en)}
      >
        <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDuaItem = ({ item }: { item: Dua }) => {
    const title = language === 'ur' ? item.titleUr : item.title;
    const category = language === 'ur' ? item.categoryUr : item.category;
    const whenToRead = language === 'ur' ? item.whenToReadUr : item.whenToRead;

    return (
      <TouchableOpacity
        style={styles.duaCard}
        onPress={() => handleDuaPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.duaHeader}>
          <View style={styles.duaIcon}>
            <Ionicons name="heart" size={18} color={colors.primary} />
          </View>
          <View style={styles.duaInfo}>
            <Text style={[styles.duaTitle, isRTL && styles.rtlText]}>{title}</Text>
            <Text style={[styles.duaCategory, isRTL && styles.rtlText]}>{category}</Text>
          </View>
          <Ionicons
            name={isRTL ? 'chevron-back' : 'chevron-forward'}
            size={20}
            color={colors.textMuted}
          />
        </View>

        <Text style={styles.arabicPreview} numberOfLines={1}>
          {item.arabic}
        </Text>

        <View style={styles.whenToReadContainer}>
          <Ionicons name="time-outline" size={14} color={colors.accent} />
          <Text style={[styles.whenToReadText, isRTL && styles.rtlText]} numberOfLines={1}>
            {whenToRead}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={t('duasTitle')} />

      {/* Category Filter */}
      <View style={styles.categorySection}>
        <FlatList
          horizontal
          data={duaCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.en}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Duas List */}
      <FlatList
        data={filteredDuas}
        renderItem={renderDuaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Banner Ad */}
      <BannerAd />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  categorySection: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  duaCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.sm,
  },
  duaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  duaIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duaInfo: {
    flex: 1,
  },
  duaTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  duaCategory: {
    ...typography.caption,
    color: colors.textMuted,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  arabicPreview: {
    ...typography.arabic,
    color: colors.primary,
    textAlign: 'right',
    paddingVertical: spacing.xs,
  },
  whenToReadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  whenToReadText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
});
