import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { AgentPhase } from '../../types/project';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  ArrowRight,
  RefreshCw,
  Sliders,
} from 'lucide-react';

const PHASES: { id: AgentPhase; label: string }[] = [
  { id: 'UNDERSTAND', label: '要件分析' },
  { id: 'CHECK_CONSTITUTION', label: '憲法適合性確認' },
  { id: 'PLAN', label: '設計策定' },
  { id: 'IMPLEMENT', label: 'コード生成' },
  { id: 'RUN', label: '実行・検証' },
  { id: 'TEST', label: 'テストスイート' },
  { id: 'REVIEW', label: '完了レビュー' },
];

export const AgentChatPanel: React.FC = () => {
  const {
    project,
    currentTask,
    runAgentPrompt,
    pendingChanges,
    applyPendingChanges,
    rejectPendingChanges,
  } = useProject();

  const [inputPrompt, setInputPrompt] = useState('');

  const quickPrompts = [
    'ログイン・認証機能とプロファイル編集画面を追加して',
    'ダークモード切り替えとレスポンシブデザインを最適化して',
    'PostgreSQLのインデックスと検索APIの高速化を実装して',
    'リアルタイム通知バナーといいねアニメーションを追加して',
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || currentTask?.status === 'running') return;
    runAgentPrompt(inputPrompt.trim(), 'generate');
    setInputPrompt('');
  };

  const getPhaseStepIndex = (phase: AgentPhase) => {
    const idx = PHASES.findIndex((p) => p.id === phase);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = currentTask ? getPhaseStepIndex(currentTask.phase) : -1;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Top Header */}
      <div className="p-3 sm:p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 gap-2 shadow-2xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">AI Agent Architect</h2>
            <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">
              自然言語から憲法を厳守してフルスタック実装を行います
            </p>
          </div>
        </div>

        {/* User Control Level Badge */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-mono bg-slate-50 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
          <Sliders className="w-3 h-3 text-cyan-600" />
          <span className="text-slate-500 hidden xs:inline">承認:</span>
          <span className="text-cyan-800 font-semibold">{project.constitution.userControlLevel}</span>
        </div>
      </div>

      {/* Main Agent Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 sm:space-y-6">
        {/* Phase Pipeline Stepper */}
        {currentTask && (
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-600" />
                <span>パイプライン進行状況</span>
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  currentTask.status === 'running'
                    ? 'bg-cyan-50 text-cyan-700 animate-pulse border border-cyan-200'
                    : currentTask.status === 'waiting_approval'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : currentTask.status === 'done'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {currentTask.status}
              </span>
            </div>

            {/* Mobile Progress Bar (< sm) */}
            <div className="sm:hidden space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">現在:</span>
                <span className="text-cyan-700 font-semibold">
                  Step {currentStepIdx >= 0 ? currentStepIdx + 1 : 1}/7: {PHASES[currentStepIdx]?.label || '分析中'}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 h-full transition-all duration-300"
                  style={{ width: `${Math.max(10, ((currentStepIdx + 1) / 7) * 100)}%` }}
                />
              </div>
              {/* Horizontal Scrollable Phase Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none whitespace-nowrap">
                {PHASES.map((phase, idx) => {
                  const isCompleted = idx < currentStepIdx || currentTask.status === 'done';
                  const isCurrent = idx === currentStepIdx && currentTask.status === 'running';
                  return (
                    <span
                      key={phase.id}
                      className={`text-[9px] px-2 py-0.5 rounded-full border shrink-0 ${
                        isCurrent
                          ? 'bg-cyan-50 text-cyan-800 border-cyan-300 font-bold'
                          : isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      {isCompleted ? '✓ ' : `${idx + 1}. `}{phase.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Desktop Stepper Dots (sm+) */}
            <div className="hidden sm:grid grid-cols-7 gap-2 pt-1">
              {PHASES.map((phase, idx) => {
                const isCompleted = idx < currentStepIdx || currentTask.status === 'done';
                const isCurrent = idx === currentStepIdx && currentTask.status === 'running';

                return (
                  <div key={phase.id} className="flex flex-col items-center text-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white font-bold'
                          : isCurrent
                          ? 'bg-cyan-600 text-white animate-bounce shadow-md shadow-cyan-600/30'
                          : 'bg-slate-100 text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] leading-tight ${
                        isCurrent ? 'text-cyan-800 font-bold' : isCompleted ? 'text-slate-800 font-medium' : 'text-slate-400'
                      }`}
                    >
                      {phase.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current Summary & Plan */}
            {currentTask.summary && (
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-800 leading-relaxed">
                <div className="font-bold text-cyan-800 mb-1">【設計・実装サマリー】</div>
                <p>{currentTask.summary}</p>
              </div>
            )}

            {currentTask.plan.length > 0 && (
              <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-800 mb-1 text-[11px]">【開発計画ステップ】</div>
                <ul className="space-y-1 text-slate-600">
                  {currentTask.plan.map((step, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-cyan-600 font-mono text-[10px] font-bold">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Real-time execution logs */}
            <div className="mt-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1 max-h-36 overflow-y-auto">
              {currentTask.logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-cyan-400 font-bold mr-1">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {/* Waiting for approval bar */}
            {currentTask.status === 'waiting_approval' && pendingChanges && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs text-amber-800 font-medium">
                    {pendingChanges.length} 個のファイル変更が提案されました。Diffを確認して適用してください。
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={rejectPendingChanges}
                    className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    却下
                  </button>
                  <button
                    onClick={() => applyPendingChanges(pendingChanges)}
                    className="px-3.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    変更を適用
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">おすすめの指示例:</span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInputPrompt(q)}
                className="text-xs text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Project Constitution Rules Reference */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Project Constitution (厳守憲法)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Immutable Rules</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mb-3">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500">言語 (固定)</div>
              <div className="text-slate-900 font-bold">{project.constitution.language}</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500">フレームワーク</div>
              <div className="text-slate-900 font-bold">{project.constitution.framework}</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500">ランタイム</div>
              <div className="text-slate-900 font-bold">{project.constitution.runtimeVersion}</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500">パッケージ管理</div>
              <div className="text-slate-900 font-bold">{project.constitution.packageManager}</div>
            </div>
          </div>
          <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
            {project.constitution.rules.slice(0, 3).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Input Box Footer */}
      <div className="p-4 border-t border-slate-200 bg-white shrink-0 shadow-xs">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <textarea
            rows={2}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e);
              }
            }}
            placeholder="AI Agentに自然言語で指示を入力（例: ユーザープロフィール設定画面とアバター画像アップロード機能を追加して）..."
            className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-relaxed shadow-2xs"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || currentTask?.status === 'running'}
            className="px-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">実行</span>
          </button>
        </form>
      </div>
    </div>
  );
};
