import { useState } from 'react';
import { Calculator, DollarSign, Target, TrendingUp, Info } from 'lucide-react';

export default function PricingCalc() {
  const [pricingType, setPricingType] = useState<'product' | 'service' | 'subscription'>('service');
  const [costs, setCosts] = useState({
    fixedCosts: 5000000,
    variableCostPerUnit: 50000,
    desiredProfitMargin: 30,
    targetMonthlyRevenue: 20000000,
    hourlyRate: 100000,
    hoursPerProject: 40,
    competitors: 500000,
    valueMultiplier: 1.5,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  // Product Pricing
  const breakEvenUnits = costs.fixedCosts / (costs.variableCostPerUnit > 0 ? 1 : 1);
  const productPrice = costs.variableCostPerUnit * (1 + costs.desiredProfitMargin / 100);
  const unitsForTarget = Math.ceil(costs.targetMonthlyRevenue / (productPrice - costs.variableCostPerUnit));

  // Service Pricing
  const servicePriceBase = costs.hourlyRate * costs.hoursPerProject;
  const servicePriceWithMargin = servicePriceBase * (1 + costs.desiredProfitMargin / 100);
  const servicePriceValue = costs.competitors * costs.valueMultiplier;

  // Subscription Pricing
  const subBasePrice = costs.variableCostPerUnit;
  const subWithMargin = subBasePrice * (1 + costs.desiredProfitMargin / 100);
  const annualRevenue = subWithMargin * 12;
  const subsForTarget = Math.ceil(costs.targetMonthlyRevenue / subWithMargin);

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          Pricing Calculator
        </h3>
        <div className="flex gap-3">
          {[
            { id: 'product' as const, label: '🛍️ Produk Fisik/Digital', desc: 'Hitung harga jual produk' },
            { id: 'service' as const, label: '💼 Jasa/Freelance', desc: 'Hitung rate jasa Anda' },
            { id: 'subscription' as const, label: '🔄 Subscription/SaaS', desc: 'Hitung harga langganan' },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setPricingType(type.id)}
              className={`flex-1 p-4 rounded-xl text-left transition-all ${
                pricingType === type.id
                  ? 'bg-cyan-500/20 border border-cyan-500/40'
                  : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <p className={`text-sm font-medium ${pricingType === type.id ? 'text-cyan-300' : 'text-slate-300'}`}>{type.label}</p>
              <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Parameters */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-400 mb-4">Input Parameter</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pricingType === 'product' && (
            <>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Fixed Costs/Bulan (Rp)</label>
                <input type="number" value={costs.fixedCosts} onChange={e => setCosts({...costs, fixedCosts: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Variable Cost/Unit (Rp)</label>
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
                <label className="text-xs text-slate-400 mb-1 block">Hourly Rate Anda (Rp/jam)</label>
                <input type="number" value={costs.hourlyRate} onChange={e => setCosts({...costs, hourlyRate: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Estimasi Jam/Project</label>
                <input type="number" value={costs.hoursPerProject} onChange={e => setCosts({...costs, hoursPerProject: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Desired Margin (%)</label>
                <input type="number" value={costs.desiredProfitMargin} onChange={e => setCosts({...costs, desiredProfitMargin: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Harga Kompetitor (Rp)</label>
                <input type="number" value={costs.competitors} onChange={e => setCosts({...costs, competitors: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Value Multiplier</label>
                <input type="number" step="0.1" value={costs.valueMultiplier} onChange={e => setCosts({...costs, valueMultiplier: parseFloat(e.target.value) || 1})}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none" />
              </div>
            </>
          )}
          {pricingType === 'subscription' && (
            <>
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
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pricingType === 'product' && (
          <>
            <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
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
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Pricing Strategies
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Penetration Pricing', price: productPrice * 0.7, desc: 'Masuk market dengan harga rendah' },
                  { name: 'Competitive Pricing', price: productPrice, desc: 'Harga berdasarkan cost + margin' },
                  { name: 'Premium Pricing', price: productPrice * 1.5, desc: 'Posisi sebagai premium brand' },
                  { name: 'Value-Based', price: productPrice * 2, desc: 'Berdasarkan value ke customer' },
                ].map((strategy, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <div>
                      <p className="text-sm text-white">{strategy.name}</p>
                      <p className="text-xs text-slate-500">{strategy.desc}</p>
                    </div>
                    <p className="text-sm font-medium text-cyan-400">{formatCurrency(Math.round(strategy.price))}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {pricingType === 'service' && (
          <>
            <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
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
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> Pricing Tiers
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Basic', price: servicePriceWithMargin * 0.6, features: ['Core service', '1 revision', '7 hari delivery'] },
                  { name: 'Standard', price: servicePriceWithMargin, features: ['Full service', '3 revisions', '5 hari delivery', 'Support 30 hari'], popular: true },
                  { name: 'Premium', price: servicePriceWithMargin * 1.8, features: ['Everything in Standard', 'Unlimited revisions', '3 hari delivery', 'Priority support', 'Bonus deliverables'] },
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
                        <p key={j} className="text-xs text-slate-400 flex items-center gap-1">
                          <span className="text-emerald-400">✓</span> {f}
                        </p>
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
            <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
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
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Subscription Tiers
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Starter', price: subWithMargin * 0.5, period: '/bulan' },
                  { name: 'Pro', price: subWithMargin, period: '/bulan', popular: true },
                  { name: 'Enterprise', price: subWithMargin * 3, period: '/bulan' },
                  { name: 'Annual Pro', price: subWithMargin * 10, period: '/tahun (hemat 17%)' },
                ].map((tier, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${tier.popular ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/30 border-slate-700/30'}`}>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white">{tier.name}</p>
                      {tier.popular && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">Popular</span>}
                    </div>
                    <p className="text-sm">
                      <span className="font-bold text-emerald-400">{formatCurrency(Math.round(tier.price))}</span>
                      <span className="text-xs text-slate-500">{tier.period}</span>
                    </p>
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
