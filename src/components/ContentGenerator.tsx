import { useState } from 'react';
import { Zap, Copy, RefreshCw, Check } from 'lucide-react';

type ContentType = 'blog' | 'social' | 'ad' | 'email' | 'product' | 'headline';

const templates: Record<ContentType, { label: string; prompts: string[]; generator: (topic: string, tone: string) => string[] }> = {
  blog: {
    label: 'Blog Post / Artikel',
    prompts: ['Topik artikel', 'Tone tulisan'],
    generator: (topic, tone) => [
      `# ${topic}: Panduan Lengkap untuk Pemula\n\nDalam artikel ini, kita akan membahas secara mendalam tentang ${topic}. Apakah Anda baru mengenal ${topic} atau sudah memiliki pengalaman, panduan ini akan memberikan insight berharga.\n\n## Mengapa ${topic} Penting?\n\nDi era digital saat ini, memahami ${topic} bukan lagi pilihan melainkan keharusan. Berikut alasan utamanya:\n\n1. **Efisiensi Waktu** - Dengan menguasai ${topic}, Anda bisa menghemat waktu hingga 40%\n2. **Peningkatan Income** - Profesional di bidang ${topic} rata-rata berpenghasilan 2x lebih tinggi\n3. **Competitive Edge** - Stand out dari kompetitor dengan keahlian ${topic}\n\n## Langkah-Langkah Memulai\n\n### Step 1: Riset dan Planning\nSebelum memulai, lakukan riset mendalam tentang ${topic}. Identifikasi target audience dan pain points mereka.\n\n### Step 2: Eksekusi\nMulai dari yang kecil. Buat MVP (Minimum Viable Product) dan iterate berdasarkan feedback.\n\n### Step 3: Scale Up\nSetelah menemukan product-market fit, saatnya scale up dengan strategi yang tepat.\n\n## Kesimpulan\n\n${topic} adalah investasi terbaik yang bisa Anda lakukan untuk masa depan. Mulai hari ini!`,

      `# 10 Cara ${topic} yang Akan Mengubah Hidup Anda di 2024\n\nPernahkah Anda merasa stuck dan tidak tahu harus mulai dari mana? Artikel ini akan mengubah cara pandang Anda tentang ${topic}.\n\n## 1. Mulai dari "Why"\nSebelum terjun ke ${topic}, tanya diri sendiri: mengapa ini penting bagi saya?\n\n## 2. Temukan Mentor\nCari seseorang yang sudah berhasil di bidang ${topic} dan pelajari dari pengalaman mereka.\n\n## 3. Konsistensi > Kesempurnaan\nLebih baik publish konten ${topic} yang "cukup baik" setiap minggu daripada sempurna tapi jarang.\n\n## 4. Bangun Komunitas\n${topic} akan lebih mudah jika Anda punya support system. Join komunitas yang relevan.\n\n## 5. Track Progress\nUkur apa yang bisa diukur. Set KPI untuk ${topic} Anda dan review setiap bulan.\n\n---\n*Bookmark artikel ini dan share ke teman yang membutuhkan!*`,

      `# ${topic}: Dari Nol Sampai Mahir dalam 30 Hari\n\n**Day 1-7: Foundation**\n- Pelajari dasar-dasar ${topic}\n- Baca 3 buku/artikel utama\n- Join 2 komunitas online\n\n**Day 8-14: Practice**\n- Terapkan apa yang dipelajari\n- Buat project pertama\n- Share progress di social media\n\n**Day 15-21: Optimize**\n- Analisis hasil\n- Perbaiki kelemahan\n- Cari feedback dari expert\n\n**Day 22-30: Monetize**\n- Tawarkan jasa ${topic}\n- Buat portfolio\n- Set pricing yang kompetitif\n\n💰 *Potensi income setelah 30 hari: Rp 3-10 juta/bulan*`
    ]
  },
  social: {
    label: 'Social Media Post',
    prompts: ['Topik/produk', 'Platform (IG/Twitter/LinkedIn)'],
    generator: (topic, tone) => [
      `🔥 ${topic.toUpperCase()} - Ini yang tidak orang bicarakan!\n\n3 tahun lalu saya mulai dari nol.\nHari ini? ${topic} jadi sumber income utama saya.\n\nIni 5 hal yang saya pelajari:\n\n1️⃣ Mulai sebelum siap\n2️⃣ Gagal itu data, bukan akhir\n3️⃣ Konsistensi beats bakat\n4️⃣ Network = Net worth\n5️⃣ Invest in yourself first\n\nYang nomor 3 paling penting 👆\n\nSave post ini untuk reminder!\n\n#${topic.replace(/\s/g, '')} #Motivasi #SuccessStory #Entrepreneur #DigitalMarketing`,

      `💡 HOT TAKE: ${topic} itu overrated.\n\n...just kidding. Tapi banyak orang salah paham.\n\nMereka pikir ${topic} = instant money.\nPadahal kenyataannya:\n\n❌ Butuh 6-12 bulan untuk hasil nyata\n❌ 90% orang quit di bulan ke-3\n❌ Butuh skill + consistency + luck\n\nTapi kalau kamu mau put in the work?\n\n✅ Passive income yang scalable\n✅ Freedom dari 9-5\n✅ Skill yang terus appreciate\n\nMau tahu step-by-stepnya?\nKomen "MAU" dan aku share di thread 👇\n\n#Thread #${topic.replace(/\s/g, '')} #SideHustle`,

      `📊 Data doesn't lie:\n\nOrang yang konsisten di ${topic} selama 1 tahun:\n\n→ 73% report income increase >50%\n→ 85% lebih satisfied dengan hidup\n→ 92% wouldn't go back to 9-5\n\nTapi yang START?\nHanya 12% dari yang "berencana".\n\nDon't be a planner. Be a DOER.\n\nStart today. Start small. Just START.\n\n🔗 Link di bio untuk free guide ${topic}`
    ]
  },
  ad: {
    label: 'Ad Copy / Iklan',
    prompts: ['Produk/Jasa', 'Target audience'],
    generator: (topic, tone) => [
      `🎯 HEADLINE: "Rahasia ${topic} yang Bikin 10,000+ Orang Quit Job Mereka"\n\nSUBHEADLINE: Dalam 90 hari atau uang kembali 100%\n\nBODY:\nHey ${tone}! 👋\n\nPernahkah Anda bertanya-tanya kenapa beberapa orang bisa hidup bebas finansial sementara Anda masih stuck di rutinitas 9-5?\n\nJawabannya: ${topic}.\n\nTapi bukan sembarang ${topic}. Ini adalah framework yang sudah terbukti:\n\n✅ Step 1: Setup dalam 24 jam\n✅ Step 2: First income dalam 7 hari  \n✅ Step 3: Scale ke Rp 10jt+/bulan\n\n🎁 BONUS: Free consultation 30 menit (worth Rp 500rb)\n\n⚡ LIMITED: Hanya 20 slot minggu ini\n\n[CLAIM SLOT ANDA SEKARANG →]\n\n*"Saya sudah coba 5 program sebelumnya, ini yang pertama kali benar-benar works" - Andi, Jakarta*`,

      `STOP scrolling! 🛑\n\nKalau Anda ${tone} yang ingin:\n• Extra income 5-20jt/bulan\n• Kerja dari mana saja\n• Be your own boss\n\n...maka ${topic} adalah JAWABAN.\n\n🔥 Flash Sale: Diskon 70% (24 jam saja!)\n\nNormal: Rp 2.500.000\nSekarang: Rp 750.000\n\nApa yang Anda dapatkan:\n✅ Video course 50+ modul\n✅ Template siap pakai\n✅ Komunitas exclusive\n✅ 1-on-1 mentoring\n\n👉 Klik link di bawah sebelum harga naik!\n\n[DAFTAR SEKARANG - Diskon 70%]`,

      `⚠️ PERINGATAN: Jangan beli ${topic} ini kalau...\n\n❌ Anda tidak serius\n❌ Anda mau instant rich\n❌ Anda tidak mau belajar\n\nTAPI kalau Anda:\n✅ Ready to put in the work\n✅ Want real, sustainable income\n✅ Serious about your future\n\nMaka ini untuk ANDA.\n\n📈 Result siswa kami:\n• Average income: Rp 8.5jt/bulan\n• 89% profit dalam bulan pertama\n• 4.9/5 rating kepuasan\n\n🎯 GARANSI 30 hari atau uang kembali\n\n[DAPATKAN AKSES SEKARANG →]`
    ]
  },
  email: {
    label: 'Email Marketing',
    prompts: ['Tujuan email', 'Target reader'],
    generator: (topic, tone) => [
      `Subject: 🚀 ${topic} - Kesempatan Terakhir!\n\nPreheader: Hanya tersisa 24 jam...\n\n---\n\nHi ${tone},\n\nSaya mau share sesuatu yang mungkin mengubah hidup Anda.\n\nBulan lalu, saya menemukan sesuatu tentang ${topic} yang benar-benar mind-blowing. Dan hasilnya?\n\n💰 Income naik 340% dalam 60 hari\n⏰ Kerja hanya 4 jam/hari\n🌍 Bisa dari mana saja\n\nTapi ini bukan tentang saya.\n\nIni tentang ANDA.\n\nKalau Anda serius mau transformasi yang sama, saya sudah siapkan step-by-step guide lengkap di sini:\n\n👉 [LINK: Panduan Lengkap ${topic}]\n\n⚠️ Tapi cepat - harga promo berakhir MIDNIGHT ini.\n\nJangan sampai menyesal besok.\n\nCheers,\n[Your Name]\n\nP.S. Ada bonus exclusive 5 template siap pakai untuk 50 orang pertama!`,

      `Subject: Apakah Anda membuat 5 kesalahan fatal ini di ${topic}?\n\nPreheader: #3 bikin 80% orang gagal...\n\n---\n\nHi ${tone},\n\nQuick question: Kenapa beberapa orang sukses di ${topic} sementara yang lain gagal?\n\nSetelah menganalisis 500+ kasus, saya menemukan 5 kesalahan fatal:\n\n❌ Mistake #1: Tidak punya clear goal\n❌ Mistake #2: Terlalu perfectionist\n❌ Mistake #3: Tidak invest di education ← THIS ONE\n❌ Mistake #4: Working alone (no mentor)\n❌ Mistake #5: Quit too early\n\nKalau Anda melakukan salah satu di atas, jangan khawatir.\n\nSaya sudah siapkan SOLUSI-nya:\n\n🎯 [FREE WEBINAR: Cara Menghindari 5 Kesalahan Fatal di ${topic}]\n\n📅 Tanggal: Sabtu, 10:00 WIB\n🎁 Bonus: Recording + checklist\n\n[RESERVE SEAT GRATIS →]\n\nSee you there!\n[Your Name]`,

      `Subject: Quick win untuk ${topic} Anda (baca ini 2 menit)\n\nPreheader: Tips yang langsung bisa dipraktekkan\n\n---\n\nHi ${tone},\n\nSaya janji ini akan singkat dan valuable.\n\nSatu hal yang bisa Anda lakukan HARI INI untuk improve ${topic}:\n\n💡 The 80/20 Rule\n\nFokus pada 20% aktivitas yang menghasilkan 80% hasil.\n\nUntuk ${topic}, itu biasanya:\n1. Outreach ke 5 prospek/hari\n2. Create 1 piece of content\n3. Follow up dengan existing clients\n\nThat's it. Simple tapi POWERFUL.\n\nCoba lakukan ini selama 30 hari dan lihat hasilnya.\n\nKalau mau deeper dive, saya punya resource lengkap:\n\n👉 [DOWNLOAD: 80/20 Framework untuk ${topic}]\n\nFree, no strings attached.\n\nGo get it!\n[Your Name]`
    ]
  },
  product: {
    label: 'Product Description',
    prompts: ['Nama produk', 'Fitur utama'],
    generator: (topic, tone) => [
      `✨ ${topic}\n\n---\n\n**Transformasi dimulai dari sini.**\n\n${topic} bukan sekadar produk - ini adalah INVESTASI untuk masa depan Anda.\n\n🎯 **Apa yang Anda dapatkan:**\n\n✅ Modul 1: Foundation - Kuatkan dasar ${tone}\n✅ Modul 2: Implementation - Step-by-step guide\n✅ Modul 3: Optimization - Scale & automate\n✅ Bonus: Template pack (worth Rp 2jt)\n✅ Bonus: Community access (lifetime)\n✅ Bonus: Monthly Q&A sessions\n\n💎 **Kenapa ${topic}?**\n\n• Dibuat oleh praktisi, bukan teoritis\n• Sudah terbukti oleh 500+ pengguna\n• Update gratis selamanya\n• Garansi 30 hari\n\n⭐ **Testimoni:**\n*"Best investment I ever made. ROI dalam 2 minggu!"* - Sarah K.\n\n💰 **Investasi:**\nNormal: ~~Rp 2.500.000~~\nLaunch Price: **Rp 997.000**\n\n[🔥 DAPATKAN SEKARANG]\n\n*Harga naik dalam 48 jam*`,

      `# ${topic}\n\n### ${tone} yang Akan Level Up Your Game\n\n---\n\n🤔 Frustrasi karena hasil tidak maksimal?\n\nKami mengerti. Itulah kenapa kami menciptakan ${topic}.\n\n**Before ${topic}:**\n- ❌ Confused dimana harus mulai\n- ❌ Trial and error yang mahal\n- ❌ Hasil yang inconsistent\n\n**After ${topic}:**\n- ✅ Clear roadmap to success\n- ✅ Proven framework\n- ✅ Predictable, scalable results\n\n📦 **What's Inside:**\n1. Core ${tone} system (50+ lessons)\n2. Swipe file & templates\n3. Private community\n4. Weekly coaching calls\n5. Resource library\n\n🏆 **Results speak:**\n- 500+ happy customers\n- 4.9/5 average rating\n- 89% see results in 30 days\n\n**Special Launch Offer:**\n💥 Rp 997.000 (normally Rp 2.5jt)\n\n[GET INSTANT ACCESS →]`,

      `---\n${topic.toUpperCase()}\n${tone}\n---\n\n🎁 LIMITED EDITION RELEASE\n\nIntroducing the ultimate solution for ${tone}...\n\n🔥 WHAT MAKES IT SPECIAL:\n\n✓ Research-backed methodology\n✓ Battle-tested by industry experts  \n✓ Beginner-friendly yet advanced enough\n✓ Lifetime updates included\n\n📊 BY THE NUMBERS:\n• 10,000+ downloads\n• 98% satisfaction rate\n• Average ROI: 12x\n\n💬 WHAT PEOPLE SAY:\n"This changed everything for me" ⭐⭐⭐⭐⭐\n"Worth 10x the price" ⭐⭐⭐⭐⭐\n\n🎯 PERFECT FOR:\n- Beginners who want fast results\n- Intermediates ready to scale\n- Experts looking for new frameworks\n\n💰 PRICING:\nStarter: Rp 497.000\nPro: Rp 997.000 (Best Value!)\nVIP: Rp 2.497.000\n\n[CHOOSE YOUR PLAN →]`
    ]
  },
  headline: {
    label: 'Headline / Judul',
    prompts: ['Topik', 'Jenis konten'],
    generator: (topic, tone) => [
      `📝 HEADLINE OPTIONS untuk "${topic}":\n\n1. "10 ${topic} Secrets That Top Earners Don't Want You to Know"\n2. "How I Made Rp 50 Juta from ${topic} in Just 3 Months"\n3. "The ${topic} Blueprint: A Step-by-Step Guide for Beginners"\n4. "Stop Making These 7 ${topic} Mistakes (Before It's Too Late)"\n5. "${topic} 101: Everything You Need to Know in 2024"\n6. "Why ${topic} is the #1 Skill You Need to Learn Right Now"\n7. "From Zero to Hero: My ${topic} Journey (Full Breakdown)"\n8. "The Lazy Person's Guide to ${topic} Success"\n9. "${topic}: The Complete Masterclass (Free Resources Inside)"\n10. "I Tested 15 ${topic} Strategies - Here's What Actually Works"`,

      `🎯 VIRAL HEADLINE FORMULAS untuk ${topic}:\n\n**Number + Adjective + Keyword + Promise:**\n• "7 Powerful ${topic} Hacks That Generate Rp 10jt/Month"\n• "5 Shocking ${topic} Truths Nobody Talks About"\n\n**How To + Benefit + Timeframe:**\n• "How to Master ${topic} in 30 Days (Even as a Complete Beginner)"\n• "How to Build a ${topic} Empire from Your Bedroom"\n\n**Question + Curiosity:**\n• "Are You Making This Fatal ${topic} Mistake?"\n• "What If ${topic} Could Replace Your Full-Time Salary?"\n\n**Before/After:**\n• "From Broke to Rp 100jt: How ${topic} Changed Everything"\n• "I Was Skeptical About ${topic}... Until This Happened"\n\n**List + Specificity:**\n• "12 ${topic} Tools I Use Daily (3 Are Free)"\n• "The Exact ${topic} System That Made Me Rp 1 Miliar"`,

      `⚡ POWER HEADLINES untuk ${topic}:\n\n🏆 AUTHORITY:\n• "The Definitive Guide to ${topic} (2024 Edition)"\n• "${topic} Explained by Someone Who's Done It for 10 Years"\n\n😱 FEAR/URGency:\n• "Why 95% of People Fail at ${topic} (And How to Be the 5%)"\n• "The ${topic} Industry Doesn't Want You to Read This"\n\n🎁 VALUE:\n• "Free ${topic} Toolkit Worth Rp 5 Juta (Download Now)"\n• "The ${topic} Cheat Sheet That Saves You 100+ Hours"\n\n📖 STORY:\n• "How a Single ${topic} Decision Made Me a Millionaire"\n• "I Quit My Job for ${topic}. Here's What Happened Next."\n\n🔬 DATA:\n• "We Analyzed 1,000 ${topic} Success Stories. Here's the Pattern."\n• "The Science Behind ${topic}: Data-Driven Insights"`
    ]
  }
};

