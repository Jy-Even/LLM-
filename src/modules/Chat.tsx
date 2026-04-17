import { useState, useRef, useEffect } from 'react';
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
  CheckCircle2
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat session
  useEffect(() => {
    if (!chatInstance.current) {
      chatInstance.current = ai.chats.create({
        model: MODELS.flash,
        config: {
          systemInstruction: "你是一个专业的知识库助手，擅长分析文档、回答深度学习相关问题。你的回答应当专业、准确，并尽量引用背景知识。",
        }
      });
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const newAssistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      thought: isDeepMode ? '正在检索知识库并思考最佳回答...' : undefined,
    };

    setMessages(prev => [...prev, newAssistantMessage]);

    try {
      const responseStream = await chatInstance.current.sendMessageStream({
        message: currentInput,
      });

      let fullContent = '';
      for await (const chunk of responseStream) {
        const text = chunk.text;
        fullContent += text;
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId 
            ? { ...msg, content: fullContent } 
            : msg
        ));
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId 
          ? { ...msg, content: '抱歉，生成回复时出错了。请重试。' } 
          : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 relative">
      {/* Session History Sidebar */}
      <div className={`
        fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none lg:z-0
        transition-opacity duration-300
        ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:visible'}
      `} onClick={() => setIsSidebarOpen(false)}>
        <div className={`
          absolute left-0 top-0 bottom-0 w-64 flex flex-col bg-white border-r border-slate-200 lg:rounded-2xl lg:border lg:shadow-sm overflow-hidden
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `} onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b border-slate-100">
             <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-hover hover:bg-slate-800 active:scale-95">
               <Plus className="h-4 w-4" /> 新建会话
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
             <div>
               <h5 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">今天</h5>
               <div className="space-y-1">
                 {['关于 Transformer 的总结', '模型量化方案讨论', 'RAG 系统架构图说明'].map((title, i) => (
                   <button key={i} className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all ${i === 0 ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                     <BookOpen className={`h-4 w-4 shrink-0 ${i === 0 ? 'text-blue-500' : 'text-slate-400'}`} />
                     <span className="truncate">{title}</span>
                   </button>
                 ))}
               </div>
             </div>
             <div>
               <h5 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">昨日</h5>
               <div className="space-y-1">
                 {['如何部署 Llama 3', '知识库数据清洗流程'].map((title, i) => (
                   <button key={i} className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-left text-slate-600 hover:bg-slate-50 transition-all">
                     <BookOpen className="h-4 w-4 shrink-0 text-slate-400" />
                     <span className="truncate">{title}</span>
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-1 flex-col bg-white lg:rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Chat Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900"
             >
               <List className="h-5 w-5" />
             </button>
             <Sparkles className="h-5 w-5 text-blue-500 shrink-0" />
             <h2 className="font-semibold text-slate-800 truncate text-sm sm:text-base">深度学习基础探讨</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-medium text-slate-500">深度思考</span>
              <button 
                onClick={() => setIsDeepMode(!isDeepMode)}
                className={`relative h-5 w-9 sm:h-6 sm:w-11 rounded-full p-1 transition-colors ${isDeepMode ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-white transition-transform ${isDeepMode ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] sm:max-w-[75%] lg:max-w-[70%] shadow-minimal ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-[16px_16px_0_16px]' : 'bg-white border border-slate-200 text-slate-800 rounded-[16px_16px_16px_0]'}`}>
                {msg.role === 'assistant' && (
                   <div className="px-4 sm:px-5 pt-3 text-[10px] sm:text-[12px] font-bold text-blue-600 uppercase tracking-tight">AI 助手</div>
                )}
                {msg.role === 'assistant' && msg.thought && isDeepMode && (
                  <div className="px-4 sm:px-5 py-3 border-b border-slate-100 bg-blue-50/30">
                    <button 
                      onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                      className="flex items-center justify-between w-full group/thought"
                    >
                      <div className="flex items-center gap-2.5 text-xs font-bold text-blue-600">
                        <div className="relative">
                          <Cpu className="h-4 w-4" />
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-blue-400 rounded-full blur-[2px] -z-10"
                          />
                        </div>
                        AI 思考深度链
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map(i => (
                            <motion.div 
                              key={i}
                              animate={{ height: [4, 8, 4] }}
                              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                              className="w-0.5 bg-blue-300 rounded-full"
                            />
                          ))}
                        </div>
                        {isThinkingExpanded ? <ChevronUp className="h-3.5 w-3.5 text-blue-400" /> : <ChevronDown className="h-3.5 w-3.5 text-blue-400" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isThinkingExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 text-xs text-slate-500 leading-relaxed border-l-2 border-blue-100 pl-4 py-1.5 space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <Activity className="h-3 w-3" /> 模型推理路径
                            </div>
                            <p className="italic">{msg.thought}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {['知识库检回', '逻辑验证', '上下文對齐'].map(step => (
                                <span key={step} className="px-1.5 py-0.5 rounded bg-white border border-slate-100 text-[9px] font-medium text-slate-400 flex items-center gap-1">
                                  <div className="h-1 w-1 rounded-full bg-blue-400" /> {step}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <div className="px-4 sm:px-5 py-3 sm:py-4 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-line overflow-hidden break-words">
                  {msg.content}
                </div>
                {msg.role === 'assistant' && msg.citations && (
                   <div className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">引用溯源</p>
                      <div className="space-y-2">
                        {msg.citations.map((cite, i) => (
                          <div key={i} className="group/cite flex items-start gap-3 cursor-pointer">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-400 group-hover/cite:border-blue-400 group-hover/cite:text-blue-600 shadow-sm transition-all">{i+1}</span>
                            <div className="space-y-0.5 min-w-0">
                              <p className="text-xs text-slate-600 line-clamp-1">{cite.text}</p>
                              <p className="text-[10px] text-blue-500 font-medium">来自 Wiki: {cite.pageTitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                )}
              </div>
              {msg.role === 'assistant' && (
                <div className="mt-2 flex items-center gap-1 opacity-100 sm:opacity-0 transition-opacity hover:opacity-100 group-messages pl-2">
                   <button className="p-1 px-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"><ThumbsUp className="h-3.5 w-3.5" /></button>
                   <button className="p-1 px-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"><ThumbsDown className="h-3.5 w-3.5" /></button>
                   <button 
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="p-1 px-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all flex items-center gap-1.5"
                   >
                     {copiedId === msg.id ? (
                       <>
                         <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                         <span className="text-[10px] text-green-600 font-bold">已复制</span>
                       </>
                     ) : (
                       <Copy className="h-3.5 w-3.5" />
                     )}
                   </button>
                   <button className="hidden sm:block p-1 px-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all text-[10px] font-medium ml-2 border border-slate-100">转存为 Wiki</button>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/30 shrink-0">
          <div className="max-w-[900px] mx-auto relative">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-lg focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all p-1">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="询问任何问题..." 
                  className="w-full bg-transparent border-none text-sm sm:text-[15px] focus:ring-0 resize-none px-4 py-3 min-h-[56px] max-h-[200px]"
                  style={{ height: 'auto' }}
                  rows={2}
                  disabled={isTyping}
                />
                <div className="flex items-center justify-between px-3 pb-2">
                   <div className="flex items-center gap-1">
                      <button className="hidden sm:flex items-center gap-1.5 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                        <Command className="h-4 w-4" />
                        <span className="text-[10px] font-bold">快捷指令</span>
                      </button>
                      <button className="hidden sm:flex items-center gap-1.5 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                        <Search className="h-4 w-4" />
                        <span className="text-[10px] font-bold">强制检索</span>
                      </button>
                      <button className="sm:hidden p-1.5 text-slate-500">
                        <Plus className="h-4 w-4" />
                      </button>
                   </div>
                   <button 
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl shadow-sm transition-all ${input.trim() && !isTyping ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' : 'bg-slate-100 text-slate-300'}`}
                   >
                     {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                   </button>
                </div>
             </div>
             <p className="mt-2 text-[9px] sm:text-[10px] text-center text-slate-400">
               LLM 助手也可能出错，请核实重要信息。
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
