import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  Github,
  X,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Key,
  ShieldCheck,
  LogOut,
  RefreshCw,
  GitBranch,
} from 'lucide-react';

interface GitHubAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubAuthModal: React.FC<GitHubAuthModalProps> = ({ isOpen, onClose }) => {
  const { gitHubUser, setGitHubUser, showToast } = useProject();
  const [patToken, setPatToken] = useState('');
  const [isSubmittingPat, setIsSubmittingPat] = useState(false);
  const [oauthConfig, setOauthConfig] = useState<{ configured: boolean; redirectUri: string; url?: string } | null>(null);
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedProd, setCopiedProd] = useState(false);
  const [activeTab, setActiveTab] = useState<'oauth' | 'pat'>('oauth');

  const devCallback = 'https://ais-dev-bpiotptynamcvdsliemfv6-58338577398.asia-northeast1.run.app/auth/github/callback';
  const prodCallback = 'https://ais-pre-bpiotptynamcvdsliemfv6-58338577398.asia-northeast1.run.app/auth/github/callback';

  // Check auth and OAuth configuration
  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/github/user');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setGitHubUser(data.user);
        }
        if (data.oauthConfig) {
          setOauthConfig(data.oauthConfig);
        }
      }
    } catch {
      // Backend maybe initializing
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkAuthStatus();
    }
  }, [isOpen]);

  // Listen for OAuth popup postMessage callback as required by oauth-integration skill
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'github') {
        if (event.data.user) {
          setGitHubUser(event.data.user);
          showToast(`GitHub (@${event.data.user.login}) と連携しました！`, 'success');
          onClose();
        } else {
          checkAuthStatus();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isOpen) return null;

  // Handle OAuth Popup Login
  const handleOAuthConnect = async () => {
    try {
      const res = await fetch('/api/auth/github/url');
      const data = await res.json();

      if (!data.configured || !data.url) {
        showToast('GITHUB_CLIENT_ID が設定されていません。個人アクセストークン (PAT) で即座に連携できます。', 'info');
        setActiveTab('pat');
        return;
      }

      const popup = window.open(
        data.url,
        'github_oauth_popup',
        'width=600,height=700,menubar=no,toolbar=no,status=no'
      );

      if (!popup) {
        alert('ポップアップがブロックされました。ブラウザの設定でポップアップを許可してください。');
      }
    } catch (err: any) {
      showToast(`OAuth開始エラー: ${err.message}`, 'error');
    }
  };

  // Handle PAT Token Login
  const handlePatLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patToken.trim()) return;

    setIsSubmittingPat(true);
    try {
      const res = await fetch('/api/auth/github/token-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: patToken.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'トークンによる認証に失敗しました');
      }

      setGitHubUser(data.user);
      showToast(`GitHub (@${data.user.login}) と連携しました！`, 'success');
      setPatToken('');
      onClose();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmittingPat(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/github/logout', { method: 'POST' });
      setGitHubUser(null);
      showToast('GitHub連携を解除しました', 'info');
    } catch {
      setGitHubUser(null);
    }
  };

  const copyToClipboard = (text: string, isDev: boolean) => {
    navigator.clipboard.writeText(text);
    if (isDev) {
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2000);
    } else {
      setCopiedProd(true);
      setTimeout(() => setCopiedProd(false), 2000);
    }
    showToast('コールバックURLをコピーしました', 'success');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">GitHub 連携・認証</h2>
              <p className="text-xs text-slate-500">リポジトリ同期・コミット履歴・OAuthサインイン</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* If already connected */}
          {gitHubUser ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={gitHubUser.avatar_url}
                    alt={gitHubUser.login}
                    className="w-12 h-12 rounded-full border-2 border-emerald-400 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{gitHubUser.name || gitHubUser.login}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
                        連携済み
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">@{gitHubUser.login}</div>
                    {gitHubUser.email && <div className="text-[11px] text-slate-500">{gitHubUser.email}</div>}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="連携を解除"
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-rose-50 hover:border-rose-300 text-slate-700 hover:text-rose-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>解除</span>
                </button>
              </div>

              {/* Account stats */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[11px] text-slate-500">公開リポジトリ</div>
                  <div className="text-lg font-bold text-slate-900 font-mono">{gitHubUser.public_repos ?? '-'} 件</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[11px] text-slate-500">フォロワー</div>
                  <div className="text-lg font-bold text-slate-900 font-mono">{gitHubUser.followers ?? '-'} 人</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-slate-700" />
                  <span>Genesis Studio のコミットは GitHub へ自動同期可能です</span>
                </div>
                <a
                  href={gitHubUser.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>プロフィール</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            /* Connection Options */
            <div className="space-y-4">
              {/* Tab Switcher */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('oauth')}
                  className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'oauth'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  OAuth ポップアップ認証
                </button>
                <button
                  onClick={() => setActiveTab('pat')}
                  className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'pat'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  アクセストークン (PAT) で即座に連携
                </button>
              </div>

              {activeTab === 'oauth' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      GitHub アカウントでワンクリック認証します。リポジトリへのプッシュやクローン権限を連携できます。
                    </p>

                    <button
                      onClick={handleOAuthConnect}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub でログイン / 連携</span>
                    </button>
                  </div>

                  {/* OAuth App Setup Guide & Exact Callbacks */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-cyan-600" />
                      <span>GitHub OAuth App 設定情報 (コールバックURL)</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      独自の GitHub OAuth App を設定する場合は、
                      <a
                        href="https://github.com/settings/developers"
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-700 underline font-medium ml-1 inline-flex items-center gap-0.5"
                      >
                        GitHub Developer Settings <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      にて以下の URL を <strong>Authorization callback URL</strong> に登録してください。
                    </p>

                    {/* Dev Callback URL */}
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 font-medium">開発用コールバック URL:</div>
                      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
                        <span className="truncate flex-1">{devCallback}</span>
                        <button
                          onClick={() => copyToClipboard(devCallback, true)}
                          title="コピー"
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          {copiedDev ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Shared Callback URL */}
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 font-medium">共有 / 本番用コールバック URL:</div>
                      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
                        <span className="truncate flex-1">{prodCallback}</span>
                        <button
                          onClick={() => copyToClipboard(prodCallback, false)}
                          title="コピー"
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          {copiedProd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* PAT Token Login */
                <form onSubmit={handlePatLogin} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs text-cyan-900 leading-relaxed">
                    OAuth App を登録せずに即座に連携したい場合は、GitHubの
                    <a
                      href="https://github.com/settings/tokens"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-semibold ml-1 inline-flex items-center gap-0.5"
                    >
                      Personal Access Token (classicまたはfine-grained) <ExternalLink className="w-3 h-3" />
                    </a>
                    を入力してください（スコープ: <code className="bg-white/80 px-1 py-0.5 rounded text-[10px] font-mono">read:user</code>, <code className="bg-white/80 px-1 py-0.5 rounded text-[10px] font-mono">repo</code>）。
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-500" />
                      <span>GitHub Personal Access Token (PAT)</span>
                    </label>
                    <input
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={patToken}
                      onChange={(e) => setPatToken(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingPat || !patToken.trim()}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    {isSubmittingPat ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>認証中...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>トークンで連携する</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
