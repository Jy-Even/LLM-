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
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadFile } from '../types.ts';

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

  const [selectedFileId, setSelectedFileId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="flex h-[calc(100vh-160px)] flex-col gap-6">
      {/* Header & Compact Upload */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">文档管理</h1>
          <p className="text-sm text-slate-500">上传并查看您的知识源文件</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text"
              placeholder="搜索文档..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95">
            <UploadCloud className="h-4 w-4" />
            <span>上传文件</span>
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        {/* Left Sidebar: File List */}
        <div className="w-80 flex flex-col gap-4 overflow-hidden shrink-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">上传队列 ({filteredFiles.length})</span>
            {files.some(f => f.status === 'success') && (
              <button 
                onClick={() => setFiles(files.filter(f => f.status !== 'success'))}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                清空完成
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredFiles.map((file) => (
                <motion.div
                  layout
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`group relative flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                    selectedFileId === file.id 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                    : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    file.type === 'pdf' ? 'bg-red-50' :
                    file.type === 'doc' ? 'bg-blue-50' :
                    file.type === 'image' ? 'bg-purple-50' : 'bg-slate-50'
                  }`}>
                    {getFileIcon(file.type)}
                  </div>

                  <div className="flex flex-1 flex-col min-w-0">
                    <span className="truncate text-sm font-semibold text-slate-900">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{file.size} • {file.type.toUpperCase()}</span>
                  </div>

                  {file.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin shrink-0" />
                  )}

                  <button 
                    onClick={(e) => removeFile(file.id, e)}
                    className="absolute -right-2 -top-2 rounded-full bg-white border border-slate-200 p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredFiles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="h-8 w-8 opacity-20 mb-2" />
                <p className="text-xs">未找到匹配文档</p>
              </div>
            )}
          </div>

          {/* Compact Drop Area */}
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50/30">
            <div className="flex flex-col items-center gap-2 text-center">
              <UploadCloud className="h-6 w-6 text-slate-400" />
              <div className="text-[11px] text-slate-500">
                <span className="font-bold text-blue-600 cursor-pointer">点击上传</span> 或拖拽到这里
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Content Viewer */}
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {selectedFile ? (
            <>
              {/* Toolbar */}
              <div className="h-14 shrink-0 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                    {getFileIcon(selectedFile.type)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-slate-900 truncate">{selectedFile.name}</h2>
                    <p className="text-[10px] text-slate-500">大小: {selectedFile.size} • 格式: {selectedFile.type.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Viewer Area */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
                <div className="max-w-3xl mx-auto">
                  {selectedFile.type === 'image' ? (
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-200/50">
                        <img 
                          src={selectedFile.previewUrl} 
                          alt={selectedFile.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-contain max-h-[600px]"
                        />
                      </div>
                      <div className="p-4 rounded-xl bg-slate-100/50 border border-slate-200 text-xs text-slate-500 italic text-center">
                        图像预览: {selectedFile.name}
                      </div>
                    </div>
                  ) : selectedFile.type === 'pdf' ? (
                    <div className="space-y-6">
                      <div className="aspect-[1/1.414] w-full rounded-xl border border-slate-200 bg-white shadow-lg p-12 flex flex-col gap-6">
                        <div className="space-y-4">
                          <div className="h-8 w-2/3 bg-slate-100 rounded animate-pulse" />
                          <div className="h-4 w-full bg-slate-50 rounded" />
                          <div className="h-4 w-full bg-slate-50 rounded" />
                          <div className="h-4 w-5/6 bg-slate-50 rounded" />
                        </div>
                        <div className="flex-1 border-t border-slate-100 pt-6 prose prose-slate prose-sm max-w-none">
                          <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                            {selectedFile.content}
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-[11px] text-slate-400">PDF 内容解析摘要</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-white shadow-md">
                      <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                        <Type className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Document Content</span>
                      </div>
                      <div className="p-10 prose prose-slate max-w-none">
                        <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                          {selectedFile.content || '该文档暂无内容预览'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                <Eye className="h-8 w-8 opacity-20" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-slate-600">选择一个文件进行预览</h3>
                <p className="text-xs mt-1">从左侧列表中选择文档查看其解析内容</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

