import React, { useState } from 'react';
import { analyzeTaskRisk } from '../services/geminiService';
import { AlertCircle, MoreHorizontal, Plus, X, Check } from 'lucide-react';
import { Task, User, TaskStatus, TaskPriority } from '../types';
import { AUTH_DB } from '../constants';

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentUser: User;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks, currentUser }) => {
  const [analysisResult, setAnalysisResult] = useState<{id: string, text: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Task State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('RoseAero');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  const isCaptain = currentUser.roleCallsign === 'RoseUnitX'; // Only Selçuk can assign

  const handleAnalyze = async (task: Task) => {
    setAnalysisResult({ id: task.id, text: "Analiz ediliyor..." });
    const result = await analyzeTaskRisk(task.description);
    setAnalysisResult({ id: task.id, text: result });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
        id: `TSK-${Math.floor(Math.random() * 9000) + 1000}`,
        title: newTaskTitle,
        description: newTaskDesc,
        assignee: newTaskAssignee,
        priority: newTaskPriority,
        status: 'Pending',
        deadline: newTaskDeadline || '2024-01-01',
        progress: 0
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    // Reset form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskDeadline('');
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus, progress: newStatus === 'Completed' ? 100 : t.progress } : t));
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical': return 'text-rose-danger border-rose-danger/30 bg-rose-danger/10';
      case 'High': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'Medium': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const statusMap: Record<TaskStatus, string> = {
    'Pending': 'Beklemede',
    'In Progress': 'İşlemde',
    'Review': 'İnceleme',
    'Completed': 'Tamamlandı'
  };

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h2 className="text-sm lg:text-lg font-bold text-rose-silver uppercase tracking-wider">Operasyon Görevleri</h2>
        {isCaptain && (
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-rose-accent hover:bg-rose-accent/90 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded text-xs lg:text-sm flex items-center transition-colors shadow-lg shadow-rose-accent/20 active:scale-95 transform"
            >
            <Plus size={16} className="mr-1 lg:mr-2" />
            Görev Ata
            </button>
        )}
      </div>

      {/* Responsive Grid: Horizontal Scroll on Mobile (Snap), Grid on Desktop */}
      <div className="flex lg:grid lg:grid-cols-4 gap-4 lg:gap-6 h-full overflow-x-auto overflow-y-hidden lg:overflow-visible snap-x-mandatory pb-4 lg:pb-0">
        {(['Pending', 'In Progress', 'Review', 'Completed'] as TaskStatus[]).map((status) => (
          <div key={status} className="min-w-[85vw] lg:min-w-0 snap-center bg-rose-dark/30 rounded border border-rose-border p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-border">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{statusMap[status]}</span>
              <span className="text-xs font-mono bg-rose-dark px-2 py-1 rounded text-gray-500">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 scrollbar-hide">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="glass-panel p-4 rounded border border-rose-border/50 hover:border-rose-accent/50 transition-colors group relative flex flex-col active:bg-rose-dark/80">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'Critical' ? 'KRİTİK' : task.priority === 'High' ? 'YÜKSEK' : task.priority === 'Medium' ? 'ORTA' : 'DÜŞÜK'}
                    </span>
                    <div className="relative group/edit">
                        <button className="text-gray-600 hover:text-white transition-colors p-1">
                            <MoreHorizontal size={14} />
                        </button>
                        {/* Quick Status Change */}
                        <div className="hidden group-hover/edit:flex absolute right-0 top-4 bg-rose-black border border-rose-border z-20 flex-col rounded w-24 shadow-xl">
                            {(['Pending', 'In Progress', 'Review', 'Completed'] as TaskStatus[]).map(s => (
                                <button key={s} onClick={() => updateTaskStatus(task.id, s)} className="text-[9px] text-left px-2 py-2 hover:bg-rose-accent/20 text-gray-300 border-b border-rose-border/20 last:border-none">
                                    {statusMap[s]}
                                </button>
                            ))}
                        </div>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-gray-200 mb-1">{task.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-3 mb-3">{task.description}</p>
                  
                  {analysisResult?.id === task.id && (
                    <div className="mb-3 p-2 bg-rose-black/50 border border-rose-accent/20 rounded text-[10px] text-rose-accent">
                        <p className="font-bold mb-1">AI RİSK ANALİZİ:</p>
                        {analysisResult.text}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-rose-border/30">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center text-[9px] font-bold" title={task.assignee}>
                            {task.assignee.substring(4, 6)}
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">{task.deadline}</span>
                    </div>
                    <button 
                        onClick={() => handleAnalyze(task)}
                        className="text-[10px] text-rose-accent hover:underline flex items-center lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                    >
                        <AlertCircle size={10} className="mr-1" />
                        Analiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151515] border border-rose-border p-6 rounded-lg w-full max-w-md shadow-2xl relative animate-[fadeIn_0.2s_ease-out]">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white p-2">
                    <X size={20} />
                </button>
                <h3 className="text-lg font-bold text-rose-silver mb-6 border-l-4 border-rose-accent pl-3">YENİ GÖREV ATA</h3>
                
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 font-mono block mb-1">GÖREV BAŞLIĞI</label>
                        <input required type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} className="w-full bg-rose-dark border border-rose-border p-2 rounded text-sm text-white focus:border-rose-accent outline-none appearance-none" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-mono block mb-1">AÇIKLAMA</label>
                        <textarea required value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} className="w-full bg-rose-dark border border-rose-border p-2 rounded text-sm text-white focus:border-rose-accent outline-none h-24 appearance-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 font-mono block mb-1">ATANACAK BİRİM</label>
                            <select value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)} className="w-full bg-rose-dark border border-rose-border p-2 rounded text-sm text-white focus:border-rose-accent outline-none">
                                {Object.values(AUTH_DB).map(u => (
                                    <option key={u.callsign} value={u.callsign}>{u.realName} ({u.callsign})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-mono block mb-1">ÖNEM DERECESİ</label>
                            <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as any)} className="w-full bg-rose-dark border border-rose-border p-2 rounded text-sm text-white focus:border-rose-accent outline-none">
                                <option value="Low">Düşük</option>
                                <option value="Medium">Orta</option>
                                <option value="High">Yüksek</option>
                                <option value="Critical">Kritik</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-mono block mb-1">SON TESLİM TARİHİ</label>
                        <input required type="date" value={newTaskDeadline} onChange={e => setNewTaskDeadline(e.target.value)} className="w-full bg-rose-dark border border-rose-border p-2 rounded text-sm text-white focus:border-rose-accent outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-rose-accent text-white font-bold py-3 rounded mt-4 hover:bg-rose-accent/80 transition-colors active:scale-95 transform">
                        GÖREVİ ONAYLA VE GÖNDER
                    </button>
                </form>
            </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default TaskBoard;