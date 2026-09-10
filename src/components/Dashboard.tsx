import { DollarSign, TrendingUp, Users, Zap, ArrowUpRight, Settings, Sparkles, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useApi } from '../context/ApiContext';

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
  { name: 'Content AI', count: 45 },
  { name: 'Email AI', count: 38 },
  { name: 'SEO AI', count: 32 },
  { name: 'Invoice', count: 28 },
  { name: 'Pricing AI', count: 22 },
];

interface DashboardProps {
  tools: { id: string; name: string; icon: any; desc: string }[];
  setActiveTool: (id: string) => void;
}

export default function Dashboard({ tools, setActiveTool }: DashboardProps) {
  const { isConfigured, models } = useApi();

  const stats = [
    { label: 'Total Income', value: 'Rp 32.300.000', change: '+23.5%', up: true, icon: DollarSign, color: 'from-emerald-500 to-green-500' },
    { label: 'Active Projects', value: '12', change: '+3', up: true, icon: Users, color: 'from-indigo-500 to-purple-500' },
    { label: 'Growth Rate', value: '45.2%', change: '+12.3%', up: true, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    { label: 'AI Tools Active', value: isConfigured ? `${models.length || '60+'} models` : 'Not Connected', change: isConfigured ? 'Online' : 'Setup needed', up: isConfigured, icon: Zap, color: 'from-pink-500 to-rose-500' },
  ];

  const recentActivities = [
    { text: 'AI generated 5 blog posts about digital marketing', time: '2 menit lalu', amount: 'Potential +Rp 2jt', type: 'ai' },
    { text: 'Invoice #042 dikirim ke Klien ABC', time: '15 menit lalu', amount: '+Rp 5.000.000', type: 'income' },
    { text: 'AI analyzed portfolio & recommended optimization', time: '1 jam lalu', amount: 'Insight', type: 'ai' },
    { text: 'Email campaign generated & sent to 1,200 subscribers', time: '3 jam lalu', amount: 'CTR: 4.2%', type: 'email' },
    { text: 'SEO meta tags generated untuk 10 pages', time: '5 jam lalu', amount: 'SEO Score: 92', type: 'ai' },
  ];

  return (
    <div className="space-y-6">
      {/* Setup Banner */}
      {!isConfigured && (
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-300">Setup 9Router untuk Mengaktifkan Semua Fitur AI</h3>
            <p className="text-sm text-slate-400 mt-1">
              Hubungkan 9Router API untuk mengaktifkan AI Content Generator, Email Template, SEO Generator, dan semua fitur AI-powered lainnya.
            </p>
          </div>
          <button onClick={() => setActiveTool('settings')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-all text-sm font-medium flex-shrink-0">
            <Settings className="w-4 h-4" /> Setup Now
          </button>
        </div>
      )}

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
                <span className={`text-xs font-medium flex items-center gap-1 ${stat.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : null}
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
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} labelStyle={{ color: '#e2e8f0' }} />
              <Area type="monotone" dataKey="income" stroke="#6366f1" fill="url(#colorIncome)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#10b981" fill="url(#colorExpense)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI Tool Usage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={toolUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
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
            {tools.filter(t => t.id !== 'dashboard' && t.id !== 'settings').map((tool) => {
              const Icon = tool.icon;
              const isAI = ['content', 'email', 'seo', 'invoice', 'pricing', 'freelance', 'passive', 'hustle'].includes(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-indigo-500/10 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-200 text-left"
                >
                  <Icon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-slate-300 truncate">{tool.name}</span>
                      {isAI && <Sparkles className="w-3 h-3 text-purple-400 flex-shrink-0" />}
                    </div>
                  </div>
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
                  activity.type === 'ai' ? 'bg-purple-500/10 text-purple-400' :
                  activity.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' :
                  activity.type === 'email' ? 'bg-blue-500/10 text-blue-400' :
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
          Cara Menghasilkan Uang dengan AI Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'AI Content Marketing', desc: 'Gunakan AI Content Generator untuk buat blog, social media, dan ad copy yang converting', earning: 'Rp 5-30jt/bulan', tool: 'content' },
            { title: 'AI Email Marketing', desc: 'Build email list dan kirim campaign yang dibuat AI untuk konversi tinggi', earning: 'Rp 3-25jt/bulan', tool: 'email' },
            { title: 'AI SEO & Blogging', desc: 'Generate SEO meta tags dan konten yang ranking di Google untuk traffic organik', earning: 'Rp 2-20jt/bulan', tool: 'seo' },
            { title: 'Freelance dengan AI', desc: 'Gunakan AI untuk generate proposal, email klien, dan analisis bisnis', earning: 'Rp 10-50jt/bulan', tool: 'freelance' },
            { title: 'Digital Products', desc: 'AI Pricing Calculator untuk hitung harga optimal produk digital Anda', earning: 'Rp 5-100jt/bulan', tool: 'pricing' },
            { title: 'Multiple Income Streams', desc: 'AI Side Hustle Tracker untuk kelola dan optimize semua sumber income', earning: 'Rp 10-50jt/bulan', tool: 'hustle' },
          ].map((tip, i) => (
            <div key={i} onClick={() => setActiveTool(tip.tool)} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-emerald-500/30 transition-all cursor-pointer">
              <h4 className="text-sm font-semibold text-white flex items-center gap-1">{tip.title} <Sparkles className="w-3 h-3 text-purple-400" /></h4>
              <p className="text-xs text-slate-400 mt-1">{tip.desc}</p>
              <p className="text-xs text-emerald-400 font-medium mt-2">💰 {tip.earning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
