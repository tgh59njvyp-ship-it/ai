import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { buildPreviewHtml } from '../../services/projectRunner';
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  Terminal,
  ExternalLink,
  AlertTriangle,
  Wrench,
  CheckCircle,
} from 'lucide-react';

export const LivePreview: React.FC = () => {
  const {
    project,
    previewDevice,
    setPreviewDevice,
    consoleMessages,
    clearConsole,
    runtimeError,
    runAgentPrompt,
    setActiveView,
  } = useProject();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewHtml = React.useMemo(() => {
    return buildPreviewHtml(project);
  }, [project, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const getFrameWidth = () => {
    if (previewDevice === 'mobile') return 'w-[375px] max-w-full h-full sm:h-[667px] my-auto rounded-none sm:rounded-3xl shadow-xl border-0 sm:border-4 border-slate-300';
    if (previewDevice === 'tablet') return 'w-[768px] max-w-full h-full sm:h-[90%] my-auto rounded-none sm:rounded-2xl shadow-xl border-0 sm:border-2 border-slate-300';
    return 'w-full h-full';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden select-none">
      {/* Top Preview Controls Bar */}
      <div className="h-10 bg-white border-b border-slate-200 px-2 sm:px-4 flex items-center justify-between text-xs shrink-0 gap-1 sm:gap-2 shadow-2xs">
        {/* Device Switchers */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 sm:p-1 rounded-lg border border-slate-200 shrink-0">
          <button
            onClick={() => setPreviewDevice('desktop')}
            title="Desktop (100%)"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              previewDevice === 'desktop'
                ? 'bg-white text-cyan-700 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            title="Tablet (768px)"
            className={`p-1.5 rounded-md transition-colors hidden xs:block sm:block cursor-pointer ${
              previewDevice === 'tablet'
                ? 'bg-white text-cyan-700 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            title="Mobile (375px)"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              previewDevice === 'mobile'
                ? 'bg-white text-cyan-700 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Live URL simulation bar (Desktop/Tablet only) */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-slate-600 bg-slate-50 px-3 py-1 rounded-md border border-slate-200 max-w-sm truncate shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="truncate">https://localhost:3000/{project.name.toLowerCase().replace(/\s+/g, '-')}</span>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Console Drawer Toggle */}
          <button
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] border transition-colors cursor-pointer ${
              isConsoleOpen
                ? 'bg-white text-cyan-800 border-slate-300 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span className="hidden sm:inline">Console</span>
            <span>({consoleMessages.length})</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            title="プレビュー再読み込み"
            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Runtime Error Alert banner */}
      {runtimeError && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2 truncate">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="truncate font-medium">実行時エラー: {runtimeError}</span>
          </div>
          <button
            onClick={() => {
              setActiveView('agent');
              runAgentPrompt(`エラーを自動修正してください: ${runtimeError}`, 'fix');
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold shrink-0 transition-colors cursor-pointer shadow-xs"
          >
            <Wrench className="w-3 h-3" />
            <span>AIでエラー自動修正</span>
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 bg-slate-100/90 overflow-hidden relative">
        <div className={`${getFrameWidth()} bg-white overflow-hidden transition-all duration-300 relative shadow-md`}>
          <iframe
            key={refreshKey}
            ref={iframeRef}
            srcDoc={previewHtml}
            title="Genesis Live Preview"
            sandbox="allow-scripts allow-modals"
            className="w-full h-full border-none"
          />
        </div>
      </div>

      {/* Console Drawer */}
      {isConsoleOpen && (
        <div className="h-44 bg-white border-t border-slate-200 flex flex-col shrink-0 font-mono text-[11px] shadow-lg">
          <div className="px-3 py-1.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-slate-600">
            <span className="font-semibold text-slate-800">Sandbox Console</span>
            <button
              onClick={clearConsole}
              className="hover:text-slate-900 text-[10px] text-slate-500 cursor-pointer"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
            {consoleMessages.length === 0 ? (
              <div className="text-slate-400 italic">No logs recorded yet.</div>
            ) : (
              consoleMessages.map((m) => (
                <div key={m.id} className="flex gap-2 leading-relaxed">
                  <span className="text-slate-400 select-none">{m.timestamp}</span>
                  <span
                    className={
                      m.level === 'error'
                        ? 'text-rose-600 font-semibold'
                        : m.level === 'warn'
                        ? 'text-amber-600 font-medium'
                        : 'text-slate-800'
                    }
                  >
                    [{m.level.toUpperCase()}] {m.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
