import React, { useState } from 'react';
import { 
  Search as SearchIcon, 
  Mic, 
  Filter, 
  ChevronDown, 
  Clock, 
  Globe, 
  Star, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle2,
  Box,
  Hash,
  Activity,
  Maximize2,
  Share2,
  List,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchResult } from '../types.ts';
import { api } from '../lib/api.ts';
import { useToast } from '../lib/ToastContext.tsx';

export default function KnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [timeFilter, setTimeFilter] = useState('全部');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['All']);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const performSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const data = await api.search(query);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      toast('检索失败，请检查网络连接', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const saveToWiki = async (result: SearchResult) => {
    if (savedIds.includes(result.id)) return;
    
    try {
      await api.saveWikiPage({
        id: result.id,
        title: result.title,
        content: `### ${result.title}\n\n${result.snippet.replace(/<mark[^>]*>|<\/mark>/g, '')}\n\n*Source: ${result.source}*`,
        snippet: result.snippet,
        source: result.source,
        type: result.type,
        relevance: result.relevance,
        author: 'System',
        tags: ['AI', result.type.toUpperCase()]
      });

      setSavedIds(prev => [...prev, result.id]);
      toast(`"${result.title.slice(0, 20)}..." 已成功归档至 Wiki 知识库`, 'success');
    } catch (error) {
      console.error('Failed to save to wiki:', error);
    }
  };

  return (
    <div className="flex h-full bg-white relative overflow-hidden">
      {/* Discovery Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-80' : 'w-0'} 
        flex flex-col border-r border-slate-200 bg-slate-50/50 transition-all duration-300 overflow-hidden shrink-0
      `}>
         <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <Target size={16} className="text-blue-600" /> 知识挖掘
            </h2>
            <button onClick={() => { setQuery(''); setResults([]); toast('检索条件已重置'); }} className="p-1 px-2 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all">
               重置
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">多维过滤</h4>
               <div className="space-y-4">
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">时间窗口</p>
                     <div className="p-1 bg-slate-200/50 rounded-full flex items-center gap-1 relative overflow-hidden ring-1 ring-slate-100">
                        {['今日', '本周', '本月', '本年', '全部'].map(time => {
                           const isActive = timeFilter === time;
                           return (
                              <button 
                                 key={time} 
                                 onClick={() => setTimeFilter(time)}
                                 className={`relative flex-1 py-1.5 rounded-full text-[10px] font-black transition-all ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900 group'}`}
                              >
                                 {isActive && (
                                    <motion.div 
                                       layoutId="timeHighlightCompact"
                                       className="absolute inset-0 bg-white shadow-md ring-1 ring-slate-200/50 z-0 rounded-full"
                                       transition={{ type: 'spring', bounce: 0.1, duration: 0.5 }}
                                    />
                                 )}
                                 <span className="relative z-10">{time}</span>
                              </button>
                           );
                        })}
                     </div>
                  </div>

                  <div className="space-y-3 relative">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">源类型</p>
                     
                     <div className="relative">
                        <button 
                          onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 transition-all ${isTypeDropdownOpen ? 'bg-white border-blue-600 shadow-lg' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
                        >
                           <div className="flex items-center gap-2 overflow-hidden">
                              <Box size={14} className={selectedTypes.length > 0 && !selectedTypes.includes('All') ? 'text-blue-600' : 'text-slate-400'} />
                              <span className="text-[11px] font-black text-slate-700 truncate capitalize">
                                 {selectedTypes.includes('All') ? '全部类型' : selectedTypes.join(', ')}
                              </span>
                           </div>
                           <ChevronDown size={14} className={`text-slate-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                           {isTypeDropdownOpen && (
                              <>
                                 <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 right-0 top-full mt-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 space-y-1"
                                 >
                                    {['PDF', 'Wiki', 'Web', 'Docx', 'Notes', 'All'].map(type => {
                                       const isActive = selectedTypes.includes(type);
                                       return (
                                          <button 
                                             key={type} 
                                             onClick={() => {
                                                if (type === 'All') {
                                                   setSelectedTypes(['All']);
                                                   setIsTypeDropdownOpen(false);
                                                } else {
                                                   const newTypes = selectedTypes.filter(t => t !== 'All');
                                                   if (isActive) {
                                                      const filtered = newTypes.filter(t => t !== type);
                                                      setSelectedTypes(filtered.length === 0 ? ['All'] : filtered);
                                                   } else {
                                                      setSelectedTypes([...newTypes, type]);
                                                   }
                                                }
                                             }}
                                             className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[11px] font-black transition-all ${
                                                isActive 
                                                   ? 'bg-blue-50 text-blue-600' 
                                                   : 'text-slate-600 hover:bg-slate-50'
                                             }`}
                                          >
                                             <span className="capitalize">{type === 'All' ? '全部项目' : type}</span>
                                             {isActive && (
                                                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                                                   <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                </div>
                                             )}
                                          </button>
                                       );
                                    })}
                                 </motion.div>
                                 <div 
                                    className="fixed inset-0 z-40 bg-transparent" 
                                    onClick={() => setIsTypeDropdownOpen(false)} 
                                 />
                              </>
                           )}
                        </AnimatePresence>
                     </div>
                  </div>
               </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">核心主题 Tags</h4>
               <div className="flex flex-wrap gap-2">
                  {['神经网络', 'Transformer', '大规模语言模型', '知识蒸馏', '架构优化'].map(tag => (
                     <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[10px] font-black text-blue-600 border border-blue-100 cursor-pointer hover:bg-blue-600 hover:text-white transition-all">
                        <Hash size={10} /> {tag}
                     </span>
                  ))}
               </div>
            </div>

            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">热门检索趋势</h4>
               <div className="space-y-3">
                  {[
                    { text: 'RAG 系统的响应优化', trend: '+12%' },
                    { text: '多模态 Tokenization', trend: '+8%' },
                    { text: '向量数据库对比', trend: '+24%' }
                  ].map(item => (
                    <div key={item.text} 
                         onClick={() => { setQuery(item.text); setTimeout(performSearch, 50); }}
                         className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer">
                       <span className="text-xs font-bold text-slate-700">{item.text}</span>
                       <span className="text-[9px] font-black text-emerald-500 uppercase">{item.trend}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
         <header className="h-20 border-b border-slate-100 px-6 flex items-center gap-6 shrink-0 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition-all">
               <List size={22} />
            </button>
            
            <div className="flex-1 relative group">
               <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
               <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="键入自然语言指令 or 关键词启动语义检索..." 
                className="w-full h-14 pl-14 pr-32 bg-slate-50/50 border-2 border-slate-100 rounded-[24px] text-lg font-medium focus:bg-white focus:border-slate-900 focus:shadow-2xl transition-all outline-none"
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button onClick={() => toast('语音输入功能待接入')} className="p-2 text-slate-400 hover:text-slate-900"><Mic size={18} /></button>
                  <button onClick={performSearch} className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                     发现知识
                  </button>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button onClick={() => toast('已进入全屏检索模式')} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 shadow-sm"><Maximize2 size={18} /></button>
               <button onClick={() => toast('检索结果已可以分享', 'success')} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 shadow-sm"><Share2 size={18} /></button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-10 lg:p-14 bg-slate-50/20 custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-10">
               <AnimatePresence mode="wait">
                  {isSearching ? (
                    <motion.div 
                      key="searching"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center p-20 space-y-6"
                    >
                      <div className="relative h-16 w-16">
                         <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 border-4 border-slate-100 border-t-blue-600 rounded-full"
                         />
                      </div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                         正在扫描全量知识节点...
                      </p>
                    </motion.div>
                  ) : results.length > 0 ? (
                    <motion.div 
                       key="results"
                       initial={{ opacity: 0 }} 
                       animate={{ opacity: 1 }} 
                       exit={{ opacity: 0 }}
                       className="space-y-10"
                    >
                       <div className="flex items-center justify-between px-6 py-4 bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200">
                          <div className="flex items-center gap-3">
                             <TrendingUp size={16} className="text-blue-400" />
                             <p className="text-xs font-black text-white uppercase tracking-widest">
                                本次共找到 <span className="text-blue-400 text-sm">{results.length}</span> 个高匹配项
                             </p>
                          </div>
                          <div className="flex items-center gap-4">
                             <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                相关度优先 <Filter size={12} />
                             </span>
                          </div>
                       </div>
                       
                       {results.map((result, idx) => (
                         <motion.div
                           key={result.id}
                           initial={{ opacity: 0, y: 30 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.05 }}
                           className="group p-8 lg:p-10 rounded-[32px] bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-900 transition-all cursor-pointer relative overflow-hidden"
                         >
                            <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
                               <div className="flex-1 space-y-4">
                                  <div className="flex items-baseline gap-4">
                                     <h3 className="text-xl lg:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                        {result.title}
                                     </h3>
                                      <div className="flex items-center gap-2 shrink-0">
                                         <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 font-black text-[10px]">
                                            {result.type.toUpperCase()}
                                         </div>
                                         <button 
                                           onClick={(e) => { e.stopPropagation(); saveToWiki(result); }}
                                           className={`p-2 rounded-xl border transition-all ${
                                             savedIds.includes(result.id) 
                                               ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                               : 'bg-white text-slate-400 border-slate-100 hover:text-blue-600 hover:border-blue-100 shadow-sm'
                                           }`}
                                         >
                                            {savedIds.includes(result.id) ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                                         </button>
                                      </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                     <span className="flex items-center gap-2"><Globe size={12} className="text-blue-500" /> {result.source}</span>
                                     <span className="flex items-center gap-2"><Clock size={12} /> {result.date}</span>
                                     <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                                        <Activity size={10} /> 语义契合: {result.relevance}%
                                     </div>
                                  </div>
                               </div>

                               <div className="shrink-0 flex items-center justify-center">
                                  <div className="relative h-20 w-20 flex items-center justify-center">
                                     <motion.div 
                                       animate={{ rotate: 360 }}
                                       transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                       className="absolute inset-0 border-4 border-slate-100 border-t-blue-600 rounded-full"
                                     />
                                     <span className="text-xl font-black text-slate-900">{result.relevance}</span>
                                  </div>
                               </div>
                            </div>

                            <div 
                              className="text-base lg:text-lg text-slate-600 leading-[1.8] mb-10 border-l-4 border-slate-100 pl-8"
                              dangerouslySetInnerHTML={{ __html: result.snippet }}
                            />

                            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                               <div className="flex gap-4">
                                  <button onClick={(e) => { e.stopPropagation(); toast('已关注', 'success'); }} className="p-3 border border-slate-100 bg-white rounded-2xl text-slate-400 hover:text-blue-600 transition-all">
                                     <Star size={20} />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); saveToWiki(result); }}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                                  >
                                     <BookOpen size={18} /> {savedIds.includes(result.id) ? '查看 Wiki' : '存为 Wiki'}
                                  </button>
                               </div>
                               <button className="flex items-center gap-2 group/go text-sm font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-all">
                                  查看上下文原文 <ArrowRight size={18} className="group-hover/go:translate-x-2 transition-transform text-blue-600" />
                               </button>
                            </div>
                         </motion.div>
                       ))}
                    </motion.div>
                  ) : query.length > 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center p-20 text-center"
                    >
                       <Target size={48} className="text-slate-200 mb-6" />
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                          未找到相关匹配项<br/>尝试修改关键词
                       </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                       key="initial"
                       initial={{ opacity: 0 }} 
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="flex flex-col items-center justify-center p-20 text-center"
                    >
                       <Target size={64} className="text-slate-100 mb-8" />
                       <h3 className="text-lg font-black text-slate-900 uppercase tracking-[0.2em] mb-4">开启深度知识扫描</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">输入关键词探索知识图谱</p>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </main>
    </div>
  );
}
