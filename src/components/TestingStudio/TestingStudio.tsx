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
} from 'lucide-react';

export const TestingStudio: React.FC = () => {
  const { project, runAllTests, runAgentPrompt, setActiveView } = useProject();
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
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Header */}
      <div className="h-12 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Testing & Quality Assurance</h2>
            <p className="text-[10px] text-slate-500">ユニット・結合・API・UIテストの自動検証スイート</p>
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunning ? 'テスト実行中...' : 'すべてのテストを実行'}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-5 space-y-5">
        {/* Test Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-[11px] text-slate-500 mb-1 font-medium">テスト総数</div>
            <div className="text-xl font-bold font-mono text-slate-900">{tests.length} 件</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-[11px] text-slate-500 mb-1 font-medium">合格 (Passed)</div>
            <div className="text-xl font-bold font-mono text-emerald-600">{passedCount} 件</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-[11px] text-slate-500 mb-1 font-medium">失敗 (Failed)</div>
            <div className="text-xl font-bold font-mono text-rose-600">{failedCount} 件</div>
          </div>
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
                  <div className="text-[11px] text-slate-600">{t.assertion}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">{t.durationMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
