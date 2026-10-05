import React from 'react';
import { Download, FolderDown, Github, Terminal, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const OwnYourCodeSection: React.FC = () => {
  const { setIsExportModalOpen, setDisplayMode } = useProject();

  return (
    <section id="own-your-code" className="py-20 bg-[#0b0f19] border-t border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Zero Platform Lock-in
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            AIの中に閉じ込めない。<br />
            あなたのコードは、あなたのもの。
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            多くのAI開発プラットフォームは、ユーザーを自社環境に囲い込もうとします。
            Genesis OSの設計思想は真逆です。いつでも、どのような形式でも、作成したソフトウェアをそのままローカル環境や他社クラウドへ持ち出せます。
          </p>
        </div>

        {/* 3 Pillars of Ownership */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Folder Export */}
          <div className="bg-[#0e1422] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <FolderDown className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">フォルダ直接書き出し</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ブラウザのFile System Access APIを活用し、ローカルPCの指定フォルダへ完全なディレクトリツリー（src/, app/, package.json, README等）を直接保存します。
              </p>
            </div>
            <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 pt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ファイル構造完全維持</span>
            </div>
          </div>

          {/* Card 2: ZIP Export */}
          <div className="bg-[#0e1422] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">ZIPアーカイブ出力</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ワンクリックで全コードベース、アセット、lockfile、自動生成されたREADME.md、安全に秘匿化された.env.exampleをZIPパッケージ化して即座にダウンロード。
              </p>
            </div>
            <div className="text-[11px] font-mono text-indigo-400 flex items-center gap-1.5 pt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Git Safetyスキャン済み</span>
            </div>
          </div>

          {/* Card 3: GitHub Direct Sync */}
          <div className="bg-[#0e1422] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Github className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">GitHubリポジトリ同期</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                コミット履歴、ブランチ構造、スナップショットをそのままGitHubリモートリポジトリへ同期。チーム開発やCI/CDパイプラインへ即座に接続できます。
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>完全なGitコミットグラフ保持</span>
            </div>
          </div>
        </div>

        {/* Local Run Preview Box */}
        <div className="mt-10 max-w-4xl mx-auto bg-[#080c14] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>持ち出し後も 100% 動作保証</span>
            </span>
            <p className="text-xs text-slate-400">
              エクスポートしたプロジェクトは、<code className="text-cyan-300 font-mono">pnpm install &amp;&amp; pnpm dev</code> だけであなたの端末上で即座に起動します。
            </p>
          </div>

          <button
            onClick={() => {
              setDisplayMode('studio');
              setIsExportModalOpen(true);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700/80"
          >
            <span>エクスポート機能を試す</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
