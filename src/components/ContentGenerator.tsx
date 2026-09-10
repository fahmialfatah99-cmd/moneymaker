import { useState } from 'react';
import { useAIStream } from '../hooks/useAIStream';
import { useApi } from '../context/ApiContext';
import { Zap, Copy, RefreshCw, Check, AlertCircle, Loader2 } from 'lucide-react';

type ContentType = 'blog' | 'social' | 'ad' | 'email' | 'product' | 'headline';

const contentTypes: Record<ContentType, { label: string; icon: string; systemPrompt: string }> = {
  blog: {
    label: 'Blog Post / Artikel',
    icon: '📝',
    systemPrompt: 'Kamu adalah content writer profesional yang ahli membuat artikel blog yang engaging, SEO-friendly, dan valuable. Tulis dalam bahasa Indonesia yang natural dan mudah dipahami. Gunakan format markdown dengan headings, bullet points, dan paragraf yang pendek.'
  },
  social: {
    label: 'Social Media Post',
    icon: '📱',
    systemPrompt: 'Kamu adalah social media expert yang ahli membuat konten viral dan engaging. Buat post yang catchy, menggunakan emoji, dan memiliki hook yang kuat. Tulis dalam bahasa Indonesia yang casual dan relatable.'
  },
  ad: {
    label: 'Ad Copy / Iklan',
    icon: '🎯',
    systemPrompt: 'Kamu adalah copywriter iklan yang ahli membuat ad copy yang converting. Gunakan formula AIDA (Attention, Interest, Desire, Action). Buat headline yang powerful, body copy yang persuasive, dan CTA yang jelas. Tulis dalam bahasa Indonesia.'
  },
  email: {
    label: 'Email Marketing',
    icon: '📧',
    systemPrompt: 'Kamu adalah email marketing specialist yang ahli membuat email yang engaging dan converting. Buat subject line yang catchy, opening yang hook, body yang valuable, dan CTA yang jelas. Tulis dalam bahasa Indonesia yang profesional tapi friendly.'
  },
  product: {
    label: 'Product Description',
    icon: '🛍️',
    systemPrompt: 'Kamu adalah product copywriter yang ahli membuat deskripsi produk yang selling. Fokus pada benefits bukan features, gunakan storytelling, dan buat customer membayangkan menggunakan produk. Tulis dalam bahasa Indonesia yang persuasive.'
  },
  headline: {
    label: 'Headline / Judul',
    icon: '✨',
    systemPrompt: 'Kamu adalah headline expert yang ahli membuat judul yang catchy dan click-worthy. Gunakan formula proven seperti numbers, how-to, questions, dan power words. Berikan 10 variasi headline yang berbeda. Tulis dalam bahasa Indonesia.'
  }
};

export default function ContentGenerator() {
  const { isConfigured } = useApi();
  const { output, isStreaming, error, startStream, reset } = useAIStream();
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;

    const type = contentTypes[contentType];
    const userPrompt = `Buatkan ${type.label} tentang: ${topic}

${audience ? `Target audience: ${audience}` : ''}
${tone ? `Tone/gaya: ${tone}` : ''}

Buat konten yang:
- Engaging dan menarik
- Valuable untuk reader
- Actionable (bisa langsung dipraktekkan)
- ${contentType === 'headline' ? 'Berikan 10 variasi headline' : 'Panjang dan detail'}
- Menggunakan bahasa Indonesia yang natural

${contentType === 'social' ? 'Gunakan emoji dan format yang cocok untuk social media' : ''}
${contentType === 'ad' ? 'Gunakan formula AIDA dan buat urgency' : ''}
${contentType === 'email' ? 'Buat subject line yang catchy dan opening yang hook' : ''}
${contentType === 'blog' ? 'Gunakan markdown format dengan H2, H3, bullet points' : ''}`;

    await startStream([
      { role: 'system', content: type.systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* API Status */}
      {!isConfigured && (
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-300 mb-1">9Router Belum Terhubung</h3>
            <p className="text-xs text-slate-400">
              Setup API Key 9Router di menu Settings untuk mengaktifkan AI Content Generator. 
              Tanpa API Key, fitur ini tidak dapat digunakan.
            </p>
          </div>
        </div>
      )}

      {/* Content Type Selector */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          AI Content Generator
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(Object.keys(contentTypes) as ContentType[]).map(type => (
            <button
              key={type}
              onClick={() => { setContentType(type); reset(); }}
              disabled={isStreaming}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                contentType === type
                  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
              } disabled:opacity-50`}
            >
              <span className="text-lg">{contentTypes[type].icon}</span>
              <p className="text-xs mt-1">{contentTypes[type].label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Topik / Keyword *</label>
            <input
              type="text"
              placeholder="Contoh: Digital Marketing untuk UMKM"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              disabled={isStreaming}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Target Audience</label>
            <input
              type="text"
              placeholder="Contoh: Pemilik bisnis online"
              value={audience}
              onChange={e => setAudience(e.target.value)}
              disabled={isStreaming}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tone / Gaya</label>
            <input
              type="text"
              placeholder="Contoh: Professional, casual, friendly"
              value={tone}
              onChange={e => setTone(e.target.value)}
              disabled={isStreaming}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generate}
            disabled={isStreaming || !topic.trim() || !isConfigured}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStreaming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate dengan AI
              </>
            )}
          </button>
          {isStreaming && (
            <button onClick={reset} className="px-4 py-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all">
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card rounded-2xl p-5 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-300 mb-1">Error</h3>
            <p className="text-xs text-slate-400">{error}</p>
          </div>
        </div>
      )}

      {/* Generated Content */}
      {(output || isStreaming) && (
        <div className="glass-card rounded-2xl p-6 slide-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Konten Generated</h3>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                copied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
              } disabled:opacity-50`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="prose prose-invert max-w-none">
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed bg-slate-900/30 rounded-xl p-4">
              {output}
              {isStreaming && <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-1" />}
            </pre>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="glass-card rounded-2xl p-6 border border-amber-500/20">
        <h3 className="text-sm font-semibold text-amber-300 mb-3">💡 Tips Monetisasi Konten AI</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Gunakan konten blog untuk SEO → traffic → ads/affiliate income',
            'Social media content → build audience → sponsored posts & brand deals',
            'Ad copy → gunakan untuk produk sendiri atau jual jasa copywriting',
            'Email marketing → nurture leads → konversi ke penjualan',
            'Product description → jual di marketplace atau landing page',
            'Headline yang catchy → increase CTR → lebih banyak konversi',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
