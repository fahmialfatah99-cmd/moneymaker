import { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { testConnection } from '../services/api';
import {
  Key, Globe, Cpu, CheckCircle2, XCircle, Loader2, RefreshCw,
  Zap, Wifi, WifiOff, Info, ChevronDown, AlertTriangle, Server
} from 'lucide-react';

export default function Settings() {
  const { config, models, loading, updateConfig, refreshModels, isConfigured } = useApi();
  const [localConfig, setLocalConfig] = useState(config);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string; model?: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSave = () => {
    updateConfig(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    updateConfig(localConfig);
    await new Promise(r => setTimeout(r, 100));
    const result = await testConnection();
    setTestResult(result);
    setTesting(false);
  };

  const groupedModels = models.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = [];
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, typeof models>);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Status Banner */}
      <div className={`rounded-xl p-4 flex items-center gap-4 border ${
        isConfigured 
          ? 'bg-emerald-500/5 border-emerald-500/20' 
          : 'bg-amber-500/5 border-amber-500/20'
      }`}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isConfigured ? 'bg-emerald-500/10' : 'bg-amber-500/10'
        }`}>
          {isConfigured ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-amber-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${isConfigured ? 'text-emerald-300' : 'text-amber-300'}`}>
            {isConfigured ? '9Router Connected' : '9Router Not Connected'}
          </h3>
          <p className="text-xs text-slate-500 truncate">
            {isConfigured
              ? `Base URL: ${config.baseUrl} • ${models.length} models detected`
              : 'Enter 9Router API Key to enable all AI features'
            }
          </p>
        </div>
        {isConfigured && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active
          </div>
        )}
      </div>

      {/* Connection Settings */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-400" />
          9Router Connection
        </h3>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block font-medium">Base URL</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              value={localConfig.baseUrl}
              onChange={e => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
              placeholder="http://localhost:20128/v1"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 font-mono"
            />
          </div>
          <p className="text-[10px] text-slate-600 mt-1.5 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Default: http://localhost:20128/v1
          </p>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block font-medium">API Key</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="password"
              value={localConfig.apiKey}
              onChange={e => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
              placeholder="Enter your 9Router API Key"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 font-mono"
            />
          </div>
          <p className="text-[10px] text-slate-600 mt-1.5 flex items-center gap-1">
            <Info className="w-3 h-3" />
            API Key is stored locally in your browser only
          </p>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block font-medium">AI Model</label>
          <div className="relative">
            <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <select
              value={localConfig.model}
              onChange={e => setLocalConfig({ ...localConfig, model: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-indigo-500 focus:outline-none appearance-none"
            >
              <option value="auto">🔄 Auto (9Router selects best)</option>
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  [{model.provider}] {model.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
          </div>
          {localConfig.model === 'auto' && (
            <p className="text-[10px] text-indigo-400 mt-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              9Router will auto-detect & select the best model
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button 
            onClick={handleSave} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              saved 
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20'
            }`}
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Key className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Config'}
          </button>
          <button 
            onClick={handleTest} 
            disabled={testing || !localConfig.apiKey} 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 text-sm font-medium transition-all disabled:opacity-50"
          >
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          <button 
            onClick={refreshModels} 
            disabled={loading || !isConfigured} 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 text-sm font-medium transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Models'}
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`p-3 rounded-lg border ${
            testResult.ok ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
          }`}>
            <div className="flex items-center gap-2">
              {testResult.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
              <span className={`text-xs font-medium ${testResult.ok ? 'text-emerald-300' : 'text-red-300'}`}>
                {testResult.message}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Detected Models */}
      {models.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            Detected Models ({models.length})
          </h3>
          <p className="text-xs text-slate-500 mb-4">9Router auto-detects models from all connected providers</p>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {Object.entries(groupedModels).map(([provider, providerModels]) => (
              <div key={provider}>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-300 mb-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  {provider} ({providerModels.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {providerModels.map(model => (
                    <button
                      key={model.id}
                      onClick={() => setLocalConfig({ ...localConfig, model: model.id })}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        localConfig.model === model.id
                          ? 'bg-indigo-500/10 border-indigo-500/30'
                          : 'bg-slate-800/20 border-slate-800/50 hover:border-slate-700/50'
                      }`}
                    >
                      <p className="text-xs font-medium text-slate-300 truncate">{model.name}</p>
                      <p className="text-[10px] text-slate-600 truncate font-mono mt-0.5">{model.id}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Setup Guide */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-indigo-400" />
          9Router Setup Guide
        </h3>
        <div className="space-y-2">
          {[
            { step: '1', title: 'Install 9Router', code: 'npm install -g 9router' },
            { step: '2', title: 'Run 9Router', code: '9router' },
            { step: '3', title: 'Connect providers in 9Router dashboard', desc: 'Add API keys or OAuth for desired providers' },
            { step: '4', title: 'Enter API Key & Base URL here', desc: 'Default Base URL: http://localhost:20128/v1' },
            { step: '💡', title: 'Use "auto" model for smart routing', desc: '9Router will auto-detect combo & fallback to best model' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-800/20 border border-slate-800/30">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-indigo-400 w-5 flex-shrink-0">{item.step}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300">{item.title}</p>
                  {item.code && <code className="text-[10px] text-emerald-400 font-mono mt-0.5 block">{item.code}</code>}
                  {item.desc && <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