export default function ContentGenerator() {
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [generated, setGenerated] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    if (topic) {
      const results = templates[contentType].generator(topic, tone || 'reader');
      setGenerated(results);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Content Type Selector */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Pilih Jenis Konten
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(Object.keys(templates) as ContentType[]).map(type => (
            <button
              key={type}
              onClick={() => { setContentType(type); setGenerated([]); }}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                contentType === type
                  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {templates[type].label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{templates[contentType].prompts[0]}</label>
            <input type="text" placeholder="Contoh: Digital Marketing, Freelance Writing..." value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{templates[contentType].prompts[1]}</label>
            <input type="text" placeholder="Contoh: Pemula, Profesional..." value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
          </div>
          <div className="flex items-end">
            <button onClick={generate} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Generate
            </button>
          </div>
        </div>
      </div>

      {/* Generated Content */}
      {generated.length > 0 && (
        <div className="space-y-4">
          {generated.map((content, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-medium">Variasi #{i + 1}</span>
                <button onClick={() => copyToClipboard(content, i)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    copied === i ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}>
                  {copied === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === i ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{content}</pre>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="glass-card rounded-2xl p-6 border border-amber-500/20">
        <h3 className="text-sm font-semibold text-amber-300 mb-3">💡 Tips Monetisasi Konten</h3>
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
