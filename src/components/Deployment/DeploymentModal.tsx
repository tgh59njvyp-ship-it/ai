import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  Rocket,
  X,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Globe,
  RefreshCw,
} from 'lucide-react';

export const DeploymentModal: React.FC = () => {
  const { project, isDeployModalOpen, setIsDeployModalOpen, showToast } = useProject();
  const [selectedTarget, setSelectedTarget] = useState<'Vercel' | 'Netlify' | 'Cloudflare' | 'Railway'>('Vercel');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<number>(0);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(
    project.deployments[0]?.url || `https://${project.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}.vercel.app`
  );

  if (!isDeployModalOpen) return null;

  const handleStartDeploy = async () => {
    setIsDeploying(true);
    setDeployStep(1);
    setDeployLogs([`[1/4] ソースコードとProject Constitutionを検証中 (${project.constitution.framework})...`]);

    await new Promise((r) => setTimeout(r, 700));
    setDeployStep(2);
    setDeployLogs((prev) => [
      ...prev,
      `[2/4] ${project.constitution.packageManager} install: 依存関係をキャッシュから復元中...`,
      'Resolved 142 packages in 1.1s',
    ]);

    await new Promise((r) => setTimeout(r, 800));
    setDeployStep(3);
    setDeployLogs((prev) => [
      ...prev,
      `[3/4] ${project.constitution.framework} ビルド最適化 (TypeScript compilation & asset hashing)...`,
      'Build completed with 0 errors.',
    ]);

    await new Promise((r) => setTimeout(r, 700));
    setDeployStep(4);
    const newUrl = `https://${project.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}-${Date.now().toString(36).slice(-4)}.${selectedTarget.toLowerCase()}.app`;
    setDeployedUrl(newUrl);
    setDeployLogs((prev) => [
      ...prev,
      `[4/4] デプロイ完了！エッジネットワークへ伝播しました: ${newUrl}`,
    ]);
    setIsDeploying(false);
    showToast('本番デプロイが完了しました！', 'success');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#0e1422] border border-slate-700/80 rounded-xl sm:rounded-2xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-white">Production Deployment</h2>
              <p className="text-[10px] sm:text-xs text-slate-400">ワンクリックでエッジネットワークへ本番デプロイ</p>
            </div>
          </div>
          <button
            onClick={() => setIsDeployModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto">
          {/* Target Platforms */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">デプロイ先ターゲット</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {(['Vercel', 'Netlify', 'Cloudflare', 'Railway'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTarget(t)}
                  className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                    selectedTarget === t
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger button */}
          <button
            onClick={handleStartDeploy}
            disabled={isDeploying}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-600/20"
          >
            {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            <span>{isDeploying ? 'デプロイを実行中...' : `${selectedTarget} へデプロイを開始`}</span>
          </button>

          {/* Logs Terminal */}
          {deployLogs.length > 0 && (
            <div className="bg-[#080c14] p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1 max-h-44 overflow-y-auto">
              {deployLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-cyan-400 mr-1">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}

          {/* Active URL if deployed */}
          {deployedUrl && deployStep === 4 && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-emerald-300 truncate">{deployedUrl}</span>
              </div>
              <a
                href={deployedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 shrink-0 font-medium ml-2"
              >
                <span>開く</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
