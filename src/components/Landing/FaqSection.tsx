import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'エクスポートしたプロジェクトは本当にローカルや他社環境で動きますか？',
      a: 'はい、完全に動作します。Genesis OSは独自ランタイムに依存しません。標準的なTypeScript、React/Next.js、PostgreSQL、pnpm構成で出力されるため、ZIP解凍またはフォルダ保存後、ローカルマシン上で「pnpm install && pnpm dev」を実行するだけでそのまま稼働します。',
    },
    {
      q: 'AIが勝手にライブラリを追加したり既存コードを壊す心配はありませんか？',
      a: 'ありません。本プラットフォーム最大の特徴である「Project Constitution（プロジェクト憲法）」により、言語（TypeScript ONLY等）やフレームワーク、禁止依存関係が厳格に固定されます。AIは憲法ルールをすべての生成処理より優先して遵守し、変更前にはDiffレビュー（承認・却下）が提供されます。',
    },
    {
      q: '自分のGeminiやOpenAI、AnthropicのAPIキー（BYOK）を利用できますか？',
      a: 'はい、対応しています。デフォルトではサーバーサイドのGemini 3.8 Flashをご利用いただけますが、Settings画面からBYOK（Bring Your Own Key）を設定することで、ご自身のAPIキーやOpenAI互換カスタムエンドポイント（Ollama等）に切り替え可能です。',
    },
    {
      q: 'データベースやAPIエンドポイントはどのように設計されますか？',
      a: '自然言語の要件からAIが正規化されたPostgreSQLテーブルスキーマ（主キー、外部キー、インデックス、デフォルト値）を自動設計します。Database StudioでER図や行データを視覚的に編集可能で、SQLクエリの直接実行やマイグレーションSQLの書き出しにも対応しています。',
    },
    {
      q: '誤った変更が行われた場合、以前の状態に戻せますか？',
      a: 'はい、Git Managerがコミット履歴およびワーキングツリーの完全なスナップショットを保持しています。ワンクリックで過去の任意のコミット状態へ安全にロールバックできます。',
    },
  ];

  return (
    <section className="py-20 bg-[#080c14] border-t border-slate-800/80 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            よくある質問
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
