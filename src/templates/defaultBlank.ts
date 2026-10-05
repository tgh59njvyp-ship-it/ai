import { Project, ProgrammingLanguage, Framework, Runtime, PackageManager } from '../types/project';

export function createBlankProject(
  name: string,
  description: string,
  language: ProgrammingLanguage = 'TypeScript',
  framework: Framework = 'React',
  runtime: Runtime = 'Node.js',
  packageManager: PackageManager = 'pnpm'
): Project {
  return {
    id: `proj_${Date.now()}`,
    name: name || 'New Custom Software',
    description: description || 'Built with Genesis Studio AI Development OS',
    icon: 'Layers',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    constitution: {
      language,
      allowedLanguages: [language],
      forbiddenLanguages: language === 'TypeScript' ? ['Python', 'PHP', 'Ruby', 'Java'] : [],
      framework,
      runtime,
      runtimeVersion: runtime === 'Node.js' ? 'Node.js 22' : 'Latest',
      packageManager,
      uiSystem: 'Tailwind CSS + shadcn/ui',
      database: 'PostgreSQL',
      auth: 'Supabase Auth',
      dependencyControl: {
        allowed: ['lucide-react', 'clsx', 'tailwind-merge', 'zod'],
        requiresApproval: ['framer-motion', 'axios'],
        blocked: ['unverified-npm-pkg'],
      },
      rules: [
        'Strictly obey user instructions and project constitution.',
        'Never change framework or language without approval.',
        'Produce real working, responsive, high-aesthetic code.',
        'Secrets must remain in .env.example with redacted placeholders.',
      ],
      userControlLevel: 'Ask',
    },
    database: {
      tables: [
        {
          id: 'tbl_items',
          name: 'items',
          description: 'Core application items table',
          columns: [
            { name: 'id', type: 'UUID', primaryKey: true },
            { name: 'title', type: 'VARCHAR(100)', nullable: false },
            { name: 'status', type: 'VARCHAR(30)', defaultValue: "'active'" },
            { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()' },
          ],
          rows: [
            { id: 'item-1', title: '初回設定完了', status: 'completed', created_at: new Date().toISOString() },
            { id: 'item-2', title: 'Genesis Studioへようこそ', status: 'active', created_at: new Date().toISOString() },
          ],
        },
      ],
      migrations: [
        {
          id: 'mig_01',
          name: '20261005_init.sql',
          sql: `CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  status VARCHAR(30) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
          appliedAt: new Date().toISOString(),
        },
      ],
    },
    apis: [
      {
        id: 'api_get_items',
        name: 'List Items',
        method: 'GET',
        path: '/api/v1/items',
        description: 'アイテム一覧を取得します',
        authRequired: false,
        params: [],
        responseSample: JSON.stringify({ success: true, count: 2, items: [] }, null, 2),
      },
    ],
    git: {
      currentBranch: 'main',
      branches: [{ name: 'main', current: true, latestCommitId: 'c-init' }],
      commits: [
        {
          id: 'c-init',
          message: 'Initial project scaffolding from Genesis Studio',
          author: 'Genesis AI Agent <agent@genesis.studio>',
          timestamp: Date.now(),
          branch: 'main',
          filesSnapshot: {},
          stats: { added: 120, modified: 0, deleted: 0 },
        },
      ],
      remoteRepoUrl: '',
      isSynced: false,
    },
    tests: [
      {
        id: 't-blank-1',
        name: 'Application boots and mounts root DOM',
        category: 'ui',
        status: 'passed',
        assertion: 'Element #root exists and renders successfully',
        durationMs: 15,
      },
    ],
    deployments: [],
    storage: [],
    logs: [
      {
        id: 'l-1',
        level: 'info',
        source: 'App',
        message: 'Project created successfully with strict constitution.',
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
    analytics: [
      { date: 'Day 1', visitors: 1, views: 3, apiCalls: 5, avgLatencyMs: 10 },
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
            name: name.toLowerCase().replace(/\\s+/g, '-'),
            version: '0.1.0',
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
        content: `# ${name}

${description}

## Quickstart
\`\`\`bash
${packageManager} install
${packageManager} dev
\`\`\`
`,
      },
      '.env.example': {
        path: '.env.example',
        name: '.env.example',
        language: 'bash',
        isFolder: false,
        updatedAt: Date.now(),
        content: `# Environment Variables
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
APP_SECRET="REPLACE_WITH_SECRET"
`,
      },
      '.gitignore': {
        path: '.gitignore',
        name: '.gitignore',
        language: 'bash',
        isFolder: false,
        updatedAt: Date.now(),
        content: `node_modules/\ndist/\n.env\n`,
      },
      'src/App.tsx': {
        path: 'src/App.tsx',
        name: 'App.tsx',
        language: 'typescript',
        isFolder: false,
        updatedAt: Date.now(),
        content: `import React, { useState } from 'react';
import { Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
        <Sparkles className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-white mb-2">${name}</h1>
      <p className="text-xs text-slate-400 max-w-md mb-6">${description}</p>
      
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl mb-6 flex items-center gap-3">
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          クリック数: {count}
        </button>
        <span className="text-xs text-slate-400">インタラクティブ実行中</span>
      </div>

      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
        <Terminal className="w-3.5 h-3.5" />
        <span>AI Agentにアイデアを伝えて、このコードを機能拡張してください</span>
      </div>
    </div>
  );
}
`,
      },
    },
  };
}
