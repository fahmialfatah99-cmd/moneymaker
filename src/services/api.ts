// 9Router API Service - OpenAI Compatible
// Endpoint: http://localhost:20128/v1 (or custom URL)

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  owned_by: string;
}

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: 'http://localhost:20128/v1',
  apiKey: '',
  model: 'auto',
  temperature: 0.7,
  maxTokens: 4096,
};

export function getConfig(): ApiConfig {
  try {
    const saved = localStorage.getItem('moneymaker_api_config');
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_CONFIG;
}

export function saveConfig(config: Partial<ApiConfig>) {
  const current = getConfig();
  const updated = { ...current, ...config };
  localStorage.setItem('moneymaker_api_config', JSON.stringify(updated));
  return updated;
}

export function isConfigured(): boolean {
  const config = getConfig();
  return !!config.apiKey && !!config.baseUrl;
}

// Fetch available models from 9router
export async function fetchModels(): Promise<ModelInfo[]> {
  const config = getConfig();
  if (!config.apiKey) return [];

  try {
    const res = await fetch(`${config.baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.data && Array.isArray(data.data)) {
      return data.data.map((m: any) => ({
        id: m.id,
        name: formatModelName(m.id),
        provider: detectProvider(m.id),
        owned_by: m.owned_by || detectProvider(m.id),
      }));
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch models:', err);
    return [];
  }
}

function detectProvider(modelId: string): string {
  const id = modelId.toLowerCase();
  if (id.includes('gpt') || id.includes('openai') || id.includes('o1') || id.includes('o3') || id.includes('o4')) return 'OpenAI';
  if (id.includes('claude') || id.includes('anthropic')) return 'Anthropic';
  if (id.includes('gemini') || id.includes('google')) return 'Google';
  if (id.includes('deepseek')) return 'DeepSeek';
  if (id.includes('qwen') || id.includes('qwq')) return 'Qwen/Alibaba';
  if (id.includes('llama') || id.includes('meta')) return 'Meta';
  if (id.includes('mistral') || id.includes('mixtral')) return 'Mistral';
  if (id.includes('grok') || id.includes('xai')) return 'xAI';
  if (id.includes('glm') || id.includes('chatglm')) return 'GLM/Zhipu';
  if (id.includes('kimi') || id.includes('moonshot')) return 'Moonshot';
  if (id.includes('minimax')) return 'MiniMax';
  if (id.includes('command') || id.includes('cohere')) return 'Cohere';
  if (id.includes('phi') || id.includes('microsoft')) return 'Microsoft';
  if (id.includes('dbrx') || id.includes('databricks')) return 'Databricks';
  if (id.includes('iflow')) return 'iFlow (FREE)';
  if (id.includes('kiro')) return 'Kiro (FREE)';
  if (id.includes('opencode')) return 'OpenCode (FREE)';
  if (id.includes('nvidia') || id.includes('nemotron')) return 'NVIDIA';
  if (id.includes('cloudflare')) return 'Cloudflare';
  if (id.includes('groq')) return 'Groq';
  return 'Unknown';
}

function formatModelName(id: string): string {
  return id
    .replace(/\//g, ' / ')
    .replace(/-/g, ' ')
    .replace(/:latest/g, '')
    .replace(/@.*/g, '')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Core chat completion - streaming
export async function* streamChat(
  messages: ChatMessage[],
  config?: Partial<ApiConfig>
): AsyncGenerator<string, void, unknown> {
  const cfg = { ...getConfig(), ...config };

  if (!cfg.apiKey) {
    throw new Error('API Key belum diatur. Buka Settings untuk memasukkan API Key 9Router.');
  }

  const body = {
    model: cfg.model || 'auto',
    messages,
    temperature: cfg.temperature,
    max_tokens: cfg.maxTokens,
    stream: true,
  };

  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cfg.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API Error ${res.status}: ${errText || res.statusText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response stream');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (!trimmed.startsWith('data: ')) continue;

      try {
        const json = JSON.parse(trimmed.slice(6));
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {}
    }
  }
}

// Non-streaming chat completion
export async function chatCompletion(
  messages: ChatMessage[],
  config?: Partial<ApiConfig>
): Promise<string> {
  const cfg = { ...getConfig(), ...config };

  if (!cfg.apiKey) {
    throw new Error('API Key belum diatur. Buka Settings untuk memasukkan API Key 9Router.');
  }

  const body = {
    model: cfg.model || 'auto',
    messages,
    temperature: cfg.temperature,
    max_tokens: cfg.maxTokens,
    stream: false,
  };

  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cfg.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API Error ${res.status}: ${errText || res.statusText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// Quick helper for single-prompt generation
export async function generate(
  prompt: string,
  systemPrompt?: string,
  config?: Partial<ApiConfig>
): Promise<string> {
  const messages: ChatMessage[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });
  return chatCompletion(messages, config);
}

// Test connection
export async function testConnection(): Promise<{ ok: boolean; message: string; model?: string }> {
  const config = getConfig();
  if (!config.apiKey) return { ok: false, message: 'API Key belum diatur' };
  if (!config.baseUrl) return { ok: false, message: 'Base URL belum diatur' };

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model || 'auto',
        messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
        max_tokens: 10,
        stream: false,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return { ok: false, message: `Error ${res.status}: ${errText.slice(0, 200)}` };
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || '';
    const usedModel = data.model || config.model;

    return { ok: true, message: `Koneksi berhasil! Model: ${usedModel}`, model: usedModel };
  } catch (err: any) {
    return { ok: false, message: `Koneksi gagal: ${err.message}` };
  }
}
