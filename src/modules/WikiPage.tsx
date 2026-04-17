import { useState, useCallback } from 'react';
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

export default function WikiPageModule() {
  const [activeTab, setActiveTab] = useState<'content' | 'graph'>('content');
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['root']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  };

  const handleNodeClick = useCallback((node: any) => {
    if (node.type === 'page') {
      setActiveTab('content');
    }
  }, []);

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
                  {['深度学习核心概念', 'Transformer 架构详解', '向量检索优化策略'].map(title => (
                    <div key={title} className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                       <Star size={14} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <span className="truncate">{title}</span>
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
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight px-3 py-1 bg-slate-100 rounded-lg">深度学习中的核心组件解析</span>
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
                  <motion.article 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-16 lg:p-24 min-h-[1200px] relative overflow-hidden"
                  >
                     
                     <div className="mb-16 space-y-6">
                        <div className="flex items-center gap-4 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
                           <div className="h-px flex-1 bg-blue-100" />
                           DOC ID: #DL-CORE-001
                           <div className="h-px flex-1 bg-blue-100" />
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                           深度学习中的<br />核心组件解析
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">AI</div>
                              <div>
                                 <p className="text-[10px] text-slate-400 font-black uppercase">主要执笔</p>
                                 <p className="text-xs font-bold text-slate-800">智能知识库引擎</p>
                              </div>
                           </div>
                           <div>
                              <p className="text-[10px] text-slate-400 font-black uppercase">最后修订</p>
                              <p className="text-xs font-bold text-slate-800">2024-04-12 14:30</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-slate-400 font-black uppercase">可读性评分</p>
                              <div className="flex gap-1 mt-1">
                                 {[1,2,3,4,5].map(i => <div key={i} className="h-1 w-4 rounded-full bg-blue-500" />)}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tighter prose-p:text-slate-600 prose-p:text-lg prose-p:leading-[2] prose-strong:text-slate-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-blue-900">
                        <h2># 背景与动机</h2>
                        <p>
                           在深度学习的研究与应用中，理解其核心组件是如何相互作用的至关重要。这不仅影响着模型的最终性能，更决定了系统在垂直领域执行任务时的<b>稳定性</b>与<b>可解释性</b>。
                        </p>

                        <blockquote>
                           “神经网络的本质并非简单的堆叠，而是对数据特征维度的不断抽象与非线性变换过程。”
                        </blockquote>

                        <h2># 核心三大支柱</h2>
                        <ul>
                           <li>
                              <strong>激活函数 (Activation Functions)</strong>: 
                              决定了神经元对信息的传递阈值与非线性特征。ReLU 及其变体是目前大规模工业应用的首选。
                           </li>
                           <li>
                              <strong>权重初始化 (Initialization)</strong>: 
                              由于深度网络的复杂梯度流动，合理的初始化策略能有效防止梯度消失或爆炸。
                           </li>
                           <li>
                              <strong>注意力机制 (Attention Mechanism)</strong>: 
                              彻底改变了序列建模的方式，通过计算输入序列内部的相互关联程度实现对信息的精准聚焦。
                           </li>
                        </ul>

                        <div className="my-16 p-10 bg-slate-900 rounded-[32px] text-white relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-20">
                              <Zap size={100} />
                           </div>
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">专家点评</h4>
                           <p className="text-lg font-medium leading-relaxed italic border-l-2 border-blue-500 pl-8">
                              “在高阶 RAG 架构中，Wiki 内容不仅是人类检索的对象，更是 LLM 执行上下文学习的关键语料。因此，内容的结构化深度直接决定了智能体的表现。”
                           </p>
                        </div>
                     </div>

                     <div className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {['关联资源 (12)', '反向引用 (86)', '被引用指数 (High)', '标签热度 (Top)'].map(meta => (
                           <div key={meta} className="space-y-2 group cursor-pointer">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{meta.split(' (')[0]}</p>
                              <p className="text-xl font-black text-slate-900">{meta.includes('(') ? meta.split('(')[1].replace(')', '') : 'HOT'}</p>
                           </div>
                        ))}
                     </div>
                  </motion.article>
               </div>
            ) : (
               <div className="h-full relative bg-slate-50">
                  <div className="absolute top-6 left-6 z-10 p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl max-w-xs">
                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <GitBranch size={14} className="text-blue-600" /> 图谱导航说明
                     </h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">当前视图展示了知识库中所有内容节点之间的逻辑引用关系。节点颜色代表内容权重，连线粗细代表相关度密度。</p>
                     <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><div className="h-2 w-2 rounded-full bg-blue-500" /> 原理</div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><div className="h-2 w-2 rounded-full bg-purple-500" /> 架构</div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><div className="h-2 w-2 rounded-full bg-emerald-500" /> 实践</div>
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
