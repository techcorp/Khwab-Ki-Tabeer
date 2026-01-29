'use client';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors, spacing, borderRadius, typography, shadows } from '@/config/theme';

export default function AboutScreen() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t('aboutTitle')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* App Info */}
        <View style={styles.appInfo}>
          <View style={styles.iconContainer}>
            <Ionicons name="moon" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.appName, isRTL && styles.rtlText]}>{t('appName')}</Text>
          <Text style={styles.version}>{t('version')} 1.0.0</Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.accent} />
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('disclaimer')}</Text>
          </View>
          <Text style={[styles.disclaimerText, isRTL && styles.rtlText]}>
            {t('disclaimerText')}
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {isRTL ? 'خصوصیات' : 'Features'}
          </Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="sparkles" size={18} color={colors.primary} />
              <Text style={[styles.featureText, isRTL && styles.rtlText]}>
                {isRTL ? 'AI پر مبنی خواب کی تعبیر' : 'AI-powered dream interpretation'}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="book" size={18} color={colors.primary} />
              <Text style={[styles.featureText, isRTL && styles.rtlText]}>
                {isRTL ? 'خوابوں کا انسائیکلوپیڈیا' : 'Dream encyclopedia'}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="heart" size={18} color={colors.primary} />
              <Text style={[styles.featureText, isRTL && styles.rtlText]}>
                {isRTL ? 'نیند کی دعائیں اور اذکار' : 'Sleep duas and azkar'}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="time" size={18} color={colors.primary} />
              <Text style={[styles.featureText, isRTL && styles.rtlText]}>
                {isRTL ? 'تعبیرات کی تاریخ' : 'Interpretation history'}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="language" size={18} color={colors.primary} />
              <Text style={[styles.featureText, isRTL && styles.rtlText]}>
                {isRTL ? 'اردو اور انگریزی' : 'Urdu & English support'}
              </Text>
            </View>
          </View>
        </View>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>
            {isRTL ? 'اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے' : 'Bismillahir Rahmanir Raheem'}
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
    ...typography.h2,
    color: colors.textOnPrimary,
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
  appInfo: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  appName: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  version: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  disclaimerText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  credits: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  creditsText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
