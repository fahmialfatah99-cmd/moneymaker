import {
  DollarSign, FileText, TrendingUp, Target,
  Mail, Search, Calculator, Zap, Menu, X,
  BarChart3, Briefcase, Globe, Settings, Sparkles, ShoppingCart
} from 'lucide-react';
import { useState } from 'react';
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
import AffiliateFinder from './components/AffiliateFinder';
import VideoPromoter from './components/VideoPromoter';

const tools = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, desc: 'Overview semua tools & earning' },
  { id: 'affiliate', name: 'AI Affiliate Finder', icon: ShoppingCart, desc: 'Cari produk affiliate trending dengan AI' },
  { id: 'video', name: 'AI Video Promoter', icon: Zap, desc: 'Buat prompt video promosi 1 menit (6 scene x 10 detik)' },
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
      case 'affiliate': return <AffiliateFinder />;
      case 'video': return <VideoPromoter />;
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

  const currentTool = tools.find(t => t.id === activeTool);
  const isAITool = ['content', 'email', 'seo', 'invoice', 'pricing', 'freelance', 'passive', 'hustle', 'affiliate', 'video'].includes(activeTool);

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        h-screen w-72 
        bg-[#0f172a]/95 backdrop-blur-xl
        border-r border-slate-800/50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-800/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">MoneyMaker Pro</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">AI-Powered Tools</p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="px-5 py-3 border-b border-slate-800/50 flex-shrink-0">
          <div className={`
            px-3 py-2 rounded-lg border text-xs flex items-center gap-2
            ${isConfigured 
              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
              : 'bg-amber-500/5 border-amber-500/20 text-amber-400'}
          `}>
            <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-medium">
              {isConfigured ? `${models.length || '60+'} models • Connected` : 'Not Connected'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            const hasAI = !['dashboard', 'settings'].includes(tool.id);

            return (
              <button
                key={tool.id}
                onClick={() => { setActiveTool(tool.id); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'}
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate">{tool.name}</span>
                    {hasAI && <Sparkles className="w-3 h-3 text-purple-400/70 flex-shrink-0" />}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/50 flex-shrink-0">
          <div className="text-[10px] text-slate-600 text-center">
            v2.0 • Powered by 9Router
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="px-4 md:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-semibold text-white truncate">
                    {currentTool?.name}
                  </h2>
                  {isAITool && (
                    <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-medium">
                      <Sparkles className="w-2.5 h-2.5" /> AI
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate hidden sm:block">{currentTool?.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                isConfigured 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
              }`}>
                <Globe className="w-3.5 h-3.5" />
                <span>{isConfigured ? '9Router Active' : 'Setup Required'}</span>
              </div>
              <button 
                onClick={() => { setActiveTool('settings'); setSidebarOpen(false); }}
                className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/50"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full slide-in" key={activeTool}>
            {renderTool()}
          </div>
        </main>
      </div>
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
