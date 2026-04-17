import React, { useState, useMemo } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  RotateCcw,
  Eye,
  File,
  ImageIcon,
  Type,
  ExternalLink,
  ChevronRight,
  Search,
  List,
  Filter,
  MoreVertical,
  Download,
  Info,
  Layers,
  Archive,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadFile } from '../types.ts';
import { api } from '../lib/api.ts';
import { useToast } from '../lib/ToastContext.tsx';

export default function DocumentUpload() {
  const [files, setFiles] = useState<UploadFile[]>([
    { 
      id: '1', 
      name: '2024_Technical_Specs.pdf', 
      size: '2.4 MB', 
      type: 'pdf', 
      progress: 100, 
      status: 'success',
      content: '## Technical Specifications 2024\n\n### Overview\nThis document outlines the architectural requirements for the next-generation knowledge graph system...\n\n### Key Metrics\n- Latency: < 100ms\n- Scalability: 10M+ nodes\n- Reliability: 99.99%',
      previewUrl: 'https://picsum.photos/seed/pdf/800/1200'
    },
    { 
      id: '2', 
      name: 'Product_Market_Fit.docx', 
      size: '1.1 MB', 
      type: 'doc', 
      progress: 100, 
      status: 'success',
      content: 'Market Analysis Summary:\n\n1. Target Audience: Knowledge workers and researchers.\n2. Pain Points: Information silos and hard-to-navigate documentation.\n3. Solution: AI-powered graph visualization and search.'
    },
    { 
      id: '3', 
      name: 'Architecture_Diagram.png', 
      size: '4.8 MB', 
      type: 'image', 
      progress: 100, 
      status: 'success',
      previewUrl: 'https://picsum.photos/seed/arch/800/600'
    },
    { 
      id: '4', 
      name: 'README.md', 
      size: '12 KB', 
      type: 'md', 
      progress: 100, 
      status: 'success',
      content: '# Knowledge Base Project\n\nThis is a README file for the structured data project. Use this to index local files.'
    },
  ]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>('1');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setFiles(prev => prev.filter(f => !selectedIds.includes(f.id)));
    if (selectedFileId && selectedIds.includes(selectedFileId)) {
      setSelectedFileId(null);
    }
    toast(`已批量删除 ${selectedIds.length} 个文档`, 'success');
    setSelectedIds([]);
    setIsBulkMode(false);
  };

  const handleBulkIndex = async () => {
    if (selectedIds.length === 0) return;
    toast(`正在对 ${selectedIds.length} 个文档进行深度索引...`, 'info');
    
    try {
      const selectedFiles = files.filter(f => selectedIds.includes(f.id));
      for (const file of selectedFiles) {
        await api.saveWikiPage({
          id: file.id,
          title: file.name,
          content: file.content || '批量索引导入的内容',
          snippet: '批量导出的结构化索引',
          source: 'Bulk Action',
          type: file.type,
          relevance: 100,
          author: 'System',
          tags: ['BulkIndexed', file.type.toUpperCase()]
        });
      }
      toast(`成功建立 ${selectedIds.length} 个结构化索引`, 'success');
    } catch (err) {
      console.error(err);
      toast('部分文档索引失败', 'error');
    }
    
    setSelectedIds([]);
    setIsBulkMode(false);
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredFiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFiles.map(f => f.id));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file: File) => {
        return {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
          type: file.type.includes('image') ? 'image' : file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.md') ? 'md' : 'doc',
          progress: 100,
          status: 'success' as const,
          content: '新上传的文档内容。此文档已被智能引擎解析入库。',
          previewUrl: file.type.includes('image') ? URL.createObjectURL(file) : undefined
        };
      });
      setFiles(prev => [...newFiles, ...prev]);
      if (newFiles.length > 0) {
        setSelectedFileId(newFiles[0].id);
        
        // Push the first uploaded file to the Wiki DB to simulate backend indexing pipeline
        try {
          await api.saveWikiPage({
            id: newFiles[0].id,
            title: newFiles[0].name,
            content: newFiles[0].content,
            snippet: '此文档刚被系统扫描并建立结构化索引',
            source: 'Local Upload',
            type: newFiles[0].type,
            relevance: 100,
            author: 'Current User',
            tags: ['Uploaded', newFiles[0].type.toUpperCase()]
          });
        } catch (err) {
          console.error("Auto-index failed", err);
        }
      }
    }
  };

  const filteredFiles = useMemo(() => {
    return files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [files, searchQuery]);

  const selectedFile = useMemo(() => {
    return files.find(f => f.id === selectedFileId) || null;
  }, [files, selectedFileId]);

  const removeFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles(files.filter(f => f.id !== id));
    if (selectedFileId === id) setSelectedFileId(null);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-rose-500" />;
      case 'doc': return <File className="h-5 w-5 text-blue-500" />;
      case 'image': return <ImageIcon className="h-5 w-5 text-purple-500" />;
      case 'md': return <Type className="h-5 w-5 text-emerald-500" />;
      default: return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex h-full bg-white relative overflow-hidden">
      {/* Knowledge Source Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-80' : 'w-0'} 
        flex flex-col border-r border-slate-200 bg-slate-50/50 transition-all duration-300 overflow-hidden shrink-0
      `}>
         <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <Layers size={16} className="text-blue-600" /> 知识源
            </h2>
            <button 
              onClick={() => {
                setIsBulkMode(!isBulkMode);
                setSelectedIds([]);
              }} 
              className={`p-1 px-2 text-[10px] font-black uppercase transition-all rounded ${isBulkMode ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
            >
               {isBulkMode ? '取消批量' : '批量操作'}
            </button>
         </div>

         {isBulkMode && (
            <div className="p-3 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between gap-2">
               <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === filteredFiles.length && filteredFiles.length > 0} 
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[10px] font-black text-blue-700 uppercase">全选 ({selectedIds.length})</span>
               </div>
               <div className="flex gap-1">
                  <button onClick={handleBulkIndex} className="p-1.5 bg-blue-600 text-white rounded-lg transition-all hover:bg-blue-700 disabled:opacity-50" disabled={selectedIds.length === 0} title="批量索引">
                     <Cpu size={14} />
                  </button>
                  <button onClick={handleBulkDelete} className="p-1.5 bg-rose-600 text-white rounded-lg transition-all hover:bg-rose-700 disabled:opacity-50" disabled={selectedIds.length === 0} title="批量删除">
                     <Trash2 size={14} />
                  </button>
               </div>
            </div>
         )}

         <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative mb-4">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
               <input 
                type="text" 
                placeholder="搜索文档库..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
               />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              onChange={handleFileUpload} 
              accept=".pdf,.doc,.docx,.txt,.md,image/*" 
            />
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg shadow-slate-200 hover:bg-blue-600 transition-all">
               <UploadCloud size={14} /> 导入新文档
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            <div className="flex items-center justify-between px-2 mb-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最近上传 ({filteredFiles.length})</span>
               <Filter size={12} className="text-slate-400" />
            </div>
            <AnimatePresence mode="popLayout">
               {filteredFiles.map((file) => (
                 <motion.div
                   layout
                   key={file.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   onClick={() => !isBulkMode && setSelectedFileId(file.id)}
                   className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedFileId === file.id && !isBulkMode ? 'bg-white shadow-sm ring-1 ring-slate-200 font-bold' : 'text-slate-600 hover:bg-slate-200/50'}`}
                 >
                   {isBulkMode && (
                     <input 
                       type="checkbox" 
                       checked={selectedIds.includes(file.id)}
                       onChange={(e) => toggleSelect(file.id, e as any)}
                       onClick={(e) => e.stopPropagation()}
                       className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                     />
                   )}
                   <div className={`h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm`}>
                      {getFileIcon(file.type)}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm truncate text-slate-900">{file.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{file.size} • {file.type}</p>
                   </div>
                   <button onClick={(e) => removeFile(file.id, e)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-500 rounded transition-all">
                      <X size={12} />
                   </button>
                 </motion.div>
               ))}
            </AnimatePresence>
         </div>

         <div className="p-4 border-t border-slate-200 bg-white/50 space-y-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
               <div className="flex items-center gap-2 mb-2">
                  <Info size={12} className="text-blue-500" />
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-tighter">知识库容量</span>
               </div>
               <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[65%]" />
               </div>
               <p className="mt-2 text-[10px] text-slate-500 font-medium">12.4GB / 20.0GB 已用</p>
            </div>
         </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
         <header className="h-16 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
               <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                  <List size={20} />
               </button>
               <div>
                  <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">文档详情与预览</h1>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                     <span>存储空间: Cloud A1</span>
                     <span className="text-blue-500">已索引</span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
               <button onClick={() => toast('正在导出结构化数据...', 'success')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                  <Download size={14} /> 导出解析数据
               </button>
               <button onClick={() => toast('文档已加入归档队列', 'success')} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-red-600 transition-all shadow-sm">
                  <Archive size={18} />
               </button>
               <button onClick={() => toast('已展示更多操作选项')} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-all shadow-sm">
                  <MoreVertical size={18} />
               </button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto bg-slate-50/30 custom-scrollbar">
            {selectedFile ? (
               <div className="max-w-4xl mx-auto p-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] border border-slate-200 shadow-2xl p-10 min-h-[800px] flex flex-col relative overflow-hidden"
                  >
                     {/* Decorative background for file icons */}
                     <div className="absolute top-0 right-0 p-8 opacity-5">
                        <FileText size={120} />
                     </div>

                     <div className="flex items-center gap-5 border-b border-slate-100 pb-8 mb-10">
                        <div className="h-16 w-16 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-800 border border-slate-200 shadow-sm">
                           {getFileIcon(selectedFile.type)}
                        </div>
                        <div>
                           <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedFile.name}</h2>
                           <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase"><Info size={12} /> {selectedFile.size}</span>
                              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-100">已完成多维度解析</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex-1 prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed">
                        {selectedFile.type === 'image' ? (
                           <div className="w-full flex flex-col gap-6">
                              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xl ring-4 ring-slate-100 transition-transform active:scale-[0.98]">
                                 <img src={selectedFile.previewUrl} alt="Preview" className="w-full h-auto object-contain max-h-[600px] my-0" />
                              </div>
                              <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-x-auto">
                                 <div className="flex items-center gap-3 mb-4">
                                    <Cpu size={14} className="text-blue-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">OCR & 视觉大模型解析结果</span>
                                 </div>
                                 <p className="text-sm font-medium leading-relaxed italic opacity-80">
                                    这是一个包含了知识库架构示意图的图像。图像中心展示了核心的向量检索引擎，左侧是多种非结构化数据源的输入接口，右侧则是通过 RAG 架构支撑的智能问答终端。图中标识了实时流处理与全量批处理两条数据链路。
                                 </p>
                              </div>
                           </div>
                        ) : (
                           <div className="whitespace-pre-wrap font-sans text-slate-700 text-lg leading-[2]">
                              {selectedFile.content || '该文档暂无内容预览'}
                           </div>
                        )}
                     </div>

                     <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-3 gap-6">
                        {['关联实体', '引用次数', '提取关键词'].map(label => (
                           <div key={label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                              <p className="text-sm font-bold text-slate-900">{label === '关联实体' ? '12 个' : label === '引用次数' ? '86 次' : 'Transformer, AI, RAG'}</p>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Archive size={48} className="opacity-10 mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest opacity-30">选择文档进行深度内容核查</p>
               </div>
            )}
         </div>
      </main>
    </div>
  );
}
