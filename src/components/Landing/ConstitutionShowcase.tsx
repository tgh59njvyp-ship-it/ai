import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const ConstitutionShowcase: React.FC = () => {
  const { setDisplayMode, setActiveView } = useProject();
  const [selectedLang, setSelectedLang] = useState('TypeScript');
  const [selectedFramework, setSelectedFramework] = useState('Next.js');
  const [selectedPkg, setSelectedPkg] = useState('pnpm');

  return (
    <section id="constitution" className="py-20 bg-[#080c14] border-t border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>THE ARCHITECTURAL CONSTITUTION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              YOUR PROJECT.<br />
              <span className="text-cyan-400">YOUR RULES.</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              AI開発で最も恐ろしいのは、AIが勝手に未知のライブラリを追加したり、言語仕様を改変してプロジェクトを崩壊させることです。
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Genesis OSの <strong className="text-white">Project Constitution（プロジェクト憲法）</strong> は、AIがコードを生成・編集する前に必ず参照する不可侵のルールセットです。技術選択権は常にあなたにあります。
            </p>

            <div className="space-y-2 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>TypeScript ONLY — 未型付JSの混入を完全遮断</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>pnpm ロックファイルを維持 — 勝手にnpmへ変更しない</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>承認なき大型UIライブラリや未検証SDKの追加を禁止</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setDisplayMode('studio');
                  setActiveView('constitution');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>憲法エディタをStudioで試す</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Interactive Simulated Constitution Card */}
          <div className="lg:col-span-7 bg-[#0b0f19] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-bold">PROJECT CONSTITUTION ENGINE</span>
              </div>
              <span className="text-emerald-400 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Status: Enforced
              </span>
            </div>

            {/* Invariant Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500">Language Invariant:</span>
                <div className="text-sm font-bold text-cyan-300">{selectedLang} ONLY</div>
                <div className="text-[9px] text-rose-400">Forbidden: Python, PHP</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500">Framework Lock:</span>
                <div className="text-sm font-bold text-white">{selectedFramework}</div>
                <div className="text-[9px] text-emerald-400">App Router Locked</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500">Package Manager:</span>
                <div className="text-sm font-bold text-white">{selectedPkg}</div>
                <div className="text-[9px] text-slate-400">pnpm-lock.yaml</div>
              </div>
            </div>

            {/* Rules Code Block */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <div className="text-slate-500">// AI Agent Invariant Rules:</div>
              <div>1. Do not change framework without explicit user instruction.</div>
              <div>2. Do not change programming language (TypeScript ONLY).</div>
              <div>3. Do not introduce unverified dependencies or packages.</div>
              <div>4. Every requested feature must actually work with real database state.</div>
              <div>5. Keep the project 100% portable and exportable without vendor lock-in.</div>
            </div>

            {/* Validation Banner */}
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>AIによるコード編集時、全ファイルが自動で憲法バリデーションされます。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
