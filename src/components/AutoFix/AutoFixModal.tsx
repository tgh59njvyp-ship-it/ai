import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  Wrench,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileCode,
  CheckSquare,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Terminal,
  Bug,
  ChevronRight,
  Zap,
  Code2,
  Copy,
  Check,
} from 'lucide-react';

export const AutoFixModal: React.FC = () => {
  const {
    isAutoFixModalOpen,
    setIsAutoFixModalOpen,
    autoFixState,
    startAutoFixLoop,
    applyAutoFixPatch,
    project,
    runtimeError,
  } = useProject();

  const [customErrorInput, setCustomErrorInput] = useState<string>(
    runtimeError || "TypeError: Cannot read properties of undefined (reading 'avatar_url') in src/App.tsx:42:15"
  );
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'diff' | 'tests' | 'logs'>('diff');
  const [isCopied, setIsCopied] = useState(false);

  if (!isAutoFixModalOpen) return null;

  const presets = [
    {
      title: 'TypeError: 未定義プロパティ参照',
      error: "TypeError: Cannot read properties of undefined (reading 'avatar_url') in src/App.tsx:42:15",
      description: 'オブジェクトがnull/undefinedの状態でプロパティを参照した際の実行時例外',
    },
    {
      title: 'ReferenceError: 未定義識別子',
      error: "ReferenceError: calculateCartSubtotal is not defined at CartDrawer (src/components/CartDrawer.tsx:28:8)",
      description: '関数または変数のインポート漏れ・未宣言による参照エラー',
    },
    {
      title: 'AssertionError: テスト不合格',
      error: "AssertionError: Expected status 200 OK with session payload, received 401 Unauthorized in src/tests/auth.test.ts:14:5",
      description: '単体テスト・APIテストのアサーション不一致エラー',
    },
    {
      title: 'PostgreSQL: スキーマカラム不整合',
      error: 'DatabaseSchemaError: column "tax_rate" does not exist in table "orders" at PostgresQuery (src/db/schema.sql:8:1)',
      description: 'データベーステーブル定義とSQLクエリのスキーマ不整合エラー',
    },
  ];

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setCustomErrorInput(presets[idx].error);
  };

  const handleStartLoop = () => {
    if (!customErrorInput.trim()) return;
    startAutoFixLoop(customErrorInput.trim());
  };

  const currentIteration = autoFixState?.iterations[autoFixState.iterations.length - 1];
  const isRunning = autoFixState?.status === 'analyzing' || autoFixState?.status === 'patching' || autoFixState?.status === 'testing';
  const isSuccess = autoFixState?.status === 'success';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 select-none animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Auto-Fix & Test Loop
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">
                  Self-Healing Engine
                </span>
              </div>
              <p className="text-xs text-slate-300">
                エラーログと該当コードをAST解析し、修正案の自動生成とテスト検証をループ実行します
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAutoFixModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Preset Buttons & Input Box */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Bug className="w-3.5 h-3.5 text-rose-500" />
                <span>解析対象のエラーログ / スタックトレース:</span>
              </span>
              <span className="text-[11px] text-slate-500">プリセットまたは直接入力</span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPresetIndex === idx
                      ? 'bg-cyan-50 border-cyan-400 shadow-2xs text-cyan-950 font-medium'
                      : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate flex items-center justify-between">
                    <span>{p.title}</span>
                    {selectedPresetIndex === idx && <Check className="w-3 h-3 text-cyan-600 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.description}</div>
                </button>
              ))}
            </div>

            {/* Error Textarea Input */}
            <div className="relative">
              <textarea
                rows={2}
                value={customErrorInput}
                onChange={(e) => {
                  setCustomErrorInput(e.target.value);
                  setSelectedPresetIndex(null);
                }}
                placeholder="エラーログやスタックトレースを貼り付けてください..."
                className="w-full font-mono text-xs p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Launch Button */}
            <div className="flex justify-end">
              <button
                onClick={handleStartLoop}
                disabled={isRunning || !customErrorInput.trim()}
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auto-Fix & Test Loop 実行中 (Loop {autoFixState?.currentIteration || 1}/{autoFixState?.maxIterations || 3})...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Auto-Fix & Test Loop を開始する</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loop Execution Results Card */}
          {autoFixState && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden animate-fadeIn space-y-4">
              {/* Loop Progress Visualizer Banner */}
              <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                    <span className="font-mono text-xs text-cyan-300 font-bold uppercase tracking-wider">
                      AUTO-FIX LOOP STATUS: {autoFixState.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-white/10 px-2.5 py-0.5 rounded-full text-slate-200">
                    Iteration {autoFixState.currentIteration} of {autoFixState.maxIterations}
                  </span>
                </div>

                {/* Visual Step Nodes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className={`p-2 rounded-xl border ${autoFixState.currentIteration >= 1 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    <div className="font-mono text-[10px] text-cyan-300 font-bold">STEP 1</div>
                    <div className="font-semibold text-[11px]">エラー構文・AST解析</div>
                    <div className="text-[10px] text-slate-300 truncate">{autoFixState.errorDetails.type || 'Runtime Error'}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${autoFixState.currentIteration >= 1 ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    <div className="font-mono text-[10px] text-indigo-300 font-bold">STEP 2</div>
                    <div className="font-semibold text-[11px]">修正パッチの自動合成</div>
                    <div className="text-[10px] text-slate-300 truncate">{autoFixState.errorDetails.filePath}</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${autoFixState.currentIteration >= 1 ? 'bg-purple-500/20 border-purple-400 text-purple-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    <div className="font-mono text-[10px] text-purple-300 font-bold">STEP 3</div>
                    <div className="font-semibold text-[11px]">テスト検証ループ</div>
                    <div className="text-[10px] text-slate-300">Vitest / Unit Suite</div>
                  </div>

                  <div className={`p-2 rounded-xl border ${isSuccess ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    <div className="font-mono text-[10px] text-emerald-300 font-bold">STEP 4</div>
                    <div className="font-semibold text-[11px]">自己検証 & 解決</div>
                    <div className="text-[10px] text-slate-300">{isSuccess ? '✓ 100% Passed' : '検証中...'}</div>
                  </div>
                </div>

                {/* Root Cause & Diagnostic Note */}
                <div className="p-2.5 bg-white/10 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>根本原因 (Root Cause):</span>
                  </div>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    {autoFixState.errorDetails.rootCause}
                  </p>
                </div>
              </div>

              {/* Tab Switcher: Diff vs Test Results vs Logs */}
              <div className="px-4 flex border-b border-slate-200 bg-white">
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'diff' ? 'border-cyan-600 text-cyan-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>修正差分 (Diff Preview)</span>
                </button>
                <button
                  onClick={() => setActiveTab('tests')}
                  className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'tests' ? 'border-cyan-600 text-cyan-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>テスト結果 ({currentIteration?.testResults.passed || 0}/{currentIteration?.testResults.total || 0} 合格)</span>
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'logs' ? 'border-cyan-600 text-cyan-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Loop 実行ログ</span>
                </button>
              </div>

              {/* Tab 1: Diff Preview */}
              {activeTab === 'diff' && currentIteration && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-700 font-bold flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-cyan-600" />
                      <span>{currentIteration.targetFile}</span>
                    </span>
                    <span className="text-[11px] text-slate-500">{currentIteration.patchDescription}</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 max-h-60 overflow-y-auto space-y-1">
                    <div className="text-slate-500 select-none pb-1 border-b border-slate-800">
                      --- {currentIteration.targetFile} (Original)
                      <br />
                      +++ {currentIteration.targetFile} (Auto-Fixed Patch)
                    </div>
                    {currentIteration.proposedChanges[0]?.newContent.split('\n').slice(0, 20).map((line, idx) => (
                      <div
                        key={idx}
                        className={
                          line.includes('// [Auto-Fix') || line.includes('?.') || line.includes('??')
                            ? 'bg-emerald-950/70 text-emerald-300 font-semibold px-1 rounded'
                            : 'text-slate-300'
                        }
                      >
                        <span className="text-slate-600 w-6 inline-block select-none">{idx + 1}</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Test Results */}
              {activeTab === 'tests' && currentIteration && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">自動実行テストスイートの評価結果:</span>
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${currentIteration.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {currentIteration.testResults.passed} / {currentIteration.testResults.total} PASSED
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentIteration.testResults.tests.map((t, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                          t.status === 'passed' ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {t.status === 'passed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <div>
                            <div className="font-bold text-slate-900">{t.name}</div>
                            {t.errorMessage && <div className="text-[11px] text-rose-700 mt-0.5">{t.errorMessage}</div>}
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">{t.durationMs}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Terminal Logs */}
              {activeTab === 'logs' && (
                <div className="p-4">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-60 overflow-y-auto space-y-1.5">
                    {autoFixState.logs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-cyan-400 font-bold select-none">&gt;</span>
                        <span
                          className={
                            log.includes('✓') || log.includes('PASS')
                              ? 'text-emerald-400'
                              : log.includes('✗') || log.includes('FAIL')
                              ? 'text-rose-400'
                              : log.includes('Loop')
                              ? 'text-cyan-300 font-bold'
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

              {/* Success / Apply Banner */}
              {isSuccess && (
                <div className="p-4 bg-emerald-50 border-t border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        自動修復＆テスト検証ループが正常に完了しました！ (100% Tests Passed)
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        生成されたパッチをプロジェクトに適用し、Gitスナップショットを作成できます。
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      applyAutoFixPatch();
                      setIsAutoFixModalOpen(false);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>修正パッチを適用して保存</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
