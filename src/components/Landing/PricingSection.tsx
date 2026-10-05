import React from 'react';
import { Check, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const PricingSection: React.FC = () => {
  const { setDisplayMode } = useProject();

  const plans = [
    {
      name: 'Free (オープン版)',
      price: '¥0',
      period: '完全無料',
      desc: '個人開発者や学習用途に最適。AI開発OSの基本機能をフルに体験できます。',
      features: [
        '無制限のローカルZIP & フォルダExport',
        'Project Constitution 厳格統制',
        'BYOK (個人APIキー利用でAI無制限)',
        '3件のアクティブプロジェクト',
        'PostgreSQL & Database Studio',
        'REST API Workbench',
      ],
      cta: '今すぐ無料で始める',
      popular: false,
    },
    {
      name: 'Pro (開発者向け)',
      price: '¥3,800',
      period: '月額',
      desc: '本番SaaSや本格的なクライアントワークを構築するインディーハッカー・エンジニア向け。',
      features: [
        'Freeプランの全機能',
        'Genesis クラウドGemini 3.8 Flash内蔵',
        '無制限のプロジェクト作成',
        'ワンクリック Vercel / Railway 本番デプロイ',
        '優先エラー自動修復 (Self-Healing)',
        'GitHub プライベートリポジトリ直接同期',
      ],
      cta: 'Proで開発を始める',
      popular: true,
    },
    {
      name: 'Team (チーム開発)',
      price: '¥9,800',
      period: '月額 / 5ユーザー',
      desc: 'スタートアップや受託開発チーム向け。組織共通のProject Constitutionと共有DB。',
      features: [
        'Proプランの全機能',
        '5名までのチームメンバー招待',
        '組織共通 Project Constitution 共有',
        'ロールベースアクセス制御 (RBAC)',
        '監査ログ & 変更履歴台帳',
        '専用サポート & アーキテクチャレビュー',
      ],
      cta: 'Teamプランを試す',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-[#0b0f19] border-t border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            透明性の高い料金プラン
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            作成したコードは100%あなた自身のものです。無料プランでも完全なZIP・フォルダエクスポートに一切の制限はありません。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                p.popular
                  ? 'bg-[#0e1422] border-2 border-cyan-500/80 shadow-2xl shadow-cyan-950/40'
                  : 'bg-[#0a0e17] border border-slate-800 hover:border-slate-700'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white font-mono text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="text-sm font-semibold text-white mb-1">{p.name}</div>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold font-mono text-white">{p.price}</span>
                  <span className="text-xs text-slate-400">/ {p.period}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{p.desc}</p>

                <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setDisplayMode('studio')}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    p.popular
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <span>{p.cta}</span>
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
