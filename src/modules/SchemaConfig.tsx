import { useState } from 'react';
import { 
  Database, 
  Settings, 
  Code, 
  Layout, 
  ChevronRight, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Folder, 
  FileJson,
  GitBranch,
  ShieldCheck,
  Save,
  History,
  AlertTriangle,
  Target,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

export default function SchemaConfig() {
  const [editMode, setEditMode] = useState<'visual' | 'code'>('visual');
  const [selectedCategory, setSelectedCategory] = useState('entity');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-140px)] gap-6 sm:gap-8 relative">
      {/* Settings Navigation Sidebar */}
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
          <div className="p-5 border-b border-slate-100">
             <h3 className="font-semibold text-slate-800 flex items-center gap-2">
               <Settings className="h-4 w-4 text-slate-400" /> 配置中心
             </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            <section>
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">结构配置</h4>
              <div className="space-y-1">
                <button 
                  onClick={() => setSelectedCategory('entity')}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-all ${selectedCategory === 'entity' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Database className="h-4 w-4" /> 实体类型 (Entities)
                </button>
                <button className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-600 hover:bg-slate-50">
                  <Layout className="h-4 w-4" /> 目录模板 (Templates)
                </button>
              </div>
            </section>

            <section>
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">规则配置</h4>
              <div className="space-y-1">
                <button className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-600 hover:bg-slate-50">
                  <Target className="h-4 w-4" /> 数据 Ingest 流程
                </button>
                <button className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-600 hover:bg-slate-50">
                  <Search className="h-4 w-4" /> Query 路由逻辑
                </button>
                <button className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-600 hover:bg-slate-50">
                  <ShieldCheck className="h-4 w-4" /> 知识 Lint 规则
                </button>
              </div>
            </section>

            <section>
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">系统管理</h4>
              <div className="space-y-1">
                <button className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-600 hover:bg-slate-50">
                  <ShieldCheck className="h-4 w-4" /> 角色权限 (RBAC)
                </button>
                <button className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-slate-600 hover:bg-slate-50">
                  <History className="h-4 w-4" /> 版本管理与回滚
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Main Configuration Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Sub Header */}
        <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 shrink-0 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900"
            >
              <Settings className="h-4 w-4" />
            </button>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">实体类型定义 (Entity Schema)</span>
            <span className="hidden xs:inline-block text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold whitespace-nowrap">V1.2 Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex p-1 bg-slate-200 rounded-lg">
              <button 
                onClick={() => setEditMode('visual')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${editMode === 'visual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Layout className="h-3 w-3" /> 可视化
              </button>
              <button 
                onClick={() => setEditMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${editMode === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Code className="h-3 w-3" /> YAML
              </button>
            </div>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all">
              <Save className="h-3.5 w-3.5" /> 保存更改
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {editMode === 'visual' ? (
            <div className="p-8 max-w-4xl mx-auto space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">系统实体 (System Entities)</h4>
                    <p className="text-sm text-slate-500">定义知识库中核心对象的结构化元数据。</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                    <Plus className="h-4 w-4" /> 添加实体
                  </button>
               </div>

               <div className="grid gap-4">
                 {['ResearchPaper', 'TechManual', 'ConferenceNote', 'API_Reference'].map((entity, i) => (
                   <motion.div 
                     key={entity}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="group p-5 border border-slate-100 rounded-2xl bg-white shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                   >
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                             {entity[0]}
                           </div>
                           <div>
                              <h5 className="font-semibold text-slate-800">{entity}</h5>
                              <p className="text-xs text-slate-400">上次更新: 3天前 • 12个字段</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-1">
                           <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-lg"><Edit3 className="h-4 w-4" /></button>
                           <button className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                        </div>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {['title:string:required', 'author:string', 'doi:string', 'published_at:date', 'tags:array:string'].map(field => {
                          const [name, type, req] = field.split(':');
                          return (
                            <div key={name} className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[11px]">
                               <span className="font-bold text-slate-700">{name}</span>
                               <span className="text-slate-400 font-mono">{type}</span>
                               {req && <span className="h-1 w-1 rounded-full bg-red-400" title="必填"></span>}
                            </div>
                          );
                        })}
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-slate-200 text-[11px] text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-all">
                           <Plus className="h-3 w-3" /> 添加字段
                        </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </div>
          ) : (
            <div className="h-full flex bg-slate-900 border-t border-slate-800 font-mono text-sm">
               <div className="w-12 border-r border-slate-800 bg-slate-900/50 flex flex-col items-center pt-4 text-slate-600 select-none">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="h-6 flex items-center">{i + 1}</div>
                  ))}
               </div>
               <div className="flex-1 p-4 text-slate-300 overflow-auto custom-scrollbar whitespace-pre">
{`# LLC Wiki Schema Definition
# Version 1.2.4
# Auth: System Admin

entities:
  ResearchPaper:
    title: string
    description: "学术研究论文实体定义"
    properties:
      title:
        type: string
        required: true
      authors:
        type: array
        items: string
      abstract:
        type: text
        maxLength: 2000
      published_date:
        type: date

  TechManual:
    title: string
    properties:
      product_name:
        type: string
        index: true`}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
