/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Database, 
  FileText, 
  LayoutDashboard, 
  MessageSquare, 
  Search, 
  Settings, 
  UploadCloud,
  Menu,
  Bell,
  User,
  Star,
  Hash,
  Share2,
  History,
  MoreHorizontal,
  Edit,
  Plus,
  Send,
  Zap,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  AlertTriangle,
  XCircle,
  Lightbulb,
  ArrowRight,
  Minimize2,
  Maximize2,
  Command,
  Search as SearchIcon,
  Sparkles,
  MousePointer2,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleId } from './types.ts';

// Modules
import DocumentUpload from './modules/DocumentUpload.tsx';
import WikiPageModule from './modules/WikiPage.tsx';
import KnowledgeSearch from './modules/Search.tsx';
import IntelligentChat from './modules/Chat.tsx';
import SchemaConfig from './modules/SchemaConfig.tsx';
import QualityControl from './modules/QualityControl.tsx';

function CommandPalette({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (id: ModuleId) => void }) {
  const [search, setSearch] = useState('');
  
  const items = [
    { id: 'wiki', label: 'Wiki 知识库', sub: '查阅与编辑页面', icon: BookOpen },
    { id: 'chat', label: '智能助手', sub: '基于 RAG 的问答', icon: MessageSquare },
    { id: 'search', label: '多源检索', icon: SearchIcon, sub: '搜索文档、网页与笔记' },
    { id: 'upload', label: '数据导入', icon: UploadCloud, sub: '上传并索引新文档' },
    { id: 'quality', label: '系统体检', icon: CheckCircle2, sub: '一致性与链接检查' },
    { id: 'schema', label: '结构配置', icon: Settings, sub: '定义实体与规则' },
  ];

  const filtered = items.filter(i => i.label.includes(search) || i.sub?.includes(search));

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleDown);
    return () => window.removeEventListener('keydown', handleDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <SearchIcon className="h-5 w-5 text-slate-400" />
          <input 
            autoFocus
            type="text" 
            placeholder="搜索功能或指令..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none text-base focus:ring-0 placeholder:text-slate-400"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400 uppercase">
            ESC
          </div>
        </div>
        
        <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {filtered.length > 0 ? (
            <div className="space-y-1">
              {filtered.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id as ModuleId);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-slate-700 group-hover:text-blue-700">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.sub}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-200 group-hover:text-blue-400 transition-all" />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Sparkles className="h-8 w-8 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">未找到相关功能</p>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400">
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><ChevronRight className="h-3 w-3" /> 选择</span>
              <span className="flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> 切换</span>
           </div>
           <div className="flex items-center gap-2">
              <Command className="h-3 w-3" /> <span>+ K</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('wiki');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleDown);
    return () => window.removeEventListener('keydown', handleDown);
  }, []);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="font-medium text-slate-500">Initializing Knowledge System...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'wiki', label: 'Wiki 页面', icon: BookOpen },
    { id: 'upload', label: '文档上传', icon: FileText },
    { id: 'search', label: '知识检索', icon: Search },
    { id: 'chat', label: '智能问答', icon: MessageSquare },
    { id: 'quality', label: '质量检测', icon: CheckCircle2 },
    { id: 'schema', label: 'Schema 配置', icon: Settings },
  ] as const;

  return (
    <div className="flex h-screen w-full flex-col bg-[#F8FAFC]">
      {/* Top Main Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 pr-4">LLM Wiki Pro</span>
          </div>
          
          <div className="h-8 w-px bg-slate-200" />
          
          <nav className="flex items-center gap-1 pl-2 overflow-x-auto no-scrollbar mask-fade-right max-w-[calc(100vw-300px)] lg:max-w-none">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`flex-none relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                  activeModule === item.id 
                    ? 'text-blue-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{item.label}</span>
                {activeModule === item.id && (
                  <motion.div 
                    layoutId="active-nav-pill"
                    className="absolute -bottom-[21px] left-0 right-0 h-1 bg-blue-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCommandOpen(true)}
            className="hidden xl:flex h-9 w-[240px] items-center gap-2 rounded-full bg-slate-100 px-4 border border-slate-200 hover:bg-white hover:border-blue-400 transition-all text-slate-400"
          >
            <Search className="h-4 w-4" />
            <span className="text-xs">快速检索...</span>
            <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 bg-slate-200/50 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <Command className="h-2.5 w-2.5" /> K
            </div>
          </button>
        </div>
      </header>

      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        onSelect={setActiveModule} 
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Module Content Wrapper */}
        <div className="w-full h-full min-h-full">
          <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`h-full ${activeModule === 'schema' ? 'p-0' : 'p-4 md:p-8'}`}
              >
                <div className={`h-full ${activeModule === 'wiki' ? 'mx-auto max-w-[1360px]' : 'w-full'}`}>
                {activeModule === 'upload' && <DocumentUpload />}
                {activeModule === 'wiki' && <WikiPageModule />}
                {activeModule === 'search' && <KnowledgeSearch />}
                {activeModule === 'chat' && <IntelligentChat />}
                {activeModule === 'schema' && <SchemaConfig />}
                {activeModule === 'quality' && <QualityControl />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

