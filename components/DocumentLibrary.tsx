import React, { useRef } from 'react';
import { DocumentFile, User } from '../types';
import { FileText, Download, ShieldAlert, Search, Upload } from 'lucide-react';

interface DocumentLibraryProps {
    docs: DocumentFile[];
    setDocs: React.Dispatch<React.SetStateAction<DocumentFile[]>>;
    currentUser: User;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ docs, setDocs, currentUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSecurityBadge = (level: string) => {
    switch(level) {
        case 'TopSecure': return 'bg-rose-danger/20 text-rose-danger border-rose-danger/40';
        case 'Restricted': return 'bg-orange-500/20 text-orange-500 border-orange-500/40';
        default: return 'bg-blue-500/20 text-blue-500 border-blue-500/40';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const newDoc: DocumentFile = {
            id: `DOC-${Math.floor(Math.random() * 1000)}`,
            name: file.name,
            type: 'PDF', // Simulating type detection
            securityLevel: 'Internal',
            owner: currentUser.roleCallsign,
            date: new Date().toLocaleDateString('tr-TR'),
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
        };
        setDocs([newDoc, ...docs]);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 space-y-4 lg:space-y-0">
        <div>
            <h2 className="text-lg font-bold text-rose-silver uppercase tracking-wider">İstihbarat Arşivi</h2>
            <p className="text-xs text-gray-500 font-mono mt-1">GÜVENLİ DOSYA DEPOLAMA • v4.2</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload} 
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-rose-dark border border-rose-border text-gray-300 px-4 py-2 rounded text-sm hover:bg-white/5 transition-colors flex items-center justify-center active:bg-rose-dark/80"
            >
                <Upload size={14} className="mr-2"/>
                İstihbarat Yükle
            </button>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Metadata ara..." 
                    className="w-full bg-rose-dark border border-rose-border text-sm pl-9 pr-4 py-2 rounded focus:outline-none focus:border-rose-accent appearance-none"
                />
                <Search className="absolute left-3 top-2.5 text-gray-600 h-4 w-4" />
            </div>
        </div>
      </div>

      <div className="glass-panel rounded border border-rose-border overflow-hidden">
        <div className="overflow-x-auto">
            {docs.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">Arşiv boş.</div>
            ) : (
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-rose-dark/50 border-b border-rose-border">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Doküman Adı</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Gizlilik</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sahibi</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tarih</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Boyut</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-border/30">
                        {docs.map(doc => (
                            <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="p-2 rounded bg-gray-800 mr-3 text-rose-accent">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-200 truncate max-w-[150px]">{doc.name}</p>
                                            <p className="text-[10px] text-gray-600 font-mono">{doc.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getSecurityBadge(doc.securityLevel)}`}>
                                        {doc.securityLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">{doc.owner}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{doc.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{doc.size}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button className="p-1.5 text-gray-500 hover:text-rose-silver transition-colors">
                                            <Download size={16} />
                                        </button>
                                        <button className="p-1.5 text-gray-500 hover:text-rose-danger transition-colors">
                                            <ShieldAlert size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
};

export default DocumentLibrary;