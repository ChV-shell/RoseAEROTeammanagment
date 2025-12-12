import React from 'react';
import { ViewState } from '../types';
import { 
  LayoutDashboard, 
  ListTodo, 
  MessageSquare, 
  FileText, 
  BarChart2, 
  Settings, 
  LogOut, 
  Shield,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
  onClose?: () => void;
  onSettingsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout, onClose, onSettingsClick }) => {
  
  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Operasyonlar', icon: <LayoutDashboard size={20} /> },
    { id: 'tasks', label: 'Görev Gücü', icon: <ListTodo size={20} /> },
    { id: 'chat', label: 'Haberleşme', icon: <MessageSquare size={20} /> },
    { id: 'documents', label: 'İstihbarat', icon: <FileText size={20} /> },
    { id: 'analytics', label: 'Performans', icon: <BarChart2 size={20} /> },
  ];

  return (
    <aside className="w-full h-full bg-rose-black border-r border-rose-border flex flex-col flex-shrink-0 shadow-2xl lg:shadow-none">
      <div className="p-4 lg:p-6 flex items-center justify-between border-b border-rose-border">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-rose-accent rounded flex items-center justify-center">
                <Shield size={18} className="text-white" />
            </div>
            <span className="font-bold tracking-widest text-lg text-rose-silver">ROSE</span>
        </div>
        {/* Mobile Close Button */}
        <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white p-2">
            <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition-all duration-200 group ${
              currentView === item.id 
                ? 'bg-rose-accent/10 text-rose-accent border-l-2 border-rose-accent' 
                : 'text-gray-500 hover:bg-rose-dark hover:text-gray-300'
            }`}
          >
            <span className={currentView === item.id ? 'text-rose-accent' : 'text-gray-500 group-hover:text-gray-300'}>
                {item.icon}
            </span>
            <span className="text-sm font-medium tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-rose-border mb-safe">
        <button 
            onClick={onSettingsClick}
            className="flex items-center space-x-3 text-gray-500 hover:text-rose-silver w-full px-4 py-3 transition-colors active:bg-rose-dark"
        >
            <Settings size={18} />
            <span className="text-sm">Yapılandırma</span>
        </button>
        <button 
            onClick={onLogout}
            className="flex items-center space-x-3 text-rose-danger hover:bg-rose-danger/10 w-full px-4 py-3 mt-1 rounded transition-colors active:bg-rose-danger/20"
        >
            <LogOut size={18} />
            <span className="text-sm">Oturumu Kapat</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;