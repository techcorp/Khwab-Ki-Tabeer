'use client';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/config/theme';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const insets = useSafeAreaInsets();
  const { isRTL } = useLanguage();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.content}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, isRTL && styles.rtlText]}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.decoration} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryDark,
    paddingBottom: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.accentLight,
    opacity: 0.9,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  decoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.accent,
    opacity: 0.6,
  },
});
