import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  CheckSquare,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  ShieldCheck,
  Plus,
  Zap,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const TestingStudio: React.FC = () => {
  const { project, runAllTests, startAutoFixLoop, setIsAutoFixModalOpen } = useProject();
  const tests = project.tests;

  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    await runAllTests();
    setIsRunning(false);
  };

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const failedCount = tests.filter((t) => t.status === 'failed').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden select-none">
      {/* Header */}
      <div className="h-12 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">Testing & Quality Assurance</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                Vitest / E2E
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500">ユニット・結合・API・UIテストの自動検証スイート</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-Fix Loop Trigger */}
          <button
            onClick={() => startAutoFixLoop('AssertionError: テストスイートの検証に失敗しました')}
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Auto-Fix & Test Loop</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
            <span>{isRunning ? 'テスト実行中...' : 'すべてのテストを実行'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-5 space-y-4 sm:space-y-5">
        {/* Test Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-medium">テスト総数</div>
            <div className="text-xl font-bold font-mono text-slate-900">{tests.length} 件</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-medium">合格 (Passed)</div>
            <div className="text-xl font-bold font-mono text-emerald-600">{passedCount} 件</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-medium">失敗 (Failed)</div>
            <div className="text-xl font-bold font-mono text-rose-600">{failedCount} 件</div>
          </div>
        </div>

        {/* Auto-Fix Loop Banner info */}
        <div className="p-3.5 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Auto-Fix & Test Loop (自己修復・検証ループ)
              </div>
              <p className="text-[11px] text-slate-600">
                テスト不合格やエラーログをAST解析し、修正パッチを自動生成してテストが合格するまで自動検証ループを実行します。
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAutoFixModalOpen(true)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>ループ画面を開く</span>
          </button>
        </div>

        {/* Tests List */}
        <div className="space-y-2.5">
          {tests.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {t.status === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : t.status === 'failed' ? (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-900">{t.name}</span>
                    <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                      {t.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">{t.assertion}</div>
                  {t.errorMessage && (
                    <div className="text-[11px] text-rose-600 font-mono mt-1 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                      {t.errorMessage}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs font-mono text-slate-400">{t.durationMs}ms</span>
                {t.status === 'failed' && (
                  <button
                    onClick={() => startAutoFixLoop(`AssertionError in ${t.name}: ${t.errorMessage || t.assertion}`)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>Auto-Fix</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

