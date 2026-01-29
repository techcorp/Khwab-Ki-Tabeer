'use client';

import React, { useState, useEffect } from 'react';
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
import { getHistory, type DreamInterpretation } from '@/services/storage';

export default function DreamDetailScreen() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [dream, setDream] = useState<DreamInterpretation | null>(null);

  useEffect(() => {
    loadDream();
  }, [id]);

  const loadDream = async () => {
    const history = await getHistory();
    const found = history.find((item) => item.id === id);
    setDream(found || null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(isRTL ? 'ur-PK' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!dream) {
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
          <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>
            {t('interpretationTitle')}
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Dream not found</Text>
        </View>
      </View>
    );
  }

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
        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>
          {t('interpretationTitle')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Date */}
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
          <Text style={styles.dateText}>{formatDate(dream.timestamp)}</Text>
        </View>

        {/* Dream Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="moon-outline" size={18} color={colors.accent} />
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {isRTL ? 'خواب' : 'Dream'}
            </Text>
          </View>
          <Text style={[styles.dreamText, isRTL && styles.rtlText]}>{dream.dream}</Text>
        </View>

        {/* Interpretation Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={18} color={colors.accent} />
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t('interpretationTitle')}
            </Text>
          </View>
          <Text style={[styles.interpretationText, isRTL && styles.rtlText]}>
            {dream.interpretation}
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dateText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  dreamText: {
    ...typography.body,
    color: colors.textPrimary,
    padding: spacing.lg,
    lineHeight: 24,
  },
  interpretationText: {
    ...typography.body,
    color: colors.textPrimary,
    padding: spacing.lg,
    lineHeight: 24,
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
