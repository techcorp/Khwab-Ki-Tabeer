import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd as GoogleBannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ADS_ENABLED, AD_UNIT_IDS } from '@/services/ads';
import { colors, spacing } from '@/config/theme';
import { __DEV__ } from 'react-native';

interface BannerAdProps {
  size?: BannerAdSize;
}

export const BannerAd: React.FC<BannerAdProps> = ({ 
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER 
}) => {
  if (!ADS_ENABLED) {
    return null;
  }

  // Use test IDs in development
  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : AD_UNIT_IDS.BANNER;

  return (
    <View style={styles.container}>
      <GoogleBannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.log('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
