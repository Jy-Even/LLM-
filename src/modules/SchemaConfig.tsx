import { useState } from 'react';
import { 
  Database, 
  Settings, 
  Code, 
  Layout, 
  Plus, 
  Trash2, 
  Edit3, 
  FileJson,
  ShieldCheck,
  Save,
  History,
  AlertTriangle,
  Target,
  Layers,
  Box,
  Fingerprint,
  Type,
  FileText,
  MessageSquare,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SchemaConfig() {
  const [editMode, setEditMode] = useState<'visual' | 'code'>('visual');
  const [selectedCategory, setSelectedCategory] = useState('entity');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string | null>('ResearchPaper');

  const mockEntities = [
    { id: 'ResearchPaper', name: 'ResearchPaper', icon: <Box className="h-4 w-4" />, fields: 12, update: '3天前', description: '学术研究论文实体定义' },
    { id: 'TechManual', name: 'TechManual', icon: <FileText className="h-4 w-4" />, fields: 8, update: '1周前', description: '技术操作手册与说明书' },
    { id: 'ConferenceNote', name: 'ConferenceNote', icon: <MessageSquare className="h-4 w-4" />, fields: 5, update: '刚刚', description: '会议记录与访谈摘要' },
    { id: 'API_Reference', name: 'API_Reference', icon: <Code className="h-4 w-4" />, fields: 15, update: '2小时前', description: '系统接口与其文档定义' },
  ];

  return (
    <div className="flex h-full overflow-hidden bg-white">
      {/* Sidebar Navigation - Slim Rail */}
      <aside className={`
        fixed inset-0 z-50 bg-slate-900/40 lg:static lg:bg-transparent lg:z-0
        transition-opacity duration-300
        ${isSidebarOpen ? 'opacity-100 visible flex' : 'opacity-0 invisible lg:visible lg:flex'}
      `} onClick={() => setIsSidebarOpen(false)}>
        <div className={`
          w-16 bg-slate-900 flex flex-col items-center py-6 h-full shrink-0
          transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `} onClick={e => e.stopPropagation()}>
          <div className="mb-8 h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Database size={20} />
          </div>
          
          <div className="flex flex-col gap-4 w-full">
            {[
              { id: 'entity', icon: Box, label: '实体' },
              { id: 'relation', icon: Layers, label: '关系' },
              { id: 'mapping', icon: Settings, label: '映射' },
              { id: 'rules', icon: ShieldCheck, label: '规则' },
              { id: 'sync', icon: History, label: '同步' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
                className={`
                  w-full aspect-square flex flex-col items-center justify-center gap-1 transition-all group relative
                  ${selectedCategory === item.id 
                    ? 'text-white' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
                `}
              >
                {selectedCategory === item.id && (
                  <motion.div 
                    layoutId="activeRailTab"
                    className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                  />
                )}
                <item.icon size={20} />
                <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute left-16 bg-slate-800 text-white px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-auto pb-4">
             <button className="p-3 text-slate-500 hover:text-white transition-colors">
                <Settings size={20} />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Integrated Pane */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        {/* Module Header */}
        <header className="h-14 shrink-0 border-b border-slate-100 px-6 flex items-center justify-between bg-white backdrop-blur-md bg-white/80 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900"
            >
              <Layout className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
               <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">配置面板</h2>
               <div className="h-4 w-px bg-slate-200 mx-2" />
               <p className="text-xs text-slate-400 font-medium">{mockEntities.find(e => e.id === selectedEntity)?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button 
                onClick={() => setEditMode('visual')}
                className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${editMode === 'visual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                设计器
              </button>
              <button 
                onClick={() => setEditMode('code')}
                className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${editMode === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                源码
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
              <Save size={16} /> 保存
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {editMode === 'visual' ? (
            <>
              {/* List Section - Denser */}
              <div className="hidden md:flex w-64 shrink-0 border-r border-slate-100 flex-col overflow-hidden bg-slate-50/50">
                <div className="p-4 flex items-center justify-between border-b border-slate-200/50 bg-white">
                  <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">实体列表</span>
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {mockEntities.map(entity => (
                    <button 
                      key={entity.id}
                      onClick={() => setSelectedEntity(entity.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${
                        selectedEntity === entity.id 
                        ? 'bg-white shadow-sm ring-1 ring-slate-200' 
                        : 'hover:bg-slate-200/40 text-slate-600'
                      }`}
                    >
                      <div className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        selectedEntity === entity.id ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-400'
                      }`}>
                        {entity.name[0]}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate ${selectedEntity === entity.id ? 'text-slate-900' : 'text-slate-600 font-medium'}`}>{entity.name}</h4>
                        <div className="text-[9px] text-slate-400 mt-0.5 whitespace-nowrap">
                          {entity.fields} fields • {entity.update}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail/Editor Section - Multi-column */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                <AnimatePresence mode="wait">
                  {selectedEntity ? (
                    <motion.div 
                      key={selectedEntity}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8 space-y-10"
                    >
                      {/* Hero Overview */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-8">
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedEntity}</h3>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                               <span className="text-[10px] text-blue-700 font-black uppercase tracking-wider">Active Production</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                            {mockEntities.find(e => e.id === selectedEntity)?.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"><Edit3 size={14} /> 编辑基础信息</button>
                           <button className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                        </div>
                      </div>

                      {/* Fields Section - Multi-column Grid */}
                      <section className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">字段配置面板</h4>
                              <p className="text-xs text-slate-400 mt-0.5">管理数据模型的内部结构与约束</p>
                           </div>
                           <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-200">
                             <Plus size={16} /> 添加新字段
                           </button>
                        </div>
                        
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                          {[
                            { name: 'document_id', type: 'uuid', icon: Fingerprint, req: true, desc: '全局唯一标识系统生成的UUID' },
                            { name: 'title', type: 'string', icon: Type, req: true, desc: '文档或论文的主标题' },
                            { name: 'abstract', type: 'text', icon: FileText, req: false, desc: '论文的核心摘要及背景信息' },
                            { name: 'authors', type: 'array<string>', icon: Plus, req: true, desc: '参与创作的所有人员名单' },
                            { name: 'publish_date', type: 'datetime', icon: History, req: true, desc: '文档正式对外发布的服务器时间' },
                            { name: 'citation_count', type: 'number', icon: Target, req: false, desc: '该论文在外部学术库中的被引频次' }
                          ].map((field, idx) => (
                            <motion.div 
                              key={field.name} 
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all group/field"
                            >
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/field:bg-blue-600 group-hover/field:text-white transition-all duration-300">
                                   <field.icon size={20} />
                                 </div>
                                 <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-black text-slate-800">{field.name}</span>
                                      {field.req && <span className="text-[8px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-red-100">REQUIRED</span>}
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-tight">{field.desc}</p>
                                    <div className="text-[9px] font-mono font-black text-blue-500 uppercase">{field.type}</div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover/field:opacity-100 transition-all transform translate-x-2 group-hover/field:translate-x-0">
                                 <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Settings size={14} /></button>
                                 <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><X size={14} /></button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </section>

                      {/* Warnings and Meta */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 p-6 bg-slate-900 rounded-3xl flex gap-5 text-white shadow-2xl shadow-slate-400/20">
                           <div className="h-10 w-10 shrink-0 bg-blue-500/20 rounded-xl flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-blue-400" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-xs font-black uppercase tracking-widest text-blue-400">系统审计建议</p>
                              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                修改 `ResearchPaper` 架构可能会触发自动化数据重构任务。建议首先在 STAGING 环境进行演练，并确保 Elasticsearch 索引同步服务处于就绪状态。
                              </p>
                           </div>
                        </div>
                        <div className="p-6 bg-indigo-600 rounded-3xl flex flex-col justify-between text-white overflow-hidden relative group">
                           <Layers className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 group-hover:scale-110 transition-transform" />
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-60">数据血缘</p>
                           <h5 className="text-lg font-bold mt-2">12个下游关联</h5>
                           <p className="text-[10px] font-medium opacity-80 mt-1">影响5个独立应用模块</p>
                           <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">查看影响范围</button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-slate-400 p-10"
                    >
                      <Database className="h-20 w-20 opacity-5 mb-6" />
                      <p className="text-sm font-bold text-slate-900 mb-1">未选中实体</p>
                      <p className="text-xs text-slate-400 max-w-[200px] text-center">请从左侧列表选择一个数据模型，或开启上帝模式直接编写源码。</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex-1 flex bg-[#0B0F19] font-mono text-[13px] leading-relaxed relative overflow-hidden">
               <div className="w-12 shrink-0 border-r border-slate-800/50 bg-slate-900/30 flex flex-col items-center pt-4 text-slate-700 select-none hidden sm:flex">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="h-6 flex items-center">{i + 1}</div>
                  ))}
               </div>
               <div className="flex-1 px-8 py-6 text-indigo-100 overflow-auto custom-scrollbar">
<pre className="whitespace-pre">
{`{
  "version": "1.2.4",
  "entities": {
    "ResearchPaper": {
      "title": "Research Paper",
      "description": "Definition for academic and research documents",
      "properties": {
        "document_id": {
          "type": "uuid",
          "required": true,
          "unique": true
        },
        "title": {
          "type": "string",
          "index": "semantic"
        },
        "abstract": {
          "type": "text",
          "maxLength": 5000
        },
        "authors": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  }
}`}
</pre>
               </div>
               <div className="absolute top-4 right-10 p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                 JSON SCHEMA READY
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
