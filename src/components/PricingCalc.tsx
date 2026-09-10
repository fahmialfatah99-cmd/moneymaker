import { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { generate } from '../services/api';
import { Calculator, DollarSign, Target, TrendingUp, Info, Zap, Loader2, Sparkles } from 'lucide-react';

export default function PricingCalc() {
  const { isConfigured } = useApi();
  const [pricingType, setPricingType] = useState<'product' | 'service' | 'subscription'>('service');
  const [costs, setCosts] = useState(() => {
    try {
      const saved = localStorage.getItem('moneymaker_pricing_calc');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      fixedCosts: 0,
      variableCostPerUnit: 0,
      desiredProfitMargin: 0,
      targetMonthlyRevenue: 0,
      hourlyRate: 0,
      hoursPerProject: 0,
      competitors: 0,
      valueMultiplier: 1.5,
      productName: '',
      industry: '',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('moneymaker_pricing_calc', JSON.stringify(costs));
    } catch {}
  }, [costs]);
  const [aiStrategy, setAiStrategy] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const productPrice = costs.variableCostPerUnit * (1 + costs.desiredProfitMargin / 100);
  const unitsForTarget = Math.ceil(costs.targetMonthlyRevenue / (productPrice - costs.variableCostPerUnit));
  const servicePriceBase = costs.hourlyRate * costs.hoursPerProject;
  const servicePriceWithMargin = servicePriceBase * (1 + costs.desiredProfitMargin / 100);
  const servicePriceValue = costs.competitors * costs.valueMultiplier;
  const subBasePrice = costs.variableCostPerUnit;
  const subWithMargin = subBasePrice * (1 + costs.desiredProfitMargin / 100);
  const annualRevenue = subWithMargin * 12;
  const subsForTarget = Math.ceil(costs.targetMonthlyRevenue / subWithMargin);

  // AI: Generate pricing strategy
  const aiGenerateStrategy = async () => {
    if (!isConfigured) return;
    setAiLoading(true);
    try {
      const context = pricingType === 'product'
        ? `Produk dengan HPP ${formatCurrency(costs.variableCostPerUnit)}, fixed cost ${formatCurrency(costs.fixedCosts)}/bulan, harga saat ini ${formatCurrency(Math.round(productPrice))}`
        : pricingType === 'service'
        ? `Jasa freelance dengan rate ${formatCurrency(costs.hourlyRate)}/jam, ${costs.hoursPerProject} jam/project, harga kompetitor ${formatCurrency(costs.competitors)}`
        : `Subscription dengan cost per user ${formatCurrency(costs.variableCostPerUnit)}/bulan, harga saat ini ${formatCurrency(Math.round(subWithMargin))}`;

      const result = await generate(
        `Analisis pricing strategy untuk bisnis saya:

${context}
${costs.productName ? `Nama produk/jasa: ${costs.productName}` : ''}
${costs.industry ? `Industri: ${costs.industry}` : ''}
Tipe: ${pricingType}

Berikan:
1. Analisis harga saat ini (terlalu mahal/murah/pas)
2. Rekomendasi 3 pricing tiers (Basic, Standard, Premium) dengan harga dan fitur
3. Psikologi pricing yang tepat
4. Strategi diskon/promo
5. Tips meningkatkan perceived value
6. Warning/pitfalls yang harus dihindari

Berikan jawaban yang actionable dan spesifik.`,
        'Kamu adalah pricing strategist expert dengan pengalaman di berbagai industri. Berikan analisis yang data-driven dan actionable.'
      );
      setAiStrategy(result);
    } catch (err: any) {
      setAiStrategy('Error: ' + err.message);
    }
    setAiLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          AI Pricing Calculator
        </h3>
        <div className="flex gap-3">
          {[
            { id: 'product' as const, label: '🛍️ Produk', desc: 'Hitung harga jual produk' },
            { id: 'service' as const, label: '💼 Jasa/Freelance', desc: 'Hitung rate jasa Anda' },
            { id: 'subscription' as const, label: '🔄 Subscription/SaaS', desc: 'Hitung harga langganan' },
          ].map(type => (
            <button key={type.id} onClick={() => setPricingType(type.id)}
              className={`flex-1 p-4 rounded-xl text-left transition-all ${pricingType === type.id ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'}`}>
              <p className={`text-sm font-medium ${pricingType === type.id ? 'text-cyan-300' : 'text-slate-300'}`}>{type.label}</p>
              <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Parameters */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-400 mb-4">Input Parameter</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pricingType === 'product' && (
            <>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nama Produk</label>
                <input type="text" value={costs.productName} onChange={e => setCosts({...costs, productName: e.target.value})}
                  placeholder="Nama produk Anda"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-600" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Industri/Niche</label>
                <input type="text" value={costs.industry} onChange={e => setCosts({...costs, industry: e.target.value})}
                  placeholder="Contoh: Fashion, F&B, Tech"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-600" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Fixed Costs/Bulan (Rp)</label>
                <input type="number" value={costs.fixedCosts} onChange={e => setCosts({...costs, fixedCosts: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">HPP/Unit (Rp)</label>
                <input type="number" value={costs.variableCostPerUnit} onChange={e => setCosts({...costs, variableCostPerUnit: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Desired Margin (%)</label>
                <input type="number" value={costs.desiredProfitMargin} onChange={e => setCosts({...costs, desiredProfitMargin: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Target Revenue/Bulan (Rp)</label>
                <input type="number" value={costs.targetMonthlyRevenue} onChange={e => setCosts({...costs, targetMonthlyRevenue: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
            </>
          )}
          {pricingType === 'service' && (
            <>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nama Jasa</label>
                <input type="text" value={costs.productName} onChange={e => setCosts({...costs, productName: e.target.value})}
                  placeholder="Contoh: Web Development"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-600" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Industri/Spesialisasi</label>
                <input type="text" value={costs.industry} onChange={e => setCosts({...costs, industry: e.target.value})}
                  placeholder="Contoh: Tech Startup"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-600" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Hourly Rate (Rp/jam)</label>
                <input type="number" value={costs.hourlyRate} onChange={e => setCosts({...costs, hourlyRate: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Estimasi Jam/Project</label>
                <input type="number" value={costs.hoursPerProject} onChange={e => setCosts({...costs, hoursPerProject: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Harga Kompetitor (Rp)</label>
                <input type="number" value={costs.competitors} onChange={e => setCosts({...costs, competitors: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Desired Margin (%)</label>
                <input type="number" value={costs.desiredProfitMargin} onChange={e => setCosts({...costs, desiredProfitMargin: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
            </>
          )}
          {pricingType === 'subscription' && (
            <>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nama Produk/SaaS</label>
                <input type="text" value={costs.productName} onChange={e => setCosts({...costs, productName: e.target.value})}
                  placeholder="Nama produk subscription"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder:text-slate-600" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Cost per User/Bulan (Rp)</label>
                <input type="number" value={costs.variableCostPerUnit} onChange={e => setCosts({...costs, variableCostPerUnit: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Desired Margin (%)</label>
                <input type="number" value={costs.desiredProfitMargin} onChange={e => setCosts({...costs, desiredProfitMargin: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Target Revenue/Bulan (Rp)</label>
                <input type="number" value={costs.targetMonthlyRevenue} onChange={e => setCosts({...costs, targetMonthlyRevenue: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
            </>
          )}
        </div>

        {/* AI Strategy Button */}
        <div className="mt-4 flex items-center gap-3">
          <button onClick={aiGenerateStrategy} disabled={aiLoading || !isConfigured}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {aiLoading ? 'Analyzing...' : 'AI Pricing Strategy'}
          </button>
          {isConfigured && (
            <span className="flex items-center gap-1 text-xs text-purple-400">
              <Sparkles className="w-3 h-3" /> Powered by AI
            </span>
          )}
          {!isConfigured && (
            <span className="text-xs text-slate-500">Setup 9Router di Settings untuk AI analysis</span>
          )}
        </div>
      </div>

      {/* AI Strategy Result */}
      {aiStrategy && (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" /> AI Pricing Strategy Analysis
          </h3>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{aiStrategy}</pre>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pricingType === 'product' && (
          <>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 border border-emerald-500/20">
              <h3 className="text-sm font-semibold text-emerald-300 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Recommended Price
              </h3>
              <div className="space-y-4">
                <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-3xl font-bold text-emerald-400">{formatCurrency(Math.round(productPrice))}</p>
                  <p className="text-xs text-slate-400 mt-1">Harga Jual per Unit</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500">HPP/Unit</p>
                    <p className="text-sm font-medium text-white">{formatCurrency(costs.variableCostPerUnit)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500">Profit/Unit</p>
                    <p className="text-sm font-medium text-emerald-400">{formatCurrency(Math.round(productPrice - costs.variableCostPerUnit))}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-slate-500">Unit untuk Target Revenue</p>
                  <p className="text-sm font-medium text-amber-400">{unitsForTarget} unit/bulan</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Pricing Strategies
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Penetration', price: productPrice * 0.7, desc: 'Masuk market dengan harga rendah' },
                  { name: 'Competitive', price: productPrice, desc: 'Cost + margin standard' },
                  { name: 'Premium', price: productPrice * 1.5, desc: 'Posisi premium brand' },
                  { name: 'Value-Based', price: productPrice * 2, desc: 'Berdasarkan value' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div>
                      <p className="text-sm text-white">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                    <p className="text-sm font-medium text-cyan-400">{formatCurrency(Math.round(s.price))}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {pricingType === 'service' && (
          <>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 border border-emerald-500/20">
              <h3 className="text-sm font-semibold text-emerald-300 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Recommended Pricing
              </h3>
              <div className="space-y-4">
                <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-3xl font-bold text-emerald-400">{formatCurrency(Math.round(servicePriceWithMargin))}</p>
                  <p className="text-xs text-slate-400 mt-1">Harga per Project</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500">Base (Hourly)</p>
                    <p className="text-sm font-medium text-white">{formatCurrency(servicePriceBase)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500">Value-Based</p>
                    <p className="text-sm font-medium text-amber-400">{formatCurrency(Math.round(servicePriceValue))}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-slate-500">Effective Hourly Rate</p>
                  <p className="text-sm font-medium text-cyan-400">{formatCurrency(Math.round(servicePriceWithMargin / costs.hoursPerProject))}/jam</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> Pricing Tiers
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Basic', price: servicePriceWithMargin * 0.6, features: ['Core service', '1 revision', '7 hari delivery'] },
                  { name: 'Standard', price: servicePriceWithMargin, features: ['Full service', '3 revisions', '5 hari delivery', 'Support 30 hari'], popular: true },
                  { name: 'Premium', price: servicePriceWithMargin * 1.8, features: ['Everything in Standard', 'Unlimited revisions', '3 hari delivery', 'Priority support'] },
                ].map((tier, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${tier.popular ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/30 border-slate-700/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{tier.name}</p>
                        {tier.popular && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">Popular</span>}
                      </div>
                      <p className="text-sm font-bold text-emerald-400">{formatCurrency(Math.round(tier.price))}</p>
                    </div>
                    <div className="space-y-1">
                      {tier.features.map((f, j) => (
                        <p key={j} className="text-xs text-slate-400 flex items-center gap-1"><span className="text-emerald-400">✓</span> {f}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {pricingType === 'subscription' && (
          <>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 border border-emerald-500/20">
              <h3 className="text-sm font-semibold text-emerald-300 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Subscription Pricing
              </h3>
              <div className="space-y-4">
                <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-3xl font-bold text-emerald-400">{formatCurrency(Math.round(subWithMargin))}</p>
                  <p className="text-xs text-slate-400 mt-1">Harga per User/Bulan</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500">Revenue/User/Tahun</p>
                    <p className="text-sm font-medium text-emerald-400">{formatCurrency(Math.round(annualRevenue))}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500">Users untuk Target</p>
                    <p className="text-sm font-medium text-amber-400">{subsForTarget} users</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Subscription Tiers
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Starter', price: subWithMargin * 0.5, period: '/bulan' },
                  { name: 'Pro', price: subWithMargin, period: '/bulan', popular: true },
                  { name: 'Enterprise', price: subWithMargin * 3, period: '/bulan' },
                  { name: 'Annual Pro', price: subWithMargin * 10, period: '/tahun' },
                ].map((tier, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${tier.popular ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/30 border-slate-700/30'}`}>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white">{tier.name}</p>
                      {tier.popular && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">Popular</span>}
                    </div>
                    <p className="text-sm"><span className="font-bold text-emerald-400">{formatCurrency(Math.round(tier.price))}</span><span className="text-xs text-slate-500">{tier.period}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
