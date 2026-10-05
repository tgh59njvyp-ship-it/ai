import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { scanSecretsInProject } from '../../services/exportService';
import {
  Download,
  FolderDown,
  Archive,
  ShieldCheck,
  AlertTriangle,
  X,
  FileText,
  Terminal,
  CheckCircle2,
} from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { project, isExportModalOpen, setIsExportModalOpen, exportZip, exportFolder } = useProject();
  const [isExporting, setIsExporting] = useState(false);

  if (!isExportModalOpen) return null;

  const secretScan = scanSecretsInProject(project);

  const handleZipDownload = async () => {
    setIsExporting(true);
    await exportZip();
    setIsExporting(false);
  };

  const handleFolderExport = async () => {
    setIsExporting(true);
    await exportFolder();
    setIsExporting(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-slate-800">Project Export & 保存</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">
                完全なソースコードをZIPまたはフォルダとしてローカルへ書き出します
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Secret Scan Verification Alert */}
          {secretScan.hasSecrets ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-2 text-rose-700 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>エクスポート安全警告: ハードコードされた秘密情報が検出されました</span>
              </div>
              <ul className="text-[11px] text-rose-600/90 pl-6 list-disc space-y-0.5">
                {secretScan.findings.map((f, i) => (
                  <li key={i}>
                    {f.file} (Line {f.line}): {f.patternType}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-slate-500 pt-1">
                ※ エクスポート時には自動的に .env.example が同梱され、秘密情報は含まれません。
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 text-emerald-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Export Safety Scan 合格: ソースコード内に漏洩リスクのあるクレデンシャルは検出されませんでした。
              </span>
            </div>
          )}

          {/* Export Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ZIP Download Card */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <Archive className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-slate-800">ZIPアーカイブでダウンロード</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  すべてのディレクトリ構造、コード、package.json、README、.env.exampleを含んだZIPファイルを生成してダウンロードします。
                </p>
              </div>

              <button
                onClick={handleZipDownload}
                disabled={isExporting}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ZIPをダウンロード</span>
              </button>
            </div>

            {/* Folder Export (File System Access API) */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-colors">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                  <FolderDown className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-slate-800">実際のフォルダとして書き出し</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  ブラウザのFile System Access APIを利用し、ローカルの指定フォルダへ直接ファイルツリーを書き出します。
                </p>
              </div>

              <button
                onClick={handleFolderExport}
                disabled={isExporting}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <FolderDown className="w-3.5 h-3.5" />
                <span>保存先フォルダを選択</span>
              </button>
            </div>
          </div>

          {/* Local Run Instructions Preview */}
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 font-mono flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>ダウンロード後のローカル実行手順:</span>
            </span>
            <pre className="text-xs font-mono text-blue-300 leading-relaxed overflow-x-auto">
{`# 1. 解凍後、プロジェクトディレクトリへ移動
cd ${project.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}

# 2. 依存関係のインストール (${project.constitution.packageManager})
${project.constitution.packageManager} install

# 3. 開発サーバーの起動
${project.constitution.packageManager} dev`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
