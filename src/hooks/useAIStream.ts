import { useState, useCallback, useRef } from 'react';
import { streamChat, ChatMessage, getConfig } from '../services/api';

interface UseAIStreamReturn {
  output: string;
  isStreaming: boolean;
  error: string | null;
  startStream: (messages: ChatMessage[]) => Promise<string>;
  reset: () => void;
}

export function useAIStream(): UseAIStreamReturn {
  const [output, setOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const startStream = useCallback(async (messages: ChatMessage[]): Promise<string> => {
    const config = getConfig();
    if (!config.apiKey) {
      const errMsg = 'API Key belum diatur. Buka menu Settings untuk konfigurasi 9Router.';
      setError(errMsg);
      return '';
    }

    setIsStreaming(true);
    setError(null);
    setOutput('');
    abortRef.current = false;
    let fullText = '';

    try {
      for await (const chunk of streamChat(messages)) {
        if (abortRef.current) break;
        fullText += chunk;
        setOutput(fullText);
      }
    } catch (err: any) {
      const errMsg = err.message || 'Terjadi kesalahan saat streaming';
      setError(errMsg);
    } finally {
      setIsStreaming(false);
    }

    return fullText;
  }, []);

  const reset = useCallback(() => {
    setOutput('');
    setError(null);
    setIsStreaming(false);
    abortRef.current = true;
  }, []);

  return { output, isStreaming, error, startStream, reset };
}
