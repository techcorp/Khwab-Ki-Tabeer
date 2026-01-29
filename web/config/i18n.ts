export type Language = 'en' | 'ur';

export const translations = {
  en: {
    // App
    appName: 'Khawab Ki Tabeer',
    
    // Tabs
    home: 'Home',
    history: 'History',
    encyclopedia: 'Encyclopedia',
    duas: 'Duas',
    about: 'About',
    settings: 'Settings',
    
    // Home Screen
    welcomeTitle: 'Dream Interpretation',
    welcomeSubtitle: 'Share your dream and receive an AI-powered Islamic interpretation',
    dreamPlaceholder: 'Describe your dream here...',
    interpretButton: 'Interpret Dream',
    interpreting: 'Interpreting...',
    stopButton: 'Stop',
    retryButton: 'Retry',
    cancelButton: 'Cancel',
    
    // Interpretation
    interpretationTitle: 'Interpretation',
    newDream: 'New Dream',
    saveInterpretation: 'Save',
    saved: 'Saved!',
    
    // History
    historyTitle: 'Past Interpretations',
    noHistory: 'No interpretations saved yet',
    noHistorySubtitle: 'Your dream interpretations will appear here',
    deleteConfirm: 'Delete this interpretation?',
    delete: 'Delete',
    cancel: 'Cancel',
    clearAll: 'Clear All',
    clearAllConfirm: 'Delete all interpretations?',
    
    // Encyclopedia
    encyclopediaTitle: 'Dream Encyclopedia',
    searchPlaceholder: 'Search dreams...',
    noResults: 'No results found',
    commonMeaning: 'Common Meaning',
    
    // Duas
    duasTitle: 'Duas & Azkar',
    whenToRead: 'When to Read',
    arabic: 'Arabic',
    transliteration: 'Transliteration',
    translation: 'Translation',
    
    // About
    aboutTitle: 'About',
    version: 'Version',
    disclaimer: 'Disclaimer',
    disclaimerText: 'This app provides AI-generated dream interpretations for educational and entertainment purposes only. Interpretations are not religious rulings (fatwa) and should not be taken as definitive Islamic guidance. Always consult qualified Islamic scholars for religious matters.',
    developer: 'Developer',
    contact: 'Contact',
    
    // Settings
    settingsTitle: 'Settings',
    language: 'Language',
    english: 'English',
    urdu: 'اردو (Urdu)',
    
    // Errors
    errorTitle: 'Error',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    cloudflareError: 'Service unavailable. Server blocked by Cloudflare Access or tunnel issue.',
    timeoutError: 'Request timed out. Please try again.',
    emptyDream: 'Please enter your dream first.',
    dreamTooLong: 'Dream description is too long. Maximum 2000 characters.',
  },
  ur: {
    // App
    appName: 'خواب کی تعبیر',
    
    // Tabs
    home: 'ہوم',
    history: 'تاریخ',
    encyclopedia: 'انسائیکلوپیڈیا',
    duas: 'دعائیں',
    about: 'تعارف',
    settings: 'ترتیبات',
    
    // Home Screen
    welcomeTitle: 'خواب کی تعبیر',
    welcomeSubtitle: 'اپنا خواب بیان کریں اور AI سے اسلامی تعبیر حاصل کریں',
    dreamPlaceholder: 'یہاں اپنا خواب بیان کریں...',
    interpretButton: 'تعبیر کریں',
    interpreting: 'تعبیر ہو رہی ہے...',
    stopButton: 'رکیں',
    retryButton: 'دوبارہ کوشش',
    cancelButton: 'منسوخ',
    
    // Interpretation
    interpretationTitle: 'تعبیر',
    newDream: 'نیا خواب',
    saveInterpretation: 'محفوظ کریں',
    saved: 'محفوظ ہو گیا!',
    
    // History
    historyTitle: 'پچھلی تعبیرات',
    noHistory: 'ابھی کوئی تعبیر محفوظ نہیں',
    noHistorySubtitle: 'آپ کی خواب کی تعبیرات یہاں دکھائی دیں گی',
    deleteConfirm: 'یہ تعبیر حذف کریں؟',
    delete: 'حذف',
    cancel: 'منسوخ',
    clearAll: 'سب حذف کریں',
    clearAllConfirm: 'تمام تعبیرات حذف کریں؟',
    
    // Encyclopedia
    encyclopediaTitle: 'خوابوں کا انسائیکلوپیڈیا',
    searchPlaceholder: 'خواب تلاش کریں...',
    noResults: 'کوئی نتیجہ نہیں ملا',
    commonMeaning: 'عام معنی',
    
    // Duas
    duasTitle: 'دعائیں اور اذکار',
    whenToRead: 'کب پڑھیں',
    arabic: 'عربی',
    transliteration: 'تلفظ',
    translation: 'ترجمہ',
    
    // About
    aboutTitle: 'تعارف',
    version: 'ورژن',
    disclaimer: 'دستبرداری',
    disclaimerText: 'یہ ایپ صرف تعلیمی اور تفریحی مقاصد کے لیے AI سے تیار کردہ خوابوں کی تعبیر فراہم کرتی ہے۔ تعبیرات مذہبی فتاویٰ نہیں ہیں اور انہیں حتمی اسلامی رہنمائی کے طور پر نہیں لینا چاہیے۔ مذہبی معاملات کے لیے ہمیشہ اہل اسلامی علماء سے رجوع کریں۔',
    developer: 'ڈیولپر',
    contact: 'رابطہ',
    
    // Settings
    settingsTitle: 'ترتیبات',
    language: 'زبان',
    english: 'English (انگریزی)',
    urdu: 'اردو',
    
    // Errors
    errorTitle: 'خرابی',
    networkError: 'نیٹ ورک کی خرابی۔ براہ کرم اپنا کنکشن چیک کریں۔',
    serverError: 'سرور کی خرابی۔ براہ کرم بعد میں دوبارہ کوشش کریں۔',
    cloudflareError: 'سروس دستیاب نہیں۔ سرور Cloudflare Access یا ٹنل کے مسئلے کی وجہ سے بلاک ہے۔',
    timeoutError: 'درخواست کا وقت ختم۔ براہ کرم دوبارہ کوشش کریں۔',
    emptyDream: 'براہ کرم پہلے اپنا خواب درج کریں۔',
    dreamTooLong: 'خواب کی تفصیل بہت لمبی ہے۔ زیادہ سے زیادہ 2000 حروف۔',
  },
};

export const t = (key: keyof typeof translations.en, lang: Language): string => {
  return translations[lang][key] || translations.en[key] || key;
};
