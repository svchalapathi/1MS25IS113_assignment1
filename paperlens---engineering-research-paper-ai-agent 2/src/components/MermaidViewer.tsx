import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Download, Code2, Eye } from 'lucide-react';

interface MermaidViewerProps {
  code: string;
  isDark?: boolean;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ code, isDark = false }) => {
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'diagram' | 'code'>('diagram');
  const [copied, setCopied] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis',
        },
        themeVariables: isDark
          ? {
              primaryColor: '#3b82f6',
              primaryTextColor: '#f8fafc',
              primaryBorderColor: '#60a5fa',
              lineColor: '#94a3b8',
              secondaryColor: '#1e293b',
              tertiaryColor: '#0f172a',
              background: '#0b0f17',
            }
          : {
              primaryColor: '#e0f2fe',
              primaryTextColor: '#0369a1',
              primaryBorderColor: '#38bdf8',
              lineColor: '#64748b',
              secondaryColor: '#f1f5f9',
              tertiaryColor: '#ffffff',
            },
      });

      const uniqueId = 'mermaid-' + Math.random().toString(36).substring(2, 9);
      const cleanCode = code.trim();

      mermaid
        .render(uniqueId, cleanCode)
        .then(({ svg }) => {
          if (isMounted) {
            setSvgHtml(svg);
            setRenderError(null);
          }
        })
        .catch((err) => {
          console.warn('Mermaid render error:', err);
          if (isMounted) {
            setRenderError(err.message || 'Syntax issue in diagram generation');
          }
        });
    } catch (err: any) {
      if (isMounted) {
        setRenderError(err.message || 'Failed to initialize Mermaid');
      }
    }

    return () => {
      isMounted = false;
    };
  }, [code, isDark]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgHtml) return;
    const blob = new Blob([svgHtml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `architecture-flowchart-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode('diagram')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'diagram'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Interactive Diagram
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'code'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Mermaid Source
          </button>
        </div>

        <div className="flex items-center gap-1">
          {viewMode === 'diagram' && (
            <>
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
                title="Zoom Out"
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1.5 text-slate-500 tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
                title="Zoom In"
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                title="Reset Zoom"
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors mr-2"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          {viewMode === 'diagram' && svgHtml && (
            <button
              onClick={handleDownloadSvg}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SVG</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="relative min-h-[380px] max-h-[640px] overflow-auto bg-slate-50/50 dark:bg-slate-950/40 p-6 flex items-center justify-center">
        {viewMode === 'diagram' ? (
          renderError ? (
            <div className="text-center p-6 max-w-lg">
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-2">
                Flowchart render notice
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                The diagram source contains complex formatting. You can view or copy the Mermaid code directly:
              </p>
              <pre className="text-left text-xs bg-slate-100 dark:bg-slate-900 p-3 rounded-lg overflow-x-auto border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                {code}
              </pre>
            </div>
          ) : svgHtml ? (
            <div
              ref={containerRef}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
              className="w-full flex justify-center [&>svg]:max-w-none [&>svg]:h-auto cursor-grab active:cursor-grabbing"
              dangerouslySetInnerHTML={{ __html: svgHtml }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Rendering system architecture diagram...</span>
            </div>
          )
        ) : (
          <div className="w-full h-full max-h-[500px]">
            <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto leading-relaxed border border-slate-800">
              {code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
