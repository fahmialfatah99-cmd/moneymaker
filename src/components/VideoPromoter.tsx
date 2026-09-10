import React, { useState } from 'react';
import { Video, Copy, Check, Play, Clock, Sparkles, ArrowRight, Film } from 'lucide-react';
import { useApi } from '../context/ApiContext';

interface VideoPrompt {
  sceneNumber: number;
  duration: string;
  title: string;
  prompt: string;
  visualDescription: string;
  cameraMovement: string;
  textOverlay: string;
}

interface GeneratedVideoPlan {
  productName: string;
  platform: string;
  totalDuration: string;
  prompts: VideoPrompt[];
}

const VideoPromoter: React.FC = () => {
  const { callAI } = useApi();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('tiktok');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyBenefits, setKeyBenefits] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoPlan, setVideoPlan] = useState<GeneratedVideoPlan | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const platforms = [
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'instagram_reels', label: 'Instagram Reels', icon: '📸' },
    { value: 'youtube_shorts', label: 'YouTube Shorts', icon: '🎬' },
    { value: 'facebook_reels', label: 'Facebook Reels', icon: '📘' },
  ];

  const generateVideoPrompts = async () => {
    if (!productName.trim()) {
      setError('Nama produk harus diisi');
      return;
    }

    setIsGenerating(true);
    setError('');
    setVideoPlan(null);

    const prompt = `Buatlah rencana video promosi berdurasi 1 menit (60 detik) yang terbagi menjadi 6 scene masing-masing 10 detik untuk produk berikut:

**Informasi Produk:**
- Nama Produk: ${productName}
- Deskripsi: ${productDescription || 'Tidak ada deskripsi'}
- Platform Target: ${platforms.find(p => p.value === targetPlatform)?.label}
- Target Audiens: ${targetAudience || 'Umum'}
- Manfaat Utama: ${keyBenefits || 'Tidak disebutkan'}

**Format Output (WAJIB dalam JSON):**
{
  "productName": "${productName}",
  "platform": "${platforms.find(p => p.value === targetPlatform)?.label}",
  "totalDuration": "60 detik",
  "prompts": [
    {
      "sceneNumber": 1,
      "duration": "0-10 detik",
      "title": "Hook - Tarik Perhatian",
      "prompt": "deskripsi detail prompt untuk AI video generator",
      "visualDescription": "apa yang terlihat di layar",
      "cameraMovement": "jenis pergerakan kamera",
      "textOverlay": "teks yang muncul di layar"
    },
    ... (total 6 scene)
  ]
}

**Struktur 6 Scene (10 detik masing-masing):**
1. Scene 1 (0-10s): HOOK - Masalah atau pertanyaan yang menarik perhatian
2. Scene 2 (10-20s): INTRO SOLUSI - Perkenalkan produk sebagai solusi
3. Scene 3 (20-30s): FITUR UTAMA 1 - Close-up produk, tunjukkan fitur pertama
4. Scene 4 (30-40s): DEMONSTRASI - Cara penggunaan atau hasil nyata
5. Scene 5 (40-50s): SOCIAL PROOF - Testimoni, reaksi positif, atau before-after
6. Scene 6 (50-60s): CALL TO ACTION - Ajakan bertindak yang jelas

**Catatan Penting:**
- Setiap prompt harus DETAIL dan DESKRIPTIF untuk AI video generator
- Sertakan pencahayaan, warna, mood, dan atmosfer
- Sesuaikan gaya dengan platform ${platforms.find(p => p.value === targetPlatform)?.label}
- Gunakan bahasa Indonesia untuk semua field
- Pastikan alur cerita koheren dari scene 1-6

Berikan HANYA JSON tanpa penjelasan tambahan.`;

    try {
      const response = await callAI(prompt);
      
      let jsonStr = response;
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      const parsed: GeneratedVideoPlan = JSON.parse(jsonStr);
      
      if (!parsed.prompts || parsed.prompts.length !== 6) {
        throw new Error('Format respons tidak valid: harus ada 6 scene');
      }

      setVideoPlan(parsed);
    } catch (err) {
      console.error('Error generating video prompts:', err);
      setError('Gagal membuat prompt video. Coba lagi dengan informasi yang lebih detail.');
      
      // Fallback: Generate manual prompts
      const fallbackPlan = generateFallbackPrompts();
      setVideoPlan(fallbackPlan);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackPrompts = (): GeneratedVideoPlan => {
    const basePrompts: VideoPrompt[] = [
      {
        sceneNumber: 1,
        duration: '0-10 detik',
        title: '🎯 Hook - Tarik Perhatian',
        prompt: `Close-up shot wajah orang dengan ekspresi frustrasi/masalah terkait ${productName}. Pencahayaan dramatis dengan kontras tinggi. Background blur dengan warna gelap. Orang tersebut melihat ke kamera dengan tatapan bertanya. Style cinematic dengan color grading moody.`,
        visualDescription: 'Orang dengan masalah yang relevan dengan produk',
        cameraMovement: 'Slow zoom in ke wajah',
        textOverlay: 'Pernah mengalami ini?',
      },
      {
        sceneNumber: 2,
        duration: '10-20 detik',
        title: '💡 Intro Solusi',
        prompt: `Transisi bright dari scene sebelumnya. Produk ${productName} muncul dengan lighting studio yang clean. Background putih atau gradient soft. Produk berputar perlahan showcase design. Warna cerah dan fresh. Style commercial advertisement profesional.`,
        visualDescription: `${productName} diperkenalkan sebagai solusi`,
        cameraMovement: '360 degree product rotation',
        textOverlay: `Solusinya: ${productName}`,
      },
      {
        sceneNumber: 3,
        duration: '20-30 detik',
        title: '⭐ Fitur Utama 1',
        prompt: `Extreme close-up pada fitur utama ${productName}. Macro shot menunjukkan detail kualitas bahan/teknologi. Lighting highlight pada fitur tersebut. Background minimalist. Animasi grafis sederhana muncul menunjukkan spesifikasi. Style tech review premium.`,
        visualDescription: 'Detail fitur unggulan produk',
        cameraMovement: 'Macro pan across features',
        textOverlay: 'Fitur Canggih',
      },
      {
        sceneNumber: 4,
        duration: '30-40 detik',
        title: '🎬 Demonstrasi Penggunaan',
        prompt: `Lifestyle shot orang menggunakan ${productName} dalam situasi nyata. Natural lighting siang hari. Environment sesuai konteks penggunaan produk. Orang tersenyum puas saat menggunakan. Camera mengikuti aksi. Style authentic user-generated content.`,
        visualDescription: 'Demonstrasi cara pakai produk',
        cameraMovement: 'Tracking shot mengikuti aksi',
        textOverlay: 'Mudah & Praktis',
      },
      {
        sceneNumber: 5,
        duration: '40-50 detik',
        title: '✅ Social Proof',
        prompt: `Split screen atau montage beberapa orang berbeda menggunakan ${productName} dengan hasil positif. Bright lighting, warna vibrant. Ekspresi bahagia dan puas. Overlay graphic bintang 5 atau testimonial singkat. Style social media testimonial compilation.`,
        visualDescription: 'Testimoni dan hasil nyata pengguna',
        cameraMovement: 'Quick cuts antara berbagai testimoni',
        textOverlay: '⭐⭐⭐⭐⭐ Ribuan Puas!',
      },
      {
        sceneNumber: 6,
        duration: '50-60 detik',
        title: '🚀 Call to Action',
        prompt: `Hero shot produk ${productName} dengan background clean. Large text CTA muncul dengan animasi bold. Warna brand yang eye-catching. Button atau arrow mengarah ke link. Ending dengan logo dan tagline. Style high-conversion advertisement.`,
        visualDescription: 'Ajakan bertindak yang jelas',
        cameraMovement: 'Static shot dengan animated text overlay',
        textOverlay: 'Beli Sekarang! Link di Bio 🔗',
      },
    ];

    return {
      productName,
      platform: platforms.find(p => p.value === targetPlatform)?.label || targetPlatform,
      totalDuration: '60 detik',
      prompts: basePrompts,
    };
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyAllPrompts = async () => {
    if (!videoPlan) return;
    
    const allPrompts = videoPlan.prompts
      .map((p, i) => `🎬 SCENE ${i + 1}: ${p.title}\n⏱️ ${p.duration}\n\n📝 PROMPT:\n${p.prompt}\n\n🎥 VISUAL: ${p.visualDescription}\n📹 CAMERA: ${p.cameraMovement}\n💬 TEXT: ${p.textOverlay}\n\n${'─'.repeat(50)}\n`)
      .join('\n');

    await copyToClipboard(allPrompts, -1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Film className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Video Promoter</h1>
            <p className="text-gray-600">Buat prompt video promosi 1 menit (6 scene × 10 detik)</p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Informasi Produk
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Produk *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Contoh: Skincare GlowBright"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Target
            </label>
            <select
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.icon} {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Produk
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Jelaskan produk Anda secara detail..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audiens
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Contoh: Wanita usia 18-35 tahun"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manfaat Utama
            </label>
            <input
              type="text"
              value={keyBenefits}
              onChange={(e) => setKeyBenefits(e.target.value)}
              placeholder="Contoh: Mencerahkan kulit dalam 7 hari"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={generateVideoPrompts}
          disabled={isGenerating || !productName.trim()}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Membuat Prompt Video...
            </>
          ) : (
            <>
              <Film className="w-5 h-5" />
              Generate 6 Scene Prompts
            </>
          )}
        </button>
      </div>

      {/* Generated Prompts */}
      {videoPlan && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">{videoPlan.productName}</h3>
                <p className="opacity-90">Platform: {videoPlan.platform}</p>
                <p className="opacity-90">Total Durasi: {videoPlan.totalDuration}</p>
              </div>
              <button
                onClick={copyAllPrompts}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
              >
                {copiedIndex === -1 ? (
                  <>
                    <Check className="w-5 h-5" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Salin Semua
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Individual Scene Cards */}
          <div className="grid gap-4">
            {videoPlan.prompts.map((prompt, index) => (
              <div
                key={prompt.sceneNumber}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* Scene Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {prompt.sceneNumber}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{prompt.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {prompt.duration}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(prompt.prompt, index)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 text-sm"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-green-600">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Salin Prompt
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Scene Content */}
                <div className="p-6 space-y-4">
                  {/* Main Prompt */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">AI Video Prompt</span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {prompt.prompt}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Play className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium text-blue-700">Visual</span>
                      </div>
                      <p className="text-sm text-blue-900">{prompt.visualDescription}</p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Video className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium text-green-700">Camera</span>
                      </div>
                      <p className="text-sm text-green-900">{prompt.cameraMovement}</p>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowRight className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-medium text-orange-700">Text Overlay</span>
                      </div>
                      <p className="text-sm text-orange-900">{prompt.textOverlay}</p>
                    </div>
                  </div>

                  {/* Usage Tips */}
                  <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                    <p className="text-xs text-yellow-800">
                      💡 <strong>Tips:</strong> Copy prompt di atas dan paste ke AI video generator seperti Runway, Pika, Kaiber, atau Sora. Sesuaikan durasi menjadi 10 detik di tool yang Anda gunakan.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final Instructions */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">🎬 Cara Menggunakan Prompt Ini:</h3>
            <ol className="space-y-2 text-sm opacity-90">
              <li>1. Pilih salah satu scene di atas dan klik "Salin Prompt"</li>
              <li>2. Paste ke AI video generator (Runway, Pika, Kaiber, Sora, dll)</li>
              <li>3. Set durasi menjadi 10 detik untuk setiap scene</li>
              <li>4. Generate semua 6 scene secara berurutan</li>
              <li>5. Gabungkan ke-6 video menjadi 1 video utuh 60 detik</li>
              <li>6. Tambahkan musik dan voice over jika diperlukan</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPromoter;
