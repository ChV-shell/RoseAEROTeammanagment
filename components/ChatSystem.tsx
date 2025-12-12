import React, { useState, useRef, useEffect } from 'react';
import { summarizeChat } from '../services/geminiService';
import { Send, Hash, Lock, Mic, Paperclip, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { ChatMessage, User } from '../types';

interface ChatSystemProps {
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    currentUser: User;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ messages, setMessages, currentUser }) => {
  const [input, setInput] = useState('');
  const [activeChannel, setActiveChannel] = useState('Genel'); // State for active channel
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter messages based on active channel
  const channelMessages = messages.filter(m => m.channel === activeChannel);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [channelMessages, activeChannel]); // Update scroll when messages or channel changes

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: currentUser.roleCallsign,
        content: input,
        timestamp: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}),
        channel: activeChannel // Attach current channel to message
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary('Brifing oluşturuluyor, lütfen bekleyin...');
    const log = channelMessages.map(m => `${m.sender}: ${m.content}`).join('\n');
    const result = await summarizeChat(log);
    setSummary(result);
    setIsSummarizing(false);
  };

  const channels = ['Genel', 'Operasyon', 'Mühendislik', 'İstihbarat'];
  const secureChannels = ['RoseOps', 'RoseSecure'];

  return (
    <div className="h-full flex flex-col lg:flex-row lg:h-[calc(100vh-4rem)]">
      {/* Sidebar Channels - Mobile Accordion / Desktop Sidebar */}
      <div className={`
        bg-rose-dark/20 border-b lg:border-r lg:border-b-0 border-rose-border flex flex-col
        ${isChannelListOpen ? 'h-auto' : 'h-12 lg:h-auto lg:w-64'} transition-all duration-300
      `}>
        <button 
            onClick={() => setIsChannelListOpen(!isChannelListOpen)}
            className="lg:hidden w-full p-3 flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-rose-black"
        >
            <span>KANAL LİSTESİ: #{activeChannel.toUpperCase()}</span>
            {isChannelListOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <div className={`
            ${isChannelListOpen ? 'block' : 'hidden'} lg:block p-4
        `}>
          <h3 className="hidden lg:block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Kanallar</h3>
          <div className="space-y-1">
            {channels.map(channel => (
              <button 
                key={channel} 
                onClick={() => { setActiveChannel(channel); setIsChannelListOpen(false); }}
                className={`w-full flex items-center px-3 py-3 lg:py-2 rounded text-sm transition-colors ${activeChannel === channel ? 'bg-rose-accent/10 text-rose-silver border-l-2 border-rose-accent' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
              >
                <Hash size={14} className={`mr-2 ${activeChannel === channel ? 'text-rose-accent' : 'opacity-50'}`} />
                {channel}
              </button>
            ))}
          </div>

           <h3 className="hidden lg:block text-xs font-bold text-gray-500 uppercase tracking-widest mt-6 mb-4">Güvenli Hat</h3>
           <div className="space-y-1 mt-4 lg:mt-0">
             {secureChannels.map(channel => (
                 <button 
                    key={channel}
                    onClick={() => { setActiveChannel(channel); setIsChannelListOpen(false); }}
                    className={`w-full flex items-center px-3 py-3 lg:py-2 rounded text-sm transition-colors ${activeChannel === channel ? 'bg-rose-success/10 text-rose-silver border-l-2 border-rose-success' : 'text-gray-500 hover:bg-white/5'}`}
                 >
                    <span className={`w-2 h-2 rounded-full mr-2 ${activeChannel === channel ? 'bg-rose-success animate-pulse' : 'bg-gray-600'}`}></span>
                    {channel}
                 </button>
             ))}
           </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0c0c0c] overflow-hidden">
        {/* Chat Header */}
        <div className="h-14 border-b border-rose-border flex items-center justify-between px-4 lg:px-6 bg-rose-dark/10 flex-shrink-0">
            <div className="flex items-center">
                <Hash size={18} className="text-gray-500 mr-2" />
                <span className="font-bold text-gray-200 text-sm lg:text-base">{activeChannel}</span>
                <span className="ml-2 lg:ml-4 px-2 py-0.5 rounded border border-rose-border text-[9px] lg:text-[10px] text-gray-500 font-mono">
                    {secureChannels.includes(activeChannel) ? 'TOP SECRET' : 'KURUMSAL ŞİFRELEME'}
                </span>
            </div>
            <button 
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="text-[10px] lg:text-xs flex items-center bg-rose-dark border border-rose-border px-2 lg:px-3 py-1.5 rounded text-rose-accent hover:bg-rose-accent hover:text-white transition-all disabled:opacity-50 active:scale-95"
            >
                <FileText size={12} className="mr-1 lg:mr-2" />
                {isSummarizing ? 'Analiz...' : 'Brifing (AI)'}
            </button>
        </div>

        {summary && (
            <div className="m-4 p-4 bg-rose-accent/5 border border-rose-accent/20 rounded text-xs text-rose-silver relative flex-shrink-0">
                <button onClick={() => setSummary('')} className="absolute top-2 right-2 text-rose-accent hover:text-white p-2">×</button>
                <h4 className="font-bold text-rose-accent mb-2 uppercase tracking-wide">AI Brifing Özeti ({activeChannel})</h4>
                <p className="leading-relaxed whitespace-pre-line">{summary}</p>
            </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6" ref={scrollRef}>
            {channelMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2">
                    <Lock size={24} className="opacity-20" />
                    <div className="text-xs">Bu kanalda henüz mesaj yok.</div>
                    <div className="text-[10px] font-mono opacity-50">CHANNEL_ID: {activeChannel}</div>
                </div>
            ) : (
                channelMessages.map((msg) => (
                    <div key={msg.id} className="flex space-x-3 lg:space-x-4">
                        <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded flex-shrink-0 flex items-center justify-center font-bold text-white text-xs ${msg.sender === currentUser.roleCallsign ? 'bg-rose-accent' : 'bg-gray-800'}`}>
                            {msg.sender.substring(0,2)}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-baseline space-x-2">
                                <span className={`font-bold text-xs lg:text-sm ${msg.sender === currentUser.roleCallsign ? 'text-rose-accent' : 'text-rose-silver'}`}>{msg.sender}</span>
                                <span className="text-[9px] lg:text-[10px] text-gray-600 font-mono">{msg.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1 break-words">{msg.content}</p>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Input */}
        <div className="p-3 lg:p-4 border-t border-rose-border bg-rose-black flex-shrink-0 pb-safe">
            <div className="glass-panel p-2 rounded flex items-center space-x-2 border border-rose-border focus-within:border-rose-accent/50 transition-colors">
                <button className="p-2 text-gray-500 hover:text-rose-silver transition-colors hidden sm:block">
                    <Paperclip size={18} />
                </button>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`#${activeChannel} kanalına mesaj gönder...`} 
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-300 placeholder-gray-600 appearance-none min-w-0"
                />
                <button 
                    onClick={handleSendMessage}
                    className="p-2 bg-rose-accent/10 text-rose-accent rounded hover:bg-rose-accent hover:text-white transition-all active:scale-95"
                >
                    <Send size={18} />
                </button>
            </div>
            <div className="flex justify-center mt-2">
                <p className="flex items-center text-[9px] text-gray-600">
                    <Lock size={10} className="mr-1" />
                    RoseSecure Protokolü ile Uçtan Uca Şifreli
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;