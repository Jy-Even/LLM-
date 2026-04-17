import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Zap, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Share2, 
  Maximize2,
  Trash2,
  ChevronDown,
  Sparkles,
  Command,
  Search,
  BookOpen,
  ChevronUp,
  Loader2,
  List,
  Cpu,
  Fingerprint,
  Activity,
  CheckCircle2,
  User,
  Settings,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types.ts';
import { ai, MODELS } from '../lib/gemini.ts';

export default function IntelligentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是您的知识库助手。我已经学习了您的所有文档，您可以问我关于深度学习、Transformer 架构或者 RAG 系统的任何问题。',
    }
  ]);
  const [sessions, setSessions] = useState([
    { id: '1', title: '深度学习基础探讨', date: '今天' },
    { id: '2', title: 'Transformer 架构总结', date: '今天' },
    { id: '3', title: '模型量化方案讨论', date: '昨日' },
  ]);
  const [activeSessionId, setActiveSessionId] = useState('1');
  const [input, setInput] = useState('');
  const [isDeepMode, setIsDeepMode] = useState(false);
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInstance = useRef<any>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!chatInstance.current) {
      chatInstance.current = ai.chats.create({
        model: MODELS.flash,
        config: {
          systemInstruction: "你是一个专业的知识库助手。你的回答应当专业、准确，并尽量引用背景知识。",
        }
      });
    }
  }, []);

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id && sessions.length > 1) {
      setActiveSessionId(sessions.find(s => s.id !== id)?.id || '');
    }
  };

  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession = { id: newId, title: '新对话', date: '今天' };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setMessages([{ id: Date.now().toString(), role: 'assistant', content: '您好！我是您的 AI 助理，请问有什么可以帮您？' }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    
    if (activeSessionId) {
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId && s.title === '新对话' 
          ? { ...s, title: input.slice(0, 15) + (input.length > 15 ? '...' : '') } 
          : s
      ));
    }

    const currentInput = input;
    setInput('');
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const newAssistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      thought: isDeepMode ? '正在分析上下文，检索知识库中关于注意力机制的定义...' : undefined,
      citations: [
        { id: 'c1', text: 'Transformer 架构通过自注意力机制实现了对长距离依赖的有效建模。', pageTitle: 'Transformer 解析' },
        { id: 'c2', text: 'RAG 极大提高了生成内容的准确性。', pageTitle: 'RAG 架构白皮书' }
      ]
    };

    setMessages(prev => [...prev, newAssistantMessage]);

    try {
      const responseStream = await chatInstance.current.sendMessageStream({
        message: currentInput,
      });

      let fullContent = '';
      for await (const chunk of responseStream) {
        fullContent += chunk.text;
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId ? { ...msg, content: fullContent } : msg
        ));
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId ? { ...msg, content: '抱歉，服务暂时繁忙。' } : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full bg-white relative overflow-hidden">
      {/* History Sidebar */}
      <aside className={`
        fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:static lg:bg-slate-50 lg:backdrop-blur-none lg:z-0
        transition-opacity duration-300
        ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:visible lg:flex lg:w-72 lg:shrink-0'}
      `} onClick={() => setIsSidebarOpen(false)}>
        <div className={`
          absolute left-0 top-0 bottom-0 w-72 flex flex-col bg-slate-50 border-r border-slate-200
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `} onClick={e => e.stopPropagation()}>
          <div className="p-4 bg-white border-b border-slate-200">
             <button onClick={createNewSession} className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
               <Plus size={16} /> 开启智能对话
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
             {['今天', '昨日'].map(dateGroup => (
               <div key={dateGroup}>
                 <h5 className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{dateGroup}</h5>
                 <div className="space-y-1">
                   {sessions.filter(s => s.date === dateGroup).map(s => (
                     <div 
                      key={s.id} 
                      onClick={() => setActiveSessionId(s.id)}
                      className={`group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activeSessionId === s.id ? 'bg-white shadow-sm ring-1 ring-slate-200 font-bold' : 'text-slate-600 hover:bg-slate-200/50'}`}
                     >
                       <div className="flex items-center gap-3 truncate">
                         <MessageSquare size={14} className={activeSessionId === s.id ? 'text-blue-500' : 'text-slate-400'} />
                         <span className="truncate text-sm">{s.title}</span>
                       </div>
                       <button onClick={(e) => handleDeleteSession(s.id, e)} className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 rounded transition-all">
                         <Trash2 size={12} />
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
          </div>
          <div className="p-4 border-t border-slate-200 bg-white/50">
             <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">U</div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold text-slate-900 truncate">测试用户</p>
                   <p className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">PRO EDITION</p>
                </div>
                <Settings size={16} className="text-slate-400" />
             </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        <header className="h-16 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 sticky top-0 bg-white/80 backdrop-blur-md z-20">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900"><List size={20} /></button>
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><Sparkles size={20} /></div>
                 <div>
                    <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">智能回答专家</h2>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase">
                       <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-500" /> Gemini 3.0</span>
                    </div>
                 </div>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsDeepMode(!isDeepMode)}>
                 <span className={`hidden sm:inline text-[10px] font-black uppercase tracking-widest ${isDeepMode ? 'text-blue-600' : 'text-slate-400'}`}>Deep Think</span>
                 <div className={`p-1 relative h-5 w-9 rounded-full transition-colors ${isDeepMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`h-3 w-3 rounded-full bg-white transition-all ${isDeepMode ? 'translate-x-4' : 'translate-x-0'}`} />
                 </div>
              </div>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 border border-slate-100 rounded-xl"><Share2 size={18} /></button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 bg-slate-50/20 custom-scrollbar">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`group relative w-full lg:max-w-[92%] ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-[32px] p-8 shadow-2xl' : 'bg-white border border-slate-200 text-slate-800 rounded-[32px] p-10 shadow-sm'}`}>
                   {msg.role === 'assistant' && (
                     <div className="absolute -top-3 left-6">
                        <div className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20 ring-4 ring-white">AI Assistant</div>
                     </div>
                   )}
                   
                   {msg.role === 'assistant' && msg.thought && isDeepMode && (
                     <div className="mb-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 overflow-hidden">
                        <button onClick={() => setIsThinkingExpanded(!isThinkingExpanded)} className="w-full flex items-center justify-between p-4 bg-white/40">
                           <div className="flex items-center gap-3">
                             <div className="relative">
                               <Cpu className="h-4 w-4 text-blue-600" />
                               <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-blue-400 rounded-full blur-[2px] -z-10" />
                             </div>
                             <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">专家思维链路 (CoT)</span>
                           </div>
                           <ChevronDown size={14} className={`text-blue-500 transition-transform ${isThinkingExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isThinkingExpanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4">
                               <p className="text-xs text-slate-600 italic leading-relaxed border-l-2 border-blue-100 pl-4 py-2">{msg.thought}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                   )}

                   <div className="text-[15px] leading-8 font-medium">{msg.content}</div>

                   {msg.role === 'assistant' && msg.citations && (
                     <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.citations.map((cite, i) => (
                          <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 transition-all cursor-pointer group/cite">
                             <div className="h-5 w-5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 flex items-center justify-center group-hover/cite:bg-blue-600 group-hover/cite:text-white transition-colors">{i+1}</div>
                             <div className="min-w-0">
                                <p className="text-[11px] text-slate-500 line-clamp-1">{cite.text}</p>
                                <p className="text-[9px] text-blue-600 font-bold uppercase tracking-tight mt-1">{cite.pageTitle}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>

                {msg.role === 'assistant' && (
                  <div className="mt-4 flex items-center gap-2 pl-4">
                     <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-500 hover:bg-white hover:text-blue-600 transition-all shadow-sm"><ThumbsUp size={14} /> 有帮助</button>
                     <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"><ThumbsDown size={14} /></button>
                     <div className="w-px h-4 bg-slate-200 mx-1" />
                     <button onClick={() => copyToClipboard(msg.content, msg.id)} className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                        {copiedId === msg.id ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={14} />}
                     </button>
                  </div>
                )}
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
           <div className="w-full mx-auto relative group">
              <div className="bg-white rounded-[32px] border-2 border-slate-100 p-2 shadow-2xl shadow-slate-200 transition-all focus-within:border-slate-900">
                 <textarea 
                  value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="询问任何关于知识库的问题..." 
                  className="w-full bg-transparent border-none text-base lg:text-lg focus:ring-0 outline-none resize-none px-6 pt-5 pb-16 min-h-[120px] max-h-[400px]"
                 />
                 <div className="absolute bottom-5 left-8 flex items-center gap-3">
                    <button className="px-4 py-2 rounded-full bg-slate-50 border text-[11px] font-black text-slate-500 hover:bg-slate-100 flex items-center gap-2 group/btn"><Zap size={14} className="text-blue-500 group-hover/btn:animate-pulse" /> 常用方案摘要</button>
                    <button className="hidden sm:flex px-4 py-2 rounded-full bg-slate-50 border text-[11px] font-black text-slate-500 hover:bg-slate-100 items-center gap-2"><Plus size={14} /> 关联文档</button>
                 </div>
                 <button onClick={handleSendMessage} disabled={!input.trim() || isTyping} className={`absolute bottom-4 right-4 h-14 w-14 rounded-full flex items-center justify-center shadow-xl transition-all ${input.trim() && !isTyping ? 'bg-slate-900 text-white hover:scale-105 active:scale-95' : 'bg-slate-50 text-slate-200'}`}>
                    {isTyping ? <Loader2 size={24} className="animate-spin" /> : <Send size={20} />}
                 </button>
              </div>
              <p className="mt-4 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest shrink-0">AI 助手可能产生误差，请核实重要信息</p>
           </div>
        </div>
      </div>
    </div>
  );
}
