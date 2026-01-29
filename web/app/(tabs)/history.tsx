'use client';

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors, spacing, borderRadius, typography, shadows } from '@/config/theme';
import { getHistory, deleteInterpretation, clearHistory, type DreamInterpretation } from '@/services/storage';

export default function HistoryScreen() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [history, setHistory] = useState<DreamInterpretation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(t('deleteConfirm'), '', [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteInterpretation(id);
            await loadHistory();
          },
        },
      ]);
    },
    [t, loadHistory]
  );

  const handleClearAll = useCallback(() => {
    Alert.alert(t('clearAllConfirm'), '', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          await loadHistory();
        },
      },
    ]);
  }, [t, loadHistory]);

  const handleItemPress = useCallback(
    (item: DreamInterpretation) => {
      router.push({
        pathname: '/dream-detail',
        params: { id: item.id },
      });
    },
    [router]
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(isRTL ? 'ur-PK' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderItem = ({ item }: { item: DreamInterpretation }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <Text
          style={[styles.dreamText, isRTL && styles.rtlText]}
          numberOfLines={2}
        >
          {item.dream}
        </Text>
        <Text style={[styles.interpretationPreview, isRTL && styles.rtlText]} numberOfLines={2}>
          {item.interpretation}
        </Text>
        <View style={styles.itemFooter}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="moon-outline" size={64} color={colors.textMuted} />
      <Text style={[styles.emptyTitle, isRTL && styles.rtlText]}>{t('noHistory')}</Text>
      <Text style={[styles.emptySubtitle, isRTL && styles.rtlText]}>{t('noHistorySubtitle')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title={t('historyTitle')} />

      {history.length > 0 && (
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
            <Text style={styles.clearButtonText}>{t('clearAll')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          history.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  clearButtonText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '500',
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    overflow: 'hidden',
  },
  itemContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  dreamText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  interpretationPreview: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
