import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  Sparkles,
  Command,
  ArrowRight,
  Github,
  BookOpen,
  DollarSign,
  History,
  Activity,
  Layers,
  Menu,
  X,
} from 'lucide-react';

export const LandingHeader: React.FC = () => {
  const {
    setDisplayMode,
    setIsCommandPaletteOpen,
    setIsDocsOpen,
    setIsPricingOpen,
    setIsChangelogOpen,
    setIsStatusOpen,
    setIsGitHubModalOpen,
    gitHubUser,
  } = useProject();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080c14]/95 backdrop-blur-md border-b border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:scale-105 transition-all">
              <img
                src="/src/assets/images/genesis_app_icon_1791201198693.jpg"
                alt="Genesis OS Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Genesis OS
              </span>
              <span className="text-[9px] font-mono text-cyan-400 font-semibold px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                v1.2
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 ml-8 text-xs font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              機能一覧
            </button>
            <button
              onClick={() => scrollToSection('constitution')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Project Constitution
            </button>
            <button
              onClick={() => scrollToSection('own-your-code')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              コード完全所有
            </button>
            <button
              onClick={() => scrollToSection('templates')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              テンプレート
            </button>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              料金プラン
            </button>
            <button
              onClick={() => setIsDocsOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ドキュメント
            </button>
            <button
              onClick={() => setIsChangelogOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Changelog
            </button>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub Auth Button */}
          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="GitHub 連携"
          >
            {gitHubUser ? (
              <>
                <img
                  src={gitHubUser.avatar_url}
                  alt={gitHubUser.login}
                  className="w-4 h-4 rounded-full border border-emerald-400"
                />
                <span className="hidden sm:inline text-[11px] font-medium font-mono text-emerald-400">
                  @{gitHubUser.login}
                </span>
              </>
            ) : (
              <>
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px] font-medium">GitHub連携</span>
              </>
            )}
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="text-[11px]">検索</span>
            <kbd className="font-mono text-[9px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Launch Studio Button (Touch target min 44px on mobile) */}
          <button
            onClick={() => setDisplayMode('studio')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 min-h-[40px] sm:min-h-[38px] rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/25 transition-all cursor-pointer"
          >
            <span className="truncate">スタジオ起動</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0a0e17] px-4 py-4 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => scrollToSection('features')}
              className="p-3 bg-slate-900 rounded-xl text-left text-slate-200 font-medium hover:bg-slate-850"
            >
              機能一覧
            </button>
            <button
              onClick={() => scrollToSection('constitution')}
              className="p-3 bg-slate-900 rounded-xl text-left text-slate-200 font-medium hover:bg-slate-850"
            >
              Project Constitution
            </button>
            <button
              onClick={() => scrollToSection('own-your-code')}
              className="p-3 bg-slate-900 rounded-xl text-left text-slate-200 font-medium hover:bg-slate-850"
            >
              コード完全所有
            </button>
            <button
              onClick={() => scrollToSection('templates')}
              className="p-3 bg-slate-900 rounded-xl text-left text-slate-200 font-medium hover:bg-slate-850"
            >
              テンプレート
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsPricingOpen(true);
              }}
              className="p-3 bg-slate-900 rounded-xl text-left text-slate-200 font-medium hover:bg-slate-850"
            >
              料金プラン
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsDocsOpen(true);
              }}
              className="p-3 bg-slate-900 rounded-xl text-left text-slate-200 font-medium hover:bg-slate-850"
            >
              公式ドキュメント
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsChangelogOpen(true);
              }}
              className="p-3 bg-slate-900 rounded-xl text-left text-slate-200 font-medium hover:bg-slate-850"
            >
              Changelog (v1.2)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsStatusOpen(true);
              }}
              className="p-3 bg-slate-900 rounded-xl text-left text-emerald-400 font-medium hover:bg-slate-850 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>システム稼働状況</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

