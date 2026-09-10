import { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { generate } from '../services/api';
import { Briefcase, Plus, Trash2, Clock, CheckCircle, AlertCircle, DollarSign, X, Zap, Loader2, Sparkles, Send } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  client: string;
  status: 'proposal' | 'in_progress' | 'review' | 'completed' | 'paid';
  budget: number;
  deadline: string;
  description: string;
}

export default function FreelanceTracker() {
  const { isConfigured } = useApi();
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('moneymaker_freelance_projects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('moneymaker_freelance_projects', JSON.stringify(projects));
    } catch {}
  }, [projects]);

  const [showAddProject, setShowAddProject] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    name: '', client: '', status: 'proposal', budget: 0, deadline: '', description: ''
  });
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState<'proposal' | 'email' | 'analysis'>('proposal');

  const addProject = () => {
    if (newProject.name && newProject.client) {
      setProjects([...projects, { ...newProject, id: Date.now() }]);
      setNewProject({ name: '', client: '', status: 'proposal', budget: 0, deadline: '', description: '' });
      setShowAddProject(false);
    }
  };

  const removeProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const updateStatus = (id: number, status: Project['status']) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status } : p));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const totalPipeline = projects.filter(p => ['proposal', 'in_progress', 'review'].includes(p.status)).reduce((sum, p) => sum + p.budget, 0);
  const totalEarned = projects.filter(p => ['completed', 'paid'].includes(p.status)).reduce((sum, p) => sum + p.budget, 0);
  const activeProjects = projects.filter(p => ['in_progress', 'review'].includes(p.status)).length;
  const pendingProposals = projects.filter(p => p.status === 'proposal').length;

  // AI Functions
  const aiGenerateProposal = async () => {
    if (!isConfigured) return;
    setAiLoading(true);
    const proposalProjects = projects.filter(p => p.status === 'proposal');
    try {
      const result = await generate(
        `Buatkan proposal freelance profesional untuk project berikut:

${proposalProjects.map(p => `- ${p.name} untuk ${p.client}: ${p.description} (Budget: ${formatCurrency(p.budget)}, Deadline: ${p.deadline})`).join('\n')}

Format proposal:
1. Opening yang personal dan engaging
2. Understanding of requirements
3. Proposed solution/approach
4. Timeline & milestones
5. Investment/pricing breakdown
6. Why choose me (value proposition)
7. Call to action

Tulis dalam bahasa Indonesia yang professional.`,
        'Kamu adalah freelance expert yang ahli menulis proposal yang winning. Buat proposal yang professional, persuasive, dan menunjukkan expertise.'
      );
      setAiOutput(result);
    } catch (err: any) {
      setAiOutput('Error: ' + err.message);
    }
    setAiLoading(false);
  };

  const aiGenerateClientEmail = async () => {
    if (!isConfigured) return;
    setAiLoading(true);
    try {
      const result = await generate(
        `Buatkan email follow-up profesional untuk klien freelance.

Active projects:
${projects.filter(p => p.status === 'in_progress').map(p => `- ${p.name} (${p.client}) - deadline ${p.deadline}`).join('\n')}

Buat email update progress yang:
- Professional tapi friendly
- Menunjukkan progress yang jelas
- Proaktif tentang next steps
- Menanyakan feedback jika perlu

Tulis dalam bahasa Indonesia.`,
        'Kamu adalah freelancer profesional yang menjaga komunikasi excellent dengan klien.'
      );
      setAiOutput(result);
    } catch (err: any) {
      setAiOutput('Error: ' + err.message);
    }
    setAiLoading(false);
  };

  const aiAnalyzeBusiness = async () => {
    if (!isConfigured) return;
    setAiLoading(true);
    try {
      const result = await generate(
        `Analisis bisnis freelance saya berdasarkan data berikut:

Total Earned: ${formatCurrency(totalEarned)}
Pipeline: ${formatCurrency(totalPipeline)}
Active Projects: ${activeProjects}
Pending Proposals: ${pendingProposals}

Projects:
${projects.map(p => `- ${p.name} | ${p.client} | ${p.status} | ${formatCurrency(p.budget)}`).join('\n')}

Berikan analisis:
1. Revenue health score (1-10)
2. Pipeline strength assessment
3. Risk factors
4. Recommendations untuk growth
5. Ideal project mix
6. Pricing optimization tips

Berikan insight yang actionable dan spesifik.`,
        'Kamu adalah business consultant untuk freelancer. Berikan analisis yang data-driven dan actionable.'
      );
      setAiOutput(result);
    } catch (err: any) {
      setAiOutput('Error: ' + err.message);
    }
    setAiLoading(false);
  };

  const statusConfig: Record<Project['status'], { label: string; color: string; icon: any }> = {
    proposal: { label: 'Proposal', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: AlertCircle },
    in_progress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Clock },
    review: { label: 'Review', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Clock },
    completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
    paid: { label: 'Paid ✓', color: 'bg-green-500/10 text-green-300 border-green-500/20', icon: DollarSign },
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-emerald-400" /><span className="text-sm text-slate-400">Total Earned</span></div>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(totalEarned)}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><Briefcase className="w-5 h-5 text-indigo-400" /><span className="text-sm text-slate-400">Pipeline</span></div>
          <p className="text-xl font-bold text-indigo-400">{formatCurrency(totalPipeline)}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-5 h-5 text-blue-400" /><span className="text-sm text-slate-400">Active</span></div>
          <p className="text-xl font-bold text-blue-400">{activeProjects}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5 text-amber-400" /><span className="text-sm text-slate-400">Proposals</span></div>
          <p className="text-xl font-bold text-amber-400">{pendingProposals}</p>
        </div>
      </div>

      {/* AI Panel */}
      {isConfigured && (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Freelance Assistant
            </h3>
            <button onClick={() => setShowAIPanel(!showAIPanel)} className="text-xs text-purple-400 hover:text-purple-300">
              {showAIPanel ? 'Tutup' : 'Buka'}
            </button>
          </div>

          {showAIPanel && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setAiMode('proposal'); aiGenerateProposal(); }} disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/30 transition-all disabled:opacity-50">
                  {aiLoading && aiMode === 'proposal' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Generate Proposal
                </button>
                <button onClick={() => { setAiMode('email'); aiGenerateClientEmail(); }} disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 text-sm hover:bg-blue-500/30 transition-all disabled:opacity-50">
                  {aiLoading && aiMode === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Client Email
                </button>
                <button onClick={() => { setAiMode('analysis'); aiAnalyzeBusiness(); }} disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-all disabled:opacity-50">
                  {aiLoading && aiMode === 'analysis' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Business Analysis
                </button>
              </div>

              {aiOutput && (
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{aiOutput}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Project Pipeline
          </h3>
          <button onClick={() => setShowAddProject(!showAddProject)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition-all">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        {showAddProject && (
          <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Add New Project</h4>
              <button onClick={() => setShowAddProject(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input type="text" placeholder="Project name" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
              <input type="text" placeholder="Client name" value={newProject.client} onChange={e => setNewProject({...newProject, client: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
              <input type="number" placeholder="Budget (Rp)" value={newProject.budget || ''} onChange={e => setNewProject({...newProject, budget: parseInt(e.target.value) || 0})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
              <input type="date" value={newProject.deadline} onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none" />
              <select value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value as Project['status']})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none">
                <option value="proposal">Proposal</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="paid">Paid</option>
              </select>
              <input type="text" placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
            </div>
            <button onClick={addProject} className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-all">Add Project</button>
          </div>
        )}

        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-10 text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-800">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-400">Belum ada project</p>
              <p className="text-xs text-slate-600 mt-1">Klik "+ New Project" untuk menambahkan project pertama Anda.</p>
            </div>
          ) : (
            projects.map(project => {
              const config = statusConfig[project.status];
              const StatusIcon = config.icon;
              return (
                <div key={project.id} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/20 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm font-medium text-white">{project.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${config.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />{config.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                        <span>👤 {project.client}</span>
                        <span>💰 {formatCurrency(project.budget)}</span>
                        <span>📅 {project.deadline}</span>
                      </div>
                      {project.description && <p className="text-xs text-slate-500 mt-1">{project.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={project.status} onChange={e => updateStatus(project.id, e.target.value as Project['status'])}
                        className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none">
                        <option value="proposal">Proposal</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                        <option value="paid">Paid</option>
                      </select>
                      <button onClick={() => removeProject(project.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 border border-indigo-500/20">
        <h3 className="text-sm font-semibold text-indigo-300 mb-3">💡 Tips Meningkatkan Income Freelance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Charge based on VALUE, not hours. Client bayar untuk hasil.',
            'Always get 50% upfront. Lindungi cash flow Anda.',
            'Create tiered pricing (Basic/Standard/Premium).',
            'Build long-term relationships. Repeat clients = predictable income.',
            'Use contracts. Protect yourself dan terlihat profesional.',
            'Upsell & cross-sell. Tambah value untuk existing clients.',
            'Raise prices setiap 6 bulan seiring skill meningkat.',
            'Track semua expenses untuk tax deduction.',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 mt-0.5">✓</span><span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
