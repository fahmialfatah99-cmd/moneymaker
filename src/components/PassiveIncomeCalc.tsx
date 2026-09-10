import { useState } from 'react';
import { TrendingUp, Calculator, Target, DollarSign } from 'lucide-react';
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
  const [sources, setSources] = useState<IncomeSource[]>([
    { id: 1, name: 'Dividen Saham', initialInvestment: 50000000, monthlyReturn: 2.5, type: 'investment' },
    { id: 2, name: 'Sewa Properti', initialInvestment: 500000000, monthlyReturn: 3, type: 'property' },
    { id: 3, name: 'Buku Digital', initialInvestment: 5000000, monthlyReturn: 8, type: 'digital' },
  ]);
  const [years, setYears] = useState(5);
  const [compoundRate, setCompoundRate] = useState(5);

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

  // Compound growth projection
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-slate-400">Income/Bulan</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalMonthly)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-sm text-slate-400">Income/Tahun</span>
          </div>
          <p className="text-2xl font-bold text-indigo-400">{formatCurrency(totalAnnual)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-sm text-slate-400">Total Investasi</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{formatCurrency(totalInvestment)}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Proyeksi (Tahun)</label>
            <input type="range" min="1" max="20" value={years} onChange={e => setYears(parseInt(e.target.value))}
              className="w-40 accent-indigo-500" />
            <span className="text-sm text-indigo-300 ml-2">{years} tahun</span>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Compound Growth (%/tahun)</label>
            <input type="range" min="0" max="20" value={compoundRate} onChange={e => setCompoundRate(parseInt(e.target.value))}
              className="w-40 accent-emerald-500" />
            <span className="text-sm text-emerald-300 ml-2">{compoundRate}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sources */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              Sumber Passive Income
            </h3>
            <button onClick={addSource} className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-sm hover:bg-indigo-500/30 transition-all">
              + Tambah Sumber
            </button>
          </div>

          <div className="space-y-3">
            {sources.map(source => (
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
                    <input type="number" value={source.initialInvestment}
                      onChange={e => updateSource(source.id, 'initialInvestment', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Return/Bulan (%)</label>
                    <input type="number" step="0.1" value={source.monthlyReturn}
                      onChange={e => updateSource(source.id, 'monthlyReturn', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Income/Bulan</label>
                    <p className="text-emerald-400 font-medium text-sm py-2">
                      {formatCurrency(source.initialInvestment * source.monthlyReturn / 100)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Distribusi Income</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
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
      <div className="glass-card rounded-2xl p-6">
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
