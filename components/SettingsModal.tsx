import React, { useState, useEffect } from 'react';
import { X, Server, Shield, Wifi, Save, Database, Globe, AlertTriangle } from 'lucide-react';
import { CloudConfig } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  onSaveConfig: (config: CloudConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSaveConfig }) => {
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('rose_cloud_config');
    if (savedConfig) {
      const config: CloudConfig = JSON.parse(savedConfig);
      setApiUrl(config.apiUrl);
      setApiKey(config.apiKey);
      setIsEnabled(config.enabled);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: CloudConfig = {
      apiUrl,
      apiKey,
      enabled: isEnabled
    };
    localStorage.setItem('rose_cloud_config', JSON.stringify(newConfig));
    onSaveConfig(newConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-rose-border w-full max-w-2xl rounded-lg shadow-2xl relative animate-[fadeIn_0.2s_ease-out]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
            <X size={24} />
        </button>

        <div className="p-6 border-b border-rose-border flex items-center space-x-3">
            <div className="bg-rose-dark p-2 rounded border border-rose-border">
                <Globe className="text-rose-accent" size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-rose-silver tracking-wider uppercase">Rose Secure Cloud</h2>
                <p className="text-xs text-gray-500 font-mono">ÇOKLU CİHAZ & INTERNET SENKRONİZASYONU</p>
            </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
            
            <div className="bg-rose-dark/30 p-4 rounded border border-rose-border">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white uppercase">Bulut Bağlantısı</span>
                    <div 
                        onClick={() => setIsEnabled(!isEnabled)}
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isEnabled ? 'bg-rose-accent' : 'bg-gray-700'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </div>
                <p className="text-[10px] text-gray-500">
                    Aktif edildiğinde, verileriniz şifreli olarak bulut sunucusuna gönderilir ve Akif, Ceren ve diğer birimlerle gerçek zamanlı senkronize olur.
                </p>
            </div>

            <div className={`space-y-6 transition-opacity duration-300 ${isEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 flex items-center">
                        <Wifi size={14} className="mr-2" />
                        API ENDPOINT (URL)
                    </label>
                    <input 
                        type="text" 
                        value={apiUrl}
                        onChange={e => setApiUrl(e.target.value)}
                        placeholder="https://xyz.supabase.co"
                        className="w-full bg-rose-black border border-rose-border p-3 rounded text-rose-accent font-mono text-sm focus:border-rose-accent focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 flex items-center">
                        <Shield size={14} className="mr-2" />
                        API KEY (SECRET)
                    </label>
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder="eyJh..."
                        className="w-full bg-rose-black border border-rose-border p-3 rounded text-rose-silver font-mono text-sm focus:border-rose-accent focus:outline-none"
                    />
                </div>
            </div>

            <div className="bg-rose-warning/10 border border-rose-warning/30 p-4 rounded text-xs text-rose-warning flex items-start">
                <div className="mr-3 mt-0.5"><AlertTriangle size={16} /></div>
                <p>
                    <strong>DİKKAT:</strong> Bu ayarlar tüm ekibin birbiriyle iletişim kurmasını sağlar. 
                    Selçuk ve Akif'in bilgisayarlarında <strong>aynı URL ve KEY</strong> girili olmalıdır.
                </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-rose-border">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-6 py-2 text-sm text-gray-500 hover:text-white mr-4 transition-colors"
                >
                    İPTAL
                </button>
                <button 
                    type="submit"
                    className="bg-rose-accent hover:bg-rose-accent/90 text-white px-6 py-2 rounded text-sm font-bold flex items-center transition-all active:scale-95"
                >
                    <Save size={16} className="mr-2" />
                    BAĞLANTIYI KAYDET
                </button>
            </div>
        </form>
      </div>
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;