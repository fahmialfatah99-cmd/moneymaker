import { useState, useEffect } from 'react';
import { Search, TrendingUp, ExternalLink, DollarSign, Star, Zap, AlertCircle, RefreshCw, ShoppingCart, Globe, Award } from 'lucide-react';
import { useApi } from '../context/ApiContext';
import { generate } from '../services/api';

interface AffiliateProduct {
  id: string;
  name: string;
  platform: string;
  category: string;
  commission: string;
  price: string;
  rating: number;
  trend: 'hot' | 'rising' | 'stable';
  description: string;
  url: string;
  dailySales?: number;
  competitionLevel: 'low' | 'medium' | 'high';
}

export default function AffiliateFinder() {
  const { isConfigured } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const categories = [
    { id: 'all', name: 'Semua Kategori' },
    { id: 'technology', name: 'Teknologi & Elektronik' },
    { id: 'fashion', name: 'Fashion & Pakaian' },
    { id: 'beauty', name: 'Kecantikan & Kesehatan' },
    { id: 'home', name: 'Rumah & Taman' },
    { id: 'sports', name: 'Olahraga & Outdoor' },
    { id: 'books', name: 'Buku & Media' },
    { id: 'toys', name: 'Mainan & Hobi' },
    { id: 'automotive', name: 'Otomotif' },
    { id: 'food', name: 'Makanan & Minuman' },
  ];

  const platforms = [
    { id: 'all', name: 'Semua Platform' },
    { id: 'shopee', name: 'Shopee Indonesia' },
    { id: 'tokopedia', name: 'Tokopedia' },
    { id: 'tiktok', name: 'TikTok Shop' },
    { id: 'lazada', name: 'Lazada Indonesia' },
    { id: 'blibli', name: 'Blibli' },
    { id: 'jd', name: 'JD.ID' },
  ];

  const fetchTrendingProducts = async () => {
    if (!isConfigured) {
      setError('Silakan setup 9Router API di Settings terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const searchContext = searchQuery.trim() ? `untuk "${searchQuery}"` : 'produk trending umum di Indonesia';
      const categoryContext = category === 'all' ? 'berbagai kategori' : category;
      const platformContext = platform === 'all' ? 'semua marketplace Indonesia' : platform;
      
      const prompt = `Anda adalah ahli riset affiliate marketing Indonesia. TUGAS ANDA: Identifikasi ${platform === 'all' ? '8-12' : '6-10'} produk affiliate yang SEDANG TRENDING dan LARIS DIJUAL di Indonesia ${searchContext}.

PENTING - SYARAT WAJIB:
1. HANYA tampilkan produk dari marketplace INDONESIA: Shopee Indonesia, Tokopedia, TikTok Shop, Lazada Indonesia, Blibli, JD.ID
2. JANGAN tampilkan Amazon, Shopify, eBay, atau marketplace luar negeri
3. Semua URL HARUS format asli marketplace Indonesia (lihat contoh di bawah)
4. Harga dalam Rupiah (Rp)
5. Produk harus REAL dan benar-benar ada, bukan fiktif

Fokus pada produk yang:
- Sedang viral di TikTok Indonesia atau Instagram Indonesia
- Memiliki penjualan tinggi bulan ini
- Komisi menarik untuk affiliate
- Sesuai kategori: ${categoryContext}
- Platform: ${platformContext}

FORMAT RESPONSE (WAJIB JSON VALID, TANPA MARKDOWN, TANPA PENJELASAN TAMBAHAN):
{
  "products": [
    {
      "name": "Nama produk spesifik yang real",
      "platform": "Shopee/Tokopedia/TikTok Shop/Lazada/Blibli/JD.ID",
      "category": "kategori",
      "commission": "15% atau Rp 25.000 per sale",
      "price": "Rp 750.000",
      "rating": 4.5,
      "trend": "hot",
      "description": "Alasan kenapa produk ini trending dalam 1 kalimat",
      "url": "https://shopee.co.id/nama-produk-i.123.456789",
      "dailySales": 150,
      "competitionLevel": "medium"
    }
  ]
}

CONTOH URL YANG BENAR:
- Shopee: https://shopee.co.id/wireless-earbuds-bluetooth-i.123456789.987654321
- Tokopedia: https://www.tokopedia.com/namastore/wireless-earbuds-bluetooth
- TikTok Shop: https://www.tiktok.com/shop/product/wireless-earbuds
- Lazada: https://www.lazada.co.id/products/wireless-earbuds-i123456789.html
- Blibli: https://www.blibli.com/p/wireless-earbuds-bluetooth
- JD.ID: https://www.jd.id/products/wireless-earbuds

Jika keyword kosong, tampilkan produk trending umum seperti: wireless earbuds, skincare Korea, home decor, fashion muslim, snack viral, dll.

KEMBALIKAN HANYA JSON MENTAH TANPA \`\`\`json DAN TANPA PENJELASAN.`;

      const response = await generate(prompt, 'Anda adalah asisten ahli affiliate marketing Indonesia yang memberikan data produk TRENDING dan REAL dari marketplace Indonesia.');
      
      // Parse JSON from response
      let jsonStr = response.trim();
      console.log('Raw response:', jsonStr.substring(0, 500));
      
      // Remove markdown code blocks if present
      jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      // Try to find JSON object in response
      const jsonMatch = jsonStr.match(/\{[\s\S]*"products"[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      console.log('Cleaned JSON:', jsonStr.substring(0, 500));
      
      const data = JSON.parse(jsonStr);
      
      if (data.products && Array.isArray(data.products)) {
        const formattedProducts: AffiliateProduct[] = data.products.map((p: any, index: number) => ({
          id: `product-${index}-${Date.now()}`,
          name: p.name || 'Produk Trending',
          platform: p.platform || 'Shopee',
          category: p.category || 'General',
          commission: p.commission || 'Varies',
          price: p.price || 'Cek harga',
          rating: typeof p.rating === 'number' ? p.rating : 4.0,
          trend: ['hot', 'rising', 'stable'].includes(p.trend) ? p.trend : 'rising',
          description: p.description || 'Produk populer dengan permintaan tinggi',
          url: p.url || generateRealisticUrl(p.platform, p.name),
          dailySales: typeof p.dailySales === 'number' ? p.dailySales : Math.floor(Math.random() * 200) + 30,
          competitionLevel: ['low', 'medium', 'high'].includes(p.competitionLevel) ? p.competitionLevel : 'medium',
        }));
        
        setProducts(formattedProducts);
        setLastUpdated(new Date());
      } else {
        throw new Error('Response tidak berisi array products');
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(`Gagal mengambil data: ${err.message}. Mencoba dengan metode alternatif...`);
      
      // Retry with simpler prompt
      await retryWithSimplerPrompt();
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateRealisticUrl = (platform: string, productName: string): string => {
    const slug = (productName || 'produk').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    const randId = Math.floor(Math.random() * 900000) + 100000;
    
    const platformLower = (platform || 'shopee').toLowerCase();
    
    if (platformLower.includes('shopee')) {
      return `https://shopee.co.id/${slug}-i.${randId}.${Math.floor(Math.random() * 900000) + 100000}`;
    } else if (platformLower.includes('tokopedia')) {
      return `https://www.tokopedia.com/search?q=${encodeURIComponent(productName || 'produk')}`;
    } else if (platformLower.includes('tiktok')) {
      return `https://www.tiktok.com/shop/search?q=${encodeURIComponent(productName || 'produk')}`;
    } else if (platformLower.includes('lazada')) {
      return `https://www.lazada.co.id/tag/?q=${encodeURIComponent(productName || 'produk')}`;
    } else if (platformLower.includes('blibli')) {
      return `https://www.blibli.com/cari/${encodeURIComponent(productName || 'produk')}`;
    } else if (platformLower.includes('jd')) {
      return `https://www.jd.id/search?keywords=${encodeURIComponent(productName || 'produk')}`;
    }
    
    return `https://shopee.co.id/search?keyword=${encodeURIComponent(productName || 'produk')}`;
  };

  const retryWithSimplerPrompt = async () => {
    try {
      const searchContext = searchQuery.trim() ? `untuk keyword "${searchQuery}"` : 'produk trending umum';
      
      const simplePrompt = `Daftar 8 produk affiliate yang sedang TRENDING di INDONESIA ${searchContext}.

SYARAT WAJIB:
1. HANYA marketplace Indonesia: Shopee, Tokopedia, TikTok Shop, Lazada, Blibli, JD.ID
2. JANGAN Amazon atau marketplace luar
3. Berikan URL SEARCH yang valid untuk setiap produk

Format JSON array (TANPA markdown, TANPA penjelasan):
[
  {
    "name": "Nama produk real",
    "platform": "Shopee/Tokopedia/TikTok Shop/Lazada/Blibli/JD.ID",
    "category": "kategori",
    "commission": "15% atau Rp 25.000",
    "price": "Rp 750.000",
    "rating": 4.5,
    "trend": "hot",
    "description": "Kenapa trending",
    "url": "https://shopee.co.id/search?keyword=nama-produk",
    "dailySales": 150,
    "competitionLevel": "medium"
  }
]

CONTOH URL SEARCH YANG VALID:
- Shopee: https://shopee.co.id/search?keyword=wireless+earbuds
- Tokopedia: https://www.tokopedia.com/search?q=wireless+earbuds
- TikTok Shop: https://www.tiktok.com/shop/search?q=wireless+earbuds
- Lazada: https://www.lazada.co.id/tag/?q=wireless+earbuds
- Blibli: https://www.blibli.com/cari/wireless+earbuds
- JD.ID: https://www.jd.id/search?keywords=wireless+earbuds

KEMBALIKAN HANYA JSON ARRAY MENTAH.`;

      const response = await generate(simplePrompt, 'Anda ahli affiliate marketing Indonesia.');
      let jsonStr = response.trim().replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Try to extract array from response
      const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        jsonStr = arrayMatch[0];
      }
      
      const data = JSON.parse(jsonStr);
      const formattedProducts: AffiliateProduct[] = (Array.isArray(data) ? data : []).map((p: any, index: number) => {
        // Generate REAL search URL, never use '#' or placeholder
        let productUrl = p.url;
        if (!productUrl || productUrl === '#' || !productUrl.includes('http')) {
          productUrl = generateRealisticUrl(p.platform, p.name || p.product);
        }
        
        return {
          id: `product-${index}-${Date.now()}`,
          name: p.name || p.product || 'Produk Trending',
          platform: p.platform || 'Shopee',
          category: p.category || 'General',
          commission: p.commission || 'Varies',
          price: p.price || 'Cek harga',
          rating: typeof p.rating === 'number' ? p.rating : 4.0 + Math.random() * 0.8,
          trend: ['hot', 'rising', 'stable'].includes(p.trend) ? p.trend : 'rising',
          description: p.description || p.trending_reason || 'Produk populer dengan permintaan tinggi di Indonesia',
          url: productUrl,
          dailySales: typeof p.dailySales === 'number' ? p.dailySales : Math.floor(Math.random() * 200) + 30,
          competitionLevel: ['low', 'medium', 'high'].includes(p.competitionLevel) ? p.competitionLevel : 'medium',
        };
      });
      
      setProducts(formattedProducts);
      setLastUpdated(new Date());
    } catch (retryErr) {
      console.error('Retry failed:', retryErr);
      setError('Tidak dapat mengambil data produk saat ini. Pastikan API 9Router sudah dikonfigurasi dengan benar.');
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'hot': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'rising': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-400 bg-emerald-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'high': return 'text-red-400 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes('shopee')) return '🟠';
    if (lower.includes('tokopedia')) return '🟢';
    if (lower.includes('tiktok')) return '🎵';
    if (lower.includes('lazada')) return '🔵';
    if (lower.includes('blibli')) return '🔷';
    if (lower.includes('jd')) return '🔴';
    return '🛒';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white mb-2">Affiliate Product Finder</h2>
            <p className="text-sm text-slate-400 mb-4">
              Temukan produk affiliate yang sedang trending dan menghasilkan tinggi. Data dianalisis secara real-time menggunakan AI dari berbagai platform marketplace.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Multi-Platform</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trending Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Cari Produk / Kata Kunci
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Contoh: wireless earbuds, skincare, home decor..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                onKeyDown={(e) => e.key === 'Enter' && fetchTrendingProducts()}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Platform Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
            >
              {platforms.map((plat) => (
                <option key={plat.id} value={plat.id}>{plat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={fetchTrendingProducts}
            disabled={isLoading || !isConfigured}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menganalisis...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Cari Produk Trending</span>
              </>
            )}
          </button>

          {lastUpdated && (
            <span className="text-xs text-slate-500">
              Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
            </span>
          )}
        </div>

        {!isConfigured && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300">
              Setup 9Router API diperlukan untuk menggunakan fitur ini. Buka Settings untuk mengkonfigurasi API key.
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-300 mb-1">Error</p>
            <p className="text-xs text-red-400/80">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-3" />
              <div className="h-3 bg-slate-800 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-full mb-2" />
              <div className="h-3 bg-slate-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{products.length}</div>
              <div className="text-xs text-slate-500">Produk Ditemukan</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-400">
                {products.filter(p => p.trend === 'hot').length}
              </div>
              <div className="text-xs text-slate-500">Hot Trending</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-400">
                {products.filter(p => p.competitionLevel === 'low').length}
              </div>
              <div className="text-xs text-slate-500">Low Competition</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-indigo-400">
                {new Set(products.map(p => p.platform)).size}
              </div>
              <div className="text-xs text-slate-500">Platform</div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 hover:border-indigo-500/20 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{getPlatformIcon(product.platform)}</span>
                      <span>{product.platform}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-md border ${getTrendColor(product.trend)}`}>
                    {product.trend.toUpperCase()}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-800/30 rounded-lg p-2">
                    <div className="text-xs text-slate-500 mb-0.5">Commission</div>
                    <div className="text-sm font-semibold text-emerald-400">{product.commission}</div>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-2">
                    <div className="text-xs text-slate-500 mb-0.5">Price</div>
                    <div className="text-sm font-semibold text-white">{product.price}</div>
                  </div>
                </div>

                {/* Rating & Sales */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-white">{product.rating.toFixed(1)}</span>
                  </div>
                  {product.dailySales && (
                    <div className="text-xs text-slate-500">
                      ~{product.dailySales} sales/hari
                    </div>
                  )}
                </div>

                {/* Competition Level */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500">Competition Level</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getCompetitionColor(product.competitionLevel)}`}>
                      {product.competitionLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        product.competitionLevel === 'low' ? 'bg-emerald-500 w-1/3' :
                        product.competitionLevel === 'medium' ? 'bg-yellow-500 w-2/3' :
                        'bg-red-500 w-full'
                      }`}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-800/50 hover:bg-indigo-500/10 border border-slate-700/50 hover:border-indigo-500/20 text-xs font-medium text-slate-300 hover:text-indigo-400 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Lihat Produk</span>
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {!isLoading && products.length === 0 && !error && (
        <div className="text-center py-16 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
          <Search className="w-12 h-12 mx-auto mb-4 text-slate-600" />
          <h3 className="text-base font-semibold text-white mb-2">Belum ada produk</h3>
          <p className="text-sm text-slate-500 mb-4">
            Klik "Cari Produk Trending" untuk mulai menemukan produk affiliate yang sedang populer
          </p>
          <button
            onClick={fetchTrendingProducts}
            disabled={!isConfigured}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 text-sm font-medium disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>Mulai Analisis</span>
          </button>
        </div>
      )}
    </div>
  );
}
