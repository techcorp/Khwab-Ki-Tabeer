'use client';

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors, spacing, borderRadius, typography, shadows } from '@/config/theme';

export default function SettingsScreen() {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title={t('settingsTitle')} />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('language')}</Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                language === 'en' && styles.optionButtonActive,
              ]}
              onPress={() => setLanguage('en')}
            >
              <View style={styles.optionContent}>
                <Ionicons
                  name={language === 'en' ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={language === 'en' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.optionText,
                    language === 'en' && styles.optionTextActive,
                  ]}
                >
                  {t('english')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                language === 'ur' && styles.optionButtonActive,
              ]}
              onPress={() => setLanguage('ur')}
            >
              <View style={styles.optionContent}>
                <Ionicons
                  name={language === 'ur' ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={language === 'ur' ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.optionText,
                    language === 'ur' && styles.optionTextActive,
                  ]}
                >
                  {t('urdu')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/about')}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name="information-circle-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, isRTL && styles.rtlText]}>{t('about')}</Text>
            </View>
            <Ionicons
              name={isRTL ? 'chevron-back' : 'chevron-forward'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    padding: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  optionsContainer: {
    padding: spacing.sm,
  },
  optionButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  optionButtonActive: {
    backgroundColor: colors.successLight,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  optionText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
