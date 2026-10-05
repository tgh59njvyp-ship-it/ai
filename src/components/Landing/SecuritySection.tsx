import React from 'react';
import { Shield, Lock, FileKey, EyeOff, GitPullRequest, CheckCircle2 } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityItems = [
    {
      icon: FileKey,
      title: '環境変数の完全分離 (.env.example 自動生成)',
      desc: 'データベース接続文字列やAPIトークンはソースコードに直接含めず、自動生成された.env.exampleへ分離。エクスポート時にも漏洩しません。',
    },
    {
      icon: GitPullRequest,
      title: 'Git Safety スキャナー',
      desc: 'コミット作成時およびGitHub同期時にソースコード内を自動静的解析し、秘密情報のハードコードを検知して警告・阻止します。',
    },
    {
      icon: EyeOff,
      title: 'BYOK クライアント暗号化',
      desc: 'ユーザーが入力した個人用APIキーはブラウザ内ローカルストレージにのみ保存され、Genesis OSのサーバーや外部ログへ永続化されません。',
    },
    {
      icon: Lock,
      title: 'サンドボックス実行隔離',
      desc: 'リアルタイムプレビューは独立したiframe sandbox属性下で実行され、親DOMコンテキストやクッキーへの不正アクセスを防ぎます。',
    },
  ];

  return (
    <section className="py-20 bg-[#080c14] border-t border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Trust & Security Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            透明性のあるセキュリティ設計
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            誇張のない、具体的な設計によるセキュリティ。開発者の大切なソースコードと認証情報を確実に保護します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {securityItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-12">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
