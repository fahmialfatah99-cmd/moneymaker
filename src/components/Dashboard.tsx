import { DollarSign, TrendingUp, Users, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { month: 'Jan', income: 2400, expense: 800 },
  { month: 'Feb', income: 3200, expense: 900 },
  { month: 'Mar', income: 4100, expense: 1100 },
  { month: 'Apr', income: 3800, expense: 950 },
  { month: 'May', income: 5200, expense: 1200 },
  { month: 'Jun', income: 6100, expense: 1400 },
  { month: 'Jul', income: 7500, expense: 1600 },
];

const toolUsageData = [
  { name: 'Invoice', count: 45 },
  { name: 'Content', count: 38 },
  { name: 'SEO', count: 32 },
  { name: 'Email', count: 28 },
  { name: 'Pricing', count: 22 },
];

interface DashboardProps {
  tools: { id: string; name: string; icon: any; desc: string }[];
  setActiveTool: (id: string) => void;
}

export default function Dashboard({ tools, setActiveTool }: DashboardProps) {
  const stats = [
    { label: 'Total Income', value: 'Rp 32.300.000', change: '+23.5%', up: true, icon: DollarSign, color: 'from-emerald-500 to-green-500' },
    { label: 'Active Projects', value: '12', change: '+3', up: true, icon: Users, color: 'from-indigo-500 to-purple-500' },
    { label: 'Growth Rate', value: '45.2%', change: '+12.3%', up: true, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    { label: 'Tools Used', value: '8/9', change: '+2', up: true, icon: Zap, color: 'from-pink-500 to-rose-500' },
  ];

  const recentActivities = [
    { text: 'Invoice #042 dikirim ke Klien ABC', time: '2 menit lalu', amount: '+Rp 5.000.000', type: 'income' },
    { text: 'Blog post "10 Tips SEO" dipublish', time: '1 jam lalu', amount: 'Potential +Rp 500.000', type: 'content' },
    { text: 'Email campaign dikirim ke 1,200 subscriber', time: '3 jam lalu', amount: 'CTR: 4.2%', type: 'email' },
    { text: 'Project "Website Redesign" completed', time: '1 hari lalu', amount: '+Rp 8.000.000', type: 'income' },
    { text: 'Affiliate link menghasilkan 15 konversi', time: '2 hari lalu', amount: '+Rp 750.000', type: 'affiliate' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-medium flex items-center gap-1 ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="income" stroke="#6366f1" fill="url(#colorIncome)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#10b981" fill="url(#colorExpense)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tool Usage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={toolUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Access Tools */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Access Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {tools.filter(t => t.id !== 'dashboard').map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-indigo-500/10 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-200 text-left"
                >
                  <Icon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300 truncate">{tool.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div>
                  <p className="text-sm text-slate-300">{activity.text}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                  activity.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' :
                  activity.type === 'content' ? 'bg-blue-500/10 text-blue-400' :
                  activity.type === 'email' ? 'bg-purple-500/10 text-purple-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>
                  {activity.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Money Making Tips */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          Tips Menghasilkan Uang dengan Tools Ini
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Freelance dengan Invoice Pro', desc: 'Gunakan Invoice Generator untuk terlihat profesional dan dibayar lebih cepat', earning: 'Rp 5-50jt/bulan' },
            { title: 'Content Marketing', desc: 'Buat konten berkualitas untuk menarik klien dan monetisasi via ads/affiliate', earning: 'Rp 2-20jt/bulan' },
            { title: 'Email Marketing', desc: 'Bangun email list dan kirim campaign untuk konversi penjualan', earning: 'Rp 3-30jt/bulan' },
            { title: 'SEO & Blogging', desc: 'Optimasi SEO untuk traffic organik dan monetisasi konten', earning: 'Rp 1-15jt/bulan' },
            { title: 'Digital Products', desc: 'Hitung harga ideal dengan Pricing Calculator untuk produk digital', earning: 'Rp 5-100jt/bulan' },
            { title: 'Multiple Side Hustles', desc: 'Kelola beberapa sumber pendapatan sekaligus dengan tracker', earning: 'Rp 3-25jt/bulan' },
          ].map((tip, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-emerald-500/30 transition-all">
              <h4 className="text-sm font-semibold text-white">{tip.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{tip.desc}</p>
              <p className="text-xs text-emerald-400 font-medium mt-2">💰 {tip.earning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
