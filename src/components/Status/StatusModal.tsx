import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Activity, CheckCircle2, X, RefreshCw, Server, ShieldCheck } from 'lucide-react';

export const StatusModal: React.FC = () => {
  const { isStatusOpen, setIsStatusOpen, runtimeError } = useProject();

  if (!isStatusOpen) return null;

  const services = [
    { name: 'AI Inference Engine (Gemini 3.8 Flash)', status: 'Operational', latency: '240ms' },
    { name: 'Browser Sandbox Compiler (React 19)', status: runtimeError ? 'Degraded' : 'Operational', latency: '45ms' },
    { name: 'PostgreSQL Database Studio', status: 'Operational', latency: '18ms' },
    { name: 'REST API Workbench', status: 'Operational', latency: '12ms' },
    { name: 'File System & ZIP Packaging Service', status: 'Operational', latency: '8ms' },
    { name: 'Git Snapshot & Rollback Engine', status: 'Operational', latency: '5ms' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">System Operational Status</h2>
              <p className="text-xs text-slate-400">リアルタイムサービス稼働状態とレイテンシ</p>
            </div>
          </div>
          <button
            onClick={() => setIsStatusOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Body */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-300">All Core Systems Operational</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">99.98% Uptime</span>
          </div>

          <div className="space-y-2">
            {services.map((s, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-white font-medium">{s.name}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-slate-400">{s.latency}</span>
                  <span className="text-emerald-400 font-semibold">{s.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-500 font-mono">
            Last Checked: {new Date().toLocaleTimeString()} · Tokyo Node
          </div>
        </div>
      </div>
    </div>
  );
};
