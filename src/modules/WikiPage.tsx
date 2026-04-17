import { useState, useCallback, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Star, 
  ChevronRight, 
  Hash, 
  Share2, 
  History, 
  Edit, 
  MoreHorizontal,
  ExternalLink,
  GitBranch,
  BookMarked,
  FileText,
  BookOpen,
  List,
  ChevronDown,
  Settings,
  MoreVertical,
  Activity,
  Layers,
  ArrowRight,
  Maximize2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import KnowledgeGraph from '../components/KnowledgeGraph';
import { api } from '../lib/api.ts';
import { WikiPage } from '../types.ts';

export default function WikiPageModule() {
  const [activeTab, setActiveTab] = useState<'content' | 'graph'>('content');
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['root']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [activePage, setActivePage] = useState<WikiPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const data = await api.getWikiPages();
      setPages(data);
      if (data.length > 0 && !activePage) {
        setActivePage(data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch wiki pages:', error);
      setLoading(false);
    }
  };

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  };

  const handleNodeClick = useCallback((node: any) => {
    if (node.type === 'page') {
      const page = pages.find(p => p.id === node.id);
      if (page) setActivePage(page);
      setActiveTab('content');
    }
  }, [pages]);

  return (
    <div className="flex h-full bg-white relative overflow-hidden">
      {/* Knowledge Hierarchy Aside */}
      <aside className={`
        ${isSidebarOpen ? 'w-80' : 'w-0'} 
        flex flex-col border-r border-slate-200 bg-slate-50/50 transition-all duration-300 overflow-hidden shrink-0
      `}>
         <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <BookMarked size={16} className="text-blue-600" /> 知识目录
            </h2>
            <button className="p-1 px-2 text-[10px] font-black text-blue-600 uppercase transition-all hover:bg-blue-50 rounded">
               管理
            </button>
         </div>

         <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative mb-4">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input 
                type="text" 
                placeholder="语义搜索页面内容..." 
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
               />
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
               <Plus size={16} /> 创建新篇章
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
            <section>
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">快速访问</h4>
               <div className="space-y-1">
                  {pages.slice(0, 5).map(page => (
                    <div 
                      key={page.id} 
                      onClick={() => setActivePage(page)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${activePage?.id === page.id ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                    >
                       <Star size={14} className={`text-amber-400 transition-opacity ${activePage?.id === page.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                       <span className="truncate">{page.title}</span>
                    </div>
                  ))}
               </div>
            </section>

            <section>
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">知识层级结构</h4>
               <div className="space-y-2">
                  <div className="group">
                     <div 
                      onClick={() => toggleNode('root')}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-200/50 cursor-pointer transition-all"
                     >
                        <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-tight">
                           <ChevronDown size={14} className={`transition-transform duration-300 ${expandedNodes.includes('root') ? '' : '-rotate-90'}`} />
                           人工智能概貌
                        </div>
                        <span className="text-[9px] font-black text-slate-400">12</span>
                     </div>
                     {expandedNodes.includes('root') && (
                        <div className="ml-4 mt-2 border-l-2 border-slate-200 pl-4 space-y-1">
                           {['神经网络基础', '计算机视觉', '自然语言处理', '强化学习'].map(item => (
                              <div key={item} className="p-2 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all cursor-pointer flex items-center gap-2">
                                 <div className="h-1 w-1 rounded-full bg-slate-300" />
                                 {item}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
            </section>
         </div>

         <div className="p-4 border-t border-slate-200 bg-white/50">
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm">
               <Activity size={16} className="text-blue-500" />
               <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">知识发现指数</p>
                  <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                     <div className="h-full bg-blue-600 w-3/4" />
                  </div>
               </div>
            </div>
         </div>
      </aside>

      {/* Wiki Main Content Area */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
         <header className="h-20 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-6">
               <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition-all">
                  <List size={22} />
               </button>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 cursor-pointer">核心原理</span>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 cursor-pointer">深度学习</span>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight px-3 py-1 bg-slate-100 rounded-lg">
                     {activePage?.title || '未选择页面'}
                  </span>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="flex p-1 bg-slate-100 rounded-xl mr-4">
                  <button onClick={() => setActiveTab('content')} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                     原文内容
                  </button>
                  <button onClick={() => setActiveTab('graph')} className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'graph' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                     图谱视图
                  </button>
               </div>
               <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 group">
                  <Edit size={14} className="group-hover:rotate-12 transition-transform" /> 协同编辑
               </button>
               <button className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-all"><Share2 size={18} /></button>
               <button className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-all"><MoreVertical size={18} /></button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto bg-slate-50/20 custom-scrollbar">
            {activeTab === 'content' ? (
               <div className="max-w-[900px] mx-auto p-12 lg:p-20">
                  {activePage ? (
                    <motion.article 
                      key={activePage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-16 lg:p-24 min-h-[1200px] relative overflow-hidden"
                    >
                       <div className="mb-16 space-y-6">
                          <div className="flex items-center gap-4 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
                             <div className="h-px flex-1 bg-blue-100" />
                             DOC ID: #{activePage.id.toUpperCase().slice(0, 8)}
                             <div className="h-px flex-1 bg-blue-100" />
                          </div>
                          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                             {activePage.title}
                          </h1>
                          <div className="flex flex-wrap items-center gap-8 pt-4">
                             <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">AI</div>
                                <div>
                                   <p className="text-[10px] text-slate-400 font-black uppercase">主要执笔</p>
                                   <p className="text-xs font-bold text-slate-800">{activePage.author || '智能知识库引擎'}</p>
                                </div>
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase">最后修订</p>
                                <p className="text-xs font-bold text-slate-800">{activePage.updatedAt || '刚刚'}</p>
                             </div>
                             {activePage.tags && activePage.tags.length > 0 && (
                               <div className="flex gap-2">
                                  {activePage.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase border border-blue-100">{tag}</span>
                                  ))}
                               </div>
                             )}
                          </div>
                       </div>

                       <div 
                         className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tighter prose-p:text-slate-600 prose-p:text-lg prose-p:leading-[2] prose-strong:text-slate-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-blue-900"
                         dangerouslySetInnerHTML={{ __html: activePage.content || '' }}
                       />

                       <div className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-8">
                          {[`关联资源 (${activePage.citations || 0})`, '反向引用 (0)', '被引用指数 (Normal)', '标签热度 (Top)'].map(meta => (
                             <div key={meta} className="space-y-2 group cursor-pointer">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{meta.split(' (')[0]}</p>
                                <p className="text-xl font-black text-slate-900">{meta.includes('(') ? meta.split('(')[1].replace(')', '') : 'HOT'}</p>
                             </div>
                          ))}
                       </div>
                    </motion.article>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-20 text-slate-400 space-y-4">
                       <BookOpen size={64} className="opacity-20" />
                       <p className="font-black uppercase tracking-widest">暂无选定内容，请从左侧目录选择</p>
                    </div>
                  )}
               </div>
            ) : (
               <div className="h-full relative bg-slate-50">
                  <div className="absolute bottom-8 right-24 z-10 p-5 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-2xl max-w-[280px] ring-1 ring-slate-900/5 transition-all hover:bg-white">
                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Zap size={14} className="text-amber-500 fill-amber-500" /> 图谱交互指南
                     </h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-bold mb-4">
                        当前视图展示了知识库节点间的引用关联。您可以拖拽节点调整布局，或点击节点查看详细元数据。
                     </p>
                     <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                        <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-tighter transition-colors hover:bg-blue-100">滚轮缩放</div>
                        <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-tighter transition-colors hover:bg-emerald-100">左键点击</div>
                        <div className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-[9px] font-black uppercase tracking-tighter transition-colors hover:bg-amber-100">长按拖拽</div>
                     </div>
                  </div>
                  <KnowledgeGraph onNodeClick={handleNodeClick} />
               </div>
            )}
         </div>

         {/* Right Action Rail */}
         <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            <button className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:scale-110 active:scale-95 transition-all"><BookOpen size={20} /></button>
            <button className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:scale-110 active:scale-95 transition-all"><History size={20} /></button>
            <button className="h-12 w-12 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"><Maximize2 size={20} /></button>
         </div>
      </main>
    </div>
  );
}
