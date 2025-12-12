import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Bot, Globe, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface TopBarProps {
  user: User;
  title: string;
  onMenuToggle: () => void;
  onAiToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, title, onMenuToggle, onAiToggle }) => {
  const [networkStatus, setNetworkStatus] = useState<'Online' | 'Syncing'>('Online');

  // Simulate network heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
        setNetworkStatus('Syncing');
        setTimeout(() => setNetworkStatus('Online'), 1500);
    }, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 lg:h-16 bg-rose-black/90 backdrop-blur-md border-b border-rose-border flex items-center justify-between px-4 lg:px-6 z-30 sticky top-0">
      <div className="flex items-center">
        <button 
            onClick={onMenuToggle}
            className="lg:hidden mr-3 text-gray-400 hover:text-white p-1 rounded active:bg-rose-dark"
        >
            <Menu size={24} />
        </button>
        <h2 className="text-rose-silver font-semibold tracking-wide uppercase text-xs lg:text-base border-l-2 border-rose-accent pl-3 truncate max-w-[150px] lg:max-w-none">
            {title}
        </h2>
      </div>

      {/* Network Status Indicator (Visual) */}
      <div className="hidden lg:flex items-center space-x-2 bg-rose-dark/50 px-3 py-1.5 rounded-full border border-rose-border/50 mx-4">
        {networkStatus === 'Online' ? (
             <div className="w-2 h-2 bg-rose-success rounded-full shadow-[0_0_8px_rgba(39,174,96,0.6)]"></div>
        ) : (
             <div className="w-2 h-2 bg-rose-warning rounded-full animate-ping"></div>
        )}
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center">
            <Globe size={10} className="mr-1" />
            {networkStatus === 'Online' ? 'SECURE NET: ACTIVE' : 'SYNCING PACKETS...'}
        </span>
      </div>

      {/* Desktop Search */}
      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
            <input 
                type="text" 
                placeholder="Global Arama (CTRL+K)" 
                className="w-full bg-rose-dark border border-rose-border text-gray-300 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-rose-accent focus:ring-1 focus:ring-rose-accent transition-all placeholder-gray-600"
            />
        </div>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4">
         {/* Mobile AI Toggle */}
         <button 
            onClick={onAiToggle}
            className="lg:hidden p-2 text-rose-accent bg-rose-accent/10 rounded-full active:bg-rose-accent/20"
         >
            <Bot size={20} />
         </button>

        <button className="relative p-2 text-gray-500 hover:text-rose-accent transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-danger rounded-full animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-2 lg:pl-4 lg:border-l border-rose-border">
            <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-rose-accent font-mono uppercase">{user.roleCallsign}</p>
                <div className="flex flex-col items-end">
                  <p className="text-[10px] text-gray-500 uppercase">{user.realName}</p>
                </div>
            </div>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 flex items-center justify-center font-bold text-xs text-white">
                {user.realName.charAt(0)}
            </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;