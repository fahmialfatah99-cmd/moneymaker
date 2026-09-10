import { useState } from 'react';
import { Briefcase, Plus, Trash2, Clock, CheckCircle, AlertCircle, DollarSign, X } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  client: string;
  status: 'proposal' | 'in_progress' | 'review' | 'completed' | 'paid';
  budget: number;
  deadline: string;
  description: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  totalProjects: number;
  totalSpent: number;
}

export default function FreelanceTracker() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Website Redesign', client: 'PT Maju Jaya', status: 'in_progress', budget: 15000000, deadline: '2024-02-28', description: 'Redesign company profile website' },
    { id: 2, name: 'Mobile App UI', client: 'StartupXYZ', status: 'review', budget: 25000000, deadline: '2024-02-15', description: 'Design UI/UX untuk mobile app' },
    { id: 3, name: 'Brand Identity', client: 'Coffee Shop ABC', status: 'completed', budget: 8000000, deadline: '2024-01-30', description: 'Logo, brand guide, stationery' },
    { id: 4, name: 'SEO Optimization', client: 'Toko Online DEF', status: 'paid', budget: 5000000, deadline: '2024-01-20', description: 'On-page SEO dan technical SEO' },
    { id: 5, name: 'Marketing Campaign', client: 'Fashion Brand GHI', status: 'proposal', budget: 12000000, deadline: '2024-03-01', description: 'Social media campaign 3 bulan' },
  ]);

  const [clients] = useState<Client[]>([
    { id: 1, name: 'PT Maju Jaya', email: 'contact@majujaya.com', totalProjects: 3, totalSpent: 35000000 },
    { id: 2, name: 'StartupXYZ', email: 'hello@startupxyz.io', totalProjects: 2, totalSpent: 45000000 },
    { id: 3, name: 'Coffee Shop ABC', email: 'info@coffeeabc.com', totalProjects: 1, totalSpent: 8000000 },
    { id: 4, name: 'Toko Online DEF', email: 'admin@defshop.com', totalProjects: 4, totalSpent: 20000000 },
    { id: 5, name: 'Fashion Brand GHI', email: 'team@ghi-fashion.com', totalProjects: 1, totalSpent: 12000000 },
  ]);

  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    name: '', client: '', status: 'proposal', budget: 0, deadline: '', description: ''
  });

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
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">Total Earned</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(totalEarned)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-slate-400">Pipeline</span>
          </div>
          <p className="text-xl font-bold text-indigo-400">{formatCurrency(totalPipeline)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">Active Projects</span>
          </div>
          <p className="text-xl font-bold text-blue-400">{activeProjects}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-slate-400">Pending Proposals</span>
          </div>
          <p className="text-xl font-bold text-amber-400">{pendingProposals}</p>
        </div>
      </div>

      {/* Projects */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Project Pipeline
          </h3>
          <button onClick={() => setShowAddProject(!showAddProject)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 transition-all">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        {/* Add Project Form */}
        {showAddProject && (
          <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Add New Project</h4>
              <button onClick={() => setShowAddProject(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input type="text" placeholder="Project name" value={newProject.name}
                onChange={e => setNewProject({...newProject, name: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
              <input type="text" placeholder="Client name" value={newProject.client}
                onChange={e => setNewProject({...newProject, client: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
              <input type="number" placeholder="Budget (Rp)" value={newProject.budget || ''}
                onChange={e => setNewProject({...newProject, budget: parseInt(e.target.value) || 0})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
              <input type="date" value={newProject.deadline}
                onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none" />
              <select value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value as Project['status']})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none">
                <option value="proposal">Proposal</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="paid">Paid</option>
              </select>
              <input type="text" placeholder="Description" value={newProject.description}
                onChange={e => setNewProject({...newProject, description: e.target.value})}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600" />
            </div>
            <button onClick={addProject} className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-all">
              Add Project
            </button>
          </div>
        )}

        {/* Kanban-style list */}
        <div className="space-y-3">
          {projects.map(project => {
            const config = statusConfig[project.status];
            const StatusIcon = config.icon;
            return (
              <div key={project.id} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/20 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-sm font-medium text-white">{project.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${config.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      <span>👤 {project.client}</span>
                      <span>💰 {formatCurrency(project.budget)}</span>
                      <span>📅 {project.deadline}</span>
                    </div>
                    {project.description && (
                      <p className="text-xs text-slate-500 mt-1">{project.description}</p>
                    )}
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
                    <button onClick={() => removeProject(project.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clients */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          👥 Client Database
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-xs text-slate-500 py-3 px-2">Client</th>
                <th className="text-left text-xs text-slate-500 py-3 px-2">Email</th>
                <th className="text-center text-xs text-slate-500 py-3 px-2">Projects</th>
                <th className="text-right text-xs text-slate-500 py-3 px-2">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="py-3 px-2 text-sm text-white font-medium">{client.name}</td>
                  <td className="py-3 px-2 text-sm text-slate-400">{client.email}</td>
                  <td className="py-3 px-2 text-sm text-slate-300 text-center">{client.totalProjects}</td>
                  <td className="py-3 px-2 text-sm text-emerald-400 text-right font-medium">{formatCurrency(client.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Freelance Tips */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-500/20">
        <h3 className="text-sm font-semibold text-indigo-300 mb-3">💡 Tips Meningkatkan Income Freelance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Charge based on VALUE, not hours. Client bayar untuk hasil, bukan waktu.',
            'Always get 50% upfront. Lindungi cash flow Anda.',
            'Create tiered pricing (Basic/Standard/Premium) untuk maximize revenue.',
            'Build long-term relationships. Repeat clients = predictable income.',
            'Use contracts. Protect yourself dan terlihat profesional.',
            'Track semua expenses. Tax deduction bisa menghemat jutaan.',
            'Upsell & cross-sell. Tambah value untuk existing clients.',
            'Raise prices setiap 6 bulan seiring meningkatnya skill & portfolio.',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
