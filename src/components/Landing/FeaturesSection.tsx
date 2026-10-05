import React from 'react';
import { Database, Webhook, GitBranch, Wrench, Shield, Cpu, Code2, Play } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Database,
      title: 'Database Studio',
      problem: 'AIが勝手なスキーマを生成し、カラム型やリレーションが破綻する。',
      solution: 'PostgreSQLのER図、データエクスプローラ、SQLクエリエディタ、マイグレーション台帳を統合。',
      result: 'スキーマ整合性を維持した本物のリレーショナルDB設計とデータ永続化。',
      tag: 'PostgreSQL & Migrations',
    },
    {
      icon: Webhook,
      title: 'API Workbench',
      problem: '生成されたAPIエンドポイントが実際に動くかどうかテストできない。',
      solution: 'RESTクライアントを内蔵し、GET/POSTリクエスト送信、レスポンス検証、curlコマンド生成を即座に実行。',
      result: 'モックではなく、リアルタイムレイテンシ測定を伴う本物のAPI動作確認。',
      tag: 'Interactive REST Runner',
    },
    {
      icon: GitBranch,
      title: 'Git Version Control & Snapshots',
      problem: 'AIの大規模なコード編集によって動いていた機能が消滅し、元に戻せない。',
      solution: '全コミット時にワーキングツリーのスナップショットを自動保存し、ワンクリックで完全ロールバック。',
      result: '失敗を恐れずAIに大胆なリファクタリングを指示できる安全な開発ループ。',
      tag: 'Zero-Risk Rollback',
    },
    {
      icon: Wrench,
      title: 'Error Auto-Fix Loop',
      problem: '構文エラーや実行時例外が発生するたびに開発が中断し、原因究明に時間がかかる。',
      solution: 'サンドボックス実行時にブラウザコンソールおよびランタイムエラーを自動検知し、AIがパッチを自動適用。',
      result: '自己修復型の開発パイプラインにより、エラー解消までの時間を90%削減。',
      tag: 'Self-Healing Runtime',
    },
    {
      icon: Cpu,
      title: 'BYOK AI Model Router',
      problem: '特定のAIプロバイダーに依存し、モデルの選択肢やプライベートAPIキーが使えない。',
      solution: 'サーバーサイドGemini 3.8 Flashを標準搭載しつつ、OpenAI、Anthropic、カスタムエンドポイントに対応。',
      result: '自社キーの活用と、タスクに応じた最適なAIモデルの柔軟なルーティング。',
      tag: 'Multi-Provider Flexibility',
    },
    {
      icon: Shield,
      title: 'Secret Safety & Git Shield',
      problem: 'ソースコード内にAPIキーやシークレットがハードコードされ、Gitへ誤って流出する。',
      solution: 'コード保存およびExport時に秘密情報を自動スキャンし、.env.exampleへの分離を強制。',
      result: '機密情報の流出リスクをゼロにし、クリーンな環境変数アーキテクチャを確立。',
      tag: 'Zero-Leak Credential Engine',
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#080c14] border-t border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Engineered Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            現場のエンジニアリング課題を解決する統合機能
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            単なるチャットウィンドウではありません。IDE、データベース、API、バージョン管理が一つに結びついた完全な開発OSです。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-[#0b0f19] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all hover:bg-slate-850 group space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-3">{f.title}</h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300">
                      <span className="text-[10px] font-mono text-rose-400 block font-semibold mb-0.5">PROBLEM</span>
                      <span className="text-[11px] leading-relaxed">{f.problem}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-cyan-300">
                      <span className="text-[10px] font-mono text-cyan-400 block font-semibold mb-0.5">SOLUTION</span>
                      <span className="text-[11px] leading-relaxed">{f.solution}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                      <span className="text-[10px] font-mono text-emerald-400 block font-semibold mb-0.5">RESULT</span>
                      <span className="text-[11px] leading-relaxed">{f.result}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
