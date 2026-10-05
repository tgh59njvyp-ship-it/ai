import React from 'react';
import { Cpu, Sliders, FolderDown, Rocket, TrendingUp, Check } from 'lucide-react';

export const CoreValuesSection: React.FC = () => {
  const values = [
    {
      icon: Cpu,
      title: '01. Build Together',
      subtitle: 'AIと協調する開発',
      desc: '単なるコード出力ではなく、要件分析・アーキテクチャ設計・ファイル構成・型定義・テストまでAIエージェントと共に反復開発します。',
      metrics: '7段階パイプライン',
    },
    {
      icon: Sliders,
      title: '02. Total Control',
      subtitle: '技術スタックの絶対統制',
      desc: '使用言語（TypeScript等）、フレームワーク、パッケージマネージャー（pnpm）、DB（PostgreSQL）を固定し、AIの勝手な仕様逸脱を防止します。',
      metrics: 'Project Constitution',
    },
    {
      icon: FolderDown,
      title: '03. Own Your Code',
      subtitle: '完全なコード所有権',
      desc: '作成したプロジェクトは1行たりともプラットフォームに閉じ込めません。ZIPダウンロードやローカルフォルダ直接書き出しで自由に持ち出せます。',
      metrics: 'ノーロックイン保証',
    },
    {
      icon: Rocket,
      title: '04. Instant Deploy',
      subtitle: '本番環境への直結',
      desc: 'Vercel、Netlify、Cloudflare、Railwayへの本番デプロイに対応。開発完了と同時に世界中のエッジネットワークへ公開可能です。',
      metrics: 'ワンクリックデプロイ',
    },
    {
      icon: TrendingUp,
      title: '05. Production Grade',
      subtitle: 'プロトタイプから本番運用へ',
      desc: 'おもちゃのモックではなく、本物のPostgreSQLデータベース、REST APIエンドポイント、厳格なテストスイートを統合した本物のWebアプリを構築。',
      metrics: 'フルスタック統合',
    },
  ];

  return (
    <section id="values" className="py-20 bg-[#0b0f19] border-t border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Core Philosophy
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            5つの開発原則
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            AI開発の未来は「AI任せ」ではなく、「AIと共に、自らのルールで、自分のコードを作る」ことにあります。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="bg-[#0e1422] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:bg-slate-850 group space-y-3"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 mb-0.5">{v.title}</div>
                  <h3 className="text-sm font-semibold text-white mb-2">{v.subtitle}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                  {v.metrics}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
