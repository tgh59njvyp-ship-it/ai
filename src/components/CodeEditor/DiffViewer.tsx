import React, { useState } from 'react';
import { ProposedFileChange } from '../../types/project';
import { Check, X, FileDiff, ArrowRight, ShieldCheck } from 'lucide-react';

interface DiffViewerProps {
  proposedChanges: ProposedFileChange[];
  onAccept: (changes: ProposedFileChange[]) => void;
  onReject: () => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  proposedChanges,
  onAccept,
  onReject,
}) => {
  const [changes, setChanges] = useState<ProposedFileChange[]>(proposedChanges);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeChange = changes[selectedIdx] || changes[0];

  const toggleAccept = (index: number) => {
    setChanges((prev) =>
      prev.map((c, i) => (i === index ? { ...c, accepted: !c.accepted } : c))
    );
  };

  if (!activeChange) return null;

  const originalLines = (activeChange.originalContent || '').split('\n');
  const newLines = (activeChange.newContent || '').split('\n');

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl w-full max-w-5xl h-[92vh] sm:h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/80 gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0">
              <FileDiff className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">AI Agent 変更提案レビュー (Diff Preview)</h2>
              <p className="text-[10px] sm:text-xs text-slate-500">
                AIが生成したコードを確認し、承認または却下を選択してください
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onReject}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>却下</span>
            </button>
            <button
              onClick={() => onAccept(changes)}
              className="px-3 sm:px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>適用 ({changes.filter((c) => c.accepted).length}件)</span>
            </button>
          </div>
        </div>

        {/* Mobile File Tabs (< md) */}
        <div className="md:hidden flex items-center gap-1.5 p-2 bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 shrink-0 px-1">
            Files ({changes.length}):
          </span>
          {changes.map((c, i) => {
            const isSelected = i === selectedIdx;
            return (
              <button
                key={c.path}
                onClick={() => setSelectedIdx(i)}
                className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors border cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white font-medium border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={c.accepted}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleAccept(i);
                  }}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-0 cursor-pointer"
                />
                <span className="truncate max-w-[120px] font-mono text-[11px]">{c.path.split('/').pop()}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body: File list on left, Diff on right */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left file tabs (Desktop Only) */}
          <div className="hidden md:block w-64 border-r border-slate-200 bg-slate-50/60 p-2 space-y-1 overflow-y-auto shrink-0">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-2 py-1">
              Modified Files ({changes.length})
            </div>
            {changes.map((c, i) => {
              const isSelected = i === selectedIdx;
              return (
                <div
                  key={c.path}
                  onClick={() => setSelectedIdx(i)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors text-xs flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-50 text-cyan-900 font-semibold border border-cyan-200 shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={c.accepted}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleAccept(i);
                      }}
                      className="rounded border-slate-300 text-cyan-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="truncate">{c.path.split('/').pop()}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1 py-0.2 rounded border ${
                      c.operation === 'create'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                        : 'bg-cyan-50 text-cyan-700 border-cyan-200 font-semibold'
                    }`}
                  >
                    {c.operation}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Diff Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Diff info bar */}
            <div className="px-3 sm:px-4 py-2 border-b border-slate-200 bg-slate-50/70 text-xs text-slate-700 flex items-center justify-between font-mono gap-2 overflow-hidden">
              <span className="truncate text-cyan-800 font-bold">{activeChange.path}</span>
              <span className="text-slate-500 truncate text-[11px] hidden xs:inline">{activeChange.description}</span>
            </div>

            {/* Side-by-side or Unified Lines */}
            <div className="flex-1 overflow-auto p-3 sm:p-4 font-mono text-xs space-y-0.5 bg-white">
              <div className="text-[11px] text-emerald-700 font-bold mb-2">
                + 新規 / 更新後のコード ({newLines.length} lines):
              </div>
              {newLines.slice(0, 150).map((line, idx) => (
                <div key={idx} className="flex gap-2 sm:gap-3 hover:bg-slate-50 px-1 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs">
                  <span className="text-slate-400 select-none w-6 sm:w-8 text-right shrink-0">{idx + 1}</span>
                  <span className="text-slate-800 whitespace-pre overflow-x-auto">{line}</span>
                </div>
              ))}
              {newLines.length > 150 && (
                <div className="text-slate-400 text-center py-2 text-[11px]">
                  ... 残り {newLines.length - 150} 行 ...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
