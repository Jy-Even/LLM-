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
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleId } from './types.ts';

// Modules (I will implement basic views within this file for brevity or separate them if needed)
import DocumentUpload from './modules/DocumentUpload.tsx';
import WikiPageModule from './modules/WikiPage.tsx';
import KnowledgeSearch from './modules/Search.tsx';
import IntelligentChat from './modules/Chat.tsx';
import SchemaConfig from './modules/SchemaConfig.tsx';
import QualityControl from './modules/QualityControl.tsx';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('wiki');
  const [isLoaded, setIsLoaded] = useState(false);

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
          <div className="hidden xl:flex h-9 w-[240px] items-center gap-2 rounded-full bg-slate-100 px-4 border border-slate-200 focus-within:bg-white focus-within:border-blue-400 transition-all">
            <Search className="h-4 w-4 text-slate-400" />
            <input type="text" placeholder="快速检索..." className="bg-transparent border-none text-xs focus:ring-0 w-full" />
          </div>
        </div>
      </header>

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
              className="h-full p-4 md:p-8"
            >
              <div className="mx-auto max-w-[1360px] h-full">
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

