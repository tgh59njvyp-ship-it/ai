import React from 'react';
import { XCircle, CheckCircle2, ShieldAlert, ShieldCheck, ArrowRight, Code2 } from 'lucide-react';

export const BeforeAfterSection: React.FC = () => {
  return (
    <section className="py-20 border-t border-slate-800/80 bg-[#080c14] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Paradigm Shift
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            単なる「コード生成」と「本物の開発OS」の違い
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            AIチャットボットにコードを書かせるだけでは、ソフトウェアは完成しません。
            Genesis OSは、本番運用に耐えうるアーキテクチャ規律と完全な持ち出し自由度を提供します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* BEFORE CARD */}
          <div className="bg-[#0b0f19] border border-rose-500/20 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                従来のAIコード生成ツール
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Toy Generator</span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">勝手な技術スタックの改変</strong>
                  <span className="text-slate-400 text-[11px]">
                    TypeScriptで依頼したのに勝手にPythonを混ぜたり、指示なく別UIライブラリを追加してビルドを破壊する。
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">プラットフォームへのベンダーロックイン</strong>
                  <span className="text-slate-400 text-[11px]">
                    生成されたコードがそのAIサービス上でしか動かず、ローカルPCや自社サーバーへ持ち出せない。
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">秘密情報・APIキーのハードコード漏洩</strong>
                  <span className="text-slate-400 text-[11px]">
                    ソースコード内に生のAPIキーやパスワードを直接書き込み、Gitや外部共有時に流出事故を起こす。
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">UIだけの偽モック機能</strong>
                  <span className="text-slate-400 text-[11px]">
                    ボタンを押しても実際にはDBに保存されず、見た目だけのダミー実装で終わる。
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* AFTER CARD */}
          <div className="bg-[#0b0f19] border border-cyan-500/30 rounded-2xl p-6 space-y-5 shadow-xl shadow-cyan-950/20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Genesis OS (開発プラットフォーム)</span>
              </span>
              <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Production-Ready
              </span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Project Constitution による厳格な憲法遵守</strong>
                  <span className="text-slate-300 text-[11px]">
                    言語（TypeScript ONLY）、フレームワーク、パッケージマネージャー（pnpm）を固定し、AIによる技術改変を阻止。
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">100% 完全なコード所有権 (ZIP & フォルダ出力)</strong>
                  <span className="text-slate-300 text-[11px]">
                    File System Access APIによる直接フォルダ書き出し・ZIPダウンロード・GitHub同期に対応。どこでも実行可能。
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Git Safety & 自動 .env.example 生成</strong>
                  <span className="text-slate-300 text-[11px]">
                    Export・Push前に秘密情報を自動検知。クレデンシャルは環境変数に分離され、安全性が保証されます。
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">PostgreSQL・REST API・テストまで本物</strong>
                  <span className="text-slate-300 text-[11px]">
                    ERスキーマ、SQLマイグレーション、APIエンドポイント、自動ユニット/UIテストがすべて実際に稼働します。
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
