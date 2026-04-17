import { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { SearchResult } from '../types.ts';

export default function KnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const saveToWiki = (id: string) => {
    setSavedIds(prev => [...prev, id]);
  };
  const [results] = useState<SearchResult[]>([
    {
      id: '1',
      title: '深度学习中的高效架构设计',
      snippet: '在深度学习中，架构设计直接影响模型的推理效率。本文探讨了卷积神经网络（CNN）与 <mark class="bg-yellow-200">Transformer</mark> 架构的优化方案，特别是在移动设备端的能力...',
      source: 'Tech_Research_v2.pdf',
      relevance: 98,
      type: 'pdf',
      date: '2024-03-21'
    },
    {
      id: '2',
      title: '2024 年度 AI 行业趋势报告',
      snippet: '报告指出，大语言模型（LLM）的检索增强生成（RAG）技术正在成为知识库的核心。通过结合高效的 <mark class="bg-yellow-200">智能检索</mark> 和传统搜索引擎，企业能够...',
      source: 'Internal_Wiki',
      relevance: 85,
      type: 'doc',
      date: '2024-04-01'
    },
    {
      id: '3',
      title: '如何构建一个 RAG 系统',
      snippet: '构建一个基于知识库的问答系统需要考虑数据分块、模型选择以及重排序（Rerank）逻辑。对于 <mark class="bg-yellow-200">语义理解</mark> 的准确性至关重要...',
      source: 'https://docs.ai-system.io',
      relevance: 72,
      type: 'web',
      date: '2023-11-15'
    }
  ]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Search Sidebar Filters */}
      <div className="w-full lg:w-64 shrink-0 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">时间范围</h4>
              <div className="space-y-2">
                {['今天', '本周', '本月', '最近三个月', '自定义'].map(time => (
                  <label key={time} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`h-4 w-4 rounded border border-slate-300 transition-colors group-hover:border-blue-500 ${time === '本月' ? 'bg-blue-600 border-blue-600' : ''}`}>
                      {time === '本月' && <div className="mx-auto mt-0.5 h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={`text-sm ${time === '本月' ? 'text-blue-600 font-medium' : 'text-slate-600'}`}>{time}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="hidden sm:block lg:hidden h-full w-px bg-slate-100 mx-4" />

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">文档类型</h4>
              <div className="space-y-2">
                {['PDF 文档', 'Word / Docx', '网页爬取', '系统笔记'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked={type.includes('PDF')} />
                    <span className="text-sm text-slate-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 hidden lg:block"></div>

          <div>
             <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">标签过滤</h4>
             <div className="relative mb-2">
               <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
               <input type="text" placeholder="搜索标签..." className="w-full rounded bg-slate-50 border-none py-1 pl-7 pr-2 text-xs focus:ring-1 focus:ring-blue-500" />
             </div>
             <div className="flex flex-wrap gap-1.5">
               {['#技术', '#深度学习', '#入门', '#Q1', '#论文'].map(tag => (
                 <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-500 hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors">
                   {tag}
                 </span>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Search Main Results */}
      <div className="flex-1 space-y-6">
        {/* Large Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-4 sm:left-5 top-1/2 h-5 w-5 sm:h-6 sm:w-6 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入自然语言问题或关键词..." 
            className="w-full h-12 sm:h-14 rounded-full border border-slate-200 bg-white py-3 sm:py-4 pl-12 sm:pl-14 pr-24 sm:pr-32 text-sm sm:text-lg shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
          />
          <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-1.5">
            <button className="hidden sm:flex p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Mic className="h-5 w-5" />
            </button>
            <button className="bg-blue-600 text-white rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-blue-700 transition-hover">
              搜索
            </button>
          </div>
        </div>

        {/* Results Stream */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2">
            <span className="text-xs sm:text-sm text-slate-500">找到约 124 个结果，耗时 0.23 秒</span>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              排序方式: <span className="text-slate-900 font-medium cursor-pointer flex items-center gap-0.5">相关度 <ChevronDown className="h-4 w-4" /></span>
            </div>
          </div>

          {results.map((result, idx) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-minimal hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {result.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      {result.type === 'pdf' ? <FileText className="h-3.5 w-3.5 text-red-400" /> : 
                       result.type === 'web' ? <Globe className="h-3.5 w-3.5 text-blue-400" /> : 
                       <FileText className="h-3.5 w-3.5 text-blue-400" />}
                      {result.source}
                    </span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {result.date}</span>
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-400">
                        <Target className="h-2.5 w-2.5" /> 初始召回: {result.relevance - 5}%
                      </span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-[9px] font-bold text-blue-600">
                        <Zap className="h-2.5 w-2.5" /> AI 重排: {result.relevance}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start shrink-0">
                   <div className="flex items-center gap-2 mb-0 sm:mb-1">
                      <span className="text-[10px] font-medium text-slate-400">相关度</span>
                      <span className="text-[10px] font-bold text-blue-600">{result.relevance}%</span>
                   </div>
                   <div className="w-20 sm:w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.relevance}%` }}
                        className="h-full bg-blue-500"
                      />
                   </div>
                </div>
              </div>

              <div 
                className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: result.snippet }}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                <div className="flex gap-2">
                  <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all">
                    <Star className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg border border-slate-100 px-3 py-1 text-[10px] sm:text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors">
                    查看详情
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      saveToWiki(result.id);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-[10px] sm:text-xs font-bold transition-all border ${
                      savedIds.includes(result.id) 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
                    }`}
                  >
                    {savedIds.includes(result.id) ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> 已存入
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-3.5 w-3.5" /> 存为 Wiki
                      </>
                    )}
                  </button>
                </div>
                <button className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:gap-2.5 transition-all">
                  阅读原文 <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
