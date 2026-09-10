import { useState } from 'react';
import { Mail, Copy, Check, Eye, Palette } from 'lucide-react';

type TemplateType = 'welcome' | 'promo' | 'abandoned' | 'followup' | 'newsletter' | 'launch';

const emailTemplates: Record<TemplateType, { name: string; subject: (brand: string) => string; generate: (brand: string, offer: string, cta: string) => string }> = {
  welcome: {
    name: 'Welcome Email',
    subject: (brand) => `Selamat Datang di ${brand}! 🎉`,
    generate: (brand, offer, cta) => `Subject: Selamat Datang di ${brand}! 🎉

Hi [Nama],

Terima kasih sudah bergabung dengan ${brand}! Kami sangat senang Anda ada di sini.

Sebagai anggota baru, Anda mendapatkan:

🎁 ${offer || 'Diskon 20% untuk pembelian pertama'}

Gunakan kode: WELCOME20

Apa yang bisa Anda lakukan selanjutnya:
1. ✅ Lengkapi profil Anda
2. 📚 Jelajahi resource gratis kami
3. 💬 Join komunitas exclusive kami

${cta || 'Mulai Belanja Sekarang'} → [LINK]

Jika ada pertanyaan, reply email ini. Tim kami siap membantu!

Cheers,
Tim ${brand}

---
P.S. Follow kami di social media untuk tips & promo eksklusif!`
  },
  promo: {
    name: 'Promo / Sale',
    subject: () => `🔥 FLASH SALE: Diskon Hingga 70%!`,
    generate: (brand, offer, cta) => `Subject: 🔥 FLASH SALE 24 JAM - Diskon Hingga 70%!

Hi [Nama],

Ini bukan drill! 😱

${brand} sedang mengadakan FLASH SALE terbesar tahun ini:

💥 ${offer || 'Diskon 70% untuk SEMUA produk'}
⏰ Berakhir: MIDNIGHT ini
🚀 Free ongkir untuk pembelian di atas Rp 200rb

PRODUK BEST SELLER:
• Product A - ~~Rp 500rb~~ → Rp 150rb
• Product B - ~~Rp 750rb~~ → Rp 225rb  
• Product C - ~~Rp 1jt~~ → Rp 300rb

${cta || 'Shop Now Before It\'s Gone!'} → [LINK]

⚠️ Stok terbatas. Siapa cepat, dia dapat!

Salam,
Tim ${brand}`
  },
  abandoned: {
    name: 'Abandoned Cart',
    subject: () => `🛒 Anda Lupa Sesuatu di Cart...`,
    generate: (brand, offer, cta) => `Subject: 🛒 Hey! Anda Lupa Sesuatu di Cart...

Hi [Nama],

Kami noticed Anda meninggalkan item di cart:

📦 [Product Name] - Rp [Price]
📦 [Product Name] - Rp [Price]

Total: Rp [Total]

Jangan khawatir, kami simpan cart Anda!

Tapi tunggu... ada kabar baik:

🎁 ${offer || 'Gunakan kode COMEBACK10 untuk diskon 10%'}

Kode: COMEBACK10
Valid: 24 jam

${cta || 'Complete Your Order'} → [LINK]

Item populer ini cepat habis, jadi jangan tunggu terlalu lama!

Butuh bantuan? Reply email ini.

Best,
Tim ${brand}

P.S. Free shipping untuk order di atas Rp 300rb! 🚚`
  },
  followup: {
    name: 'Follow Up',
    subject: () => `Masih tertarik? Saya punya sesuatu untuk Anda...`,
    generate: (brand, offer, cta) => `Subject: Masih tertarik? Saya punya sesuatu untuk Anda...

Hi [Nama],

Beberapa hari lalu Anda menunjukkan interest di ${brand}.

Saya mau personally follow up karena saya tahu Anda akan mendapatkan value besar dari apa yang kami tawarkan.

${offer || 'Sebagai gesture, saya mau offer Anda free consultation 30 menit'}

Apa yang kata mereka:

⭐ "Best decision I made this year!" - Client A
⭐ "ROI 10x dalam bulan pertama" - Client B
⭐ "Wish I started sooner" - Client C

${cta || 'Book Your Free Session'} → [LINK]

Atau reply email ini dan saya personally akan reach out.

No pressure. Just want to help.

Best,
[Your Name]
${brand}

P.S. Slot terbatas untuk minggu ini. Grab yours now!`
  },
  newsletter: {
    name: 'Newsletter',
    subject: () => `📬 Weekly Digest: Tips, Tools & Insights`,
    generate: (brand, offer, cta) => `Subject: 📬 ${brand} Weekly: 5 Hal yang Wajib Anda Tahu Minggu Ini

Hi [Nama],

Happy [day]! Ini roundup minggu ini dari tim ${brand}:

━━━━━━━━━━━━━━━

📌 TOP STORY
${offer || 'Trend terbaru di industri yang akan mengubah cara Anda bekerja'}

━━━━━━━━━━━━━━━

💡 3 QUICK TIPS:
1. [Tip 1 - actionable advice]
2. [Tip 2 - actionable advice]  
3. [Tip 3 - actionable advice]

━━━━━━━━━━━━━━━

🛠️ TOOL OF THE WEEK
[Tool recommendation with brief review]

━━━━━━━━━━━━━━━

📊 BY THE NUMBERS
• Stat 1 yang menarik
• Stat 2 yang surprising
• Stat 3 yang actionable

━━━━━━━━━━━━━━━

🎯 WHAT'S COMING NEXT WEEK
[Sneak peek of upcoming content/events]

${cta || 'Baca Selengkapnya di Blog'} → [LINK]

━━━━━━━━━━━━━━━

That's all for this week!

Reply dan kasih tahu topik apa yang mau Anda baca minggu depan.

Cheers,
Tim ${brand}`
  },
  launch: {
    name: 'Product Launch',
    subject: (brand: string) => `🚀 IT'S LIVE! ${brand} Baru Sudah Tersedia`,
    generate: (brand, offer, cta) => `Subject: 🚀 IT'S FINALLY HERE! Introducing ${brand}

Hi [Nama],

Setelah berbulan-bulan development, testing, dan perfecting...

Kami dengan bangga mengumumkan:

╔══════════════════════════╗
║   ${brand.toUpperCase()}   ║
║      NOW AVAILABLE!       ║
╚══════════════════════════╝

Apa yang baru:
✅ Feature 1 - [Description]
✅ Feature 2 - [Description]
✅ Feature 3 - [Description]
✅ ${offer || 'Dan masih banyak lagi!'}

EARLY BIRD SPECIAL:
🎯 Launch price: Rp [Price] (normally Rp [Original Price])
⏰ Valid: 72 jam pertama
🎁 Bonus: [Bonus item]

${cta || 'Get Early Access Now'} → [LINK]

Kenapa Anda harus grab this:
• Limited availability
• Price goes up after launch
• Early supporters get lifetime benefits

Don't miss this.

To the moon 🚀
Tim ${brand}

P.S. First 100 customers get an EXTRA surprise bonus!`
  }
};

