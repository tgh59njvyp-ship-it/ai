import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Code2,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Play,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setDisplayMode } = useProject();

  const [activeMobileTab, setActiveMobileTab] = useState<'agent' | 'editor' | 'preview'>('preview');
  const [typedPrompt, setTypedPrompt] = useState('');
  const targetPrompt = 'ポケモンカード相場管理サイトを作って。SAR検索と損益計算付きで。';

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx <= targetPrompt.length) {
        setTypedPrompt(targetPrompt.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 overflow-hidden">
      {/* Background Subtle Tech Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] sm:text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>AI-POWERED FULL-STACK DEVELOPMENT OS</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.2] sm:leading-[1.15]">
            アイデアを、<br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              本物のソフトウェアへ。
            </span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal px-2">
            自然言語で指示し、AIと共に設計・コード生成・データベース構築・テスト・検証まで完結。
            <span className="text-white font-medium"> Project Constitution</span> があなたのアーキテクチャを守り、完成したコードは100%あなたの手元にエクスポートできます。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setDisplayMode('studio')}
              className="w-full sm:w-auto px-6 py-3.5 min-h-[46px] rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>今すぐ開発スタジオを起動</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3 min-h-[44px] rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              <span>機能とアーキテクチャを見る</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-400 pt-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>TypeScript ONLY 厳格制約</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>PostgreSQL & REST API 完備</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>ZIP & フォルダ直接エクスポート</span>
            </div>
          </div>
        </div>

        {/* Hero Workstation Visual (Real Interactive 3-Column Preview) */}
        <div className="mt-10 sm:mt-12 rounded-2xl bg-[#0a0e17] border border-slate-700/80 shadow-2xl overflow-hidden">
          {/* Top Window Bar */}
          <div className="h-10 bg-[#0e1422] border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 truncate">
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="ml-2 font-mono text-[10px] sm:text-[11px] text-slate-300 truncate">
                Genesis Studio — PokePrice Vault (Active Workspace)
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] shrink-0">
              <span className="text-emerald-400">● Live Preview Active</span>
              <span className="text-slate-500">Node.js 22 · pnpm</span>
            </div>
          </div>

          {/* Mobile Segmented Switcher (< lg) */}
          <div className="lg:hidden p-1.5 bg-slate-900 border-b border-slate-800 flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setActiveMobileTab('agent')}
              className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-colors ${
                activeMobileTab === 'agent'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. AI Agent
            </button>
            <button
              onClick={() => setActiveMobileTab('editor')}
              className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-colors ${
                activeMobileTab === 'editor'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Code Editor
            </button>
            <button
              onClick={() => setActiveMobileTab('preview')}
              className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-colors ${
                activeMobileTab === 'preview'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Live Preview
            </button>
          </div>

          {/* 3-Column Workstation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] sm:min-h-[440px] divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {/* Col 1: AI Agent Chat (3.5 cols) */}
            <div
              className={`lg:col-span-4 p-4 flex flex-col justify-between bg-[#080c14] text-xs ${
                activeMobileTab === 'agent' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Agent Architect
                  </span>
                  <span className="text-emerald-400">Constitution Verified</span>
                </div>

                {/* User Prompt Bubble */}
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-slate-200">
                  <div className="text-[10px] text-cyan-400 font-mono mb-1">User Instruction</div>
                  <div className="font-mono text-xs">{typedPrompt}</div>
                </div>

                {/* AI Thought Stream */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-[11px] text-slate-300">
                  <div className="text-cyan-400 font-semibold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Genesis Execution Pipeline:</span>
                  </div>
                  <div className="space-y-1 text-slate-400">
                    <div className="text-emerald-400">✓ 憲法照合: TypeScript & PostgreSQL 遵守</div>
                    <div className="text-emerald-400">✓ テーブル設計: pokemon_cards, portfolio</div>
                    <div className="text-emerald-400">✓ API設計: /api/v1/cards, /api/v1/portfolio</div>
                    <div className="text-cyan-300 animate-pulse">● UIコンポーネント & 損益チャート生成中...</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => setDisplayMode('studio')}
                  className="w-full py-2.5 min-h-[42px] bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>このプロジェクトをStudioで開く</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Col 2: Code Editor (4.5 cols) */}
            <div
              className={`lg:col-span-4 p-4 bg-[#0a0e17] font-mono text-xs overflow-hidden flex flex-col justify-between ${
                activeMobileTab === 'editor' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800 mb-2">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    src/App.tsx
                  </span>
                  <span className="text-[10px] text-slate-500">TypeScript · React</span>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed select-text overflow-x-auto">
                  <div><span className="text-purple-400">interface</span> <span className="text-yellow-300">CardItem</span> {'{'}</div>
                  <div className="pl-4">id: <span className="text-cyan-400">string</span>;</div>
                  <div className="pl-4">name: <span className="text-cyan-400">string</span>;</div>
                  <div className="pl-4">price_jpy: <span className="text-cyan-400">number</span>;</div>
                  <div className="pl-4">change_24h: <span className="text-cyan-400">number</span>;</div>
                  <div>{'}'}</div>
                  <div className="pt-1"><span className="text-purple-400">export default function</span> <span className="text-blue-400">PokePriceApp</span>() {'{'}</div>
                  <div className="pl-4"><span className="text-purple-400">const</span> [cards] = useState&lt;<span className="text-yellow-300">CardItem</span>[]&gt;([...]);</div>
                  <div className="pl-4"><span className="text-slate-500">// リアルタイム損益計算 & レア度フィルター</span></div>
                  <div className="pl-4"><span className="text-purple-400">const</span> totalProfit = calcROI(cards);</div>
                  <div className="pl-4"><span className="text-purple-400">return</span> &lt;<span className="text-rose-400">div</span> className=<span className="text-emerald-300">"vault-grid"</span>&gt;...&lt;/<span className="text-rose-400">div</span>&gt;;</div>
                  <div>{'}'}</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
                <span>Ln 14, Col 22</span>
                <span className="text-cyan-400 font-semibold">Strict Typing Active</span>
              </div>
            </div>

            {/* Col 3: Live Preview Rendering (4 cols) */}
            <div
              className={`lg:col-span-4 p-4 bg-[#080c14] flex flex-col justify-between ${
                activeMobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800 mb-3">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    Live App Preview
                  </span>
                  <span className="text-xs text-slate-500">Interactive</span>
                </div>

                {/* Simulated Working App Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">総資産評価額</div>
                      <div className="text-base font-bold font-mono text-white">¥131,800</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-400 font-mono">+¥18,800 (+16.6%)</div>
                      <div className="text-[9px] text-slate-500">含み益</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 bg-slate-950 rounded-lg flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium">リザードンex SAR</span>
                      <span className="font-mono text-cyan-300 font-semibold">¥42,800</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium">ナンジャモ SAR</span>
                      <span className="font-mono text-cyan-300 font-semibold">¥89,000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>Vercel Edge Ready</span>
                <span className="text-emerald-400">PostgreSQL Synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
