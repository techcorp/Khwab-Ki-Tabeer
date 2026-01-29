// Islamic-themed color palette with emerald and gold accents
export const colors = {
  // Primary - Emerald
  primary: '#059669',
  primaryDark: '#065f46',
  primaryLight: '#10b981',
  
  // Accent - Gold
  accent: '#d4a574',
  accentDark: '#b8956a',
  accentLight: '#e8c9a0',
  
  // Neutrals
  white: '#ffffff',
  background: '#f8faf9',
  surface: '#ffffff',
  surfaceSecondary: '#f1f5f4',
  
  // Text
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textMuted: '#9ca3af',
  textOnPrimary: '#ffffff',
  
  // Borders
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  
  // Status
  error: '#dc2626',
  errorLight: '#fef2f2',
  success: '#059669',
  successLight: '#ecfdf5',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  // Balanced font sizes for both English and Urdu
  h1: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  arabic: {
    fontSize: 20,
    lineHeight: 36,
    fontWeight: '400' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
