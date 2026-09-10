import { useState } from 'react';
import { useAIStream } from '../hooks/useAIStream';
import { useApi } from '../context/ApiContext';
import { Search, Copy, Check, Globe, Hash, FileText, Zap, AlertCircle, Loader2 } from 'lucide-react';

export default function SEOGenerator() {
  const { isConfigured } = useApi();
  const { output, isStreaming, error, startStream, reset } = useAIStream();
  const [keyword, setKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [pageType, setPageType] = useState('homepage');
  const [copied, setCopied] = useState('');

  const generate = async () => {
    if (!keyword.trim()) return;

    const prompt = `Buatkan SEO meta tags lengkap dan optimal untuk:

Target Keyword: "${keyword}"
${description ? `Brand/Website: ${description}` : ''}
Page Type: ${pageType}

Berikan output dalam format berikut (gunakan markdown):

## Title Tag
(Buat 5 variasi title tag yang SEO-optimal, max 60 karakter, mengandung keyword di awal)

## Meta Description
(Buat 3 variasi meta description yang compelling, 150-160 karakter, mengandung keyword dan CTA)

## Target Keywords
(Buat 15-20 related keywords dan long-tail keywords dalam format list)

## Heading Structure
(Buat struktur H1, H2, H3 yang SEO-friendly untuk konten tentang keyword ini)

## Open Graph Tags
(Buat OG title, description, dan image suggestion)

## Twitter Card
(Buat Twitter card tags)

## Schema.org JSON-LD
(Buat structured data JSON-LD yang sesuai untuk ${pageType})

## SEO Content Brief
(Buat outline konten SEO yang comprehensive, 1500+ words, dengan keyword placement strategy)

## Technical SEO Checklist
(Buat checklist technical SEO yang perlu diperhatikan)

Pastikan semua output:
- Menggunakan bahasa Indonesia
- SEO best practices 2024
- Keyword density yang natural
- Search intent aligned
- Competitor-beating quality`;

    await startStream([
      { role: 'system', content: 'Kamu adalah SEO expert dengan pengalaman 10+ tahun. Kamu menguasai technical SEO, on-page SEO, content strategy, dan keyword research. Berikan rekomendasi yang actionable dan based on data.' },
      { role: 'user', content: prompt }
    ]);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      {!isConfigured && (
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-300 mb-1">9Router Belum Terhubung</h3>
            <p className="text-xs text-slate-400">Setup API Key 9Router di menu Settings untuk mengaktifkan AI SEO Generator.</p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          AI SEO Meta Generator
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Target Keyword *</label>
            <input type="text" placeholder="Contoh: digital marketing indonesia" value={keyword}
              onChange={e => setKeyword(e.target.value)} disabled={isStreaming}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Brand/Website</label>
            <input type="text" placeholder="Nama brand atau website" value={description}
              onChange={e => setDescription(e.target.value)} disabled={isStreaming}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Page Type</label>
            <select value={pageType} onChange={e => setPageType(e.target.value)} disabled={isStreaming}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50">
              <option value="homepage">Homepage</option>
              <option value="article">Article/Blog</option>
              <option value="product">Product Page</option>
              <option value="service">Service Page</option>
              <option value="landing">Landing Page</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={generate} disabled={isStreaming || !keyword.trim() || !isConfigured}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50">
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isStreaming ? 'Generating...' : 'Generate SEO'}
          </button>
          {isStreaming && (
            <button onClick={reset} className="px-4 py-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all">
              Stop
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-5 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-300 mb-1">Error</h3>
            <p className="text-xs text-slate-400">{error}</p>
          </div>
        </div>
      )}

      {/* Generated SEO */}
      {(output || isStreaming) && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">SEO Analysis & Meta Tags</h3>
            <button onClick={() => copyToClipboard(output, 'all')}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-all ${
                copied === 'all' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
              }`}>
              {copied === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied === 'all' ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <div className="prose prose-invert max-w-none">
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed bg-slate-900/30 rounded-xl p-4">
              {output}
              {isStreaming && <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1" />}
            </pre>
          </div>
        </div>
      )}

      {/* SEO Tips */}
      <div className="glass-card rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-sm font-semibold text-blue-300 mb-3">📊 SEO Best Practices 2024</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Title tag: 50-60 karakter, keyword di awal, unique per page',
            'Meta description: 150-160 karakter, mengandung CTA dan keyword',
            'H1: Satu per page, mengandung primary keyword',
            'Content: 1500+ words untuk pillar content, comprehensive',
            'Internal linking: 3-5 internal links per artikel',
            'Image optimization: Alt text, compressed, WebP format',
            'Page speed: Core Web Vitals optimized, < 3s load time',
            'Mobile-first: Responsive design, mobile UX priority',
            'Schema markup: Structured data untuk rich snippets',
            'E-E-A-T: Experience, Expertise, Authoritativeness, Trust',
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
