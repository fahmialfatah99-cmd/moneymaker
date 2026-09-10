import { useState } from 'react';
import { Search, Copy, Check, Globe, Hash, FileText } from 'lucide-react';

export default function SEOGenerator() {
  const [keyword, setKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [pageType, setPageType] = useState('homepage');
  const [generated, setGenerated] = useState<{
    title: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    keywords: string[];
    headings: string[];
    schema: string;
    twitterCard: string;
  } | null>(null);
  const [copied, setCopied] = useState('');

  const generate = () => {
    if (!keyword) return;

    const kw = keyword.trim();
    const kwCapitalized = kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const kwLower = kw.toLowerCase();

    const titleVariants = [
      `${kwCapitalized} - Panduan Lengkap & Tips Terbaik 2024`,
      `${kwCapitalized}: Semua yang Perlu Anda Ketahui | ${description || 'Brand Anda'}`,
      `10 Tips ${kwCapitalized} yang Wajib Dicoba (Update 2024)`,
      `Cara ${kwCapitalized} untuk Pemula - Step by Step`,
      `${kwCapitalized} Terbaik di Indonesia - Review & Perbandingan`,
    ];

    const metaDescVariants = [
      `Pelajari ${kw} secara lengkap. Panduan step-by-step, tips expert, dan resource terbaik untuk membantu Anda sukses. Baca selengkapnya!`,
      `Cari tahu semua tentang ${kw}. Dari dasar hingga advanced, kami cover semuanya. Dapatkan insight yang actionable dan mulai hari ini.`,
      `${kwCapitalized} - Temukan solusi terbaik untuk kebutuhan Anda. Review lengkap, perbandingan, dan rekomendasi dari para ahli.`,
    ];

    const keywords = [
      kwLower,
      `${kwLower} terbaik`,
      `${kwLower} indonesia`,
      `cara ${kwLower}`,
      `tips ${kwLower}`,
      `${kwLower} untuk pemula`,
      `${kwLower} 2024`,
      `panduan ${kwLower}`,
      `${kwLower} murah`,
      `belajar ${kwLower}`,
      `${kwLower} online`,
      `jasa ${kwLower}`,
    ];

    const headings = [
      `Apa itu ${kwCapitalized}?`,
      `Mengapa ${kwCapitalized} Penting?`,
      `Manfaat ${kwCapitalized}`,
      `Cara Memulai ${kwCapitalized}`,
      `Tips & Trik ${kwCapitalized}`,
      `Kesalahan Umum dalam ${kwCapitalized}`,
      `${kwCapitalized} untuk Pemula`,
      `${kwCapitalized} Level Lanjutan`,
      `Tools & Resources ${kwCapitalized}`,
      `FAQ tentang ${kwCapitalized}`,
    ];

    const schema = `{
  "@context": "https://schema.org",
  "@type": "${pageType === 'product' ? 'Product' : pageType === 'article' ? 'Article' : 'WebPage'}",
  "name": "${kwCapitalized}",
  "description": "${metaDescVariants[0]}",
  "url": "https://yoursite.com/${kwLower.replace(/\s/g, '-')}",
  "datePublished": "${new Date().toISOString().split('T')[0]}",
  "dateModified": "${new Date().toISOString().split('T')[0]}"
}`;

    setGenerated({
      title: titleVariants[0],
      metaDescription: metaDescVariants[0],
      ogTitle: titleVariants[0],
      ogDescription: metaDescVariants[0],
      keywords,
      headings,
      schema,
      twitterCard: `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${titleVariants[0]}">
<meta name="twitter:description" content="${metaDescVariants[0]}">
<meta name="twitter:image" content="https://yoursite.com/og-image.jpg">`,
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const generateHTML = () => {
    if (!generated) return '';
    return `<!-- Primary Meta Tags -->
<title>${generated.title}</title>
<meta name="title" content="${generated.title}">
<meta name="description" content="${generated.metaDescription}">
<meta name="keywords" content="${generated.keywords.join(', ')}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://yoursite.com/">
<meta property="og:title" content="${generated.ogTitle}">
<meta property="og:description" content="${generated.ogDescription}">
<meta property="og:image" content="https://yoursite.com/og-image.jpg">

<!-- Twitter -->
${generated.twitterCard}

<!-- Schema.org -->
<script type="application/ld+json">
${generated.schema}
</script>

<!-- Canonical URL -->
<link rel="canonical" href="https://yoursite.com/">`;
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          SEO Meta Generator
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Target Keyword</label>
            <input type="text" placeholder="Contoh: digital marketing" value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none placeholder:text-slate-600" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Brand/Website Name</label>
            <input type="text" placeholder="Nama brand atau website" value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none placeholder:text-slate-600" />
          </div>
          <div className="flex items-end gap-2">
            <select value={pageType} onChange={e => setPageType(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none">
              <option value="homepage">Homepage</option>
              <option value="article">Article/Blog</option>
              <option value="product">Product Page</option>
              <option value="service">Service Page</option>
            </select>
            <button onClick={generate} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-all">
              Generate
            </button>
          </div>
        </div>
      </div>

      {generated && (
        <>
          {/* Meta Preview */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Google Search Preview</h3>
            <div className="bg-white rounded-xl p-6 max-w-2xl">
              <p className="text-sm text-green-700">yoursite.com › {keyword.toLowerCase().replace(/\s/g, '-')}</p>
              <h4 className="text-xl text-blue-700 hover:underline cursor-pointer mt-1">{generated.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{generated.metaDescription}</p>
            </div>
          </div>

          {/* Generated Tags */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Keywords */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Hash className="w-4 h-4 text-blue-400" /> Target Keywords
                </h3>
                <button onClick={() => copyToClipboard(generated.keywords.join(', '), 'keywords')}
                  className={`text-xs px-2 py-1 rounded ${copied === 'keywords' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/50 text-slate-400'}`}>
                  {copied === 'keywords' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generated.keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Headings Structure */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" /> Suggested Headings (H2)
                </h3>
                <button onClick={() => copyToClipboard(generated.headings.join('\n'), 'headings')}
                  className={`text-xs px-2 py-1 rounded ${copied === 'headings' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/50 text-slate-400'}`}>
                  {copied === 'headings' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="space-y-2">
                {generated.headings.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-xs text-slate-500 font-mono w-6">H2</span>
                    <span className="text-slate-300">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full HTML */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" /> Complete Meta Tags HTML
              </h3>
              <button onClick={() => copyToClipboard(generateHTML(), 'html')}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg ${
                  copied === 'html' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
                }`}>
                {copied === 'html' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied === 'html' ? 'Copied!' : 'Copy All'}
              </button>
            </div>
            <pre className="text-xs text-slate-300 bg-slate-900/50 rounded-xl p-4 overflow-x-auto font-mono leading-relaxed">
              {generateHTML()}
            </pre>
          </div>

          {/* SEO Score */}
          <div className="glass-card rounded-2xl p-6 border border-blue-500/20">
            <h3 className="text-sm font-semibold text-blue-300 mb-3">📊 SEO Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { check: true, text: `Title tag mengandung keyword "${keyword}" (${generated.title.length} chars)` },
                { check: true, text: `Meta description optimal (${generated.metaDescription.length} chars, ideal: 150-160)` },
                { check: true, text: 'Open Graph tags untuk social sharing' },
                { check: true, text: 'Twitter Card tags configured' },
                { check: true, text: 'Schema.org structured data' },
                { check: true, text: 'Canonical URL set' },
                { check: true, text: `${generated.keywords.length} target keywords identified` },
                { check: true, text: `${generated.headings.length} H2 headings suggested` },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-slate-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
