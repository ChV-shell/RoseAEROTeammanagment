import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import RightPanel from './components/RightPanel';
import DashboardView from './components/DashboardView';
import TaskBoard from './components/TaskBoard';
import ChatSystem from './components/ChatSystem';
import DocumentLibrary from './components/DocumentLibrary';
import AnalyticsView from './components/AnalyticsView';
import SettingsModal from './components/SettingsModal';
import { User, ViewState, Task, ChatMessage, DocumentFile, CloudConfig } from './types';
import { INITIAL_SYSTEM_MSG } from './constants';
import { syncTasksFromCloud, syncMessagesFromCloud, pushTaskToCloud, pushMessageToCloud } from './services/cloudService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>(() => {
    const saved = localStorage.getItem('rose_cloud_config');
    return saved ? JSON.parse(saved) : { apiUrl: '', apiKey: '', enabled: false };
  });

  // --- DATA LAYER ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('rose_db_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('rose_db_messages');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_MSG;
  });

  const [docs, setDocs] = useState<DocumentFile[]>(() => {
    const saved = localStorage.getItem('rose_db_docs');
    return saved ? JSON.parse(saved) : [];
  });

  // --- LOCAL PERSISTENCE ---
  useEffect(() => { localStorage.setItem('rose_db_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('rose_db_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('rose_db_docs', JSON.stringify(docs)); }, [docs]);

  // --- CLOUD SYNC POLLING (THE INTERNET CONNECTION) ---
  useEffect(() => {
    if (!cloudConfig.enabled || !cloudConfig.apiUrl) return;

    // Initial Sync
    const sync = async () => {
        const cloudTasks = await syncTasksFromCloud(cloudConfig);
        if (cloudTasks && cloudTasks.length > 0) setTasks(cloudTasks);

        const cloudMessages = await syncMessagesFromCloud(cloudConfig);
        if (cloudMessages && cloudMessages.length > 0) setMessages(cloudMessages);
    };

    sync();

    // Poll every 5 seconds for new data from Akif/Selcuk
    const interval = setInterval(sync, 5000);
    return () => clearInterval(interval);
  }, [cloudConfig]);

  // Wrappers to handle Push to Cloud
  const handleSetTasks = (newTasks: Task[] | ((prev: Task[]) => Task[])) => {
    // Determine the new state value
    let resolvedTasks: Task[];
    if (typeof newTasks === 'function') {
        resolvedTasks = newTasks(tasks);
    } else {
        resolvedTasks = newTasks;
    }

    setTasks(resolvedTasks);
    
    // If a new task was added (naive check), push to cloud
    // In a real app we'd identify the specific new/updated item
    if (cloudConfig.enabled && resolvedTasks.length > tasks.length) {
        const newestTask = resolvedTasks[resolvedTasks.length - 1];
        pushTaskToCloud(cloudConfig, newestTask);
    } else if (cloudConfig.enabled) {
        // For updates, we'd need more logic, but for now we rely on the Polling to catch up
        // Or push specific updates. For simplicity in this demo, we assume Additive mainly.
    }
  };

  const handleSetMessages = (newMessages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    let resolvedMessages: ChatMessage[];
    if (typeof newMessages === 'function') {
        resolvedMessages = newMessages(messages);
    } else {
        resolvedMessages = newMessages;
    }
    
    setMessages(resolvedMessages);

    if (cloudConfig.enabled && resolvedMessages.length > messages.length) {
        const newestMsg = resolvedMessages[resolvedMessages.length - 1];
        pushMessageToCloud(cloudConfig, newestMsg);
    }
  };

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <DashboardView tasks={tasks} />;
      case 'tasks': return <TaskBoard tasks={tasks} setTasks={handleSetTasks} currentUser={user!} />;
      case 'chat': return <ChatSystem messages={messages} setMessages={handleSetMessages} currentUser={user!} />;
      case 'documents': return <DocumentLibrary docs={docs} setDocs={setDocs} currentUser={user!} />;
      case 'analytics': return <AnalyticsView />;
      default: return <DashboardView tasks={tasks} />;
    }
  };

  const getPageTitle = () => {
     switch(currentView) {
      case 'dashboard': return 'Komuta Merkezi';
      case 'tasks': return 'Görev Kontrol';
      case 'chat': return 'Haberleşme';
      case 'documents': return 'Arşiv';
      case 'analytics': return 'Analiz';
      default: return 'Rose Enterprise';
    }
  };

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  return (
    <div className="flex h-[100dvh] bg-rose-black text-rose-silver overflow-hidden selection:bg-rose-accent selection:text-white">
      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
            onClose={() => setIsSettingsOpen(false)} 
            onSaveConfig={setCloudConfig}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
            currentView={currentView} 
            onChangeView={handleViewChange} 
            onLogout={() => setUser(null)}
            onClose={() => setIsSidebarOpen(false)} 
            onSettingsClick={() => { setIsSettingsOpen(true); setIsSidebarOpen(false); }}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <TopBar 
            user={user} 
            title={getPageTitle()} 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onAiToggle={() => setIsRightPanelOpen(!isRightPanelOpen)}
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-rose-black to-[#050505] pb-20 lg:pb-0">
          {renderView()}
        </main>
      </div>

      {/* Mobile RightPanel Overlay */}
      {isRightPanelOpen && (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsRightPanelOpen(false)}
        />
      )}

      {/* RightPanel - Responsive */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-80 lg:w-96 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:block border-l border-rose-border
        ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full hidden'}
      `}>
        <RightPanel onClose={() => setIsRightPanelOpen(false)} />
      </div>
    </div>
  );
};

export default App;