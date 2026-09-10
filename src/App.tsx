import { useState } from 'react';
import {
  DollarSign, FileText, TrendingUp, Target,
  Mail, Search, Calculator, Zap, Menu, X,
  BarChart3, Briefcase, Globe, Settings, Sparkles
} from 'lucide-react';
import { ApiProvider, useApi } from './context/ApiContext';
import Dashboard from './components/Dashboard';
import InvoiceGenerator from './components/InvoiceGenerator';
import PassiveIncomeCalc from './components/PassiveIncomeCalc';
import SideHustleTracker from './components/SideHustleTracker';
import ContentGenerator from './components/ContentGenerator';
import EmailTemplate from './components/EmailTemplate';
import SEOGenerator from './components/SEOGenerator';
import PricingCalc from './components/PricingCalc';
import FreelanceTracker from './components/FreelanceTracker';
import SettingsPanel from './components/Settings';

const tools = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, desc: 'Overview semua tools & earning' },
  { id: 'content', name: 'AI Content Generator', icon: Zap, desc: 'Generate konten marketing dengan AI' },
  { id: 'email', name: 'AI Email Template', icon: Mail, desc: 'Buat template email marketing dengan AI' },
  { id: 'seo', name: 'AI SEO Generator', icon: Search, desc: 'Generate meta tags SEO optimal dengan AI' },
  { id: 'invoice', name: 'Invoice Generator', icon: FileText, desc: 'Buat invoice profesional (AI enhanced)' },
  { id: 'pricing', name: 'AI Pricing Calculator', icon: Calculator, desc: 'Hitung harga produk/jasa ideal + AI strategy' },
  { id: 'freelance', name: 'AI Freelance Manager', icon: Briefcase, desc: 'Kelola project & AI proposal generator' },
  { id: 'passive', name: 'AI Passive Income Calc', icon: TrendingUp, desc: 'Hitung potensi passive income + AI analysis' },
  { id: 'hustle', name: 'AI Side Hustle Tracker', icon: Target, desc: 'Track pendapatan + AI strategist' },
  { id: 'settings', name: 'Settings', icon: Settings, desc: 'Konfigurasi 9Router API' },
];

function AppContent() {
  const [activeTool, setActiveTool] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConfigured, models } = useApi();

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard': return <Dashboard tools={tools} setActiveTool={setActiveTool} />;
      case 'invoice': return <InvoiceGenerator />;
      case 'passive': return <PassiveIncomeCalc />;
      case 'hustle': return <SideHustleTracker />;
      case 'content': return <ContentGenerator />;
      case 'email': return <EmailTemplate />;
      case 'seo': return <SEOGenerator />;
      case 'pricing': return <PricingCalc />;
      case 'freelance': return <FreelanceTracker />;
      case 'settings': return <SettingsPanel />;
      default: return <Dashboard tools={tools} setActiveTool={setActiveTool} />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 glass-card border-r border-indigo-500/10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">MoneyMaker Pro</h1>
              <p className="text-xs text-slate-400">AI-Powered Tools</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className={`mb-4 px-3 py-2 rounded-lg border text-xs flex items-center gap-2 ${isConfigured ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'}`}>
            <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {isConfigured ? `${models.length} models • 9Router Active` : '9Router Not Connected'}
          </div>

          <nav className="space-y-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isAI = ['content', 'email', 'seo', 'invoice', 'pricing', 'freelance', 'passive', 'hustle'].includes(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => { setActiveTool(tool.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTool === tool.id
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium truncate">{tool.name}</p>
                      {isAI && <Sparkles className="w-3 h-3 text-purple-400 flex-shrink-0" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-card border-b border-indigo-500/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-slate-400 hover:text-white">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">
                    {tools.find(t => t.id === activeTool)?.name || 'Dashboard'}
                  </h2>
                  {['content', 'email', 'seo', 'invoice', 'pricing', 'freelance', 'passive', 'hustle'].includes(activeTool) && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">
                  {tools.find(t => t.id === activeTool)?.desc}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border ${isConfigured ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                <Globe className={`w-4 h-4 ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className={`text-sm font-medium ${isConfigured ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {isConfigured ? '9Router Connected' : 'Setup Required'}
                </span>
              </div>
              <button onClick={() => { setActiveTool('settings'); setSidebarOpen(false); }}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-all">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8 slide-in">
          {renderTool()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  );
}

export default App;
