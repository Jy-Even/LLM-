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
  Search
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { QualityIssue } from '../types.ts';

const mockData = [
  { name: 'Mon', errors: 12, warnings: 34, suggestions: 45 },
  { name: 'Tue', errors: 10, warnings: 32, suggestions: 48 },
  { name: 'Wed', errors: 8, warnings: 28, suggestions: 52 },
  { name: 'Thu', errors: 11, warnings: 35, suggestions: 42 },
  { name: 'Fri', errors: 6, warnings: 25, suggestions: 58 },
  { name: 'Sat', errors: 4, warnings: 20, suggestions: 65 },
  { name: 'Sun', errors: 2, warnings: 15, suggestions: 70 },
];

const pieData = [
  { name: '正常', value: 82, color: '#2563EB' },
  { name: '建议', value: 12, color: '#F59E0B' },
  { name: '错误', value: 6, color: '#EF4444' },
];

export default function QualityControl() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [issues] = useState<QualityIssue[]>([
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
    <div className="space-y-8">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-minimal flex items-center gap-5">
          <div className="h-12 w-12 rounded-full border-4 border-green-500 flex items-center justify-center text-sm font-bold text-slate-900">
            82
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">健康评分</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">良好</span>
            </div>
          </div>
        </div>

        {[
          { label: '待处理错误', value: '12', icon: '!', color: 'text-red-500', bg: 'bg-red-50' },
          { label: '潜在冲突', value: '24', icon: '⚠️', color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: '已修复趋势', value: '+15%', icon: '✓', color: 'text-green-500', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-minimal flex items-center gap-5">
            <div className={`h-11 w-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-lg font-bold`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h3 className="font-semibold text-slate-800">问题检测趋势 (过去 7 日)</h3>
            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">
               查看详细报表 <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                   cursor={{ stroke: '#2563EB', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="warnings" stroke="#F59E0B" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="suggestions" stroke="#3B82F6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800">定时任务配置</h3>
              <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
           </div>
           <div className="space-y-5">
              <div className="space-y-2">
                 <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">检测频率</p>
                 <select className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10">
                    <option>实时检测 (实时变更)</option>
                    <option>每小时检测一次</option>
                    <option>每天凌晨 (02:00)</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">自动修复 (Auto Lint)</p>
                 <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3 bg-slate-50/50">
                    <span className="text-sm text-slate-600">处理简单格式错误</span>
                    <button className="relative h-5 w-9 rounded-full bg-blue-600 p-0.5 shadow-inner">
                       <div className="h-4 w-4 rounded-full bg-white translate-x-4 shadow-sm" />
                    </button>
                 </div>
              </div>
              <button className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-slate-800 transition-all">
                立即手动全量检测
              </button>
           </div>
        </div>
      </div>

      {/* Issues List Area */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-4">
             <h3 className="font-bold text-slate-900">问题列表</h3>
             <div className="flex p-1 bg-slate-200 rounded-lg">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <List className="h-4 w-4" />
                </button>
             </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="搜索问题描述..." className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all" />
             </div>
             <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter className="h-3.5 w-3.5" /> 筛选类型 <ChevronDown className="h-3.5 w-3.5" />
             </button>
             <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
                批量修复
             </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue, idx) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-minimal hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                     <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        issue.severity === 'error' ? 'bg-red-50 text-red-500' :
                        issue.severity === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                     }`}>
                       {issue.type}
                     </span>
                     <span className="text-[10px] text-slate-400 font-medium">{issue.timestamp}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 leading-relaxed mb-4 min-h-[40px]">
                    {issue.description}
                  </h4>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">涉及页面</p>
                    <div className="flex -space-x-2">
                      {issue.affectedPages.map((page, i) => (
                        <div key={i} className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm" title={page}>
                           {page[0]}
                        </div>
                      ))}
                      {issue.affectedPages.length > 3 && (
                        <div className="h-7 w-7 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                           +{issue.affectedPages.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                   <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">忽略</button>
                   {issue.canAutoFix ? (
                     <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 active:scale-95 transition-all">
                       一键修复 <ArrowUpRight className="h-3 w-3" />
                     </button>
                   ) : (
                     <button className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all border border-slate-100">
                       查看详情 <ChevronRight className="h-3 w-3" />
                     </button>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">严重程度</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">问题描述</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">涉及页面</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">检测时间</th>
                      <th className="px-6 py-4 text-right pr-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">操作</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {issues.map(issue => (
                     <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             {issue.severity === 'error' ? <XCircle className="h-4 w-4 text-red-500" /> : 
                              issue.severity === 'warning' ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : 
                              <Lightbulb className="h-4 w-4 text-blue-500" />}
                             <span className="text-xs font-medium text-slate-600 capitalize">{issue.severity}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm text-slate-700 font-medium line-clamp-1 max-w-sm">{issue.description}</p>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-1">
                              {issue.affectedPages.map((p, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500">{p}</span>
                              ))}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-xs text-slate-400">{issue.timestamp}</span>
                        </td>
                        <td className="px-6 py-4 text-right pr-8">
                           <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">解决</button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}
