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
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import KnowledgeGraph from '../components/KnowledgeGraph';

export default function WikiPageModule() {
  const [activeTab, setActiveTab] = useState<'content' | 'graph'>('content');
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['root']);

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  };

  const handleNodeClick = useCallback((node: any) => {
    // If it's a page node, we simulate navigation to that page
    if (node.type === 'page') {
      setActiveTab('content');
      // In a real app, we'd set the current page ID here
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 sm:gap-8">
      {/* Wiki Sidebar */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="快速搜索页面..." 
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none transition-border"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-hover hover:bg-blue-700 active:scale-95 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            新建页面
          </button>
        </div>

        <div className="hidden sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-6">
          <section>
            <h4 className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              <Star className="h-3 w-3" /> 收藏夹
            </h4>
            <div className="space-y-0.5">
              {['深度学习基础', 'Transformer 架构详解'].map(title => (
                <button key={title} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors truncate">
                  <Hash className="h-3.5 w-3.5 text-slate-400" /> {title}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              <ChevronRight className="h-3 w-3" /> 目录树
            </h4>
            <div className="space-y-0.5">
              <div key="root">
                <button 
                  onClick={() => toggleNode('root')}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expandedNodes.includes('root') ? 'rotate-90' : ''}`} />
                  人工神经网络
                </button>
                {expandedNodes.includes('root') && (
                  <div className="ml-4 mt-0.5 border-l border-slate-100 pl-2 space-y-0.5">
                    {['CNN', 'RNN', 'GANs'].map(sub => (
                      <button key={sub} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100 transition-colors truncate">
                        <Hash className="h-3.5 w-3.5 opacity-50" /> {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="sm:col-span-2 lg:col-span-1">
            <h4 className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              标签云
            </h4>
            <div className="flex flex-wrap gap-1.5 px-2">
              {['AI', 'NLP', 'Math', 'Pytorch', 'Optimization'].map(tag => (
                <span key={tag} className="cursor-pointer rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-200 shadow-minimal flex flex-col relative overflow-hidden min-h-[500px]">
        <div className="flex flex-col border-b border-slate-100">
          <div className="flex items-center gap-2 px-6 pt-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest overflow-x-auto no-scrollbar">
            <span className="flex items-center gap-1.5 hover:text-blue-500 cursor-pointer transition-colors"><BookOpen className="h-3 w-3" /> 知识库仪表盘</span>
            <ChevronRight className="h-2.5 w-2.5 opacity-40 shrink-0" />
            <span className="flex items-center gap-1.5 hover:text-blue-500 cursor-pointer transition-colors">人工神经网络</span>
            <ChevronRight className="h-2.5 w-2.5 opacity-40 shrink-0" />
            <span className="text-slate-900 border-b border-blue-500 pb-0.5">深度学习基础</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <span className="text-sm font-bold text-slate-900 tracking-tight truncate max-w-full">近期编辑: 深度学习基础</span>
              <div className="flex p-1 bg-[#F1F5F9] rounded-lg sm:ml-4">
                <button 
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'content' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  内容
                </button>
                <button 
                  onClick={() => setActiveTab('graph')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'graph' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  图谱
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg bg-[#F1F5F9] px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 transition-all">
                编辑
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto custom-scrollbar ${activeTab === 'content' ? 'p-6 sm:p-12' : ''}`}>
          {activeTab === 'content' ? (
            <article className="mx-auto max-w-[800px] markdown-body">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4"># 深度学习基础：从神经元到网络</h1>
              <p className="text-sm text-slate-400 mb-8 flex items-center gap-4">
                <span>最后编辑: 2024-04-12 14:30</span>
              </p>

              <p>
                深度学习（Deep Learning）是机器学习的分支...
              </p>

              <h2 className="text-xl font-bold mb-3 mt-8"># 核心组件</h2>
              <p>一个典型的深度神经网络由以下三部分组成：</p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li><strong>Data Ingestion</strong>: 数据清洗与结构化处理</li>
                <li><strong>Retrieval</strong>: 基于关键词与语义的混合检索</li>
                <li><strong>Generation</strong>: 结合上下文的 LLM 答复</li>
              </ul>

              <div className="mt-8 p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl">
                 <div className="text-xs font-bold text-blue-600 mb-1">[[知识库索引策略]]</div>
                 <div className="text-[11px] text-slate-400">此页面被引用 42 次</div>
              </div>
            </article>
          ) : (
            <div className="h-full relative">
              <KnowledgeGraph onNodeClick={handleNodeClick} />
            </div>
          )}
        </div>

        <div className="mt-auto p-4 border-t border-slate-100 flex gap-2">
           {['#Architecture', '#LLM', '#RAG'].map(tag => (
             <span key={tag} className="px-3 py-1 bg-[#F1F5F9] text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">{tag}</span>
           ))}
        </div>

        {/* Floating Graph Toggle */}
        <button 
          onClick={() => setActiveTab(activeTab === 'content' ? 'graph' : 'content')}
          className="absolute bottom-6 right-6 h-12 w-12 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20"
        >
          {activeTab === 'content' ? <GitBranch className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}
