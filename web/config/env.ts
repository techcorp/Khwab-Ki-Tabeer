// Environment configuration for Next.js web app

export const ENV = {
  /**
   * IMPORTANT:
   * Browser must NOT call Ollama direct cross-origin.
   * Use Cloudflare Pages Functions proxy at /ollama/*
   *
   * Example final URL:
   *   /ollama/api/generate
   *   /ollama/api/tags
   */
  OLLAMA_BASE_URL: process.env.NEXT_PUBLIC_OLLAMA_BASE_URL || '/ollama',
  OLLAMA_MODEL: process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'llama3.2',


   // AdMob Configuration (for reference - web uses different ad system)
  ADMOB_APP_ID: 'ca-app-pub-1781167680002439~8352490439',
  ADMOB_BANNER_ID: 'ca-app-pub-1781167680002439/7970358810',
  ADMOB_INTERSTITIAL_ID: 'ca-app-pub-1781167680002439/4494148230',
  
  // App Settings
  MAX_DREAM_LENGTH: 2000,
  REQUEST_TIMEOUT_MS: 45000, // 45 seconds
  INTERSTITIAL_FREQUENCY: 3,
};

 
  
 