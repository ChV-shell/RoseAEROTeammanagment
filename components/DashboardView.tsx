import React from 'react';
import { Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Task } from '../types';

interface DashboardViewProps {
  tasks: Task[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ tasks }) => {
  const activeCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status === 'Pending' || t.status === 'Review').length;
  const criticalCount = tasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed').length;

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Aktif Görevler', val: activeCount, icon: <Activity className="text-rose-accent" />, color: 'border-rose-accent' },
          { label: 'Tamamlanan', val: completedCount, icon: <CheckCircle className="text-rose-success" />, color: 'border-rose-success' },
          { label: 'Bekleyen / İnceleme', val: pendingCount, icon: <Clock className="text-rose-warning" />, color: 'border-rose-warning' },
          { label: 'Kritik Uyarılar', val: criticalCount, icon: <AlertTriangle className="text-rose-danger" />, color: 'border-rose-danger' },
        ].map((stat, i) => (
          <div key={i} className={`glass-panel p-5 rounded border-l-4 ${stat.color} flex items-center justify-between group hover:bg-white/5 transition-colors`}>
            <div>
              <p className="text-gray-500 text-xs font-mono uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-rose-silver mt-1">{stat.val}</h3>
            </div>
            <div className="p-3 bg-rose-dark rounded-full border border-gray-800 group-hover:border-gray-600 transition-colors">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded border border-rose-border p-6">
          <h3 className="text-sm font-bold text-rose-silver uppercase tracking-wider mb-6 flex items-center">
            <span className="w-2 h-2 bg-rose-accent rounded-full mr-2"></span>
            Operasyonel Hız
          </h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[45, 60, 30, 75, 50, 90, 65, 80].map((h, idx) => (
              <div key={idx} className="w-full bg-rose-dark rounded-t overflow-hidden relative group">
                <div 
                  style={{ height: `${h}%` }} 
                  className="w-full bg-gradient-to-t from-rose-accent/20 to-rose-accent absolute bottom-0 transition-all duration-500 group-hover:from-rose-accent/40 group-hover:to-rose-accent/80"
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500 font-mono">
            <span>HF 40</span>
            <span>HF 41</span>
            <span>HF 42</span>
            <span>HF 43</span>
            <span>HF 44</span>
            <span>HF 45</span>
            <span>HF 46</span>
            <span>HF 47</span>
          </div>
        </div>

        <div className="glass-panel rounded border border-rose-border p-6">
           <h3 className="text-sm font-bold text-rose-silver uppercase tracking-wider mb-4 flex items-center">
            <span className="w-2 h-2 bg-rose-warning rounded-full mr-2"></span>
            Bekleyen Onaylar
          </h3>
          <div className="space-y-4">
             {tasks.filter(t => t.status === 'Review').length === 0 ? (
                <p className="text-xs text-gray-500 italic">İnceleme bekleyen görev yok.</p>
             ) : (
                tasks.filter(t => t.status === 'Review').slice(0, 3).map((task) => (
                    <div key={task.id} className="bg-rose-dark/50 p-3 rounded border border-rose-border flex justify-between items-center hover:border-gray-500 transition-colors cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-rose-silver truncate w-32">{task.title}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">{task.id} • {task.assignee}</p>
                      </div>
                      <span className="text-[10px] bg-rose-warning/10 text-rose-warning px-2 py-1 rounded border border-rose-warning/20">
                        İNCELE
                      </span>
                    </div>
                ))
             )}
          </div>
          <button className="w-full mt-6 text-xs text-center text-gray-400 hover:text-white transition-colors border-t border-rose-border pt-4">
            TÜM İSTEKLERİ GÖR
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
