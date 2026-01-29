import { ENV } from '@/config/env';
import { getInterpretationCount, incrementInterpretationCount } from './storage';

// Flag to easily disable ads for testing
export const ADS_ENABLED = ENV.ADS_ENABLED;

export const AD_UNIT_IDS = {
  BANNER: ENV.ADMOB_BANNER_ID,
  INTERSTITIAL: ENV.ADMOB_INTERSTITIAL_ID,
};

// Check if interstitial should be shown (every N interpretations)
export const shouldShowInterstitial = async (): Promise<boolean> => {
  if (!ADS_ENABLED) return false;
  
  const count = await incrementInterpretationCount();
  return count % ENV.INTERSTITIAL_FREQUENCY === 0;
};

// Get current interpretation count
export const getAdInterpretationCount = async (): Promise<number> => {
  return getInterpretationCount();
};
