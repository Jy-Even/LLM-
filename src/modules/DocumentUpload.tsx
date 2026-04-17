import { useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Trash2, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { UploadFile } from '../types.ts';

export default function DocumentUpload() {
  const [files, setFiles] = useState<UploadFile[]>([
    { id: '1', name: '2024_Technical_Specs.pdf', size: '2.4 MB', type: 'pdf', progress: 100, status: 'success' },
    { id: '2', name: 'Product_Market_Fit.docx', size: '1.1 MB', type: 'doc', progress: 65, status: 'uploading' },
    { id: '3', name: 'Network_Topology.png', size: '4.8 MB', type: 'image', progress: 0, status: 'error', error: 'File too large' },
  ]);

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">文档上传</h1>
        <p className="text-slate-500">上传您的研究文档、会议记录或技术规格，供知识库索引和分析。</p>
      </div>

      {/* Upload Area */}
      <div className="group relative flex h-[360px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-white transition-all hover:border-blue-500 hover:bg-[#F0F7FF]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-5xl mb-2 opacity-30 group-hover:opacity-100 transition-opacity">☁️</div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">拖拽文件至此</h3>
            <p className="mt-1 text-sm text-slate-500">支持 PDF, Word, Markdown (单文件 ≤ 50MB)</p>
          </div>
          <button className="mt-6 rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95">
            从本地选择
          </button>
        </div>
      </div>

      {/* Queue Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-900">上传队列 ({files.length})</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors">
              全部重试
            </button>
            <button 
              onClick={() => setFiles(files.filter(f => f.status !== 'success'))}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors"
            >
              清空已完成
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          {files.map((file) => (
            <motion.div
              layout
              key={file.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-hover hover:border-blue-100 hover:shadow-md"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                file.type === 'pdf' ? 'bg-red-50 text-red-500' :
                file.type === 'doc' ? 'bg-blue-50 text-blue-500' :
                file.type === 'image' ? 'bg-purple-50 text-purple-500' : 'bg-slate-50 text-slate-500'
              }`}>
                <FileText className="h-5 w-5" />
              </div>

              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium text-slate-900">{file.name}</span>
                  <span className="text-xs text-slate-400">{file.size}</span>
                </div>
                
                {file.status === 'uploading' && (
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {file.status === 'error' && (
                  <span className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {file.error}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pl-4">
                {file.status === 'success' && (
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600">已完成</span>
                )}
                {file.status === 'uploading' && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">{file.progress}%</span>
                )}
                
                <button 
                  onClick={() => removeFile(file.id)}
                  className="rounded-lg p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-50 hover:text-red-500 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {files.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <UploadCloud className="h-12 w-12 opacity-20 mb-3" />
              <p className="text-sm">暂无待上传文件</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
