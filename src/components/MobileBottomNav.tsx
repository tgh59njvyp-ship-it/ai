import React, { useState } from 'react';
import { useProject, MainNavView } from '../context/ProjectContext';
import {
  Code2,
  Sparkles,
  Eye,
  Database,
  MoreHorizontal,
  Webhook,
  GitBranch,
  ShieldCheck,
  CheckSquare,
  Settings,
  X,
  Layers,
  Download,
  Rocket,
  Play,
  Github,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    project,
    currentTask,
    runtimeError,
    setIsExportModalOpen,
    setIsDeployModalOpen,
    setIsGitHubModalOpen,
    gitHubUser,
    runAllTests,
  } = useProject();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mainTabs: { id: MainNavView; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'editor', label: 'コード', icon: Code2 },
    { id: 'preview', label: 'プレビュー', icon: Eye },
    {
      id: 'agent',
      label: 'AI設計',
      icon: Sparkles,
      badge: currentTask?.status === 'running' ? '●' : undefined,
    },
    {
      id: 'database',
      label: 'DB',
      icon: Database,
      badge: project.database.tables.length,
    },
  ];

  const secondaryTabs: { id: MainNavView; label: string; icon: React.ElementType; desc: string; badge?: string | number }[] = [
    { id: 'apis', label: 'API Workbench', icon: Webhook, desc: 'REST API実行 & curl生成', badge: project.apis.length },
    { id: 'git', label: 'Git バージョン管理', icon: GitBranch, desc: 'ブランチ・コミット・ロールバック', badge: project.git.commits.length },
    { id: 'constitution', label: 'Project 憲法', icon: ShieldCheck, desc: '技術スタック & 依存制御' },
    { id: 'testing', label: '自動テスト', icon: CheckSquare, desc: 'ユニット & 結合テスト実行', badge: project.tests.length },
    { id: 'settings', label: '設定 & BYOK', icon: Settings, desc: 'APIキー・モデル設定' },
  ];

  const handleSelectView = (view: MainNavView) => {
    setActiveView(view);
    setIsMoreMenuOpen(false);
  };

  const isSecondaryActive = ['apis', 'git', 'constitution', 'testing', 'settings'].includes(activeView);

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Visible only on < md screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-lg border-t border-slate-200 z-40 flex items-center justify-around px-1 select-none safe-bottom shadow-md">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectView(tab.id)}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
                isActive ? 'text-cyan-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-cyan-600' : ''}`} />
                {tab.badge !== undefined && (
                  <span
                    className={`absolute -top-1 -right-2 text-[9px] px-1 py-0.2 rounded-full font-mono font-bold leading-none ${
                      tab.id === 'agent' && currentTask?.status === 'running'
                        ? 'bg-cyan-600 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-6 h-0.5 bg-cyan-600 rounded-full shadow-xs" />
              )}
            </button>
          );
        })}

        {/* More Tab Button */}
        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
            isSecondaryActive ? 'text-cyan-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <MoreHorizontal className="w-5 h-5" />
            {runtimeError && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">その他</span>
          {isSecondaryActive && (
            <div className="absolute bottom-1 w-6 h-0.5 bg-cyan-600 rounded-full shadow-xs" />
          )}
        </button>
      </nav>

      {/* More Tools Bottom Sheet Modal on Mobile */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          {/* Backdrop click to dismiss */}
          <div className="flex-1" onClick={() => setIsMoreMenuOpen(false)} />

          <div className="bg-white border-t border-slate-200 rounded-t-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden pb-6 animate-slideUp">
            {/* Sheet Handle & Header */}
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  開発ツール & メニュー
                </span>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 border-b border-slate-200">
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsGitHubModalOpen(true);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs gap-1 cursor-pointer transition-colors ${
                  gitHubUser
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <Github className="w-4 h-4 text-slate-800" />
                <span className="text-[10px] font-medium">{gitHubUser ? 'GitHub済' : 'GitHub連携'}</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  runAllTests();
                }}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs gap-1 cursor-pointer shadow-xs"
              >
                <Play className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-medium">テスト</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsExportModalOpen(true);
                }}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs gap-1 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-cyan-600" />
                <span className="text-[10px] font-medium">Export</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsDeployModalOpen(true);
                }}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs gap-1 font-semibold cursor-pointer shadow-xs"
              >
                <Rocket className="w-4 h-4 text-white" />
                <span className="text-[10px]">Deploy</span>
              </button>
            </div>

            {/* Secondary Tools List */}
            <div className="p-2 space-y-1 overflow-y-auto">
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectView(tab.id)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-cyan-50 border border-cyan-200 text-cyan-900 font-semibold'
                        : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-900">{tab.label}</div>
                        <div className="text-[10px] text-slate-500">{tab.desc}</div>
                      </div>
                    </div>

                    {tab.badge !== undefined && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
