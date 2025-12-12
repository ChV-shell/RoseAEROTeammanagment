import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Zap, Activity, X } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';

interface RightPanelProps {
    onClose?: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Rose AI Çevrimiçi. Sistemler Normal. Emrinizi bekliyorum.' }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setThinking(true);

    const aiResponse = await generateAIResponse(userMsg);
    
    setThinking(false);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
  };

  return (
    <div className="w-full h-full bg-rose-black flex flex-col border-l border-rose-border shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-rose-border flex items-center justify-between bg-rose-black/95 backdrop-blur">
        <div className="flex items-center space-x-2 text-rose-accent">
            <Bot size={18} />
            <span className="font-mono text-sm font-bold tracking-wider">ROSE AI ASİSTANI</span>
        </div>
        <div className="flex items-center space-x-3">
             <Activity size={14} className="text-rose-success animate-pulse hidden lg:block" />
             {/* Mobile Close */}
             <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white">
                <X size={20} />
             </button>
        </div>
      </div>

      {/* System Status - Compact on mobile */}
      <div className="p-2 lg:p-4 grid grid-cols-2 gap-2 border-b border-rose-border bg-rose-dark/30">
        <div className="bg-rose-dark border border-rose-border p-2 rounded">
            <p className="text-[9px] lg:text-[10px] text-gray-500 mb-1">SİSTEM YÜKÜ</p>
            <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
                <div className="bg-rose-accent h-full w-[34%]"></div>
            </div>
            <p className="text-right text-[9px] text-rose-silver mt-1 font-mono">%34</p>
        </div>
        <div className="bg-rose-dark border border-rose-border p-2 rounded">
            <p className="text-[9px] lg:text-[10px] text-gray-500 mb-1">TEHDİT SEVİYESİ</p>
            <div className="w-full bg-gray-800 h-1 rounded overflow-hidden">
                <div className="bg-rose-success h-full w-[10%]"></div>
            </div>
            <p className="text-right text-[9px] text-rose-success mt-1 font-mono">DÜŞÜK</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-rose-black" ref={scrollRef}>
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded p-3 text-xs leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-rose-accent/10 border border-rose-accent/30 text-rose-silver' 
                    : 'bg-rose-dark border border-rose-border text-gray-400'
                }`}>
                    <p className="font-mono mb-1 text-[9px] opacity-50 uppercase">{msg.role === 'user' ? 'OPERATÖR' : 'ROSE AI'}</p>
                    {msg.text}
                </div>
            </div>
        ))}
        {thinking && (
            <div className="flex justify-start">
                <div className="bg-rose-dark border border-rose-border p-2 rounded text-xs text-rose-accent animate-pulse font-mono">
                    İŞLENİYOR...
                </div>
            </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-rose-border bg-rose-black pb-safe">
        <div className="relative">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Rose AI'ya sor..."
                className="w-full bg-rose-dark text-gray-300 text-xs rounded border border-rose-border p-3 pr-10 focus:outline-none focus:border-rose-accent transition-colors placeholder-gray-600 appearance-none"
            />
            <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-rose-accent hover:text-white transition-colors p-2"
            >
                <Send size={16} />
            </button>
        </div>
        <div className="mt-2 flex justify-between">
            <button className="text-[10px] text-gray-500 hover:text-rose-accent flex items-center">
                <Zap size={10} className="mr-1" />
                <span className="hidden xs:inline">Analitik Görünüm</span>
            </button>
            <p className="text-[9px] text-gray-700 font-mono">AES-256 ŞİFRELİ</p>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;