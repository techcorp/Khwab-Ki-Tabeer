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
import { dreamTopics } from '@/data/encyclopedia';

export default function EncyclopediaDetailScreen() {
  const { t, language, isRTL } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const topic = dreamTopics.find((d) => d.id === id);

  if (!topic) {
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
          <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t('encyclopedia')}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Topic not found</Text>
        </View>
      </View>
    );
  }

  const title = language === 'ur' ? topic.titleUr : topic.titleEn;
  const description = language === 'ur' ? topic.descriptionUr : topic.descriptionEn;
  const meaning = language === 'ur' ? topic.meaningUr : topic.meaningEn;

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
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Icon and Title Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name={topic.icon as any} size={48} color={colors.primary} />
          </View>
          <Text style={[styles.heroTitle, isRTL && styles.rtlText]}>{title}</Text>
          <Text style={[styles.heroDescription, isRTL && styles.rtlText]}>{description}</Text>
        </View>

        {/* Meaning Section */}
        <View style={styles.meaningSection}>
          <View style={styles.meaningHeader}>
            <Ionicons name="sparkles" size={20} color={colors.accent} />
            <Text style={[styles.meaningTitle, isRTL && styles.rtlText]}>
              {t('commonMeaning')}
            </Text>
          </View>
          <Text style={[styles.meaningText, isRTL && styles.rtlText]}>{meaning}</Text>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipItem}>
            <Ionicons name="bulb-outline" size={18} color={colors.accent} />
            <Text style={[styles.tipText, isRTL && styles.rtlText]}>
              {language === 'ur'
                ? 'خواب کی تفصیلات اور آپ کے جذبات تعبیر پر اثر ڈالتے ہیں'
                : 'Dream details and your emotions during the dream affect interpretation'}
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="moon-outline" size={18} color={colors.accent} />
            <Text style={[styles.tipText, isRTL && styles.rtlText]}>
              {language === 'ur'
                ? 'اچھے خواب اللہ کی طرف سے ہیں، ان کا شکر ادا کریں'
                : 'Good dreams are from Allah, be thankful for them'}
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="shield-outline" size={18} color={colors.accent} />
            <Text style={[styles.tipText, isRTL && styles.rtlText]}>
              {language === 'ur'
                ? 'برے خوابوں کے بعد اللہ کی پناہ مانگیں'
                : 'Seek refuge in Allah after bad dreams'}
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, isRTL && styles.rtlText]}>
            {language === 'ur'
              ? 'یہ عمومی معلومات ہیں۔ مکمل تعبیر کے لیے علماء سے رجوع کریں۔'
              : 'This is general information. Consult scholars for complete interpretation.'}
          </Text>
        </View>
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
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.md,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  heroDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  meaningSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    overflow: 'hidden',
  },
  meaningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  meaningTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  meaningText: {
    ...typography.body,
    color: colors.textPrimary,
    padding: spacing.lg,
    lineHeight: 26,
  },
  tipsSection: {
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  tipText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
  disclaimer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
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
