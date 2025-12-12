import React, { useState } from 'react';
import { User } from '../types';
import { AUTH_DB } from '../constants';
import { ShieldCheck, Lock, ChevronRight } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Simulate network delay for "Authentication handshake"
    setTimeout(() => {
      const userLower = username.toLowerCase().trim();
      const userRecord = AUTH_DB[userLower];

      if (userRecord && userRecord.pass === password) {
        onLogin({
          username: userLower,
          realName: userRecord.realName,
          roleCallsign: userRecord.callsign,
          jobTitle: userRecord.jobTitle,
          displayName: `${userRecord.realName} (${userRecord.callsign})`
        });
      } else {
        setError(true);
        // Reset vibration animation after a bit
        setTimeout(() => setError(false), 500);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-black relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-accent rounded-full filter blur-[128px]"></div>
      </div>

      <div className={`w-full max-w-md p-8 glass-panel rounded-lg shadow-2xl z-10 transition-transform duration-100 ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        <div className="flex flex-col items-center mb-8">
            <div className="bg-rose-dark p-4 rounded-full border border-rose-border mb-4">
                <ShieldCheck className="w-10 h-10 text-rose-accent" />
            </div>
          <h1 className="text-2xl font-bold tracking-wider text-rose-silver uppercase">Rose Enterprise</h1>
          <p className="text-xs text-gray-500 mt-2 tracking-[0.2em]">GÜVENLİ ERİŞİM TERMİNALİ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-500 ml-1">KİMLİK (ID)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-rose-dark border border-rose-border text-rose-silver px-4 py-3 rounded focus:outline-none focus:border-rose-accent transition-colors font-mono"
              placeholder="Sistem Kullanıcı Adı"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-gray-500 ml-1">PAROLA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-rose-dark border border-rose-border text-rose-silver px-4 py-3 rounded focus:outline-none focus:border-rose-accent transition-colors font-mono"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div className="text-rose-danger text-xs font-bold text-center animate-pulse border border-rose-danger/30 bg-rose-danger/10 py-2 rounded">
              KİMLİK DOĞRULAMA HATASI
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-accent hover:bg-rose-accent/90 text-white font-semibold py-3 rounded transition-all duration-300 flex items-center justify-center group"
          >
            {loading ? (
                <span className="animate-pulse">EL SIKIŞMA PROTOKOLÜ...</span>
            ) : (
                <>
                <span>OTURUMU BAŞLAT</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-rose-border text-center">
            <p className="text-[10px] text-gray-600 font-mono">
                YASAK BÖLGE. YETKİSİZ ERİŞİM KAYIT ALTINA ALINIR VE ROSE KOMUTA MERKEZİNE BİLDİRİLİR.
            </p>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
