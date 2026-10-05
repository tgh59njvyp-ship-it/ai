import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  BookOpen,
  Search,
  X,
  ChevronRight,
  ShieldCheck,
  Code2,
  Database,
  Download,
  Rocket,
  Terminal,
  Key,
} from 'lucide-react';

interface DocArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
}

const DOCS_ARTICLES: DocArticle[] = [
  {
    id: 'getting-started',
    category: '入門ガイド',
    title: 'Genesis OS クイックスタート',
    summary: '自然言語から最初のフルスタックアプリケーションを構築する手順',
    content: `## Genesis OS へようこそ

Genesis OSは、自然言語のアイデアを実稼働する本物のフルスタックソフトウェアへ変換する開発プラットフォームです。

### 基本的な開発の流れ
1. **プロジェクト作成**: テンプレート（SNS、相場追跡、予約SaaS、AIチャット）を選択するか、新規作成します。
2. **AI Agent へ指示**: 「管理画面にCSVダウンロード機能を追加して」などと日本語でプロンプトを入力。
3. **Project Constitution 照合**: AIが言語制約（TypeScript ONLY等）とフレームワークを厳格に確認。
4. **Diff レビュー**: 生成された変更の差分を確認し、Accept（承認）します。
5. **Live Preview**: デスクトップ・タブレット・スマホの各ビューで即座に対話型動作確認。
6. **Export & デプロイ**: ZIPダウンロードやフォルダ書き出しでローカルPCへ完全持ち出し、またはVercelへ即座に本番公開。`,
  },
  {
    id: 'project-constitution',
    category: 'アーキテクチャ',
    title: 'Project Constitution (プロジェクト憲法) の仕様',
    summary: 'AIが技術スタックを勝手に変更することを禁止する不変ルールエンジン',
    content: `## Project Constitution とは

AIにコードを生成させると、勝手に別言語のコードを混ぜたり、指示のないUIライブラリを追加してプロジェクトを壊してしまう問題（AI Drift）が発生します。

Genesis OSでは、プロジェクトごとに「Project Constitution」を策定します:
- **言語固定 (Language Invariant)**: TypeScript ONLYに設定した場合、AIはJavaScriptやPythonの生成を拒否します。
- **フレームワーク固定**: React / Next.jsが指定されている場合、別フレームワークへの移行はユーザー承認がない限り禁止されます。
- **パッケージマネージャー**: pnpmが指定されている場合、pnpm-lock.yamlを維持します。
- **依存関係制御**: Allowed（許可）, Requires Approval（承認必須）, Blocked（禁止）の3段階でパッケージを厳格管理します。`,
  },
  {
    id: 'database-and-orm',
    category: 'バックエンド',
    title: 'PostgreSQL データベースとマイグレーション',
    summary: 'Database StudioによるER図設計・SQLクエリ実行・データ永続化',
    content: `## データベースアーキテクチャ

Genesis OSでは、すべての永続化データは正規化されたPostgreSQLスキーマとして設計されます。

### Database Studio の機能
- **ERスキーマ設計**: テーブル定義、主キー(PK)、外部キー(FK)リレーション、カラム型を視覚的に管理。
- **データエクスプローラ**: テーブルごとの実レコードを直接閲覧・編集。
- **SQLクエリエディタ**: \`SELECT * FROM users;\` などのSQLをブラウザ上で実行し、レイテンシと結果を表示。
- **マイグレーション履歴**: スキーマ変更SQLが自動的に蓄積され、本番DB移行時にそのまま利用可能。`,
  },
  {
    id: 'export-and-portability',
    category: '所有権と持ち出し',
    title: 'コード完全エクスポートとローカル実行',
    summary: 'ZIPダウンロード、File System Access APIフォルダ書き出し、ノーロックイン保証',
    content: `## 完全なコード所有権

作成されたコードは1行たりともプラットフォームに閉じ込められません。

### エクスポート方法
1. **ZIP ダウンロード**: 全ディレクトリ、package.json、README.md、.env.exampleを含んだZIPを一括ダウンロード。
2. **フォルダ直接書き出し**: File System Access APIに対応したブラウザでは、ローカルPCのフォルダへ直接ツリーを書き出せます。
3. **GitHub 同期**: コミット履歴とスナップショットをそのままGitHubリモートリポジトリへ同期。

### ローカルでの起動方法
\`\`\`bash
# 1. 解凍後ディレクトリへ移動
cd my-project

# 2. 依存関係のインストール (pnpm)
pnpm install

# 3. 開発サーバーの起動
pnpm dev
\`\`\``,
  },
  {
    id: 'security-and-secrets',
    category: 'セキュリティ',
    title: 'シークレット保護と Git Safety スキャナー',
    summary: 'APIキーやクレデンシャルのハードコード流出を防止する保護機構',
    content: `## セキュリティ規律

ソースコード内に生のAPIキーやパスワードを含めることは厳格に禁止されています。

- **.env.example 自動生成**: 環境変数テンプレートを自動生成し、実トークンは.envに分離。
- **Git Safety スキャナー**: コミット作成時およびGitHub同期時に静的解析を実行し、秘密情報のハードコードを検知して警告。
- **BYOK 暗号化**: ユーザーが設定したAPIキーはローカルストレージにのみ保存され、外部サーバーへ送信されません。`,
  },
];

export const DocsModal: React.FC = () => {
  const { isDocsOpen, setIsDocsOpen } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleId, setActiveArticleId] = useState<string>('getting-started');

  if (!isDocsOpen) return null;

  const filteredArticles = searchQuery
    ? DOCS_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : DOCS_ARTICLES;

  const currentArticle =
    DOCS_ARTICLES.find((a) => a.id === activeArticleId) || DOCS_ARTICLES[0];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Genesis OS 公式ドキュメント</h2>
              <p className="text-xs text-slate-400">アーキテクチャ、Project Constitution、API、エクスポート仕様</p>
            </div>
          </div>
          <button
            onClick={() => setIsDocsOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-[#0a0e17] border-r border-slate-800/80 p-3 space-y-2 flex flex-col shrink-0">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ドキュメントを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Articles List */}
            <div className="flex-1 overflow-y-auto space-y-1 pt-1">
              {filteredArticles.map((art) => (
                <button
                  key={art.id}
                  onClick={() => setActiveArticleId(art.id)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    art.id === activeArticleId
                      ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                  }`}
                >
                  <div className="truncate">
                    <div className="text-[10px] text-slate-500 font-mono">{art.category}</div>
                    <div className="truncate">{art.title}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* Article View */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#080c14] space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {currentArticle.category}
              </span>
              <h1 className="text-xl font-bold text-white mt-2">{currentArticle.title}</h1>
              <p className="text-xs text-slate-400 mt-1">{currentArticle.summary}</p>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-3 font-sans whitespace-pre-wrap select-text">
              {currentArticle.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
