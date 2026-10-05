import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { AgentPhase, FileConstructionProgress } from '../../types/project';
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
  Database,
  Code2,
  CheckSquare,
  FilePlus,
  FileEdit,
  Eye,
  ExternalLink,
  ChevronRight,
  Clock,
} from 'lucide-react';

const PHASES: { id: AgentPhase; label: string; description: string }[] = [
  { id: 'UNDERSTAND', label: '要件分析', description: 'プロンプト解析 & AST依存関係' },
  { id: 'CHECK_CONSTITUTION', label: '憲法照合', description: 'TypeScript / FW制約検証' },
  { id: 'PLAN', label: '設計策定', description: 'DB・API・UIの分割計画' },
  { id: 'IMPLEMENT', label: 'コード生成', description: '多層ファイルの並行生成' },
  { id: 'RUN', label: 'プレビュー同期', description: 'HMR & 仮想DOMマウント' },
  { id: 'TEST', label: 'テスト検証', description: '型検査 & 単体テスト' },
  { id: 'REVIEW', label: 'レビュー & 承認', description: 'Diff確認とコミット準備' },
];

export const AgentChatPanel: React.FC = () => {
  const {
    project,
    currentTask,
    runAgentPrompt,
    pendingChanges,
    applyPendingChanges,
    rejectPendingChanges,
    openTab,
    setActiveView,
  } = useProject();

  const [inputPrompt, setInputPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'inspector' | 'logs' | 'diff'>('inspector');

  const quickPrompts = [
    'ユーザー認証とプロファイル編集画面・セッション管理を追加して',
    'PostgreSQLの相場管理テーブルとリアルタイム検索APIを実装して',
    '注文カートドロワーと決済フロー、いいねアニメーションを追加して',
    '型安全なエラーハンドリングと自動テストスイートを拡張して',
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || currentTask?.status === 'running') return;
    runAgentPrompt(inputPrompt.trim(), 'generate');
    setInputPrompt('');
    setActiveTab('inspector');
  };

  const getPhaseStepIndex = (phase: AgentPhase) => {
    const idx = PHASES.findIndex((p) => p.id === phase);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = currentTask ? getPhaseStepIndex(currentTask.phase) : -1;

  const getLayerMeta = (layer?: string) => {
    switch (layer) {
      case 'db':
        return { label: 'Database / SQL', icon: Database, color: 'text-amber-700 bg-amber-50 border-amber-300' };
      case 'api':
        return { label: 'Backend REST API', icon: Terminal, color: 'text-purple-700 bg-purple-50 border-purple-300' };
      case 'test':
        return { label: 'Testing Suite', icon: CheckSquare, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
      case 'config':
        return { label: 'Config / JSON', icon: Sliders, color: 'text-slate-700 bg-slate-100 border-slate-300' };
      default:
        return { label: 'Frontend UI', icon: Code2, color: 'text-cyan-700 bg-cyan-50 border-cyan-300' };
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden select-none">
      {/* Top Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 gap-2 shadow-xs z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">AI Agent Architect</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 font-semibold border border-cyan-200">
                Full-Stack Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              自然言語指示からDB・API・UI・テストを段階的に生成しリアルタイム監視します
            </p>
          </div>
        </div>

        {/* User Control Level Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
            <Sliders className="w-3.5 h-3.5 text-cyan-600" />
            <span className="text-slate-500 hidden sm:inline">承認モード:</span>
            <span className="text-cyan-900 font-bold">{project.constitution.userControlLevel}</span>
          </div>
        </div>
      </div>

      {/* Main Agent Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 sm:space-y-5">
        {/* Task Execution Card */}
        {currentTask ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden animate-fadeIn">
            {/* Live Status Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="text-cyan-300 font-bold uppercase tracking-wider">
                    {currentTask.status === 'running' ? 'EXECUTION IN PROGRESS' : currentTask.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-white/10 px-2.5 py-0.5 rounded-full text-slate-300 border border-white/10">
                  Step {currentStepIdx >= 0 ? currentStepIdx + 1 : 1} / 7
                </span>
              </div>

              {/* Active Action Real-Time Banner */}
              <div className="p-3 bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl text-xs space-y-1">
                <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>現在の実行アクティビティ</span>
                </div>
                <div className="font-semibold text-white text-xs sm:text-sm">
                  {currentTask.activeActionDescription || 'タスクを初期化中...'}
                </div>
                {currentTask.activeFileGenerating && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 font-mono text-[11px] border border-cyan-400/30">
                    <FileEdit className="w-3 h-3 animate-spin" />
                    <span>書き込み中: {currentTask.activeFileGenerating}</span>
                  </div>
                )}
              </div>

              {/* User Instruction Quote */}
              <div className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-cyan-400 font-mono font-bold shrink-0">指示:</span>
                <span className="italic line-clamp-2">{currentTask.prompt}</span>
              </div>
            </div>

            {/* Stepper Pipeline */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {PHASES.map((phase, idx) => {
                  const isCompleted = idx < currentStepIdx || currentTask.status === 'done';
                  const isCurrent = idx === currentStepIdx && currentTask.status === 'running';

                  return (
                    <div
                      key={phase.id}
                      className={`p-2 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-cyan-50 border-cyan-400 shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                          0{idx + 1}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-cyan-600 text-white animate-bounce'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 text-[11px] truncate">{phase.label}</div>
                      <div className="text-[9px] text-slate-500 line-clamp-1">{phase.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tab Navigation: Inspector vs Terminal Logs vs Diff */}
            <div className="flex border-b border-slate-200 bg-white px-4">
              <button
                onClick={() => setActiveTab('inspector')}
                className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'inspector'
                    ? 'border-cyan-600 text-cyan-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>生成ファイル・インスペクター ({currentTask.fileProgress?.length || currentTask.proposedChanges.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'logs'
                    ? 'border-cyan-600 text-cyan-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>実行ログ ({currentTask.logs.length})</span>
              </button>
            </div>

            {/* Tab Content 1: File Construction Inspector */}
            {activeTab === 'inspector' && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>フルスタック各層の生成ステータスと変更ファイル詳細:</span>
                  <span className="font-mono text-[11px] text-slate-700 font-semibold">
                    {currentTask.fileProgress?.filter((f) => f.status === 'done').length || 0} /{' '}
                    {currentTask.fileProgress?.length || currentTask.proposedChanges.length} 完了
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {(currentTask.fileProgress && currentTask.fileProgress.length > 0
                    ? currentTask.fileProgress
                    : currentTask.proposedChanges.map((f) => ({
                        path: f.path,
                        status: currentTask.status === 'done' ? 'done' : ('generating' as const),
                        operation: f.operation,
                        layer: f.layer || 'ui',
                        linesCount: f.linesCount || 40,
                        description: f.description,
                      }))
                  ).map((file, idx) => {
                    const layerMeta = getLayerMeta(file.layer);
                    const LayerIcon = layerMeta.icon;

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          file.status === 'generating'
                            ? 'bg-cyan-50/60 border-cyan-400 shadow-xs ring-1 ring-cyan-300'
                            : file.status === 'done'
                            ? 'bg-white border-slate-200 hover:border-slate-300'
                            : 'bg-slate-50/80 border-slate-200 opacity-70'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${layerMeta.color}`}
                          >
                            <LayerIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-slate-900">
                                {file.path}
                              </span>
                              <span
                                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border ${
                                  file.operation === 'create'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-blue-50 text-blue-800 border-blue-300'
                                }`}
                              >
                                {file.operation}
                              </span>
                              <span
                                className={`text-[9px] font-medium px-1.5 py-0.2 rounded border ${layerMeta.color}`}
                              >
                                {layerMeta.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              {file.description}
                            </p>
                          </div>
                        </div>

                        {/* Status & Action */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className="text-[10px] font-mono text-slate-500">
                            +{file.linesCount} 行
                          </span>

                          {file.status === 'generating' ? (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-lg border border-cyan-300 animate-pulse">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>書き込み中...</span>
                            </span>
                          ) : file.status === 'done' ? (
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>完了</span>
                              </span>
                              <button
                                onClick={() => {
                                  openTab(file.path);
                                  setActiveView('editor');
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] rounded-lg border border-slate-200 font-medium transition-colors cursor-pointer flex items-center gap-1"
                                title="エディタで開く"
                              >
                                <Eye className="w-3 h-3" />
                                <span>表示</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                              待機中
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab Content 2: Terminal Real-Time Logs */}
            {activeTab === 'logs' && (
              <div className="p-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 max-h-72 overflow-y-auto">
                  {currentTask.logs.map((log, i) => (
                    <div key={i} className="leading-relaxed flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold select-none">&gt;</span>
                      <span
                        className={
                          log.includes('[ERROR]')
                            ? 'text-rose-400 font-semibold'
                            : log.includes('[FILE_WRITE]')
                            ? 'text-amber-300'
                            : log.includes('[FILE_COMPILED]') || log.includes('PASS')
                            ? 'text-emerald-400'
                            : 'text-slate-300'
                        }
                      >
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval / Review Action Bar */}
            {currentTask.status === 'waiting_approval' && pendingChanges && (
              <div className="p-4 bg-amber-50 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-amber-900">
                      フルスタック変更提案のレビュー確認 ({pendingChanges.length} ファイル)
                    </div>
                    <div className="text-[11px] text-amber-700">
                      内容を確認の上、プロジェクトへ反映してください。
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={rejectPendingChanges}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-xs"
                  >
                    破棄
                  </button>
                  <button
                    onClick={() => applyPendingChanges(pendingChanges)}
                    className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shadow-cyan-600/30 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>すべての変更を適用する</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Quick Suggestion Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800 block">💡 フルスタック指示例 (クリックで入力):</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInputPrompt(q)}
                className="text-xs text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyan-400 text-slate-800 p-2.5 rounded-xl transition-all cursor-pointer shadow-2xs group flex items-start justify-between gap-2"
              >
                <span className="group-hover:text-cyan-800 font-medium">{q}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Project Constitution Rules Reference */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Project Constitution (厳格遵守アーキテクチャ)</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              Immutable Constraints
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mb-3">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">言語制約</div>
              <div className="text-slate-900 font-bold">{project.constitution.language} ONLY</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">フレームワーク</div>
              <div className="text-slate-900 font-bold">{project.constitution.framework}</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">データベース</div>
              <div className="text-slate-900 font-bold">{project.constitution.database}</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">パッケージ管理</div>
              <div className="text-slate-900 font-bold">{project.constitution.packageManager}</div>
            </div>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            {project.constitution.rules.slice(0, 3).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Input Box Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-white shrink-0 shadow-xs">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <textarea
            rows={2}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleFormSubmit(e);
              }
            }}
            placeholder="AI Agentに自然言語で指示（例: 注文カートドロワーとPostgreSQLテーブル、REST APIを作成して）... ⌘/Ctrl+Enterで実行"
            className="flex-1 bg-slate-50 border border-slate-300 focus:bg-white focus:border-cyan-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden resize-none leading-relaxed transition-colors"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || currentTask?.status === 'running'}
            className="px-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
          >
            {currentTask?.status === 'running' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span className="hidden sm:inline font-mono">実行中...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">実行</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

