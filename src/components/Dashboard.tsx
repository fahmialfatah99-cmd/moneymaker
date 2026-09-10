import { useMemo } from 'react';
import {
  DollarSign, TrendingUp, Users, Zap, ArrowUpRight, Settings, Sparkles, AlertTriangle, Activity
} from 'lucide-react';
import { useApi } from '../context/ApiContext';

interface DashboardProps {
  tools: { id: string; name: string; icon: any; desc: string }[];
  setActiveTool: (id: string) => void;
}

export default function Dashboard({ tools, setActiveTool }: DashboardProps) {
  const { isConfigured, models } = useApi();

  const { totalIncome, activeProjectsCount, sideHustleCount, recentActivities } = useMemo(() => {
    let freelanceEarned = 0;
    let activeProjects = 0;
    let projectsList: any[] = [];
    try {
      const savedProjects = localStorage.getItem('moneymaker_freelance_projects');
      if (savedProjects) {
        projectsList = JSON.parse(savedProjects);
        freelanceEarned = projectsList
          .filter((p: any) => ['completed', 'paid'].includes(p.status))
          .reduce((sum: number, p: any) => sum + (p.budget || 0), 0);
        activeProjects = projectsList
          .filter((p: any) => ['in_progress', 'review', 'proposal'].includes(p.status)).length;
      }
    } catch {}

    let hustleProfit = 0;
    let activeHustles = 0;
    let hustlesList: any[] = [];
    try {
      const savedHustles = localStorage.getItem('moneymaker_side_hustles');
      if (savedHustles) {
        hustlesList = JSON.parse(savedHustles);
        hustleProfit = hustlesList.reduce((sum: number, h: any) => sum + ((h.income || 0) - (h.expense || 0)), 0);
        activeHustles = hustlesList.filter((h: any) => h.status === 'active').length;
      }
    } catch {}

    const total = freelanceEarned + hustleProfit;

    const activities: { text: string; time: string; badge: string; type: string }[] = [];

    projectsList.slice(-3).reverse().forEach((p: any) => {
      activities.push({
        text: `Project: ${p.name} (${p.client || 'Klien'})`,
        time: p.deadline ? `Deadline: ${p.deadline}` : 'Freelance',
        badge: p.status.toUpperCase(),
        type: 'income',
      });
    });

    hustlesList.slice(-3).reverse().forEach((h: any) => {
      activities.push({
        text: `Side Hustle: ${h.name}`,
        time: h.category || 'Hustle',
        badge: h.income ? `Rp ${(h.income / 1000).toFixed(0)}k` : 'Active',
        type: 'ai',
      });
    });

    return {
      totalIncome: total,
      activeProjectsCount: activeProjects,
      sideHustleCount: activeHustles,
      recentActivities: activities.slice(0, 5),
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const stats = [
    { label: 'Total Income', value: formatCurrency(totalIncome), change: totalIncome > 0 ? 'Active' : 'Rp 0', icon: DollarSign, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Active Projects', value: String(activeProjectsCount), change: `${activeProjectsCount} Project`, icon: Users, gradient: 'from-indigo-500 to-purple-600' },
    { label: 'Active Side Hustles', value: String(sideHustleCount), change: `${sideHustleCount} Hustle`, icon: TrendingUp, gradient: 'from-amber-500 to-orange-600' },
    { label: 'AI Models', value: isConfigured ? `${models.length || '60+'}` : 'N/A', change: isConfigured ? 'Online' : 'Setup', icon: Zap, gradient: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="space-y-5">
      {/* Setup Banner */}
      {!isConfigured && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-amber-300 mb-1">Setup 9Router Required</h3>
            <p className="text-xs text-slate-400 mb-3">
              Connect 9Router API to enable all AI-powered features including Content Generator, Email Templates, SEO Analysis, and more.
            </p>
            <button 
              onClick={() => setActiveTool('settings')} 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 text-xs font-medium"
            >
              <Settings className="w-3.5 h-3.5" />
              Setup Now
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 hover:border-slate-700/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-xl font-bold text-white mb-0.5">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quick Access */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            Quick Access Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tools.filter(t => !['dashboard', 'settings'].includes(t.id)).map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-indigo-500/5 border border-slate-800/50 hover:border-indigo-500/20 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center group-hover:bg-indigo-500/10">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300 group-hover:text-white truncate">{tool.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{tool.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-slate-500 bg-slate-800/20 rounded-lg border border-dashed border-slate-800">
              <Activity className="w-6 h-6 mx-auto mb-1.5 text-slate-600" />
              <p className="text-xs text-slate-400">Belum ada aktivitas</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Tambahkan data di Freelance Manager atau Side Hustle Tracker</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/20 border border-slate-800/30">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-xs text-slate-300 truncate">{activity.text}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{activity.time}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 ${
                    activity.type === 'ai' ? 'bg-purple-500/10 text-purple-400' :
                    activity.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' :
                    activity.type === 'email' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {activity.badge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Money Making Guide */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          How to Make Money with AI Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'AI Content Marketing', desc: 'Generate blog posts, social media content, and ad copy that converts', earning: 'Rp 5-30jt/mo', tool: 'content' },
            { title: 'AI Email Marketing', desc: 'Build email lists and send campaigns with AI-generated templates', earning: 'Rp 3-25jt/mo', tool: 'email' },
            { title: 'AI SEO & Blogging', desc: 'Optimize for Google ranking with AI-generated meta tags and content', earning: 'Rp 2-20jt/mo', tool: 'seo' },
            { title: 'Freelance with AI', desc: 'Use AI to generate winning proposals and client communications', earning: 'Rp 10-50jt/mo', tool: 'freelance' },
            { title: 'Digital Products', desc: 'Use AI Pricing Calculator to optimize your digital product pricing', earning: 'Rp 5-100jt/mo', tool: 'pricing' },
            { title: 'Multiple Income Streams', desc: 'Track and optimize all your side hustles with AI analysis', earning: 'Rp 10-50jt/mo', tool: 'hustle' },
          ].map((tip, i) => (
            <button
              key={i}
              onClick={() => setActiveTool(tip.tool)}
              className="p-3 rounded-lg bg-slate-800/30 border border-slate-800/50 hover:border-emerald-500/20 transition-all text-left group"
            >
              <h4 className="text-xs font-semibold text-white mb-1 flex items-center gap-1">
                {tip.title}
                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
              </h4>
              <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{tip.desc}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">💰 {tip.earning}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
