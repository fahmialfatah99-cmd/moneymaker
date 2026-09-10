import { useState } from 'react';
import {
  DollarSign, FileText, TrendingUp, Calendar,
  Mail, Search, Calculator, Zap, Menu, X,
  BarChart3, Target, Briefcase, Globe
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import InvoiceGenerator from './components/InvoiceGenerator';
import PassiveIncomeCalc from './components/PassiveIncomeCalc';
import SideHustleTracker from './components/SideHustleTracker';
import ContentGenerator from './components/ContentGenerator';
import EmailTemplate from './components/EmailTemplate';
import SEOGenerator from './components/SEOGenerator';
import PricingCalc from './components/PricingCalc';
import FreelanceTracker from './components/FreelanceTracker';

const tools = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, desc: 'Overview semua tools & earning' },
  { id: 'invoice', name: 'Invoice Generator', icon: FileText, desc: 'Buat invoice profesional untuk klien' },
  { id: 'passive', name: 'Passive Income Calc', icon: TrendingUp, desc: 'Hitung potensi passive income' },
  { id: 'hustle', name: 'Side Hustle Tracker', icon: Target, desc: 'Track pendapatan side hustle' },
  { id: 'content', name: 'Content Generator', icon: Zap, desc: 'Generate konten marketing & blog' },
  { id: 'email', name: 'Email Template', icon: Mail, desc: 'Buat template email marketing' },
  { id: 'seo', name: 'SEO Meta Generator', icon: Search, desc: 'Generate meta tags SEO optimal' },
  { id: 'pricing', name: 'Pricing Calculator', icon: Calculator, desc: 'Hitung harga produk/jasa ideal' },
  { id: 'freelance', name: 'Freelance Manager', icon: Briefcase, desc: 'Kelola project & klien freelance' },
];

function App() {
  const [activeTool, setActiveTool] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">MoneyMaker Pro</h1>
              <p className="text-xs text-slate-400">Tools & Automation</p>
            </div>
          </div>

          <nav className="space-y-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
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
                  <div>
                    <p className="text-sm font-medium">{tool.name}</p>
                    <p className="text-xs opacity-60 hidden xl:block">{tool.desc}</p>
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
                <h2 className="text-lg font-semibold text-white">
                  {tools.find(t => t.id === activeTool)?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-slate-400">
                  {tools.find(t => t.id === activeTool)?.desc}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-medium">Pro Plan</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
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

export default App;
