import { useState, useEffect } from 'react';
import { 
  Search as SearchIcon, 
  Mic, 
  Filter, 
  ChevronDown, 
  Clock, 
  FileText, 
  Globe, 
  User, 
  Star, 
  BookOpen,
  MoreVertical,
  ArrowRight,
  TrendingUp,
  History,
  Zap,
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

export default function KnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState<{ message: string; id: string } | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
      setToast({ message: '检索失败，请检查网络连接', id: Math.random().toString() });
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
      setToast({ 
        message: `"${result.title.slice(0, 20)}..." 已成功归档至 Wiki 知识库`, 
        id: Math.random().toString() 
      });
      setTimeout(() => setToast(null), 3000);
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
            <button className="p-1 px-2 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all">
               重置
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">多维过滤</h4>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase">时间窗口</p>
                     <div className="flex flex-col gap-1">
                        {['今日', '本周', '本月', '本年', '全部'].map(time => (
                           <div key={time} className="flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                              <span>{time}</span>
                              <div className={`h-3 w-3 rounded-full border-2 border-slate-200 ${time === '全部' ? 'bg-blue-600 border-blue-600' : ''}`} />
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase">源类型</p>
                     <div className="flex flex-wrap gap-2">
                        {['PDF', 'Wiki', 'Web', 'Docx', 'Notes'].map(type => (
                           <button key={type} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                              {type}
                           </button>
                        ))}
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
                placeholder="键入自然语言指令或关键词启动语义检索..." 
                className="w-full h-14 pl-14 pr-32 bg-slate-50/50 border-2 border-slate-100 rounded-[24px] text-lg font-medium focus:bg-white focus:border-slate-900 focus:shadow-2xl transition-all outline-none"
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-900"><Mic size={18} /></button>
                  <button onClick={performSearch} className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                     发现知识
                  </button>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button className="p-2.5 border border-slate-200 rounded-xl text-slate-500 shadow-sm"><Maximize2 size={18} /></button>
               <button className="p-2.5 border border-slate-200 rounded-xl text-slate-500 shadow-sm"><Share2 size={18} /></button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-10 lg:p-14 bg-slate-50/20 custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-10">
               <div className="flex items-center justify-between px-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {isSearching ? '正在扫描全量知识节点...' : `本次共计扫描知识网络，找到 ${results.length} 个高匹配项`}
                  </p>
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-bold text-slate-500 flex items-center gap-2">相关度排序 <ChevronDown size={14} /></span>
                  </div>
               </div>

               <AnimatePresence>
                  {results.length === 0 && !isSearching && query.length > 0 && (
                     <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-10 text-center text-slate-400">
                        未找到与 "{query}" 相关的匹配项。尝试其他关键词或导入新知识。
                     </motion.div>
                  )}
                  {results.length === 0 && !isSearching && query.length === 0 && (
                     <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-10 text-center text-slate-400">
                        <Target size={48} className="mx-auto mb-4 opacity-20" />
                        输入关键词探索知识图谱，或点击左侧热门趋势。
                     </motion.div>
                  )}
                  {results.map((result, idx) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group p-8 lg:p-10 rounded-[32px] bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-900 transition-all cursor-pointer relative overflow-hidden"
                    >
                       <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
                          <div className="flex-1 space-y-4">
                             <div className="flex items-baseline gap-4">
                                <h3 className="text-xl lg:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                   {result.title}
                                </h3>
                                 <div className="flex items-center gap-2 shrink-0">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 font-black text-[10px]`}>
                                       {result.type.toUpperCase()}
                                    </div>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); saveToWiki(result); }}
                                      className={`p-2 rounded-xl border transition-all ${
                                        savedIds.includes(result.id) 
                                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                          : 'bg-white text-slate-400 border-slate-100 hover:text-blue-600 hover:border-blue-100 shadow-sm'
                                      }`}
                                      title="保存到 Wiki"
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
                                  initial={{ rotate: 0 }}
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
                             <button className="flex items-center gap-2 p-3 border border-slate-100 bg-white rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-400 transition-all">
                                <Star size={20} />
                             </button>
                             {savedIds.includes(result.id) ? (
                                <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                                   <ArrowRight size={18} /> 前往 Wiki 查看
                                </button>
                             ) : (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); saveToWiki(result); }}
                                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                                >
                                   <BookOpen size={18} /> 存为 Wiki 详情
                                </button>
                             )}
                          </div>
                          <button className="flex items-center gap-2 group/go text-sm font-black text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-all">
                             查看上下文原文 <ArrowRight size={18} className="group-hover/go:translate-x-2 transition-transform text-blue-600" />
                          </button>
                       </div>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-8 py-5 bg-slate-900 text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800 backdrop-blur-xl"
          >
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
               <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
            <p className="text-sm font-black tracking-tight whitespace-nowrap">{toast.message}</p>
            <div className="h-1 w-12 bg-slate-700/50 rounded-full overflow-hidden ml-4">
               <motion.div 
                 initial={{ width: '100%' }}
                 animate={{ width: '0%' }}
                 transition={{ duration: 3, ease: 'linear' }}
                 className="h-full bg-blue-500"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
