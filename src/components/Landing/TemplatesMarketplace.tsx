import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Layers, ArrowRight, Check, Star, Sparkles, ExternalLink } from 'lucide-react';

export const TemplatesMarketplace: React.FC = () => {
  const { switchProject, setDisplayMode } = useProject();

  const templates = [
    {
      id: 'proj_social_sphere',
      name: 'SocialSphere',
      tagline: 'Modern Full-Stack Social Network',
      desc: 'タイムライン、リアルタイム投稿、いいね・コメント機能、ユーザープロファイル、PostgreSQLリレーションシップを完備したSNSプラットフォーム。',
      stack: ['TypeScript', 'React 19', 'PostgreSQL', 'pnpm', 'Tailwind CSS'],
      features: ['JWT/Supabase認証', 'タイムライン投稿', 'いいね・コメント', 'REST API', '自動テスト'],
      badge: 'POPULAR',
    },
    {
      id: 'proj_poke_price',
      name: 'PokePrice Vault',
      tagline: 'Marketplace & Asset Portfolio Tracker',
      desc: 'ポケモンカード相場価格追跡、24時間価格変動、保有資産ポートフォリオROI計算、SAR/URレア度検索フィルターを搭載したトレーディング資産管理SaaS。',
      stack: ['TypeScript', 'React 19', 'PostgreSQL', 'pnpm', 'Tailwind CSS'],
      features: ['市場価格チャート', '資産損益(未実現)計算', 'レア度フィルター', '高速カード検索', 'API完備'],
      badge: 'FEATURED',
    },
    {
      id: 'proj_desk_flow',
      name: 'DeskFlow Booking & Admin',
      tagline: 'Enterprise Space & Resource Reservation',
      desc: '会議室・ワークデスクの重複防止予約ロジック、空席状況リアルタイム監視、予約台帳、管理者と一般ユーザーのRBAC権限管理を備えた社内リソース予約SaaS。',
      stack: ['TypeScript', 'React 19', 'PostgreSQL', 'pnpm', 'Tailwind CSS'],
      features: ['重複予約自動遮断', '管理者/一般RBAC', '座席・会議室空席一覧', '予約台帳台帳', 'コンフリクト検証'],
      badge: 'ENTERPRISE',
    },
    {
      id: 'proj_omni_chat',
      name: 'OmniChat AI Studio',
      tagline: 'Multi-Model Knowledge Workspace',
      desc: 'Gemini 3.8 Flashをはじめとするマルチモデル対応、ストリーミング回答、プロンプトライブラリ、スレッド履歴永続化DBを備えたAIワークスペース。',
      stack: ['TypeScript', 'React 19', 'PostgreSQL', 'pnpm', 'Tailwind CSS'],
      features: ['ストリーミングレスポンス', 'BYOK対応', 'プロンプト履歴DB', 'ワンクリックコピー', 'トークン集計'],
      badge: 'NEW',
    },
  ];

  return (
    <section id="templates" className="py-20 bg-[#0b0f19] border-t border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Verified Blueprints
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            実証済みフルスタック・テンプレート
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            白紙から始めるだけでなく、PostgreSQLスキーマ・API・UI・テストが最初から完全に組み込まれたテンプレートから即座に開発を始められます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-[#0e1422] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all hover:bg-slate-850 group space-y-5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{t.tagline}</span>
                  <span className="text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded font-bold">
                    {t.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {t.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {t.desc}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.stack.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Features List */}
                <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                  {t.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => {
                    switchProject(t.id);
                    setDisplayMode('studio');
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-cyan-600 text-white hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <span>このテンプレートで開発を始める</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
