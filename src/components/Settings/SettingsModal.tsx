import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  Settings,
  Key,
  Cpu,
  Shield,
  Save,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { byokConfig, setByokConfig, showToast } = useProject();
  const [provider, setProvider] = useState(byokConfig.provider);
  const [apiKey, setApiKey] = useState(byokConfig.apiKey);
  const [baseUrl, setBaseUrl] = useState(byokConfig.baseUrl || '');
  const [modelId, setModelId] = useState(byokConfig.modelId);

  const handleSave = () => {
    setByokConfig({
      provider,
      apiKey,
      baseUrl,
      modelId,
      modelName: `${provider.toUpperCase()} (${modelId})`,
    });
    showToast('AI設定とBYOK構成を保存しました！', 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Header */}
      <div className="h-auto sm:h-12 border-b border-slate-200 bg-white px-3 sm:px-4 py-2 sm:py-0 flex items-center justify-between shrink-0 gap-2 shadow-2xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Settings & BYOK</h2>
            <p className="text-[10px] text-slate-500 hidden xs:block">カスタムAPIキー・モデルルーター・プロバイダー構成</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-3 sm:px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>保存</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <div className="flex-1 overflow-auto p-3 sm:p-5 space-y-4 sm:space-y-6 max-w-3xl mx-auto w-full">
        {/* BYOK Info Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
            <Key className="w-4 h-4" />
            <span>BYOK (Bring Your Own Key) 対応</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            デフォルトのサーバーサイドGemini API（推奨）に加えて、ユーザー自身のAPIキーやOpenAI互換エンドポイントを自由に使用できます。キーはローカルストレージ内で安全に保持され、外部送信されません。
          </p>
        </div>

        {/* Provider Selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1.5">AI Provider</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'gemini', label: 'Gemini (Default)' },
                { id: 'openai', label: 'OpenAI' },
                { id: 'anthropic', label: 'Anthropic' },
                { id: 'custom', label: 'Custom / Ollama' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer font-medium ${
                    provider === p.id
                      ? 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              {provider === 'gemini' ? 'Gemini API Key (空欄時はサーバー設定を使用)' : 'API Key'}
            </label>
            <input
              type="password"
              placeholder={provider === 'gemini' ? 'AIzaSy... (任意)' : 'sk-...'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
            />
          </div>

          {provider === 'custom' && (
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Base URL (OpenAI Compatible)</label>
              <input
                type="text"
                placeholder="https://api.openai.com/v1 または http://localhost:11434/v1"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Model ID</label>
            <input
              type="text"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Security & Data Ownership Policy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
            <Shield className="w-4 h-4" />
            <span>ユーザーコード完全所有・ノーロックイン原則</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Genesis Studioで生成・編集されたすべてのコード、DBスキーマ、API定義、設定ファイルは100%ユーザーが所有します。ZIPエクスポートまたはフォルダ書き出しにより、ローカルマシンや任意のクラウド環境（AWS, Vercel, Docker）でそのまま実行可能です。
          </p>
        </div>
      </div>
    </div>
  );
};
