import { useState } from 'react';
import { useAIStream } from '../hooks/useAIStream';
import { useApi } from '../context/ApiContext';
import { Mail, Copy, Check, Eye, Zap, AlertCircle, Loader2 } from 'lucide-react';

type TemplateType = 'welcome' | 'promo' | 'abandoned' | 'followup' | 'newsletter' | 'launch' | 'cold' | 'reengagement';

const templateTypes: Record<TemplateType, { name: string; systemPrompt: string }> = {
  welcome: { name: 'Welcome Email', systemPrompt: 'Kamu adalah email marketing specialist yang membuat welcome email yang engaging. Buat email yang membuat subscriber merasa special dan tahu apa yang harus dilakukan selanjutnya.' },
  promo: { name: 'Promo / Sale', systemPrompt: 'Kamu adalah email marketing expert yang membuat email promo yang converting. Gunakan urgency, scarcity, dan social proof. Buat CTA yang irresistible.' },
  abandoned: { name: 'Abandoned Cart', systemPrompt: 'Kamu adalah email specialist yang membuat abandoned cart email yang recover penjualan. Gunakan reminder yang friendly, incentive, dan urgency.' },
  followup: { name: 'Follow Up', systemPrompt: 'Kamu adalah sales email expert yang membuat follow up email yang tidak annoying tapi effective. Personal, valuable, dan clear CTA.' },
  newsletter: { name: 'Newsletter', systemPrompt: 'Kamu adalah newsletter writer yang membuat konten yang people actually want to read. Mix of value, stories, dan soft promotion.' },
  launch: { name: 'Product Launch', systemPrompt: 'Kamu adalah launch email specialist. Buat excitement, build anticipation, dan drive action. Gunakan storytelling dan social proof.' },
  cold: { name: 'Cold Outreach', systemPrompt: 'Kamu adalah B2B outreach expert. Buat cold email yang personal, relevant, dan tidak spammy. Focus on value proposition dan clear CTA.' },
  reengagement: { name: 'Re-engagement', systemPrompt: 'Kamu adalah retention specialist. Buat email yang win back inactive subscribers. Gunakan FOMO, exclusive offer, atau emotional appeal.' },
};

export default function EmailTemplate() {
  const { isConfigured } = useApi();
  const { output, isStreaming, error, startStream, reset } = useAIStream();
  const [templateType, setTemplateType] = useState<TemplateType>('welcome');
  const [brandName, setBrandName] = useState('');
  const [offer, setOffer] = useState('');
  const [audience, setAudience] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generate = async () => {
    const type = templateTypes[templateType];
    const prompt = `Buatkan ${type.name} untuk:

Brand/Produk: ${brandName || '[Brand Name]'}
${offer ? `Offer/Promo: ${offer}` : ''}
${audience ? `Target audience: ${audience}` : ''}

Requirements:
- Subject line yang catchy (berikan 3 variasi)
- Preheader text
- Email body yang engaging dan converting
- CTA yang jelas
- Personalization tokens [Nama], [Brand], dll
- Gunakan bahasa Indonesia yang natural
- Format email yang professional
- Panjang optimal (tidak terlalu panjang, tidak terlalu pendek)
- Include P.S. section jika relevan

Buat email yang siap dikirim, bukan template kosong.`;

    await startStream([
      { role: 'system', content: type.systemPrompt },
      { role: 'user', content: prompt }
    ]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {!isConfigured && (
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-300 mb-1">9Router Belum Terhubung</h3>
            <p className="text-xs text-slate-400">Setup API Key 9Router di menu Settings untuk mengaktifkan AI Email Generator.</p>
          </div>
        </div>
      )}

      {/* Template Selector */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-purple-400" />
          AI Email Template Generator
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(templateTypes) as TemplateType[]).map(type => (
            <button
              key={type}
              onClick={() => { setTemplateType(type); reset(); }}
              disabled={isStreaming}
              className={`p-3 rounded-xl text-sm font-medium transition-all text-center ${
                templateType === type
                  ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
              } disabled:opacity-50`}
            >
              {templateTypes[type].name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Brand / Produk</label>
            <input type="text" placeholder="Nama brand atau produk" value={brandName}
              onChange={e => setBrandName(e.target.value)} disabled={isStreaming}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Offer / Promo</label>
            <input type="text" placeholder="Diskon 20%, Free trial, dll" value={offer}
              onChange={e => setOffer(e.target.value)} disabled={isStreaming}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Target Audience</label>
            <input type="text" placeholder="Subscriber, leads, dll" value={audience}
              onChange={e => setAudience(e.target.value)} disabled={isStreaming}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50" />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={generate} disabled={isStreaming || !isConfigured}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all disabled:opacity-50">
              {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {isStreaming ? 'Generating...' : 'Generate'}
            </button>
            {isStreaming && (
              <button onClick={reset} className="px-4 py-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all">
                Stop
              </button>
            )}
          </div>
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

      {/* Generated Email */}
      {(output || isStreaming) && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">Email Generated</h3>
              <button onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  showPreview ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-700/50 text-slate-300'
                }`}>
                <Eye className="w-3 h-3" /> {showPreview ? 'Raw' : 'Preview'}
              </button>
            </div>
            <button onClick={copyToClipboard} disabled={!output}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-all ${
                copied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
              } disabled:opacity-50`}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {showPreview ? (
            <div className="bg-white rounded-xl p-8 text-gray-800 max-w-2xl mx-auto">
              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500">From: <span className="text-gray-800">{brandName || 'YourBrand'} &lt;hello@{(brandName || 'yourbrand').toLowerCase().replace(/\s/g, '')}.com&gt;</span></p>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">{output}</pre>
            </div>
          ) : (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans bg-slate-900/50 rounded-xl p-4 overflow-x-auto leading-relaxed">
              {output}
              {isStreaming && <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1" />}
            </pre>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="glass-card rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-sm font-semibold text-purple-300 mb-3">💡 Tips Email Marketing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Subject Line', tip: 'Gunakan emoji, angka, dan urgency. A/B test untuk optimalisasi.' },
            { title: 'Timing', tip: 'Kirim email Selasa-Kamis, jam 9-11 pagi atau 2-4 sore.' },
            { title: 'Personalization', tip: 'Gunakan nama subscriber dan segmentasi berdasarkan behavior.' },
            { title: 'CTA', tip: 'Satu CTA utama per email. Buat tombol besar dan kontras.' },
            { title: 'Follow Up', tip: 'Setup automated sequence 3-5 email untuk nurture leads.' },
            { title: 'Analytics', tip: 'Track open rate, click rate, dan conversion. Optimize terus.' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
              <h4 className="text-xs font-semibold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