export default function EmailTemplate() {
  const [templateType, setTemplateType] = useState<TemplateType>('welcome');
  const [brandName, setBrandName] = useState('');
  const [offer, setOffer] = useState('');
  const [cta, setCta] = useState('');
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generate = () => {
    const template = emailTemplates[templateType];
    const result = template.generate(brandName || 'YourBrand', offer, cta);
    setGenerated(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-purple-400" />
          Pilih Template Email
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(Object.keys(emailTemplates) as TemplateType[]).map(type => (
            <button
              key={type}
              onClick={() => { setTemplateType(type); setGenerated(''); }}
              className={`p-3 rounded-xl text-sm font-medium transition-all text-center ${
                templateType === type
                  ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {emailTemplates[type].name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nama Brand</label>
            <input type="text" placeholder="Nama brand/bisnis Anda" value={brandName}
              onChange={e => setBrandName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:outline-none placeholder:text-slate-600" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Offer/Promo</label>
            <input type="text" placeholder="Diskon 20%, Free trial, dll" value={offer}
              onChange={e => setOffer(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:outline-none placeholder:text-slate-600" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">CTA Text</label>
            <input type="text" placeholder="Shop Now, Learn More, dll" value={cta}
              onChange={e => setCta(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:outline-none placeholder:text-slate-600" />
          </div>
          <div className="flex items-end">
            <button onClick={generate} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all">
              Generate Email
            </button>
          </div>
        </div>
      </div>

      {/* Generated Email */}
      {generated && (
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
            <button onClick={copyToClipboard}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-all ${
                copied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
              }`}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Email'}
            </button>
          </div>

          {showPreview ? (
            <div className="bg-white rounded-xl p-8 text-gray-800 max-w-2xl mx-auto">
              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500">Subject: <span className="font-medium text-gray-800">{emailTemplates[templateType].subject(brandName || 'YourBrand')}</span></p>
                <p className="text-sm text-gray-500 mt-1">From: <span className="text-gray-800">{brandName || 'YourBrand'} &lt;hello@{(brandName || 'yourbrand').toLowerCase().replace(/\s/g, '')}.com&gt;</span></p>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">{generated.split('\n').slice(2).join('\n')}</pre>
            </div>
          ) : (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 rounded-xl p-4 overflow-x-auto">{generated}</pre>
          )}
        </div>
      )}

      {/* Email Marketing Tips */}
      <div className="glass-card rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Tips Email Marketing yang Menghasilkan
        </h3>
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
