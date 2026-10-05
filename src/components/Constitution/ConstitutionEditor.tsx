import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { UserControlLevel } from '../../types/project';
import {
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Sliders,
  AlertCircle,
} from 'lucide-react';

export const ConstitutionEditor: React.FC = () => {
  const { project, showToast } = useProject();
  const [constitution, setConstitution] = useState(project.constitution);
  const [newRule, setNewRule] = useState('');
  const [newAllowedDep, setNewAllowedDep] = useState('');

  const handleSave = () => {
    project.constitution = constitution;
    showToast('Project Constitutionを保存・更新しました！', 'success');
  };

  const handleControlLevelChange = (lvl: UserControlLevel) => {
    setConstitution((prev) => ({ ...prev, userControlLevel: lvl }));
  };

  const addRule = () => {
    if (!newRule.trim()) return;
    setConstitution((prev) => ({ ...prev, rules: [...prev.rules, newRule.trim()] }));
    setNewRule('');
  };

  const removeRule = (idx: number) => {
    setConstitution((prev) => ({ ...prev, rules: prev.rules.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Header */}
      <div className="h-12 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Project Constitution (プロジェクト憲法)</h2>
            <p className="text-[10px] text-slate-500">AIが最優先で遵守すべき技術仕様・制約・禁止事項</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>憲法を保存</span>
        </button>
      </div>

      {/* Main Form */}
      <div className="flex-1 overflow-auto p-5 space-y-6 max-w-4xl mx-auto w-full">
        {/* User Control Level Segmented Toggle */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-slate-900">AI 自律実行レベル (User Control Level)</span>
              <p className="text-[11px] text-slate-500">AIがコードや設定を変更する際の承認フローを設定します</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200">
            {(['Auto', 'Ask', 'Manual'] as UserControlLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleControlLevelChange(lvl)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  constitution.userControlLevel === lvl
                    ? 'bg-white text-cyan-800 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="font-bold">{lvl}</div>
                <div className="text-[10px] font-normal opacity-80">
                  {lvl === 'Auto' ? 'AI自律適用' : lvl === 'Ask' ? '重要操作時に確認 (推奨)' : '全変更を手動承認'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Technical Invariants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Language Control */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-600" />
                <span>言語制約 (Language Control)</span>
              </span>
              <span className="text-[10px] text-cyan-700 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">Immutable</span>
            </div>
            <select
              value={constitution.language}
              onChange={(e) => setConstitution({ ...constitution, language: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
            >
              <option value="TypeScript">TypeScript (厳格な型安全・推奨)</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
            </select>
            <div className="text-[11px] text-slate-500">
              禁止言語: <span className="font-mono text-rose-600 font-semibold">{constitution.forbiddenLanguages.join(', ')}</span>
            </div>
          </div>

          {/* Framework Control */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-600" />
                <span>フレームワーク (Framework Control)</span>
              </span>
              <span className="text-[10px] text-cyan-700 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">Fixed</span>
            </div>
            <select
              value={constitution.framework}
              onChange={(e) => setConstitution({ ...constitution, framework: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
            >
              <option value="React">React (SPA / Vite)</option>
              <option value="Next.js">Next.js (App Router)</option>
              <option value="Vue">Vue 3</option>
              <option value="SvelteKit">SvelteKit</option>
              <option value="FastAPI">FastAPI</option>
            </select>
            <div className="text-[11px] text-slate-500">AIは指示なく勝手にFrameworkを変更できません。</div>
          </div>

          {/* Runtime Control */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
            <span className="text-xs font-bold text-slate-900">Runtime & Version</span>
            <input
              type="text"
              value={constitution.runtimeVersion}
              onChange={(e) => setConstitution({ ...constitution, runtimeVersion: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-mono focus:outline-none"
            />
          </div>

          {/* Package Manager */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
            <span className="text-xs font-bold text-slate-900">Package Manager</span>
            <select
              value={constitution.packageManager}
              onChange={(e) => setConstitution({ ...constitution, packageManager: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-mono focus:outline-none"
            >
              <option value="pnpm">pnpm (pnpm-lock.yaml 保持・推奨)</option>
              <option value="npm">npm (package-lock.json 保持)</option>
              <option value="yarn">yarn (yarn.lock 保持)</option>
              <option value="bun">bun (bun.lockb 保持)</option>
            </select>
          </div>
        </div>

        {/* Dependency Control */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
          <span className="text-xs font-bold text-slate-900 block">依存関係制御 (Dependency Control)</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Allowed */}
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-800 block mb-1">許可 (Allowed)</span>
              <div className="text-[11px] text-emerald-950 font-mono space-y-1">
                {constitution.dependencyControl.allowed.map((dep, idx) => (
                  <div key={idx}>✓ {dep}</div>
                ))}
              </div>
            </div>

            {/* Requires Approval */}
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-800 block mb-1">承認必須 (Requires Approval)</span>
              <div className="text-[11px] text-amber-950 font-mono space-y-1">
                {constitution.dependencyControl.requiresApproval.map((dep, idx) => (
                  <div key={idx}>? {dep}</div>
                ))}
              </div>
            </div>

            {/* Blocked */}
            <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200">
              <span className="font-bold text-rose-800 block mb-1">禁止 (Blocked)</span>
              <div className="text-[11px] text-rose-950 font-mono space-y-1">
                {constitution.dependencyControl.blocked.map((dep, idx) => (
                  <div key={idx}>✕ {dep}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Invariant Rules List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">開発ルール一覧 ({constitution.rules.length}条)</span>
          </div>

          <div className="space-y-1.5">
            {constitution.rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-700 font-bold text-[11px]">第{idx + 1}条</span>
                  <span>{rule}</span>
                </div>
                <button
                  onClick={() => removeRule(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="新しいルールを追加 (例: 外部APIキーを直接ソースコードに書かないこと)..."
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-600"
            />
            <button
              onClick={addRule}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>追加</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
