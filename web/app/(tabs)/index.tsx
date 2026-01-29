'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { BannerAd } from '@/components/BannerAd';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors, spacing, borderRadius, typography, shadows } from '@/config/theme';
import { ENV } from '@/config/env';
import { interpretDream } from '@/services/ollama';
import { saveInterpretation } from '@/services/storage';
import { shouldShowInterstitial, ADS_ENABLED, AD_UNIT_IDS } from '@/services/ads';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import Constants from 'expo-constants';

// Initialize interstitial ad
const interstitialAdUnitId = Constants.manifest?.developmentMode ? TestIds.INTERSTITIAL : AD_UNIT_IDS.INTERSTITIAL;
const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function HomeScreen() {
  const { t, language, isRTL } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [dream, setDream] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInterpret = useCallback(async () => {
    // Validation
    if (!dream.trim()) {
      Alert.alert(t('errorTitle'), t('emptyDream'));
      return;
    }

    if (dream.length > ENV.MAX_DREAM_LENGTH) {
      Alert.alert(t('errorTitle'), t('dreamTooLong'));
      return;
    }

    setIsLoading(true);
    setInterpretation('');
    setError(null);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    // Set timeout
    timeoutRef.current = setTimeout(() => {
      abortControllerRef.current?.abort();
      setError(t('timeoutError'));
      setIsLoading(false);
    }, ENV.REQUEST_TIMEOUT_MS);

    try {
      const result = await interpretDream({
        dream: dream.trim(),
        language,
        onChunk: (chunk) => {
          setInterpretation((prev) => prev + chunk);
        },
        signal: abortControllerRef.current.signal,
      });

      // Clear timeout on success
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Save interpretation
      await saveInterpretation(dream.trim(), result, language);

      setIsLoading(false);

      // Show interstitial ad if applicable
      if (ADS_ENABLED) {
        const showAd = await shouldShowInterstitial();
        if (showAd) {
          interstitial.load();
          const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            interstitial.show();
            unsubscribe();
          });
        }
      }
    } catch (err) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (err instanceof Error) {
        if (err.message === 'CANCELLED') {
          // User cancelled, no error to show
          setIsLoading(false);
          return;
        }

        if (err.message === 'CLOUDFLARE_BLOCKED') {
          setError(t('cloudflareError'));
        } else if (err.message.startsWith('HTTP_ERROR')) {
          setError(t('serverError'));
        } else {
          setError(t('networkError'));
        }
      } else {
        setError(t('networkError'));
      }

      setIsLoading(false);
    }
  }, [dream, language, t]);

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLoading(false);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    handleInterpret();
  }, [handleInterpret]);

  const handleNewDream = useCallback(() => {
    setDream('');
    setInterpretation('');
    setError(null);
  }, []);

  const characterCount = dream.length;
  const isOverLimit = characterCount > ENV.MAX_DREAM_LENGTH;

  return (
    <View style={styles.container}>
      <Header title={t('welcomeTitle')} subtitle={t('welcomeSubtitle')} />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Dream Input Section */}
          {!interpretation && !isLoading && (
            <View style={styles.inputSection}>
              <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                <TextInput
                  style={[
                    styles.textInput,
                    isRTL && styles.rtlText,
                    isOverLimit && styles.textInputError,
                  ]}
                  placeholder={t('dreamPlaceholder')}
                  placeholderTextColor={colors.textMuted}
                  multiline
                  maxLength={ENV.MAX_DREAM_LENGTH + 100}
                  value={dream}
                  onChangeText={setDream}
                  textAlignVertical="top"
                />
                <View style={styles.charCount}>
                  <Text
                    style={[
                      styles.charCountText,
                      isOverLimit && styles.charCountError,
                    ]}
                  >
                    {characterCount}/{ENV.MAX_DREAM_LENGTH}
                  </Text>
                </View>
              </View>

              <View style={styles.tipsContainer}>
                <Ionicons name="bulb-outline" size={16} color={colors.accent} />
                <Text style={[styles.tipsText, isRTL && styles.rtlText]}>
                  {language === 'ur'
                    ? 'واضح تفصیلات بہتر تعبیر کے لیے مددگار ہیں'
                    : 'Clear details help provide better interpretations'}
                </Text>
              </View>
            </View>
          )}

          {/* Loading/Streaming State */}
          {isLoading && (
            <View style={styles.resultSection}>
              <View style={styles.resultHeader}>
                <Ionicons name="sparkles" size={20} color={colors.accent} />
                <Text style={[styles.resultTitle, isRTL && styles.rtlText]}>
                  {t('interpretationTitle')}
                </Text>
              </View>
              <View style={styles.resultContent}>
                {interpretation ? (
                  <Text style={[styles.interpretationText, isRTL && styles.rtlText]}>
                    {interpretation}
                  </Text>
                ) : (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>{t('interpreting')}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Result Section */}
          {interpretation && !isLoading && (
            <View style={styles.resultSection}>
              <View style={styles.resultHeader}>
                <Ionicons name="sparkles" size={20} color={colors.accent} />
                <Text style={[styles.resultTitle, isRTL && styles.rtlText]}>
                  {t('interpretationTitle')}
                </Text>
              </View>
              <View style={styles.resultContent}>
                <Text style={[styles.interpretationText, isRTL && styles.rtlText]}>
                  {interpretation}
                </Text>
              </View>
            </View>
          )}

          {/* Error Section */}
          {error && (
            <View style={styles.errorSection}>
              <Ionicons name="alert-circle" size={24} color={colors.error} />
              <Text style={[styles.errorText, isRTL && styles.rtlText]}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>{t('retryButton')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          {isLoading ? (
            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <Ionicons name="stop-circle" size={20} color={colors.white} />
              <Text style={styles.buttonText}>{t('stopButton')}</Text>
            </TouchableOpacity>
          ) : interpretation ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleNewDream}>
              <Ionicons name="add-circle" size={20} color={colors.white} />
              <Text style={styles.buttonText}>{t('newDream')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!dream.trim() || isOverLimit) && styles.primaryButtonDisabled,
              ]}
              onPress={handleInterpret}
              disabled={!dream.trim() || isOverLimit}
            >
              <Ionicons name="sparkles" size={20} color={colors.white} />
              <Text style={styles.buttonText}>{t('interpretButton')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

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
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  inputSection: {
    gap: spacing.md,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  inputContainerRTL: {},
  textInput: {
    ...typography.body,
    color: colors.textPrimary,
    padding: spacing.lg,
    minHeight: 200,
    maxHeight: 300,
  },
  textInputError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  charCount: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.md,
  },
  charCountText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  charCountError: {
    color: colors.error,
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  tipsText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  resultSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    overflow: 'hidden',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  resultContent: {
    padding: spacing.lg,
  },
  interpretationText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorSection: {
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  actionBar: {
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  stopButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
