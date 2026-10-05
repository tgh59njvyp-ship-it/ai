import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  Plus,
  X,
  Sparkles,
  Layers,
  MessageCircle,
  TrendingUp,
  Calendar,
  Bot,
  ArrowRight,
} from 'lucide-react';
import { ProgrammingLanguage, Framework, Runtime, PackageManager } from '../../types/project';

export const ProjectModal: React.FC = () => {
  const { isNewProjectModalOpen, setIsNewProjectModalOpen, createNewProject, switchProject, projectsList } = useProject();

  const [mode, setMode] = useState<'template' | 'ai' | 'blank'>('template');
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [language, setLanguage] = useState<ProgrammingLanguage>('TypeScript');
  const [framework, setFramework] = useState<Framework>('React');
  const [runtime, setRuntime] = useState<Runtime>('Node.js');
  const [packageManager, setPackageManager] = useState<PackageManager>('pnpm');

  if (!isNewProjectModalOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    createNewProject(projectName.trim(), projectDesc.trim(), language, framework);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#0e1422] border border-slate-700/80 rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-white">新規プロジェクト作成</h2>
              <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-1">テンプレートから選択、または憲法を設定して新規作成</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewProjectModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-[#0a0e17] px-2 sm:px-4 text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setMode('template')}
            className={`py-2.5 sm:py-3 px-2.5 sm:px-3 font-medium transition-colors border-b-2 cursor-pointer ${
              mode === 'template' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            実証テンプレート
          </button>
          <button
            onClick={() => setMode('blank')}
            className={`py-2.5 sm:py-3 px-2.5 sm:px-3 font-medium transition-colors border-b-2 cursor-pointer ${
              mode === 'blank' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            カスタムプロジェクト (憲法定義)
          </button>
        </div>

        {/* Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto max-h-[70vh]">
          {mode === 'template' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projectsList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    switchProject(p.id);
                    setIsNewProjectModalOpen(false);
                  }}
                  className="p-4 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 rounded-xl cursor-pointer transition-all hover:bg-slate-850 group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white group-hover:text-cyan-300 transition-colors">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {p.constitution.language} · {p.constitution.database}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-semibold text-white block mb-1">プロジェクト名</label>
                <input
                  type="text"
                  required
                  placeholder="例: CryptoVault SaaS"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1">説明・概要</label>
                <input
                  type="text"
                  placeholder="例: 暗号資産ポートフォリオ分析と取引管理システム"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">開発言語 (固定)</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none font-mono"
                  >
                    <option value="TypeScript">TypeScript (推奨)</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">フレームワーク</label>
                  <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none font-mono"
                  >
                    <option value="React">React (SPA)</option>
                    <option value="Next.js">Next.js</option>
                    <option value="Vue">Vue 3</option>
                    <option value="SvelteKit">SvelteKit</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer mt-4"
              >
                プロジェクトを作成して開始
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
