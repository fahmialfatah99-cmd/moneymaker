import { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { generate } from '../services/api';
import { TrendingUp, Calculator, Target, DollarSign, Zap, Loader2, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface IncomeSource {
  id: number;
  name: string;
  initialInvestment: number;
  monthlyReturn: number;
  type: string;
}

export default function PassiveIncomeCalc() {
  const { isConfigured } = useApi();
  const [sources, setSources] = useState<IncomeSource[]>(() => {
    try {
      const saved = localStorage.getItem('moneymaker_passive_income_sources');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('moneymaker_passive_income_sources', JSON.stringify(sources));
    } catch {}
  }, [sources]);
  const [years, setYears] = useState(5);
  const [compoundRate, setCompoundRate] = useState(5);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const addSource = () => {
    setSources([...sources, { id: Date.now(), name: '', initialInvestment: 0, monthlyReturn: 0, type: 'other' }]);
  };

  const updateSource = (id: number, field: keyof IncomeSource, value: string | number) => {
    setSources(sources.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSource = (id: number) => {
    setSources(sources.filter(s => s.id !== id));
  };

  const totalMonthly = sources.reduce((sum, s) => sum + (s.initialInvestment * s.monthlyReturn / 100), 0);
  const totalAnnual = totalMonthly * 12;
  const totalInvestment = sources.reduce((sum, s) => sum + s.initialInvestment, 0);

  const projectionData = Array.from({ length: years + 1 }, (_, i) => {
    let total = 0;
    sources.forEach(s => {
      const monthlyIncome = s.initialInvestment * s.monthlyReturn / 100;
      const annualIncome = monthlyIncome * 12;
      total += annualIncome * Math.pow(1 + compoundRate / 100, i);
    });
    return { year: `Tahun ${i}`, income: Math.round(total / 12), annual: Math.round(total) };
  });

  const pieData = sources.map(s => ({
    name: s.name || 'Unnamed',
    value: Math.round(s.initialInvestment * s.monthlyReturn / 100),
  }));

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}jt`;
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  // AI: Analyze passive income portfolio
  const aiAnalyzePortfolio = async () => {
    if (!isConfigured) return;
    setAiLoading(true);
    try {
      const result = await generate(
        `Analisis portfolio passive income saya:

Sumber income:
${sources.map(s => `- ${s.name}: Investasi ${formatCurrency(s.initialInvestment)}, Return ${s.monthlyReturn}%/bulan = ${formatCurrency(s.initialInvestment * s.monthlyReturn / 100)}/bulan`).join('\n')}

Total Investasi: ${formatCurrency(totalInvestment)}
Total Income/Bulan: ${formatCurrency(totalMonthly)}
Total Income/Tahun: ${formatCurrency(totalAnnual)}
Compound Growth: ${compoundRate}%/tahun
Proyeksi: ${years} tahun

Berikan analisis:
1. Diversifikasi score (1-10)
2. Risk assessment per sumber income
3. Rekomendasi optimasi portfolio
4. Sumber passive income lain yang cocok untuk ditambahkan
5. Strategi untuk mencapai financial freedom
6. Warning/pitfalls yang harus dihindari
7. Action plan 30/60/90 hari

Berikan insight yang spesifik dan actionable.`,
        'Kamu adalah financial advisor expert di passive income dan financial freedom. Berikan analisis yang data-driven dan actionable.'
      );
      setAiInsight(result);
    } catch (err: any) {
      setAiInsight('Error: ' + err.message);
    }
    setAiLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><DollarSign className="w-5 h-5 text-emerald-400" /></div>
            <span className="text-sm text-slate-400">Income/Bulan</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalMonthly)}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-indigo-400" /></div>
            <span className="text-sm text-slate-400">Income/Tahun</span>
          </div>
          <p className="text-2xl font-bold text-indigo-400">{formatCurrency(totalAnnual)}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center"><Target className="w-5 h-5 text-amber-400" /></div>
            <span className="text-sm text-slate-400">Total Investasi</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{formatCurrency(totalInvestment)}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Proyeksi (Tahun)</label>
            <input type="range" min="1" max="20" value={years} onChange={e => setYears(parseInt(e.target.value))} className="w-40 accent-indigo-500" />
            <span className="text-sm text-indigo-300 ml-2">{years} tahun</span>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Compound Growth (%/tahun)</label>
            <input type="range" min="0" max="20" value={compoundRate} onChange={e => setCompoundRate(parseInt(e.target.value))} className="w-40 accent-emerald-500" />
            <span className="text-sm text-emerald-300 ml-2">{compoundRate}%</span>
          </div>
          {isConfigured && (
            <button onClick={aiAnalyzePortfolio} disabled={aiLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50">
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {aiLoading ? 'Analyzing...' : 'AI Portfolio Analysis'}
            </button>
          )}
        </div>
      </div>

      {/* AI Insight */}
      {aiInsight && (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Portfolio Analysis
          </h3>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{aiInsight}</pre>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sources */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              Sumber Passive Income
            </h3>
            <button onClick={addSource} className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm hover:bg-indigo-500/30 transition-all">+ Tambah</button>
          </div>

          <div className="space-y-3">
            {sources.length === 0 ? (
              <div className="text-center py-10 text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-800">
                <Calculator className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Belum ada sumber passive income</p>
                <p className="text-xs text-slate-600 mt-1">Klik "+ Tambah" untuk menambahkan sumber passive income Anda.</p>
              </div>
            ) : (
              sources.map(source => (
                <div key={source.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <input type="text" placeholder="Nama sumber income" value={source.name}
                      onChange={e => updateSource(source.id, 'name', e.target.value)}
                      className="bg-transparent text-white font-medium text-sm focus:outline-none border-b border-transparent focus:border-indigo-500 flex-1" />
                    <button onClick={() => removeSource(source.id)} className="text-red-400 hover:text-red-300 text-sm ml-2">✕</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-500">Investasi Awal</label>
                      <input type="number" value={source.initialInvestment || ''}
                        onChange={e => updateSource(source.id, 'initialInvestment', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Return/Bulan (%)</label>
                      <input type="number" step="0.1" value={source.monthlyReturn || ''}
                        onChange={e => updateSource(source.id, 'monthlyReturn', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Income/Bulan</label>
                      <p className="text-emerald-400 font-medium text-sm py-2">{formatCurrency(source.initialInvestment * source.monthlyReturn / 100)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Distribusi Income</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {pieData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs text-white font-medium">{formatCurrency(item.value)}/bln</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projection Chart */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Proyeksi Income ({years} Tahun)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
            <Line type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} name="Income/Bulan" />
            <Line type="monotone" dataKey="annual" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Income/Tahun" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
