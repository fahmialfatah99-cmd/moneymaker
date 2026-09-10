import { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { testConnection } from '../services/api';
import {
  Settings as SettingsIcon, Key, Globe, Cpu, CheckCircle2,
  XCircle, Loader2, RefreshCw, Zap, Wifi, WifiOff, Info,
  ChevronDown, ChevronUp, AlertTriangle, Server
} from 'lucide-react';

export default function Settings() {
  const { config, models, loading, updateConfig, refreshModels, isConfigured } = useApi();
  const [localConfig, setLocalConfig] = useState(config);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string; model?: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
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
    // Save first so testConnection uses latest config
    updateConfig(localConfig);
    // Small delay to ensure config is saved
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

  const providerColors: Record<string, string> = {
    'OpenAI': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Anthropic': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    'Google': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'DeepSeek': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    'Qwen/Alibaba': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    'Meta': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Mistral': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    'xAI': 'text-white bg-white/10 border-white/20',
    'GLM/Zhipu': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    'Moonshot': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    'MiniMax': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    'iFlow (FREE)': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'Kiro (FREE)': 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    'OpenCode (FREE)': 'text-lime-400 bg-lime-500/10 border-lime-500/20',
    'NVIDIA': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Groq': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Status Banner */}
      <div className={`glass-card rounded-2xl p-5 flex items-center gap-4 ${isConfigured ? 'border-emerald-500/30' : 'border-amber-500/30'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isConfigured ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
          {isConfigured ? <Wifi className="w-6 h-6 text-emerald-400" /> : <WifiOff className="w-6 h-6 text-amber-400" />}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${isConfigured ? 'text-emerald-300' : 'text-amber-300'}`}>
            {isConfigured ? '9Router Terhubung' : '9Router Belum Terhubung'}
          </h3>
          <p className="text-sm text-slate-400">
            {isConfigured
              ? `Base URL: ${config.baseUrl} • ${models.length} models terdeteksi`
              : 'Masukkan API Key 9Router untuk mengaktifkan semua fitur AI'
            }
          </p>
        </div>
        {isConfigured && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" /> Active
          </div>
        )}
      </div>

      {/* Connection Settings */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" />
          Koneksi 9Router
        </h3>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block font-medium">Base URL 9Router</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={localConfig.baseUrl}
              onChange={e => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
              placeholder="http://localhost:20128/v1"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 font-mono"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Default: http://localhost:20128/v1 • Atau gunakan Cloud Tunnel URL
          </p>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block font-medium">API Key</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              value={localConfig.apiKey}
              onChange={e => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
              placeholder="Masukkan API Key 9Router Anda"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-600 font-mono"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <Info className="w-3 h-3" />
            API Key disimpan lokal di browser Anda, tidak dikirim ke server manapun
          </p>
        </div>

        {/* Model Selection */}
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block font-medium">Model AI</label>
          <div className="relative">
            <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={localConfig.model}
              onChange={e => setLocalConfig({ ...localConfig, model: e.target.value })}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none appearance-none"
            >
              <option value="auto">🔄 Auto (9Router memilih terbaik)</option>
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  [{model.provider}] {model.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          {localConfig.model === 'auto' && (
            <p className="text-xs text-indigo-400 mt-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              9Router akan auto-detect & memilih model terbaik berdasarkan combo & fallback
            </p>
          )}
        </div>

        {/* Advanced Settings */}
        <div>
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Advanced Settings
          </button>

          {showAdvanced && (
            <div className="mt-3 grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Temperature ({localConfig.temperature})</label>
                <input
                  type="range" min="0" max="2" step="0.1"
                  value={localConfig.temperature}
                  onChange={e => setLocalConfig({ ...localConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>Precise</span><span>Creative</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Max Tokens ({localConfig.maxTokens})</label>
                <input
                  type="range" min="256" max="16384" step="256"
                  value={localConfig.maxTokens}
                  onChange={e => setLocalConfig({ ...localConfig, maxTokens: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>256</span><span>16384</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${saved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30'}`}>
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Key className="w-4 h-4" />}
            {saved ? 'Tersimpan!' : 'Simpan Konfigurasi'}
          </button>
          <button onClick={handleTest} disabled={testing || !localConfig.apiKey} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-sm font-medium transition-all disabled:opacity-50">
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {testing ? 'Testing...' : 'Test Koneksi'}
          </button>
          <button onClick={refreshModels} disabled={loading || !isConfigured} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700 text-sm font-medium transition-all disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Models'}
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`p-4 rounded-xl border ${testResult.ok ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className="flex items-center gap-2">
              {testResult.ok ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
              <span className={`text-sm font-medium ${testResult.ok ? 'text-emerald-300' : 'text-red-300'}`}>
                {testResult.message}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Detected Models */}
      {models.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            Models Terdeteksi ({models.length})
          </h3>
          <p className="text-xs text-slate-400 mb-4">9Router auto-detect models dari semua provider yang terhubung</p>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {Object.entries(groupedModels).map(([provider, providerModels]) => (
              <div key={provider}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-2 ${providerColors[provider] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {provider} ({providerModels.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {providerModels.map(model => (
                    <div
                      key={model.id}
                      onClick={() => setLocalConfig({ ...localConfig, model: model.id })}
                      className={`p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                        localConfig.model === model.id
                          ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                          : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <p className="font-medium text-xs truncate">{model.name}</p>
                      <p className="text-xs opacity-60 truncate font-mono">{model.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Setup Guide */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-500/20">
        <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Panduan Setup 9Router
        </h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <p className="text-xs font-medium text-white mb-1">1. Install 9Router</p>
            <code className="text-xs text-emerald-400 font-mono">npm install -g 9router</code>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <p className="text-xs font-medium text-white mb-1">2. Jalankan 9Router</p>
            <code className="text-xs text-emerald-400 font-mono">9router</code>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <p className="text-xs font-medium text-white mb-1">3. Connect providers di dashboard 9Router</p>
            <p className="text-xs text-slate-400">Tambahkan API key atau OAuth untuk provider yang diinginkan</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <p className="text-xs font-medium text-white mb-1">4. Masukkan API Key & Base URL di sini</p>
            <p className="text-xs text-slate-400">Base URL default: <code className="text-indigo-400">http://localhost:20128/v1</code></p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <p className="text-xs font-medium text-white mb-1">💡 Tips: Gunakan "auto" model untuk smart routing</p>
            <p className="text-xs text-slate-400">9Router akan auto-detect combo & fallback ke model terbaik secara otomatis</p>
          </div>
        </div>
      </div>
    </div>
  );
}
