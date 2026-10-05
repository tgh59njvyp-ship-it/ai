import React, { useState } from 'react';
import { useProject, MainNavView } from '../../context/ProjectContext';
import {
  Keyboard,
  X,
  Search,
  Code2,
  Sparkles,
  Eye,
  Database,
  GitBranch,
  CheckSquare,
  Globe,
  Terminal,
  Zap,
  FolderTree,
  Play,
  ArrowRight,
} from 'lucide-react';

interface ShortcutDefinition {
  keys: string[];
  action: string;
  category: 'global' | 'editor' | 'agent' | 'preview' | 'database' | 'git' | 'testing';
  categoryLabel: string;
  icon: React.ElementType;
  description?: string;
}

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen, activeView, setActiveView } = useProject();
  const [selectedCategory, setSelectedCategory] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isShortcutsOpen) return null;

  // View metadata helper
  const getViewName = (view: MainNavView) => {
    switch (view) {
      case 'editor':
        return { label: 'エディタ & ファイル', icon: Code2, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'agent':
        return { label: 'AIエージェント', icon: Sparkles, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' };
      case 'preview':
        return { label: 'ライブプレビュー', icon: Eye, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'database':
        return { label: 'データベース Studio', icon: Database, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'git':
        return { label: 'Git & バージョン管理', icon: GitBranch, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
      case 'testing':
      case 'apis':
        return { label: 'テスト & API', icon: CheckSquare, color: 'text-purple-600 bg-purple-50 border-purple-200' };
      default:
        return { label: 'エディタ', icon: Code2, color: 'text-blue-600 bg-blue-50 border-blue-200' };
    }
  };

  const currentViewMeta = getViewName(activeView);

  const allShortcuts: ShortcutDefinition[] = [
    // Global Shortcuts
    {
      keys: ['⌘ / Ctrl', 'K'],
      action: 'コマンドパレットを開く',
      description: '全機能・ファイル・アクションを即時検索して実行',
      category: 'global',
      categoryLabel: '全般・グローバル',
      icon: Globe,
    },
    {
      keys: ['?'],
      action: 'ショートカット・チートシート表示',
      description: '本モーダルを開いてキーバインドを確認',
      category: 'global',
      categoryLabel: '全般・グローバル',
      icon: Keyboard,
    },
    {
      keys: ['⌘ / Ctrl', 'B'],
      action: 'ファイルエクスプローラーの開閉',
      description: 'サイドバー・モバイルドロワーの表示を切り替え',
      category: 'global',
      categoryLabel: '全般・グローバル',
      icon: FolderTree,
    },
    {
      keys: ['⌘ / Ctrl', 'G'],
      action: 'GitHub 認証・連携モーダルを開く',
      description: 'GitHubアカウントのOAuth/PAT連携・同期設定',
      category: 'global',
      categoryLabel: '全般・グローバル',
      icon: GitBranch,
    },
    {
      keys: ['⌘ / Ctrl', 'S'],
      action: 'プロジェクト状態の自動永続化',
      description: '全ファイル・DB状態をローカルへ即時保存',
      category: 'global',
      categoryLabel: '全般・グローバル',
      icon: Zap,
    },
    {
      keys: ['Esc'],
      action: 'モーダル・ドロワーを閉じる',
      description: '開いているポップアップ・パレットをキャンセル',
      category: 'global',
      categoryLabel: '全般・グローバル',
      icon: Globe,
    },

    // Editor Shortcuts
    {
      keys: ['Tab'],
      action: '2スペースインデント挿入',
      description: 'コードの字下げ（Shift+Tabで逆インデント）',
      category: 'editor',
      categoryLabel: 'エディタ & ファイル',
      icon: Code2,
    },
    {
      keys: ['⌘ / Ctrl', 'F'],
      action: 'ファイル内検索',
      description: 'エディタ内の文字列・識別子を素早く検索',
      category: 'editor',
      categoryLabel: 'エディタ & ファイル',
      icon: Code2,
    },
    {
      keys: ['⌘ / Ctrl', '/'],
      action: '行コメントの切り替え',
      description: '選択中の行をコメントアウト/解除',
      category: 'editor',
      categoryLabel: 'エディタ & ファイル',
      icon: Code2,
    },
    {
      keys: ['Alt', 'Z'],
      action: '右端折り返し (Word Wrap) 切り替え',
      description: '長い行の折り返し表示を切り替え',
      category: 'editor',
      categoryLabel: 'エディタ & ファイル',
      icon: Code2,
    },

    // AI Agent Shortcuts
    {
      keys: ['⌘ / Ctrl', 'Enter'],
      action: 'AIプロンプト送信 & タスク実行',
      description: 'アーキテクチャ設計・コード生成・バグ修正を指示',
      category: 'agent',
      categoryLabel: 'AIエージェント',
      icon: Sparkles,
    },
    {
      keys: ['⌘ / Ctrl', 'Shift', 'F'],
      action: 'AIランタイムエラー自動修復',
      description: '検出されたエラーログをAIに送信し即時修正提案を生成',
      category: 'agent',
      categoryLabel: 'AIエージェント',
      icon: Sparkles,
    },
    {
      keys: ['⌘ / Ctrl', 'J'],
      action: 'AI提案差分 (Diff) のレビューと承認',
      description: '変更箇所のビジュアルDiffを確認して適用',
      category: 'agent',
      categoryLabel: 'AIエージェント',
      icon: Sparkles,
    },

    // Preview Shortcuts
    {
      keys: ['⌘ / Ctrl', 'R'],
      action: 'プレビューの強制ホットリロード',
      description: '仮想サンドボックスの再描画・状態リセット',
      category: 'preview',
      categoryLabel: 'ライブプレビュー',
      icon: Eye,
    },
    {
      keys: ['⌘ / Ctrl', 'Shift', 'M'],
      action: 'デバイス切り替え (Mobile/Tablet/PC)',
      description: 'レスポンシブ検証用フレーム幅のトグル',
      category: 'preview',
      categoryLabel: 'ライブプレビュー',
      icon: Eye,
    },
    {
      keys: ['⌘ / Ctrl', '`'],
      action: 'コンソールログドロワーの開閉',
      description: '実行時エラー・Consoleメッセージの確認',
      category: 'preview',
      categoryLabel: 'ライブプレビュー',
      icon: Eye,
    },

    // Database Shortcuts
    {
      keys: ['⌘ / Ctrl', 'Enter'],
      action: 'SQLクエリの実行',
      description: '入力されたSQLを実行しテーブルビューを即時更新',
      category: 'database',
      categoryLabel: 'データベース Studio',
      icon: Database,
    },
    {
      keys: ['⌘ / Ctrl', 'L'],
      action: 'SQLコンソール・クエリのクリア',
      description: 'エディタ入力を初期化',
      category: 'database',
      categoryLabel: 'データベース Studio',
      icon: Database,
    },

    // Git Shortcuts
    {
      keys: ['⌘ / Ctrl', 'Enter'],
      action: 'コミットの確定・作成',
      description: '変更差分を新しいコミットとして記録',
      category: 'git',
      categoryLabel: 'Git & バージョン管理',
      icon: GitBranch,
    },
    {
      keys: ['⌘ / Ctrl', 'Shift', 'B'],
      action: '新規ブランチ作成モーダル',
      description: '作業用ブランチの分岐と切り替え',
      category: 'git',
      categoryLabel: 'Git & バージョン管理',
      icon: GitBranch,
    },

    // Testing & API
    {
      keys: ['⌘ / Ctrl', 'Enter'],
      action: '全テストスイートの自動実行',
      description: '単体テスト・統合テストを一括検証',
      category: 'testing',
      categoryLabel: 'テスト & API',
      icon: CheckSquare,
    },
  ];

  // Map activeView to category
  const getActiveCategory = (view: MainNavView): string => {
    if (view === 'editor') return 'editor';
    if (view === 'agent') return 'agent';
    if (view === 'preview') return 'preview';
    if (view === 'database') return 'database';
    if (view === 'git') return 'git';
    if (view === 'testing' || view === 'apis') return 'testing';
    return 'editor';
  };

  const activeCategory = getActiveCategory(activeView);

  // Filter shortcuts
  const filteredShortcuts = allShortcuts.filter((s) => {
    // Category match
    if (selectedCategory === 'active') {
      // In active view mode, show current view shortcuts + global shortcuts
      if (s.category !== activeCategory && s.category !== 'global') {
        return false;
      }
    } else if (selectedCategory !== 'all' && s.category !== selectedCategory) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAction = s.action.toLowerCase().includes(q);
      const matchDesc = s.description?.toLowerCase().includes(q);
      const matchKeys = s.keys.some((k) => k.toLowerCase().includes(q));
      const matchCategory = s.categoryLabel.toLowerCase().includes(q);
      return matchAction || matchDesc || matchKeys || matchCategory;
    }

    return true;
  });

  const categories = [
    { id: 'active', label: `現在のビュー (${currentViewMeta.label})`, isSpecial: true },
    { id: 'all', label: 'すべて表示' },
    { id: 'global', label: '全般・グローバル' },
    { id: 'editor', label: 'エディタ & ファイル' },
    { id: 'agent', label: 'AIエージェント' },
    { id: 'preview', label: 'ライブプレビュー' },
    { id: 'database', label: 'データベース Studio' },
    { id: 'git', label: 'Git & バージョン管理' },
    { id: 'testing', label: 'テスト & API' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 select-none animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">キーボードショートカット · Cheat Sheet</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200">
                  Context-Aware
                </span>
              </div>
              <p className="text-xs text-slate-500">
                現在の画面コンテキストに応じたショートカットチートシート
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active View Highlight Banner */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">現在のアクティブ画面:</span>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-2xs ${currentViewMeta.color}`}>
              <currentViewMeta.icon className="w-3.5 h-3.5" />
              <span>{currentViewMeta.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>コンテキスト適応キーバインドが有効</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-slate-200 bg-white flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ショートカットや操作名で検索 (例: 検索, コミット, AI, Enter)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-400 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Scrollable) */}
        <div className="px-3 py-2 bg-slate-50/60 border-b border-slate-200 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? cat.isSpecial
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Shortcuts Cheat Sheet Grid */}
        <div className="p-4 overflow-y-auto max-h-[52vh] space-y-2.5">
          {filteredShortcuts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Keyboard className="w-8 h-8 mx-auto text-slate-300" />
              <p>該当するショートカットが見つかりませんでした</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-indigo-600 hover:underline text-xs font-medium"
              >
                すべてのショートカットを表示
              </button>
            </div>
          ) : (
            filteredShortcuts.map((s, idx) => {
              const Icon = s.icon;
              const isCurrentContext = s.category === activeCategory;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrentContext
                      ? 'bg-indigo-50/40 border-indigo-200 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isCurrentContext
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-white border border-slate-200 text-slate-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-900">{s.action}</span>
                        <span
                          className={`text-[9px] font-medium px-1.5 py-0.2 rounded border ${
                            isCurrentContext
                              ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                              : 'bg-slate-200/80 text-slate-600 border-slate-300'
                          }`}
                        >
                          {s.categoryLabel}
                        </span>
                      </div>
                      {s.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {s.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Visual Keyboard Key Caps */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {s.keys.map((k, kIdx) => (
                      <React.Fragment key={kIdx}>
                        <kbd className="min-w-[28px] h-7 px-2 bg-white text-slate-800 font-mono text-[11px] font-bold rounded-lg border border-slate-300 shadow-xs flex items-center justify-center tracking-tight">
                          {k}
                        </kbd>
                        {kIdx < s.keys.length - 1 && (
                          <span className="text-slate-400 text-xs font-bold">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer / Tip */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-600 font-semibold font-mono">Tip:</span>
            <span>エディタやプレビュー画面でショートカットを押すとそのまま即座に実行されます</span>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-600 shadow-2xs">
              Esc
            </kbd>
            <span>キーで閉じる</span>
          </div>
        </div>
      </div>
    </div>
  );
};

