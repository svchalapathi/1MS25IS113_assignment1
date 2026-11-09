import React, { useState, useRef } from 'react';
import { Upload, Link2, FileText, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PaperInputProps {
  onAnalyzePdf: (base64: string, filename: string) => void;
  onAnalyzeUrl: (url: string) => void;
  onSelectSample: (sampleId: string) => void;
  isLoading: boolean;
  loadingStep: string;
}

export const PaperInput: React.FC<PaperInputProps> = ({
  onAnalyzePdf,
  onAnalyzeUrl,
  onSelectSample,
  isLoading,
  loadingStep,
}) => {
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF file.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('PDF file exceeds the 25MB limit. Please upload a smaller paper.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      setErrorMsg('Please select a research paper PDF first.');
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onAnalyzePdf(result, selectedFile.name);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read PDF file. Please try again.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) {
      setErrorMsg('Please enter a research paper URL or arXiv link.');
      return;
    }
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setErrorMsg('Please include https:// in the paper URL.');
      return;
    }
    onAnalyzeUrl(cleanUrl);
  };

  return (
    <div id="paper-input-area" className="w-full">
      {/* Container with spatial math */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Method selector tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              onClick={() => setActiveInputTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeInputTab === 'upload'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload PDF
            </button>
            <button
              onClick={() => setActiveInputTab('url')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeInputTab === 'url'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Enter Paper URL
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>Supported: arXiv, IEEE, NeurIPS, Nature, CVPR, open access PDFs</span>
          </div>
        </div>

        {/* Tab 1: Upload PDF */}
        {activeInputTab === 'upload' && (
          <div className="mt-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30'
                }`}
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Drop your engineering research paper PDF here
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
                  Drag and drop your academic paper, course preprint, or IEEE/ACM PDF up to 25MB.
                </p>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
                >
                  Browse PDF Files
                </button>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-md">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for AI breakdown
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Change File
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleUploadSubmit}
                      className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
                    >
                      <span>Analyze Paper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: URL Input */}
        {activeInputTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="mt-6">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Link2 className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste arXiv link (e.g. https://arxiv.org/abs/1706.03762) or open access PDF URL"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors shrink-0 shadow-xs"
              >
                <span>Analyze URL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-600 dark:text-slate-400">Quick try:</span>
              <button
                type="button"
                onClick={() => setUrlInput('https://arxiv.org/abs/1706.03762')}
                className="hover:text-indigo-600 underline underline-offset-2"
              >
                Attention Is All You Need
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setUrlInput('https://arxiv.org/abs/2106.09685')}
                className="hover:text-indigo-600 underline underline-offset-2"
              >
                LoRA
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setUrlInput('https://arxiv.org/abs/1512.03385')}
                className="hover:text-indigo-600 underline underline-offset-2"
              >
                ResNet
              </button>
            </div>
          </form>
        )}

        {/* Error notice if any */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading progress indicator */}
        {isLoading && (
          <div className="mt-6 p-4 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
              <div>
                <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                  {loadingStep || 'AI Agent is examining paper...'}
                </p>
                <p className="text-xs text-indigo-700/80 dark:text-indigo-400">
                  Extracting problem statement, engineering methodology, Mermaid architecture, and 3 project ideas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instant benchmark papers for students */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Or explore instantly with foundational benchmark papers:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onSelectSample('transformer')}
              disabled={isLoading}
              className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Attention Is All You Need
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Vaswani et al. · NeurIPS 2017
              </div>
              <div className="text-xs text-slate-400 mt-0.5 tabular-nums">
                135,000+ citations · Transformer Architecture
              </div>
            </button>

            <button
              onClick={() => onSelectSample('lora')}
              disabled={isLoading}
              className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                LoRA: Low-Rank Adaptation
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Hu et al. · ICLR 2022
              </div>
              <div className="text-xs text-slate-400 mt-0.5 tabular-nums">
                11,200+ citations · PEFT & Fine-Tuning
              </div>
            </button>

            <button
              onClick={() => onSelectSample('resnet')}
              disabled={isLoading}
              className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Deep Residual Learning (ResNet)
              </div>
              <div className="text-xs text-slate-500 mt-1">
                He et al. · IEEE CVPR 2016
              </div>
              <div className="text-xs text-slate-400 mt-0.5 tabular-nums">
                220,000+ citations · Skip Connections
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
