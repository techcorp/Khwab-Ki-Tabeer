import { ENV } from '@/config/env';
import type { Language } from '@/config/i18n';

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

interface GenerateOptions {
  dream: string;
  language: Language;
  onChunk?: (text: string) => void;
  signal?: AbortSignal;
}

// Debounce tracking
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

const getSystemPrompt = (language: Language): string => {
  if (language === 'ur') {
    return `آپ ایک اسلامی خوابوں کی تعبیر کے ماہر ہیں۔ قرآن، حدیث اور اسلامی روایات کی روشنی میں خوابوں کی تعبیر کریں۔ 
اپنا جواب اردو میں دیں۔ 
مختصر اور واضح رہیں (200-300 الفاظ)۔
اگر خواب منفی ہے تو مثبت رہنمائی بھی دیں۔
نوٹ: یہ صرف عمومی رہنمائی ہے، فتویٰ نہیں۔`;
  }
  
  return `You are an Islamic dream interpretation expert. Interpret dreams based on Quran, Hadith, and Islamic traditions.
Keep your response concise (200-300 words).
If the dream seems negative, also provide positive guidance.
Note: This is general guidance only, not a religious ruling (fatwa).`;
};

const checkCloudflareBlock = (text: string): boolean => {
  // Check if response is Cloudflare Access login page
  return (
    text.includes('cloudflare') ||
    text.includes('Cloudflare') ||
    text.includes('Access denied') ||
    text.includes('cf-access') ||
    text.includes('<!DOCTYPE html>') ||
    text.includes('<html')
  );
};

export const interpretDream = async ({
  dream,
  language,
  onChunk,
  signal,
}: GenerateOptions): Promise<string> => {
  // Rate limiting
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL - (now - lastRequestTime)));
  }
  lastRequestTime = Date.now();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Cloudflare Access headers if configured
  if (ENV.CF_ACCESS_CLIENT_ID && ENV.CF_ACCESS_CLIENT_SECRET) {
    headers['CF-Access-Client-Id'] = ENV.CF_ACCESS_CLIENT_ID;
    headers['CF-Access-Client-Secret'] = ENV.CF_ACCESS_CLIENT_SECRET;
  }

  const systemPrompt = getSystemPrompt(language);
  const userPrompt = language === 'ur' 
    ? `میرا خواب: ${dream}\n\nبراہ کرم اس خواب کی اسلامی تعبیر بیان کریں۔`
    : `My dream: ${dream}\n\nPlease provide an Islamic interpretation of this dream.`;

  // Create timeout
  const timeoutId = setTimeout(() => {
    // This will be handled by the AbortController
  }, ENV.REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${ENV.OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: ENV.OLLAMA_MODEL,
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: true,
      }),
      signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      if (checkCloudflareBlock(text)) {
        throw new Error('CLOUDFLARE_BLOCKED');
      }
      throw new Error(`HTTP_ERROR_${response.status}`);
    }

    // Check content type for potential Cloudflare intercept
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('CLOUDFLARE_BLOCKED');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('STREAM_ERROR');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(Boolean);
      
      for (const line of lines) {
        try {
          const json: OllamaResponse = JSON.parse(line);
          
          // Check first chunk for Cloudflare block
          if (fullResponse.length === 0 && checkCloudflareBlock(json.response)) {
            reader.cancel();
            throw new Error('CLOUDFLARE_BLOCKED');
          }
          
          fullResponse += json.response;
          onChunk?.(json.response);
          
          if (json.done) {
            return fullResponse;
          }
        } catch (parseError) {
          // Check if raw response is Cloudflare page
          if (checkCloudflareBlock(line)) {
            reader.cancel();
            throw new Error('CLOUDFLARE_BLOCKED');
          }
          // Skip invalid JSON lines
        }
      }
    }

    return fullResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('CANCELLED');
      }
      throw error;
    }
    
    throw new Error('UNKNOWN_ERROR');
  }
};

// Non-streaming version as fallback
export const interpretDreamSync = async (
  dream: string,
  language: Language,
  signal?: AbortSignal
): Promise<string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (ENV.CF_ACCESS_CLIENT_ID && ENV.CF_ACCESS_CLIENT_SECRET) {
    headers['CF-Access-Client-Id'] = ENV.CF_ACCESS_CLIENT_ID;
    headers['CF-Access-Client-Secret'] = ENV.CF_ACCESS_CLIENT_SECRET;
  }

  const systemPrompt = getSystemPrompt(language);
  const userPrompt = language === 'ur'
    ? `میرا خواب: ${dream}\n\nبراہ کرم ا�� خواب کی اسلامی تعبیر بیان کریں۔`
    : `My dream: ${dream}\n\nPlease provide an Islamic interpretation of this dream.`;

  const response = await fetch(`${ENV.OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: ENV.OLLAMA_MODEL,
      prompt: `${systemPrompt}\n\n${userPrompt}`,
      stream: false,
    }),
    signal,
  });

  if (!response.ok) {
    const text = await response.text();
    if (checkCloudflareBlock(text)) {
      throw new Error('CLOUDFLARE_BLOCKED');
    }
    throw new Error(`HTTP_ERROR_${response.status}`);
  }

  const data = await response.json();
  
  if (checkCloudflareBlock(data.response || '')) {
    throw new Error('CLOUDFLARE_BLOCKED');
  }

  return data.response;
};
