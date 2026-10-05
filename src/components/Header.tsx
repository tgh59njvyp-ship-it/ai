import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import {
  Sparkles,
  GitBranch,
  Play,
  Download,
  Rocket,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  ChevronDown,
  Plus,
  Layers,
  Terminal,
  Github,
  Sun,
  Moon,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    project,
    projectsList,
    switchProject,
    setIsNewProjectModalOpen,
    setIsExportModalOpen,
    setIsDeployModalOpen,
    runAllTests,
    runtimeError,
    runAgentPrompt,
    setActiveView,
    setDisplayMode,
    setIsCommandPaletteOpen,
    isGitHubModalOpen,
    setIsGitHubModalOpen,
    gitHubUser,
    themeMode,
    setThemeMode,
  } = useProject();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  return (
    <header className="h-13 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between shrink-0 select-none z-20 shadow-xs">
      {/* Left: App Logo, Website Back Link, & Project Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2 pr-2.5 sm:pr-3 border-r border-slate-200">
          <button
            onClick={() => setDisplayMode('landing')}
            title="SaaS トップページに戻る"
            className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-slate-200 shadow-xs group-hover:border-cyan-400 group-hover:scale-105 transition-all shrink-0">
              <img
                src="/src/assets/images/genesis_app_icon_1791201198693.jpg"
                alt="Genesis OS"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight text-slate-900">Genesis OS</span>
                <span className="text-[9px] font-mono bg-cyan-50 text-cyan-700 px-1.5 py-0.2 rounded border border-cyan-200 font-semibold">
                  STUDIO
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Website return pill */}
        <button
          onClick={() => setDisplayMode('landing')}
          className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mr-1"
        >
          <span>←</span>
          <span>Website</span>
        </button>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs text-slate-800 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span className="font-semibold text-slate-900 max-w-[95px] sm:max-w-[140px] truncate">{project.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 animate-fadeIn">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-2 py-1">
                Active Projects ({projectsList.length})
              </div>
              <div className="space-y-0.5 max-h-56 overflow-y-auto">
                {projectsList.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchProject(p.id);
                      setIsProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      p.id === project.id
                        ? 'bg-cyan-50 text-cyan-800 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    {p.id === project.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="pt-1.5 mt-1.5 border-t border-slate-200">
                <button
                  onClick={() => {
                    setIsProjectDropdownOpen(false);
                    setIsNewProjectModalOpen(true);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-cyan-700 hover:bg-cyan-50 flex items-center gap-1.5 transition-colors font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新規プロジェクト作成...</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Project Constitution Mini Badge */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          <span className="text-slate-800 font-medium">{project.constitution.language}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-700">{project.constitution.framework}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">{project.constitution.packageManager}</span>
        </div>
      </div>

      {/* Right: Actions (GitHub Auth, Theme, Tests, Export, Deploy) */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Quick Command Palette Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs text-slate-600 transition-colors cursor-pointer"
        >
          <span className="text-[11px]">Command</span>
          <kbd className="font-mono text-[9px] bg-white text-slate-600 px-1 py-0.5 rounded border border-slate-200 shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* GitHub Auth Connect Button */}
        <button
          onClick={() => setIsGitHubModalOpen(true)}
          title={gitHubUser ? `GitHub連携中 (@${gitHubUser.login})` : 'GitHubと連携・認証'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
            gitHubUser
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              : 'bg-slate-900 hover:bg-slate-850 text-white border-transparent shadow-xs'
          }`}
        >
          {gitHubUser ? (
            <>
              <img
                src={gitHubUser.avatar_url}
                alt={gitHubUser.login}
                className="w-4 h-4 rounded-full border border-emerald-400"
              />
              <span className="hidden sm:inline font-mono">@{gitHubUser.login}</span>
            </>
          ) : (
            <>
              <Github className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">GitHub連携</span>
            </>
          )}
        </button>

        {/* Theme Toggle (Clean White / Dark Mode) */}
        <button
          onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
          title={themeMode === 'light' ? 'ダークモードに切り替え' : 'クリーンな白モードに切り替え'}
          className="p-1.5 sm:p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          {themeMode === 'light' ? (
            <Moon className="w-3.5 h-3.5 text-slate-600" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          )}
        </button>

        {/* Runtime Error Auto-Fix Pill */}
        {runtimeError && (
          <button
            onClick={() => {
              setActiveView('agent');
              runAgentPrompt(`エラーを自動修正してください: ${runtimeError}`, 'fix');
            }}
            title="AIでエラー自動修正"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-medium transition-colors cursor-pointer animate-pulse"
          >
            <Wrench className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">AI修復</span>
          </button>
        )}

        {/* Run Tests Button */}
        <button
          onClick={runAllTests}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer shadow-xs"
          title="全テストケースを実行"
        >
          <Play className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="hidden sm:inline">テスト</span>
        </button>

        {/* Export Modal Trigger */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          title="プロジェクトをExport / ZIP保存"
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium transition-colors cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Deploy Modal Trigger */}
        <button
          onClick={() => setIsDeployModalOpen(true)}
          title="本番環境へデプロイ"
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs shadow-cyan-600/20"
        >
          <Rocket className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Deploy</span>
        </button>
      </div>
    </header>
  );
};
