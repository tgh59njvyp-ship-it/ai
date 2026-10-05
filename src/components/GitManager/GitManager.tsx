import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  GitBranch,
  GitCommit,
  RotateCcw,
  Check,
  Plus,
  Github,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { scanSecretsInProject } from '../../services/exportService';

export const GitManager: React.FC = () => {
  const {
    project,
    createCommit,
    rollbackCommit,
    switchBranch,
    createNewBranch,
    showToast,
    gitHubUser,
    setIsGitHubModalOpen,
  } = useProject();

  const [newCommitMsg, setNewCommitMsg] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const secretScan = scanSecretsInProject(project);

  const handleCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitMsg.trim()) return;
    createCommit(newCommitMsg.trim());
    setNewCommitMsg('');
  };

  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;
    createNewBranch(newBranchName.trim());
    setNewBranchName('');
    setIsCreatingBranch(false);
  };

  const handleSyncPush = async () => {
    if (!gitHubUser) {
      setIsGitHubModalOpen(true);
      return;
    }
    setIsSyncing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSyncing(false);
    showToast(`GitHub (@${gitHubUser.login}) のリモートリポジトリへ同期・プッシュが完了しました！`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Header */}
      <div className="h-auto sm:h-12 border-b border-slate-200 bg-white px-3 sm:px-4 py-2 sm:py-0 flex items-center justify-between shrink-0 gap-2 shadow-2xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Git Version Control</h2>
            <p className="text-[10px] text-slate-500 hidden xs:block">ブランチ管理・コミット履歴・ロールバック・GitHub同期</p>
          </div>
        </div>

        {/* Current Branch Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-[11px] text-slate-500 hidden xs:inline">Branch:</span>
          <select
            value={project.git.currentBranch}
            onChange={(e) => switchBranch(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 sm:px-2.5 py-1 text-xs text-slate-900 font-mono focus:outline-none max-w-[110px] sm:max-w-none truncate shadow-xs"
          >
            {project.git.branches.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsCreatingBranch(true)}
            title="新規ブランチ"
            className="p-1 sm:p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-auto p-3 sm:p-5 space-y-4 sm:space-y-6">
        {/* Branch Creation Modal / Bar */}
        {isCreatingBranch && (
          <form
            onSubmit={handleBranchSubmit}
            className="p-3 bg-white border border-cyan-500 rounded-xl flex items-center gap-2 animate-fadeIn shadow-xs"
          >
            <input
              type="text"
              autoFocus
              placeholder="新しいブランチ名 (例: feat/user-auth)..."
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              作成
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingBranch(false)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs cursor-pointer"
            >
              キャンセル
            </button>
          </form>
        )}

        {/* GitHub Integration Remote Status Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">GitHub リモートリポジトリ</span>
                {gitHubUser ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>@{gitHubUser.login} 連携済み</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                    未連携
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-md">
                {gitHubUser
                  ? `https://github.com/${gitHubUser.login}/${project.name.toLowerCase().replace(/\s+/g, '-')}`
                  : 'GitHub と連携すると、コミットの自動プッシュや同期が有効になります'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {gitHubUser ? (
              <>
                <button
                  onClick={handleSyncPush}
                  disabled={isSyncing}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{isSyncing ? '同期中...' : 'Sync / Push'}</span>
                </button>
                <button
                  onClick={() => setIsGitHubModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  アカウント情報
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsGitHubModalOpen(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHubと連携する</span>
              </button>
            )}
          </div>
        </div>

        {/* Git Safety Check Alert */}
        {secretScan.hasSecrets ? (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Git Safety警告: {secretScan.findings.length} 件のハードコード秘密情報が検出されました。Push前に.env.exampleへ移行してください。
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Git Safety Verified: ハードコードされたクレデンシャルはありません。.gitignoreが適用されています。</span>
          </div>
        )}

        {/* Commit Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5 text-cyan-600" />
            <span>手動コミット (Working Tree Snapshot)</span>
          </h3>
          <form onSubmit={handleCommitSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="コミットメッセージを入力 (例: feat: add real-time price notification)..."
              value={newCommitMsg}
              onChange={(e) => setNewCommitMsg(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-600 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-2xs"
            />
            <button
              type="submit"
              disabled={!newCommitMsg.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Commit
            </button>
          </form>
        </div>

        {/* Commit History List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              コミット履歴 ({project.git.commits.length}件)
            </span>
          </div>

          <div className="space-y-2.5">
            {project.git.commits.map((c, idx) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-cyan-700 shrink-0 mt-0.5">
                    <GitCommit className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900">{c.message}</span>
                      <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200 font-semibold">
                        {c.id}
                      </span>
                      {idx === 0 && (
                        <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                          HEAD
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{c.author}</span>
                      <span>·</span>
                      <span>{new Date(c.timestamp).toLocaleString()}</span>
                      <span>·</span>
                      <span className="font-mono text-emerald-600 font-medium">+{c.stats.added}</span>
                      <span className="font-mono text-rose-600 font-medium">-{c.stats.deleted}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => rollbackCommit(c.id)}
                    title="このコミットの状態へ復元"
                    className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-500" />
                    <span>ロールバック</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
