import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { History, X, Sparkles, CheckCircle2, Wrench, Shield } from 'lucide-react';

export const ChangelogModal: React.FC = () => {
  const { isChangelogOpen, setIsChangelogOpen } = useProject();

  if (!isChangelogOpen) return null;

  const releases = [
    {
      version: 'v1.2.0',
      date: '2026-10-05',
      title: 'Project Constitution Engine & Live Sandbox Preview 強化',
      features: [
        '言語不変ルール（TypeScript ONLY制約）の強制バリデーションエンジンを搭載',
        'File System Access APIによる「ローカルフォルダ直接書き出し」に対応',
        'PostgreSQL Database Studio にインタラクティブSQLクエリエディタを追加',
        'Git Safety スキャナーによるシークレット漏洩検知と .env.example 自動生成',
      ],
      improvements: [
        'Live Preview のコンソールログ捕捉レイテンシを 30% 短縮',
        'Diff Viewer での行単位変更レビューおよび個別ファイル承認の操作性向上',
      ],
      fixes: [
        '長いファイルパスにおけるファイルツリーの水平スクロール表示崩れを解消',
      ],
    },
    {
      version: 'v1.1.0',
      date: '2026-10-01',
      title: 'BYOK AI Model Router & Multi-Template Release',
      features: [
        'OpenAI・Anthropic・Ollama互換のカスタムエンドポイント（BYOK）構成を追加',
        '4つの実証済みフルスタックテンプレート（SocialSphere, PokePrice, DeskFlow, OmniChat）の提供開始',
        'API Workbench でのリアルタイムレイテンシ計測および cURL コマンド自動生成機能',
      ],
      improvements: [
        'AI Agent のパイプライン進行状態（要件分析〜完了レビュー）の可視化ステッパーを導入',
      ],
      fixes: [
        'マルチブランチ作成時の Git コミットスナップショット復元ロジックを修正',
      ],
    },
    {
      version: 'v1.0.0',
      date: '2026-09-20',
      title: 'Genesis OS Initial Release',
      features: [
        '自然言語プロンプトからのフルスタックアプリケーション自動設計・コード生成',
        'ブラウザ内サンドボックスでの React 19 / TypeScript リアルタイム実行',
        'JSZip を用いた完全なプロジェクトZIPエクスポート機能',
        'Vercel / Railway 向けの本番デプロイシミュレーション機能',
      ],
      improvements: [],
      fixes: [],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Changelog & Release Notes</h2>
              <p className="text-xs text-slate-400">Genesis OS のバージョン更新履歴と機能改善</p>
            </div>
          </div>
          <button
            onClick={() => setIsChangelogOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {releases.map((rel, idx) => (
            <div key={idx} className="relative pl-6 border-l border-slate-800 space-y-3">
              <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-950"></div>

              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-white">{rel.version}</span>
                <span className="text-xs text-slate-500 font-mono">({rel.date})</span>
                {idx === 0 && (
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.2 rounded border border-cyan-500/20 font-bold">
                    LATEST
                  </span>
                )}
              </div>

              <h3 className="text-xs font-semibold text-slate-200">{rel.title}</h3>

              {rel.features.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">New Features</div>
                  <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                    {rel.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rel.improvements.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">Improvements</div>
                  <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                    {rel.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rel.fixes.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-amber-400 font-semibold uppercase">Bug Fixes</div>
                  <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                    {rel.fixes.map((fix, i) => (
                      <li key={i}>{fix}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
