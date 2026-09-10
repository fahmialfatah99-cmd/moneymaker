import { useState } from 'react';
import { useAIStream } from '../hooks/useAIStream';
import { useApi } from '../context/ApiContext';
import { Zap, Copy, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';

type ContentType = 'blog' | 'social' | 'ad' | 'email' | 'product' | 'headline';

const contentTypes: Record<ContentType, { label: string; icon: string; systemPrompt: string }> = {
  blog: {
    label: 'Blog Post',
    icon: '📝',
    systemPrompt: 'Kamu adalah content writer profesional yang ahli membuat artikel blog yang engaging, SEO-friendly, dan valuable. Tulis dalam bahasa Indonesia yang natural dan mudah dipahami. Gunakan format markdown dengan headings, bullet points, dan paragraf yang pendek.'
  },
  social: {
    label: 'Social Media',
    icon: '📱',
    systemPrompt: 'Kamu adalah social media expert yang ahli membuat konten viral dan engaging. Buat post yang catchy, menggunakan emoji, dan memiliki hook yang kuat. Tulis dalam bahasa Indonesia yang casual dan relatable.'
  },
  ad: {
    label: 'Ad Copy',
    icon: '🎯',
    systemPrompt: 'Kamu adalah copywriter iklan yang ahli membuat ad copy yang converting. Gunakan formula AIDA (Attention, Interest, Desire, Action). Buat headline yang powerful, body copy yang persuasive, dan CTA yang jelas. Tulis dalam bahasa Indonesia.'
  },
  email: {
    label: 'Email',
    icon: '📧',
    systemPrompt: 'Kamu adalah email marketing specialist yang ahli membuat email yang engaging dan converting. Buat subject line yang catchy, opening yang hook, body yang valuable, dan CTA yang jelas. Tulis dalam bahasa Indonesia yang profesional tapi friendly.'
  },
  product: {
    label: 'Product Desc',
    icon: '🛍️',
    systemPrompt: 'Kamu adalah product copywriter yang ahli membuat deskripsi produk yang selling. Fokus pada benefits bukan features, gunakan storytelling, dan buat customer membayangkan menggunakan produk. Tulis dalam bahasa Indonesia yang persuasive.'
  },
  headline: {
    label: 'Headlines',
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
    <div className="space-y-5">
      {/* API Status */}
      {!isConfigured && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-300 mb-1">9Router Not Connected</h3>
            <p className="text-xs text-slate-400">
              Setup API Key 9Router in Settings to enable AI Content Generator.
            </p>
          </div>
        </div>
      )}

      {/* Content Type Selector */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          AI Content Generator
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.keys(contentTypes) as ContentType[]).map(type => (
            <button
              key={type}
              onClick={() => { setContentType(type); reset(); }}
              disabled={isStreaming}
              className={`p-3 rounded-lg text-center transition-all ${
                contentType === type
                  ? 'bg-indigo-500/10 border border-indigo-500/30'
                  : 'bg-slate-800/30 border border-slate-800/50 hover:border-slate-700/50'
              } disabled:opacity-50`}
            >
              <span className="text-xl">{contentTypes[type].icon}</span>
              <p className="text-xs font-medium text-slate-300 mt-1">{contentTypes[type].label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Topic / Keyword *</label>
            <input
              type="text"
              placeholder="e.g., Digital Marketing for UMKM"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              disabled={isStreaming}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Target Audience</label>
            <input
              type="text"
              placeholder="e.g., Online business owners"
              value={audience}
              onChange={e => setAudience(e.target.value)}
              disabled={isStreaming}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Tone / Style</label>
            <input
              type="text"
              placeholder="e.g., Professional, casual, friendly"
              value={tone}
              onChange={e => setTone(e.target.value)}
              disabled={isStreaming}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={generate}
            disabled={isStreaming || !topic.trim() || !isConfigured}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStreaming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate with AI
              </>
            )}
          </button>
          {isStreaming && (
            <button onClick={reset} className="px-4 py-2.5 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 text-sm font-medium transition-all">
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-300 mb-1">Error</h3>
            <p className="text-xs text-slate-400">{error}</p>
          </div>
        </div>
      )}

      {/* Generated Content */}
      {(output || isStreaming) && (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Generated Content
            </h3>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                copied ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20'
              } disabled:opacity-50`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-800/50">
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
              {output}
              {isStreaming && <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-1" />}
            </pre>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-amber-300 mb-3">💡 Monetization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'Use blog content for SEO → traffic → ads/affiliate income',
            'Social media content → build audience → sponsored posts',
            'Ad copy → use for your products or sell copywriting services',
            'Email marketing → nurture leads → convert to sales',
            'Product descriptions → sell on marketplace or landing page',
            'Catchy headlines → increase CTR → more conversions',
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
