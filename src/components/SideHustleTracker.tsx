import { useState } from 'react';
import { useApi } from '../context/ApiContext';
import { generate } from '../services/api';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar, Zap, Loader2, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HustleEntry {
  id: number;
  name: string;
  category: string;
  income: number;
  expense: number;
  hours: number;
  date: string;
  status: 'active' | 'paused' | 'completed';
}

export default function SideHustleTracker() {
  const { isConfigured } = useApi();
  const [entries, setEntries] = useState<HustleEntry[]>([
    { id: 1, name: 'Freelance Web Dev', category: 'Freelance', income: 8000000, expense: 500000, hours: 40, date: '2024-01-15', status: 'active' },
    { id: 2, name: 'YouTube Channel', category: 'Content', income: 2500000, expense: 300000, hours: 20, date: '2024-01-15', status: 'active' },
    { id: 3, name: 'Jual E-book', category: 'Digital Product', income: 1500000, expense: 100000, hours: 5, date: '2024-01-10', status: 'active' },
    { id: 4, name: 'Affiliate Marketing', category: 'Affiliate', income: 750000, expense: 200000, hours: 10, date: '2024-01-12', status: 'active' },
    { id: 5, name: 'Kursus Online', category: 'Education', income: 3000000, expense: 500000, hours: 15, date: '2024-01-08', status: 'active' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<HustleEntry, 'id'>>({
    name: '', category: '', income: 0, expense: 0, hours: 0, date: new Date().toISOString().split('T')[0], status: 'active'
  });

  const addEntry = () => {
    if (newEntry.name) {
      setEntries([...entries, { ...newEntry, id: Date.now() }]);
      setNewEntry({ name: '', category: '', income: 0, expense: 0, hours: 0, date: new Date().toISOString().split('T')[0], status: 'active' });
      setShowForm(false);
    }
  };

  const removeEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const totalIncome = entries.reduce((sum, e) => sum + e.income, 0);
  const totalExpense = entries.reduce((sum, e) => sum + e.expense, 0);
  const totalProfit = totalIncome - totalExpense;
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const hourlyRate = totalHours > 0 ? totalProfit / totalHours : 0;

  const chartData = entries.map(e => ({
    name: e.name.length > 12 ? e.name.substring(0, 12) + '...' : e.name,
    profit: e.income - e.expense,
    income: e.income,
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const categories = ['Freelance', 'Content', 'Digital Product', 'Affiliate', 'Education', 'E-commerce', 'Investasi', 'Lainnya'];

  // AI: Analyze side hustle portfolio
  const aiAnalyzeHustles = async () => {
    if (!isConfigured) return;
    setAiLoading(true);
    try {
      const result = await generate(
        `Analisis portfolio side hustle saya:

${entries.map(e => `- ${e.name} (${e.category}): Income ${formatCurrency(e.income)}, Expense ${formatCurrency(e.expense)}, ${e.hours} jam/bulan, Profit ${formatCurrency(e.income - e.expense)}, Rate ${formatCurrency(Math.round((e.income - e.expense) / (e.hours || 1)))}/jam`).join('\n')}

Total Income: ${formatCurrency(totalIncome)}
Total Profit: ${formatCurrency(totalProfit)}
Total Hours: ${totalHours} jam/bulan
Average Rate: ${formatCurrency(Math.round(hourlyRate))}/jam

Berikan analisis:
1. Hustle paling profitable (by profit & by hourly rate)
2. Hustle yang harus di-scale up vs di-cut
3. Rekomendasi side hustle baru yang cocok
4. Strategi untuk mencapai Rp 50jt/bulan dari side hustles
5. Time allocation optimization
6. Automation opportunities
7. Risk diversification assessment

Berikan insight yang spesifik dan actionable.`,
        'Kamu adalah side hustle expert dan business strategist. Berikan analisis yang data-driven dan actionable.'
      );
      setAiInsight(result);
    } catch (err: any) {
      setAiInsight('Error: ' + err.message);
    }
    setAiLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-emerald-400" /><span className="text-sm text-slate-400">Total Income</span></div>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-5 h-5 text-red-400" /><span className="text-sm text-slate-400">Total Expense</span></div>
          <p className="text-xl font-bold text-red-400">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-indigo-400" /><span className="text-sm text-slate-400">Net Profit</span></div>
          <p className="text-xl font-bold text-indigo-400">{formatCurrency(totalProfit)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2"><Calendar className="w-5 h-5 text-amber-400" /><span className="text-sm text-slate-400">Rate/Jam</span></div>
          <p className="text-xl font-bold text-amber-400">{formatCurrency(Math.round(hourlyRate))}</p>
        </div>
      </div>

      {/* AI Analysis */}
      {isConfigured && (
        <div className="glass-card rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Side Hustle Strategist
            </h3>
            <button onClick={aiAnalyzeHustles} disabled={aiLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50">
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {aiLoading ? 'Analyzing...' : 'Analyze Portfolio'}
            </button>
          </div>
          {aiInsight && (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed mt-3">{aiInsight}</pre>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Profit per Side Hustle</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v/1000000).toFixed(1)}jt`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
            <Bar dataKey="profit" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Entries */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Daftar Side Hustle</h3>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition-all">
            <Plus className="w-4 h-4" /> Tambah Hustle
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-indigo-500/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input type="text" placeholder="Nama side hustle" value={newEntry.name} onChange={e => setNewEntry({...newEntry, name: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
              <select value={newEntry.category} onChange={e => setNewEntry({...newEntry, category: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none">
                <option value="">Pilih Kategori</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Income (Rp)" value={newEntry.income || ''} onChange={e => setNewEntry({...newEntry, income: parseInt(e.target.value) || 0})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
              <input type="number" placeholder="Expense (Rp)" value={newEntry.expense || ''} onChange={e => setNewEntry({...newEntry, expense: parseInt(e.target.value) || 0})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
              <input type="number" placeholder="Jam/bulan" value={newEntry.hours || ''} onChange={e => setNewEntry({...newEntry, hours: parseInt(e.target.value) || 0})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
              <input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={addEntry} className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-all">Simpan</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-all">Batal</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/20 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-white">{entry.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${entry.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : entry.status === 'paused' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'}`}>{entry.status}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">{entry.category}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span>Income: <span className="text-emerald-400">{formatCurrency(entry.income)}</span></span>
                  <span>Expense: <span className="text-red-400">{formatCurrency(entry.expense)}</span></span>
                  <span>Hours: {entry.hours}h</span>
                  <span>Rate: <span className="text-amber-400">{formatCurrency(Math.round((entry.income - entry.expense) / (entry.hours || 1)))}/jam</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span className="text-sm font-medium text-emerald-400">{formatCurrency(entry.income - entry.expense)}</span>
                <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
