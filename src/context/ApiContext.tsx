import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiConfig, getConfig, saveConfig, fetchModels, ModelInfo } from '../services/api';

interface ApiContextType {
  config: ApiConfig;
  models: ModelInfo[];
  loading: boolean;
  updateConfig: (config: Partial<ApiConfig>) => void;
  refreshModels: () => Promise<void>;
  isConfigured: boolean;
}

const ApiContext = createContext<ApiContextType | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ApiConfig>(getConfig());
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const isConfigured = !!config.apiKey && !!config.baseUrl;

  const updateConfig = (newConfig: Partial<ApiConfig>) => {
    const updated = saveConfig(newConfig);
    setConfig(updated);
  };

  const refreshModels = async () => {
    if (!isConfigured) return;
    setLoading(true);
    try {
      const fetched = await fetchModels();
      setModels(fetched);
    } catch (err) {
      console.error('Failed to refresh models:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConfigured) {
      refreshModels();
    }
  }, [config.apiKey, config.baseUrl]);

  return (
    <ApiContext.Provider value={{ config, models, loading, updateConfig, refreshModels, isConfigured }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApi must be used within ApiProvider');
  return context;
}
