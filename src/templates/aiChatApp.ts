import { Project } from '../types/project';

export const aiChatAppTemplate: Project = {
  id: 'proj_omni_chat',
  name: 'OmniChat AI Studio',
  description: 'BYOK対応・マルチモデルAIチャット & ナレッジワークスペース (ストリーミング・プロンプトライブラリ・履歴DB完備)',
  icon: 'Bot',
  createdAt: Date.now() - 86400000 * 5,
  updatedAt: Date.now(),
  constitution: {
    language: 'TypeScript',
    allowedLanguages: ['TypeScript'],
    forbiddenLanguages: ['Python', 'PHP', 'Ruby', 'Java'],
    framework: 'React',
    runtime: 'Node.js',
    runtimeVersion: 'Node.js 22',
    packageManager: 'pnpm',
    uiSystem: 'Tailwind CSS + shadcn/ui',
    database: 'PostgreSQL',
    auth: 'Supabase Auth',
    dependencyControl: {
      allowed: ['lucide-react', 'zod', 'clsx', 'tailwind-merge'],
      requiresApproval: ['@google/genai'],
      blocked: ['unverified-npm-pkg'],
    },
    rules: [
      'Strict TypeScript only.',
      'API keys must never be exposed or sent to telemetry.',
      'Model router must handle fallback gracefully.',
      'Exportable project with standard .env.example.',
    ],
    userControlLevel: 'Ask',
  },
  database: {
    tables: [
      {
        id: 'tbl_conversations',
        name: 'conversations',
        description: 'チャットスレッド履歴',
        columns: [
          { name: 'id', type: 'UUID', primaryKey: true },
          { name: 'title', type: 'VARCHAR(150)', nullable: false },
          { name: 'model_id', type: 'VARCHAR(50)', defaultValue: "'gemini-3.8-flash'" },
          { name: 'total_tokens', type: 'INTEGER', defaultValue: '0' },
          { name: 'updated_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()' },
        ],
        rows: [
          { id: 'conv-1', title: 'マイクロサービスアーキテクチャ設計相談', model_id: 'gemini-3.8-flash', total_tokens: 1420, updated_at: '2026-10-04T16:00:00Z' },
          { id: 'conv-2', title: 'SQLインデックスチューニング分析', model_id: 'gemini-3.8-flash', total_tokens: 890, updated_at: '2026-10-05T02:00:00Z' },
        ],
      },
    ],
    migrations: [
      {
        id: 'mig_chat_init',
        name: '20261001_chat_tables.sql',
        sql: `CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(150) NOT NULL,
  model_id VARCHAR(50) DEFAULT 'gemini-3.8-flash',
  total_tokens INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`,
        appliedAt: '2026-10-01 10:00:00 UTC',
      },
    ],
  },
  apis: [
    {
      id: 'api_ai_generate',
      name: 'Stream AI Completion',
      method: 'POST',
      path: '/api/v1/chat',
      description: 'AIモデルへのプロンプト送信およびストリーミング応答',
      authRequired: true,
      params: [],
      responseSample: JSON.stringify({ role: 'assistant', content: 'こんにちは！今日はどのようなソフトウェアを構築しますか？' }, null, 2),
      handlerCode: `export async function POST(req: Request) {
  return Response.json({ role: 'assistant', content: 'Sample response' });
}`,
    },
  ],
  git: {
    currentBranch: 'main',
    branches: [{ name: 'main', current: true, latestCommitId: 'c-chat-01' }],
    commits: [
      {
        id: 'c-chat-01',
        message: 'feat: initial setup of OmniChat studio workspace',
        author: 'Genesis AI Agent <agent@genesis.studio>',
        timestamp: Date.now() - 3600000 * 20,
        branch: 'main',
        filesSnapshot: {},
        stats: { added: 310, modified: 0, deleted: 0 },
      },
    ],
    remoteRepoUrl: 'https://github.com/developer/omnichat-ai-studio.git',
    isSynced: true,
  },
  tests: [
    {
      id: 'ct-1',
      name: 'Chat history persistence test',
      category: 'integration',
      status: 'passed',
      assertion: 'Ensures chat messages are preserved across sessions in IndexedDB/Postgres',
      durationMs: 20,
    },
  ],
  deployments: [
    {
      id: 'dep-chat-1',
      target: 'Vercel',
      status: 'ready',
      url: 'https://omnichat-ai.vercel.app',
      deployedAt: '2026-10-04T17:00:00Z',
      commitId: 'c-chat-01',
      logs: ['[Vercel] Edge streaming active.'],
    },
  ],
  storage: [],
  logs: [],
  analytics: [
    { date: '10/01', visitors: 190, views: 600, apiCalls: 1200, avgLatencyMs: 25 },
    { date: '10/02', visitors: 420, views: 1500, apiCalls: 3100, avgLatencyMs: 24 },
    { date: '10/03', visitors: 650, views: 2400, apiCalls: 5400, avgLatencyMs: 22 },
    { date: '10/04', visitors: 980, views: 3700, apiCalls: 8300, avgLatencyMs: 20 },
    { date: '10/05', visitors: 1300, views: 4900, apiCalls: 11200, avgLatencyMs: 19 },
  ],
  files: {
    'package.json': {
      path: 'package.json',
      name: 'package.json',
      language: 'json',
      isFolder: false,
      updatedAt: Date.now(),
      content: JSON.stringify(
        {
          name: 'omnichat-ai',
          version: '1.0.0',
          private: true,
          type: 'module',
          scripts: { dev: 'vite', build: 'tsc && vite build' },
          dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0', 'lucide-react': '^0.546.0' },
          devDependencies: { typescript: '^5.7.0', vite: '^6.0.0', tailwindcss: '^4.0.0' },
        },
        null,
        2
      ),
    },
    'README.md': {
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      isFolder: false,
      updatedAt: Date.now(),
      content: `# OmniChat AI Studio 🤖

BYOK対応・マルチモデルAIチャット & ナレッジワークスペース。
`,
    },
    'src/App.tsx': {
      path: 'src/App.tsx',
      name: 'App.tsx',
      language: 'typescript',
      isFolder: false,
      updatedAt: Date.now(),
      content: `import React, { useState } from 'react';
import { Bot, User, Send, Sparkles, Copy, Check, Terminal, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function OmniChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'こんにちは！Genesis Studioで構築されたOmniChat AIです。コード作成、アーキテクチャ相談、リファクタリングなど何でも質問してください。',
      timestamp: '10:00',
    },
    {
      id: '2',
      role: 'user',
      content: 'Next.jsとPostgreSQLでスケーラブルなマルチテナントDBを組む際のベストプラクティスを教えてください。',
      timestamp: '10:01',
    },
    {
      id: '3',
      role: 'assistant',
      content: 'マルチテナント設計には主に3つの方式があります:\\n\\n1. **スキーマ分離 (Schema per Tenant)**: PostgreSQLのSCHEMA機能を使用。データ分離とマイグレーションのバランスが優秀。\\n2. **行レベル分離 (Row Level Security / RLS)**: tenant_idカラムを追加し、Supabase/PostgreSQLのRLSポリシーで自動フィルタリング。最もコスト効率が高い。\\n3. **DB分離 (Database per Tenant)**: 独立DB。コンプライアンス要件が極めて高い大企業向け。',
      timestamp: '10:01',
    },
  ]);

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: \`「\${currentInput}」について承知いたしました。Genesis Studioのフルスタック環境と連動し、実証済みのコードパターンとPostgreSQLスキーマを構築可能です。\`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiReply]);
    }, 600);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight text-white">OmniChat AI Studio</h1>
              <span className="text-[10px] text-slate-400">Gemini 3.8 Flash · Full-Stack Integration</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Ready</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={\`flex gap-3 \${m.role === 'user' ? 'justify-end' : 'justify-start'}\`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={\`max-w-[80%] rounded-xl p-4 text-xs leading-relaxed \${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }\`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                <span>{m.role === 'user' ? 'You' : 'OmniChat AI'}</span>
                <span>{m.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap">{m.content}</div>

              {m.role === 'assistant' && (
                <div className="flex justify-end mt-2 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => copyToClipboard(m.content, m.id)}
                    className="text-slate-400 hover:text-slate-200 text-[10px] flex items-center gap-1 transition-colors"
                  >
                    {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === m.id ? 'コピー完了' : 'コピー'}</span>
                  </button>
                </div>
              )}
            </div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Input */}
      <footer className="sticky bottom-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 py-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="AIに質問する（例: ユーザー管理APIのPostgreSQLクエリを書いて）..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>送信</span>
          </button>
        </form>
      </footer>
    </div>
  );
}
`,
    },
  },
};
