import { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  ChevronDown,
  LayoutGrid,
  List,
  ChevronRight,
  History,
  RefreshCw,
  Search,
  Activity,
  Zap,
  ShieldCheck,
  Cpu,
  MoreVertical,
  Settings,
  Bell
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { QualityIssue } from '../types.ts';

const mockData = [
  { name: '04-10', errors: 12, warnings: 34, suggestions: 45 },
  { name: '04-11', errors: 10, warnings: 32, suggestions: 48 },
  { name: '04-12', errors: 8, warnings: 28, suggestions: 52 },
  { name: '04-13', errors: 11, warnings: 35, suggestions: 42 },
  { name: '04-14', errors: 6, warnings: 25, suggestions: 58 },
  { name: '04-15', errors: 4, warnings: 20, suggestions: 65 },
  { name: '04-16', errors: 2, warnings: 15, suggestions: 70 },
];

export default function QualityControl() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'tasks'>('overview');
  const [isScanning, setIsScanning] = useState(false);
  const [toast, setToast] = useState<{ message: string; id: string } | null>(null);

  const handleStartScan = () => {
    setIsScanning(true);
    setToast({ message: '开始对 4.2k 个文档进行分布式全量扫描...', id: Date.now().toString() });
    setTimeout(() => setToast(null), 3000);
    setTimeout(() => {
      setIsScanning(false);
      setToast({ message: '全量扫描完成，发现 2 个新建议项', id: Date.now().toString() });
      setTimeout(() => setToast(null), 3000);
    }, 4000);
  };
  
  const [issues, setIssues] = useState<QualityIssue[]>([
    {
      id: '1',
      type: 'contradiction',
      severity: 'error',
      description: '文档 "Transformer_v1" 与 "Transformer_v2" 存在参数矛盾：隐藏层维度定义不一致 (512 vs 1024)。',
      affectedPages: ['架构详解.v1', '架构详解.v2'],
      timestamp: '10 分钟前',
      canAutoFix: false
    },
    {
      id: '2',
      type: 'broken-link',
      severity: 'warning',
      description: '检测到孤立节点：页面 "旧版数据迁移脚本" 未被任何其他页面引用。',
      affectedPages: ['旧版数据迁移脚本'],
      timestamp: '1 小时前',
      canAutoFix: true
    },
    {
      id: '3',
      type: 'format',
      severity: 'suggestion',
      description: '建议优化：3 个代码块缺少指定的编程语言高亮标识，可能影响 LLM 解析准确度。',
      affectedPages: ['API 接口文档', '入门指南'],
      timestamp: '昨天',
      canAutoFix: true
    }
  ]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
      {/* Dynamic Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="relative">
                  <div className="h-10 w-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                     <ShieldCheck size={20} />
                  </div>
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
               </div>
               <div>
                  <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">质量管理中心</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">实时知识库健康审计 (Active)</p>
               </div>
            </div>

            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
               {[
                 { id: 'overview', label: '总览', icon: LayoutGrid },
                 { id: 'issues', label: '异常项', icon: AlertTriangle },
                 { id: 'tasks', label: '检测任务', icon: Activity }
               ].map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   <tab.icon size={14} /> {tab.label}
                 </button>
               ))}
            </nav>
         </div>

         <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 pr-4 border-r border-slate-200">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">健康评分</p>
                  <p className="text-sm font-black text-emerald-600">82 / 100</p>
               </div>
               <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-emerald-500" />
               </div>
            </div>
            <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Bell size={18} /></button>
            <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl"><Settings size={18} /></button>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 custom-scrollbar">
         {activeTab === 'overview' && (
           <div className="max-w-[1600px] mx-auto space-y-10">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                   { label: '待修复异常', value: '12', trend: '+2', trendType: 'up', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
                   { label: '潜在冲突', value: '24', trend: '-8', trendType: 'down', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
                   { label: '优化建议', value: '156', trend: '+12', trendType: 'up', icon: Lightbulb, color: 'text-blue-500', bg: 'bg-blue-50' },
                   { label: '平均解析准确率', value: '94.2%', trend: '+0.5%', trendType: 'up', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                 ].map((stat, i) => (
                   <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="group rounded-[32px] bg-white border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:border-slate-900 transition-all cursor-pointer relative overflow-hidden"
                   >
                     <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                        <stat.icon size={26} />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                     <div className="flex items-baseline gap-4">
                        <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                        <span className={`text-[10px] font-black uppercase flex items-center gap-1 ${stat.trendType === 'up' ? 'text-red-500' : 'text-emerald-500'}`}>
                           {stat.trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {stat.trend}
                        </span>
                     </div>
                   </motion.div>
                 ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 rounded-[32px] bg-white border border-slate-200 p-10 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                       <div>
                          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">质量演变趋势</h3>
                          <p className="text-xs font-medium text-slate-400 mt-1">知识库异动与解析错误追踪 (过去 7 日)</p>
                       </div>
                       <div className="flex gap-2">
                          {['Errors', 'Warnings', 'Optimized'].map(l => (
                             <span key={l} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                <div className={`h-2 w-2 rounded-full ${l === 'Errors' ? 'bg-red-500' : l === 'Warnings' ? 'bg-amber-500' : 'bg-blue-500'}`} /> {l}
                             </span>
                          ))}
                       </div>
                    </div>
                    <div className="h-80 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={mockData}>
                             <defs>
                                <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                                   <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} />
                             <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} />
                             <Tooltip 
                                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '16px' }}
                             />
                             <Area type="monotone" dataKey="errors" stroke="#EF4444" fillOpacity={1} fill="url(#colorErrors)" strokeWidth={4} />
                             <Area type="monotone" dataKey="warnings" stroke="#F59E0B" fill="transparent" strokeWidth={4} strokeDasharray="8 4" />
                             <Area type="monotone" dataKey="suggestions" stroke="#3B82F6" fill="transparent" strokeWidth={4} />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="flex flex-col gap-8">
                    <div className="rounded-[32px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-10 shadow-xl relative overflow-hidden group">
                       <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform">
                          <Zap size={200} />
                       </div>
                       <h3 className="text-xl font-black uppercase tracking-tight mb-4">智能核查引擎</h3>
                       <p className="text-sm font-medium text-indigo-100 mb-8 leading-relaxed">
                         {isScanning ? '正在高速并行解析底层数据图谱并定位逻辑冲突...' : '当前正在通过分布式推理集群对 4.2k 个文档进行深度语义对齐校验...'}
                       </p>
                       <div className="space-y-4 relative z-10">
                          <button onClick={handleStartScan} disabled={isScanning} className={`w-full py-4 text-sm font-black uppercase tracking-widest rounded-2xl transition-all shadow-md ${isScanning ? 'bg-indigo-800 text-indigo-300 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-slate-50 active:scale-95'}`}>
                             {isScanning ? '扫描中...' : '立即启动全量扫描'}
                          </button>
                          <button className="w-full py-4 border border-indigo-400 text-indigo-100 rounded-2xl text-sm font-black uppercase tracking-widest hover:border-white hover:text-white transition-all">
                             配置自动化规则
                          </button>
                       </div>
                    </div>

                    <div className="rounded-[32px] bg-white border border-slate-200 p-8 shadow-sm">
                       <div className="flex items-center justify-between mb-6">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">资源占用率</h4>
                          <Activity size={12} className="text-blue-500" />
                       </div>
                       <div className="space-y-6">
                          {['解析算力 (CPU)', '向量存储 (DISK)', '实时内存 (RAM)'].map(item => (
                             <div key={item} className="space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-black text-slate-700 uppercase">
                                   <span>{item}</span>
                                   <span>{Math.floor(Math.random() * 40 + 30)}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                   <motion.div initial={{ width: 0 }} animate={{ width: `${Math.floor(Math.random() * 40 + 30)}%` }} className="h-full bg-slate-900" />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Latest Critical Issues */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">待处理的关键异常</h3>
                    <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline">查看全部 124 个异常 <ChevronRight size={14} className="inline" /></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.map(issue => (
                      <div key={issue.id} className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-900 transition-all group">
                         <div className="flex items-center justify-between mb-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                               issue.severity === 'error' ? 'bg-red-50 text-red-600 border border-red-100' :
                               issue.severity === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                               {issue.type}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">{issue.timestamp}</span>
                         </div>
                         <h4 className="text-base font-bold text-slate-900 leading-relaxed mb-6 line-clamp-2">{issue.description}</h4>
                         <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                            <div className="flex -space-x-2">
                               {issue.affectedPages.map((p, i) => (
                                 <div title={p} key={i} className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-600 shadow-sm">{p[0]}</div>
                               ))}
                            </div>
                            <button 
                              onClick={() => {
                                setIssues(issues.filter(i => i.id !== issue.id));
                                setToast({ message: '异常已标记为解决', id: Math.random().toString() });
                                setTimeout(() => setToast(null), 3000);
                              }}
                              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                            >
                               解决 <ArrowUpRight size={12} />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'issues' && (
           <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-3xl font-black text-slate-900 uppercase">异常库</h2>
                 <div className="flex items-center gap-3">
                    <div className="relative">
                       <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="text" placeholder="快速定位异常项..." className="pl-12 pr-6 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm outline-none w-80 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                    </div>
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500"><Filter size={20} /></button>
                 </div>
              </div>
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">描述</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">关联页面</th>
                          <th className="px-10 py-6 text-right pr-12 text-[10px] font-black text-slate-400 uppercase tracking-widest">操作</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {issues.map(issue => (
                          <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-10 py-8">
                                <span className={`flex items-center gap-2 text-xs font-black uppercase tracking-tighter ${issue.severity === 'error' ? 'text-red-600' : 'text-amber-600'}`}>
                                   <div className={`h-2 w-2 rounded-full ${issue.severity === 'error' ? 'bg-red-600' : 'bg-amber-600'}`} /> {issue.severity}
                                </span>
                             </td>
                             <td className="px-10 py-8">
                                <p className="text-sm font-bold text-slate-900 max-w-lg">{issue.description}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{issue.timestamp}</p>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex gap-2">
                                   {issue.affectedPages.map(p => (
                                      <span key={p} className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{p}</span>
                                   ))}
                                </div>
                             </td>
                             <td className="px-10 py-8 text-right pr-12">
                                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 transition-all"><MoreVertical size={18} /></button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
         )}

         {activeTab === 'tasks' && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <Cpu size={64} className={`opacity-20 mb-6 ${isScanning ? 'animate-pulse text-blue-500' : ''}`} />
               <p className="text-lg font-black uppercase tracking-[0.2em] opacity-50">
                 {isScanning ? '核心计算集群正在火力全开处理知识扫描任务...' : '分布式核查算力池正在调度中...'}
               </p>
            </div>
         )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-900 text-white rounded-full shadow-lg font-bold text-sm flex items-center gap-2"
          >
             {isScanning ? <RefreshCw size={16} className="animate-spin text-blue-400" /> : <CheckCircle2 size={16} className="text-emerald-400" />} {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
