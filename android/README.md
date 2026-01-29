# Khawab Ki Tabeer (Android)

This Android project is a **WebView wrapper** around the web UI.

## 1) Set the Web App URL (Frontend)

Open:
`android/app/src/main/java/net/imaginationai/khawabkitabeer/MainActivity.kt`

Set:

```kotlin
private val START_URL = "https://YOUR-FRONTEND-URL/"
```

### If you don't have a domain
Host the `web/` app on **Cloudflare Pages** (free) or Vercel, then paste that URL here.

## 2) Ollama Backend (Already set)

The web app is configured to call your Ollama tunnel:

- `NEXT_PUBLIC_OLLAMA_BASE_URL=https://ollama.aikafanda.com`

Edit it in `web/.env` if needed.

> If your tunnel is protected by Cloudflare Access, put `NEXT_PUBLIC_CF_ACCESS_CLIENT_ID` and
`NEXT_PUBLIC_CF_ACCESS_CLIENT_SECRET` in `web/.env` (Service Token), and rebuild/redeploy the web app.

## 3) Build APK

Open the `android/` folder in Android Studio and run:

- **Build > Build Bundle(s) / APK(s) > Build APK(s)**

