import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { ApiEndpoint } from '../../types/project';
import {
  Webhook,
  Play,
  Copy,
  Check,
  Code,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const ApiWorkbench: React.FC = () => {
  const { project, showToast } = useProject();
  const apis = project.apis;

  const [selectedApiId, setSelectedApiId] = useState<string>(apis[0]?.id || '');
  const [isRunning, setIsRunning] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const currentApi = apis.find((a) => a.id === selectedApiId) || apis[0];

  const handleSendRequest = async () => {
    setIsRunning(true);
    setLatency(null);
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 120 + Math.random() * 80));
    const end = performance.now();

    try {
      const parsed = JSON.parse(currentApi.responseSample);
      setLastResponse(parsed);
    } catch {
      setLastResponse({ success: true, message: 'Executed handler successfully' });
    }

    setLatency(Math.round(end - start));
    setIsRunning(false);
    showToast(`200 OK (${Math.round(end - start)}ms)`, 'success');
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'POST':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'PUT':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  const curlSnippet = `curl -X ${currentApi.method} "https://api.genesis.local${currentApi.path}" \\
  -H "Content-Type: application/json" \\
  ${currentApi.authRequired ? '-H "Authorization: Bearer <JWT_TOKEN>" \\' : ''}
  ${currentApi.requestBodySample ? `-d '${currentApi.requestBodySample.replace(/\n/g, '')}'` : ''}`;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Header */}
      <div className="h-auto sm:h-12 border-b border-slate-200 bg-white px-3 sm:px-4 py-2 sm:py-0 flex items-center justify-between shrink-0 gap-2 shadow-2xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0">
            <Webhook className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">API Workbench & REST Client</h2>
            <p className="text-[10px] text-slate-500 hidden xs:block">リアルタイムAPI実行・レスポンス検証・curlコード生成</p>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendRequest}
          disabled={isRunning}
          className="px-3 sm:px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunning ? 'Sending...' : 'Send'}</span>
        </button>
      </div>

      {/* Mobile Horizontal Endpoint Selector (< md) */}
      <div className="md:hidden flex items-center gap-1.5 p-2 bg-white border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0 shadow-2xs">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 shrink-0 px-1">
          APIs:
        </span>
        {apis.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              setSelectedApiId(a.id);
              setLastResponse(null);
              setLatency(null);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors border cursor-pointer ${
              a.id === selectedApiId
                ? 'bg-slate-900 text-white font-medium border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <span className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded border ${getMethodBadge(a.method)}`}>
              {a.method}
            </span>
            <span className="font-mono text-[11px]">{a.path}</span>
          </button>
        ))}
      </div>

      {/* Main Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Endpoint List Sidebar (Desktop Only) */}
        <div className="hidden md:block w-64 bg-white border-r border-slate-200 p-3 space-y-1 overflow-y-auto shrink-0 text-xs">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2">
            Endpoints ({apis.length})
          </div>
          {apis.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setSelectedApiId(a.id);
                setLastResponse(null);
                setLatency(null);
              }}
              className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                a.id === selectedApiId
                  ? 'bg-cyan-50 text-cyan-900 font-semibold border border-cyan-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getMethodBadge(
                  a.method
                )}`}
              >
                {a.method}
              </span>
              <div className="truncate">
                <div className="truncate text-slate-900 text-xs font-medium">{a.name}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">{a.path}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Endpoint Details & Live Runner */}
        <div className="flex-1 overflow-auto p-3 sm:p-5 space-y-4 sm:space-y-5">
          {/* Endpoint Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border ${getMethodBadge(
                  currentApi.method
                )}`}
              >
                {currentApi.method}
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 break-all">{currentApi.path}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              {currentApi.authRequired && (
                <span className="flex items-center gap-1 text-amber-700 font-mono text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                  <Shield className="w-3 h-3" />
                  Auth Required ({currentApi.role || 'user'})
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-600">{currentApi.description}</p>

          {/* cURL Snippet */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 relative shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-700 font-mono">cURL Command</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(curlSnippet);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                  showToast('cURLコマンドをコピーしました', 'success');
                }}
                className="text-slate-500 hover:text-slate-900 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-800 overflow-x-auto bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {curlSnippet}
            </pre>
          </div>

          {/* Response Inspector */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Response Body</span>
                {lastResponse && (
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    200 OK
                  </span>
                )}
              </div>
              {latency !== null && (
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-600" />
                  {latency} ms
                </span>
              )}
            </div>

            <pre className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto max-h-80 leading-relaxed">
              {JSON.stringify(lastResponse || JSON.parse(currentApi.responseSample), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
