'use client';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors, spacing, borderRadius, typography, shadows } from '@/config/theme';
import { duas } from '@/data/duas';

export default function DuaDetailScreen() {
  const { t, language, isRTL } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const dua = duas.find((d) => d.id === id);

  if (!dua) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons
              name={isRTL ? 'arrow-forward' : 'arrow-back'}
              size={24}
              color={colors.textOnPrimary}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t('duas')}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Dua not found</Text>
        </View>
      </View>
    );
  }

  const title = language === 'ur' ? dua.titleUr : dua.title;
  const category = language === 'ur' ? dua.categoryUr : dua.category;
  const translation = language === 'ur' ? dua.translationUr : dua.translationEn;
  const whenToRead = language === 'ur' ? dua.whenToReadUr : dua.whenToRead;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons
            name={isRTL ? 'arrow-forward' : 'arrow-back'}
            size={24}
            color={colors.textOnPrimary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Ionicons name="heart" size={14} color={colors.primary} />
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        {/* Arabic */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('arabic')}</Text>
          <View style={styles.arabicContainer}>
            <Text style={styles.arabicText}>{dua.arabic}</Text>
          </View>
        </View>

        {/* Transliteration */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('transliteration')}</Text>
          <Text style={styles.transliterationText}>{dua.transliteration}</Text>
        </View>

        {/* Translation */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('translation')}</Text>
          <Text style={[styles.translationText, isRTL && styles.rtlText]}>{translation}</Text>
        </View>

        {/* When to Read */}
        <View style={styles.whenToReadSection}>
          <View style={styles.whenToReadHeader}>
            <Ionicons name="time" size={18} color={colors.accent} />
            <Text style={styles.whenToReadLabel}>{t('whenToRead')}</Text>
          </View>
          <Text style={[styles.whenToReadText, isRTL && styles.rtlText]}>{whenToRead}</Text>
        </View>

        {/* Reference */}
        {dua.reference && (
          <View style={styles.referenceContainer}>
            <Text style={styles.referenceText}>Reference: {dua.reference}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textOnPrimary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  arabicContainer: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 44,
    color: colors.primaryDark,
    textAlign: 'right',
    fontWeight: '400',
  },
  transliterationText: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 26,
  },
  translationText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 26,
  },
  whenToReadSection: {
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  whenToReadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  whenToReadLabel: {
    ...typography.bodySmall,
    color: colors.accentDark,
    fontWeight: '600',
  },
  whenToReadText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  referenceContainer: {
    alignItems: 'center',
    padding: spacing.md,
  },
  referenceText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
