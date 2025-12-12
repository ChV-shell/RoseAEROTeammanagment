import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

const data = [
  { name: 'RoseAero', prod: 85, risks: 12 },
  { name: 'RoseOps', prod: 92, risks: 4 },
  { name: 'RoseFlight', prod: 78, risks: 8 },
  { name: 'RoseCore', prod: 88, risks: 2 },
  { name: 'RoseSys', prod: 65, risks: 15 },
];

const velocityData = [
    { day: 'Pzt', tasks: 12 },
    { day: 'Sal', tasks: 19 },
    { day: 'Çar', tasks: 15 },
    { day: 'Per', tasks: 22 },
    { day: 'Cum', tasks: 30 },
];

const AnalyticsView: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
       <div>
            <h2 className="text-lg font-bold text-rose-silver uppercase tracking-wider mb-2">Takım Performans Analizi</h2>
            <p className="text-xs text-gray-500 font-mono">GERÇEK ZAMANLI METRİKLER • AI DESTEKLİ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded border border-rose-border">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Departman Üretkenlik Endeksi</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} tickLine={false} />
                            <YAxis stroke="#666" tick={{fontSize: 10}} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }}
                                itemStyle={{ color: '#D1D1D1' }}
                            />
                            <Bar dataKey="prod" fill="#4A6CF7" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-panel p-6 rounded border border-rose-border">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Görev Tamamlama Hızı (Haftalık)</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={velocityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="day" stroke="#666" tick={{fontSize: 10}} tickLine={false} />
                            <YAxis stroke="#666" tick={{fontSize: 10}} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#FFF' }}
                            />
                            <Line type="monotone" dataKey="tasks" stroke="#27AE60" strokeWidth={3} dot={{r: 4, fill: '#1A1A1A', strokeWidth: 2}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="glass-panel p-6 rounded border border-rose-border">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Risk Dağılımı</h3>
            <div className="flex space-x-2 h-4 rounded overflow-hidden">
                <div className="bg-rose-danger/80 w-[15%] hover:opacity-80 transition-opacity" title="Kritik (%15)"></div>
                <div className="bg-orange-500/80 w-[25%] hover:opacity-80 transition-opacity" title="Yüksek (%25)"></div>
                <div className="bg-blue-500/80 w-[40%] hover:opacity-80 transition-opacity" title="Orta (%40)"></div>
                <div className="bg-gray-600/80 w-[20%] hover:opacity-80 transition-opacity" title="Düşük (%20)"></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono uppercase">
                <span className="text-rose-danger">Kritik Segment 4</span>
                <span className="text-gray-400">Düşük Segment 1</span>
            </div>
        </div>
    </div>
  );
};

export default AnalyticsView;
