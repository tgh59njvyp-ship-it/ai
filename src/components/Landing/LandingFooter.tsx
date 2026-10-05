import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Sparkles, Github, Twitter, Terminal, Shield } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const {
    setDisplayMode,
    setIsDocsOpen,
    setIsPricingOpen,
    setIsChangelogOpen,
    setIsStatusOpen,
    setIsCommandPaletteOpen,
  } = useProject();

  return (
    <footer className="bg-[#05080f] border-t border-slate-800/80 text-xs text-slate-400 select-none py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700/80 shadow-md">
                <img
                  src="/src/assets/images/genesis_app_icon_1791201198693.jpg"
                  alt="Genesis OS"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">Genesis OS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              自然言語から本格的なフルスタックソフトウェアを設計・構築・持ち出しできる次世代AI開発プラットフォーム。Project Constitutionであなたのコードを守ります。
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              © {new Date().getFullYear()} Genesis OS Inc. All rights reserved.
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider font-mono">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setDisplayMode('studio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  開発スタジオ (IDE)
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  機能一覧
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-white transition-colors">
                  テンプレート
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsPricingOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  料金プラン
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsChangelogOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Changelog (更新履歴)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsStatusOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>System Status</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Developers Col */}
          <div className="space-y-3">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider font-mono">
              Developers
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsDocsOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  公式ドキュメント
                </button>
              </li>
              <li>
                <a href="#constitution" className="hover:text-white transition-colors">
                  Project Constitution ガイド
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Command Palette (⌘K)
                </button>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Company Col */}
          <div className="space-y-3">
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider font-mono">
              Trust & Legal
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#own-your-code" className="hover:text-white transition-colors">
                  コード完全所有ポリシー
                </a>
              </li>
              <li>
                <span className="text-slate-400">Security Architecture</span>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>Built with TypeScript, React, Tailwind CSS &amp; Google Gemini 3.8 Flash.</div>
          <div className="flex items-center gap-4">
            <span>Server-side API Secured</span>
            <span>·</span>
            <span>Zero Vendor Lock-in</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
