import { useState } from 'react';
import { useAIStream } from '../hooks/useAIStream';
import { useApi } from '../context/ApiContext';
import { Mail, Copy, Check, Eye, Zap, AlertCircle, Loader2, Sparkles } from 'lucide-react';

type TemplateType = 'welcome' | 'promo' | 'abandoned' | 'followup' | 'newsletter' | 'launch' | 'cold' | 'reengagement';

const templateTypes: Record<TemplateType, { name: string; systemPrompt: string }> = {
  welcome: { name: 'Welcome', systemPrompt: 'Kamu adalah email marketing specialist yang membuat welcome email yang engaging. Buat email yang membuat subscriber merasa special dan tahu apa yang harus dilakukan selanjutnya.' },
  promo: { name: 'Promo/Sale', systemPrompt: 'Kamu adalah email marketing expert yang membuat email promo yang converting. Gunakan urgency, scarcity, dan social proof. Buat CTA yang irresistible.' },
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
    const prompt = `Buatkan ${type.name} email untuk:

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
- Panjang optimal
- Include P.S. section jika relevan

Buat email yang siap dikirim.`;

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
    <div className="space-y-5">
      {!isConfigured && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-300 mb-1">9Router Not Connected</h3>
            <p className="text-xs text-slate-400">Setup API Key 9Router in Settings to enable AI Email Generator.</p>
          </div>
        </div>
      )}

      {/* Template Selector */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-purple-400" />
          AI Email Template Generator
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(templateTypes) as TemplateType[]).map(type => (
            <button
              key={type}
              onClick={() => { setTemplateType(type); reset(); }}
              disabled={isStreaming}
              className={`p-2.5 rounded-lg text-xs font-medium transition-all ${
                templateType === type
                  ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                  : 'bg-slate-800/30 border border-slate-800/50 text-slate-400 hover:text-slate-200 hover:border-slate-700/50'
              } disabled:opacity-50`}
            >
              {templateTypes[type].name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Brand / Product</label>
            <input type="text" placeholder="Your brand name" value={brandName}
              onChange={e => setBrandName(e.target.value)} disabled={isStreaming}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-purple-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Offer / Promo</label>
            <input type="text" placeholder="20% off, Free trial, etc" value={offer}
              onChange={e => setOffer(e.target.value)} disabled={isStreaming}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-purple-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Target Audience</label>
            <input type="text" placeholder="Subscribers, leads, etc" value={audience}
              onChange={e => setAudience(e.target.value)} disabled={isStreaming}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-purple-500 focus:outline-none placeholder:text-slate-600 disabled:opacity-50" />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={generate} disabled={isStreaming || !isConfigured}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50">
              {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {isStreaming ? 'Generating...' : 'Generate'}
            </button>
            {isStreaming && (
              <button onClick={reset} className="px-3 py-2.5 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 text-sm font-medium">
                Stop
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-300 mb-1">Error</h3>
            <p className="text-xs text-slate-400">{error}</p>
          </div>
        </div>
      )}

      {/* Generated Email */}
      {(output || isStreaming) && (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Generated Email</h3>
              <button onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                  showPreview ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
                }`}>
                <Eye className="w-3 h-3" /> {showPreview ? 'Raw' : 'Preview'}
              </button>
            </div>
            <button onClick={copyToClipboard} disabled={!output}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                copied ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20'
              } disabled:opacity-50`}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {showPreview ? (
            <div className="bg-white rounded-lg p-6 text-gray-800 max-w-2xl mx-auto">
              <div className="border-b pb-3 mb-3">
                <p className="text-xs text-gray-500">From: <span className="text-gray-800">{brandName || 'YourBrand'} &lt;hello@{(brandName || 'yourbrand').toLowerCase().replace(/\s/g, '')}.com&gt;</span></p>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">{output}</pre>
            </div>
          ) : (
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-800/50">
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                {output}
                {isStreaming && <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1" />}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> Email Marketing Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            { title: 'Subject Line', tip: 'Use emoji, numbers, urgency. A/B test for optimization.' },
            { title: 'Timing', tip: 'Send Tue-Thu, 9-11 AM or 2-4 PM for best results.' },
            { title: 'Personalization', tip: 'Use subscriber name and segment by behavior.' },
            { title: 'CTA', tip: 'One main CTA per email. Make button large and contrasting.' },
            { title: 'Follow Up', tip: 'Setup automated 3-5 email sequence to nurture leads.' },
            { title: 'Analytics', tip: 'Track open rate, click rate, conversion. Optimize continuously.' },
          ].map((item, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-800/20 border border-slate-800/30">
              <h4 className="text-[10px] font-semibold text-slate-300">{item.title}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
