# Khawab Ki Tabeer - Islamic Dream Interpretation App

A React Native (Expo) mobile app that provides AI-powered Islamic dream interpretations using a local Ollama model.

## Features

- **AI Dream Interpretation**: Get Islamic dream interpretations powered by Ollama AI
- **Bilingual Support**: Full support for English and Urdu
- **Dream Encyclopedia**: 22+ common dream topics with Islamic meanings
- **Duas & Azkar**: 16+ duas for sleep, bad dreams, anxiety, and protection
- **History**: Save and review past interpretations
- **AdMob Integration**: Banner and interstitial ads (configurable)

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_OLLAMA_BASE_URL=https://ollama.aikafanda.com
EXPO_PUBLIC_OLLAMA_MODEL=llama3.2

# Optional: Cloudflare Access Service Token
EXPO_PUBLIC_CF_ACCESS_CLIENT_ID=your_client_id
EXPO_PUBLIC_CF_ACCESS_CLIENT_SECRET=your_client_secret

# Feature Flags
EXPO_PUBLIC_ADS_ENABLED=true
```

### 3. Add App Assets

Place your custom assets in the `/assets` folder:
- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen image
- `adaptive-icon.png` - Android adaptive icon (1024x1024)
- `favicon.png` - Web favicon

### 4. Development

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### 5. Build for Production

```bash
# Generate native projects
npx expo prebuild

# Build Android APK/AAB
cd android && ./gradlew assembleRelease

# Or use EAS Build (recommended)
npx eas build --platform android
```

## AdMob Configuration

The app is configured with the following AdMob IDs:

- **App ID**: `ca-app-pub-1781167680002439~8352490439`
- **Banner Ad Unit**: `ca-app-pub-1781167680002439/7970358810`
- **Interstitial Ad Unit**: `ca-app-pub-1781167680002439/4494148230`

### Disabling Ads for Testing

Set `EXPO_PUBLIC_ADS_ENABLED=false` in your `.env` file, or modify `config/env.ts`:

```typescript
ADS_ENABLED: false, // Set to false for testing
```

## Project Structure

```
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home - Dream input
│   │   ├── history.tsx    # Past interpretations
│   │   ├── encyclopedia.tsx # Dream topics
│   │   ├── duas.tsx       # Duas & Azkar
│   │   └── settings.tsx   # Language settings
│   ├── about.tsx          # About screen
│   ├── dream-detail.tsx   # Interpretation detail
│   ├── dua-detail.tsx     # Dua detail
│   └── encyclopedia-detail.tsx
├── components/            # Reusable components
├── config/               # Configuration files
│   ├── env.ts           # Environment config
│   ├── i18n.ts          # Translations
│   └── theme.ts         # Design tokens
├── contexts/            # React contexts
├── data/               # Static data (duas, encyclopedia)
├── services/           # API and storage services
│   ├── ollama.ts       # Ollama API integration
│   ├── storage.ts      # AsyncStorage helpers
│   └── ads.ts          # AdMob helpers
└── assets/             # Images and fonts
```

## Ollama API Integration

The app supports both Ollama endpoints:
- `POST /api/generate` - Used by default with streaming
- `POST /api/chat` - Alternative endpoint

Features:
- Streaming responses with live text display
- 45-second timeout with user cancellation
- Cloudflare Access header support
- Automatic detection of Cloudflare block pages
- Retry functionality on failure

## Security Features

- Input validation with character limit (2000 chars)
- Request rate limiting (2-second debounce)
- No secrets exposed in UI
- Secure AsyncStorage for local data

## Content

### Duas (16+ included)
- Before sleeping
- Upon waking
- After bad dreams
- After good dreams
- Anxiety and fear
- Night prayer (Tahajjud)
- General protection
- Forgiveness
- Difficulty sleeping

### Encyclopedia (22+ topics)
- Water, Flying, Snake, Death
- Marriage, Teeth falling
- Prophet Muhammad (PBUH)
- Quran, Mosque, Money
- Fire, House, Running
- Animals, Crying, Pregnancy
- Hajj/Umrah, Garden/Paradise
- Light/Darkness, Falling
- Exam/Test, Travel

## License

Private - All rights reserved
