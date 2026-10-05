import React, { useState, useEffect, useRef } from 'react';
import { useProject, MainNavView } from '../../context/ProjectContext';
import {
  Search,
  Code2,
  Sparkles,
  Eye,
  Database,
  Webhook,
  GitBranch,
  ShieldCheck,
  CheckSquare,
  Settings,
  Download,
  Rocket,
  Plus,
  Play,
  ArrowRight,
  BookOpen,
  DollarSign,
  History,
  X,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveView,
    setDisplayMode,
    setIsExportModalOpen,
    setIsDeployModalOpen,
    setIsNewProjectModalOpen,
    setIsDocsOpen,
    setIsPricingOpen,
    setIsChangelogOpen,
    runAllTests,
    showToast,
  } = useProject();

  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIdx(0);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  interface CommandItem {
    id: string;
    title: string;
    category: string;
    icon: React.ElementType;
    action: () => void;
  }

  const commands: CommandItem[] = [
    {
      id: 'cmd-studio',
      title: '開発スタジオを開く (Launch Studio)',
      category: 'Navigation',
      icon: Code2,
      action: () => {
        setDisplayMode('studio');
        setActiveView('editor');
      },
    },
    {
      id: 'cmd-new-proj',
      title: '新規プロジェクト作成 (Create Project)',
      category: 'Project',
      icon: Plus,
      action: () => {
        setDisplayMode('studio');
        setIsNewProjectModalOpen(true);
      },
    },
    {
      id: 'cmd-agent',
      title: 'AI Agent Architect を起動',
      category: 'AI',
      icon: Sparkles,
      action: () => {
        setDisplayMode('studio');
        setActiveView('agent');
      },
    },
    {
      id: 'cmd-preview',
      title: 'リアルタイムプレビューを表示',
      category: 'View',
      icon: Eye,
      action: () => {
        setDisplayMode('studio');
        setActiveView('preview');
      },
    },
    {
      id: 'cmd-db',
      title: 'Database Studio (ER & SQL) を開く',
      category: 'Database',
      icon: Database,
      action: () => {
        setDisplayMode('studio');
        setActiveView('database');
      },
    },
    {
      id: 'cmd-api',
      title: 'API Workbench (REST Client) を開く',
      category: 'API',
      icon: Webhook,
      action: () => {
        setDisplayMode('studio');
        setActiveView('apis');
      },
    },
    {
      id: 'cmd-git',
      title: 'Git Version Control & コミット履歴',
      category: 'Git',
      icon: GitBranch,
      action: () => {
        setDisplayMode('studio');
        setActiveView('git');
      },
    },
    {
      id: 'cmd-constitution',
      title: 'Project Constitution (憲法設定) を編集',
      category: 'Configuration',
      icon: ShieldCheck,
      action: () => {
        setDisplayMode('studio');
        setActiveView('constitution');
      },
    },
    {
      id: 'cmd-test',
      title: '全テストスイートを実行 (Run Tests)',
      category: 'Testing',
      icon: Play,
      action: () => {
        setDisplayMode('studio');
        runAllTests();
      },
    },
    {
      id: 'cmd-export',
      title: 'プロジェクトをExport / 保存 (ZIP / フォルダ)',
      category: 'Export',
      icon: Download,
      action: () => {
        setDisplayMode('studio');
        setIsExportModalOpen(true);
      },
    },
    {
      id: 'cmd-deploy',
      title: '本番環境へデプロイ (Vercel / Railway)',
      category: 'Deployment',
      icon: Rocket,
      action: () => {
        setDisplayMode('studio');
        setIsDeployModalOpen(true);
      },
    },
    {
      id: 'cmd-docs',
      title: '公式ドキュメントを開く',
      category: 'Docs',
      icon: BookOpen,
      action: () => setIsDocsOpen(true),
    },
    {
      id: 'cmd-pricing',
      title: '料金プランを確認',
      category: 'Info',
      icon: DollarSign,
      action: () => setIsPricingOpen(true),
    },
    {
      id: 'cmd-changelog',
      title: 'Changelog (更新履歴) を確認',
      category: 'Info',
      icon: History,
      action: () => setIsChangelogOpen(true),
    },
  ];

  const filtered = query
    ? commands.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const handleSelect = (cmd: CommandItem) => {
    setIsCommandPaletteOpen(false);
    cmd.action();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4 select-none animate-fadeIn">
      <div className="bg-[#0e1422] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/80">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="コマンドを検索、または操作を入力..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIdx((prev) => (prev + 1) % filtered.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIdx((prev) => (prev - 1 + filtered.length) % filtered.length);
              } else if (e.key === 'Enter' && filtered[selectedIdx]) {
                e.preventDefault();
                handleSelect(filtered[selectedIdx]);
              }
            }}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">該当するコマンドが見つかりません</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIdx;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`p-2.5 rounded-xl cursor-pointer text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-2 border-t border-slate-800 bg-[#0a0e17] text-[10px] text-slate-500 font-mono flex items-center justify-between px-3">
          <span>↑↓で移動 · ↵で実行</span>
          <span>Genesis OS Command Palette</span>
        </div>
      </div>
    </div>
  );
};
