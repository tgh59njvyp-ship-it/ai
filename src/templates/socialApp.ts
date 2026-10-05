import { Project } from '../types/project';

export const socialAppTemplate: Project = {
  id: 'proj_social_sphere',
  name: 'SocialSphere',
  description: 'モダンなフルスタックSNSプラットフォーム (認証・投稿・いいね・コメント・ユーザープロファイル・DB・API完備)',
  icon: 'MessageCircle',
  createdAt: Date.now() - 86400000 * 3,
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
      allowed: ['lucide-react', 'zod', 'date-fns', 'clsx', 'tailwind-merge'],
      requiresApproval: ['framer-motion', '@supabase/supabase-js'],
      blocked: ['unverified-npm-pkg', 'eval-based-libs'],
    },
    rules: [
      'Do not change framework without explicit user instruction.',
      'Do not change programming language (TypeScript ONLY).',
      'Do not delete existing features or database relationships.',
      'Do not expose secrets or private tokens.',
      'Every requested feature must actually work in live preview.',
      'Keep project fully exportable and portable.',
      'Always maintain clean .env.example with redacted credentials.',
    ],
    userControlLevel: 'Ask',
  },
  database: {
    tables: [
      {
        id: 'tbl_users',
        name: 'users',
        description: 'ユーザーアカウントおよびプロファイル情報',
        columns: [
          { name: 'id', type: 'UUID', primaryKey: true },
          { name: 'username', type: 'VARCHAR(50)', nullable: false },
          { name: 'email', type: 'VARCHAR(255)', nullable: false },
          { name: 'avatar_url', type: 'TEXT' },
          { name: 'bio', type: 'TEXT' },
          { name: 'role', type: 'VARCHAR(20)', defaultValue: "'user'" },
          { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()' },
        ],
        rows: [
          {
            id: 'u-101',
            username: 'alex_dev',
            email: 'alex@example.com',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            bio: 'Fullstack Dev & Open Source enthusiast 🚀',
            role: 'admin',
            created_at: '2026-03-01T10:00:00Z',
          },
          {
            id: 'u-102',
            username: 'sarah_design',
            email: 'sarah@example.com',
            avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            bio: 'Designing the future of AI interfaces ✨',
            role: 'user',
            created_at: '2026-03-02T14:30:00Z',
          },
          {
            id: 'u-103',
            username: 'kenji_tokyo',
            email: 'kenji@example.com',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            bio: 'Tokyo based software engineer 🗼 React & Rust',
            role: 'user',
            created_at: '2026-03-03T09:15:00Z',
          },
        ],
      },
      {
        id: 'tbl_posts',
        name: 'posts',
        description: 'ユーザーがタイムラインに投稿したコンテンツ',
        columns: [
          { name: 'id', type: 'UUID', primaryKey: true },
          { name: 'user_id', type: 'UUID', isForeignKey: true, foreignTable: 'users' },
          { name: 'content', type: 'TEXT', nullable: false },
          { name: 'likes_count', type: 'INTEGER', defaultValue: '0' },
          { name: 'comments_count', type: 'INTEGER', defaultValue: '0' },
          { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()' },
        ],
        rows: [
          {
            id: 'p-201',
            user_id: 'u-101',
            content: 'Genesis Studioで構築したSNSが稼働開始しました！アーキテクチャが極めてクリーンで気持ちいい。',
            likes_count: 24,
            comments_count: 5,
            created_at: '2026-10-04T08:00:00Z',
          },
          {
            id: 'p-202',
            user_id: 'u-102',
            content: '新しいDesign Systemを策定中。ダークモードのコントラストとタイポグラフィ比率にこだわっています🎨',
            likes_count: 38,
            comments_count: 8,
            created_at: '2026-10-04T11:20:00Z',
          },
          {
            id: 'p-203',
            user_id: 'u-103',
            content: 'TypeScriptの厳格な型安全とPostgreSQLのインデックス最適化を組み合わせると、APIレスポンスが20ms以下に短縮できました！',
            likes_count: 45,
            comments_count: 12,
            created_at: '2026-10-05T01:45:00Z',
          },
        ],
      },
      {
        id: 'tbl_comments',
        name: 'comments',
        description: '投稿に対するコメント',
        columns: [
          { name: 'id', type: 'UUID', primaryKey: true },
          { name: 'post_id', type: 'UUID', isForeignKey: true, foreignTable: 'posts' },
          { name: 'user_id', type: 'UUID', isForeignKey: true, foreignTable: 'users' },
          { name: 'content', type: 'TEXT', nullable: false },
          { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()' },
        ],
        rows: [
          {
            id: 'c-301',
            post_id: 'p-201',
            user_id: 'u-102',
            content: 'UIのアニメーションが自然で素晴らしいですね！',
            created_at: '2026-10-04T08:30:00Z',
          },
          {
            id: 'c-302',
            post_id: 'p-201',
            user_id: 'u-103',
            content: 'APIスキーマの定義も完璧です。',
            created_at: '2026-10-04T09:10:00Z',
          },
        ],
      },
    ],
    migrations: [
      {
        id: 'mig_001_initial',
        name: '20261001_initial_schema.sql',
        sql: `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);`,
        appliedAt: '2026-10-01 10:00:00 UTC',
      },
    ],
  },
  apis: [
    {
      id: 'api_get_posts',
      name: 'List Timeline Posts',
      method: 'GET',
      path: '/api/v1/posts',
      description: 'タイムラインの投稿一覧を最新順に取得します',
      authRequired: false,
      params: [
        { key: 'limit', type: 'number', required: false, description: '件数 (default 20)' },
        { key: 'page', type: 'number', required: false, description: 'ページ番号' },
      ],
      responseSample: JSON.stringify(
        {
          success: true,
          count: 3,
          data: [
            { id: 'p-201', author: 'alex_dev', content: 'Genesis Studioで構築したSNS...', likes: 24 },
          ],
        },
        null,
        2
      ),
      handlerCode: `export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') || '20');
  const posts = await db.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT $1', [limit]);
  return Response.json({ success: true, count: posts.length, data: posts });
}`,
    },
    {
      id: 'api_create_post',
      name: 'Create Post',
      method: 'POST',
      path: '/api/v1/posts',
      description: '新規投稿を作成します',
      authRequired: true,
      role: 'user',
      params: [],
      requestBodySample: JSON.stringify(
        {
          content: 'Hello from Genesis Studio! 🚀',
        },
        null,
        2
      ),
      responseSample: JSON.stringify(
        {
          success: true,
          post: { id: 'p-999', content: 'Hello from Genesis Studio! 🚀', likes_count: 0 },
        },
        null,
        2
      ),
      handlerCode: `export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return new Response('Unauthorized', { status: 401 });
  const body = await req.json();
  const post = await db.insert('posts').values({ user_id: user.id, content: body.content });
  return Response.json({ success: true, post });
}`,
    },
    {
      id: 'api_toggle_like',
      name: 'Like / Unlike Post',
      method: 'POST',
      path: '/api/v1/posts/:id/like',
      description: '指定投稿へのいいねトグル',
      authRequired: true,
      params: [{ key: 'id', type: 'string', required: true, description: 'Post ID' }],
      responseSample: JSON.stringify({ success: true, liked: true, totalLikes: 25 }, null, 2),
      handlerCode: `export async function POST(req: Request, { params }: { params: { id: string } }) {
  const postId = params.id;
  // toggle like logic
  return Response.json({ success: true, liked: true, totalLikes: 25 });
}`,
    },
  ],
  git: {
    currentBranch: 'main',
    branches: [
      { name: 'main', current: true, latestCommitId: 'c-003' },
      { name: 'feat/notifications', current: false, latestCommitId: 'c-002' },
    ],
    commits: [
      {
        id: 'c-003',
        message: 'feat: add real-time like and comments interaction',
        author: 'Genesis AI Agent <agent@genesis.studio>',
        timestamp: Date.now() - 3600000 * 4,
        branch: 'main',
        filesSnapshot: {},
        stats: { added: 120, modified: 14, deleted: 2 },
      },
      {
        id: 'c-002',
        message: 'feat: implement responsive timeline card and user avatars',
        author: 'Genesis AI Agent <agent@genesis.studio>',
        timestamp: Date.now() - 3600000 * 24,
        branch: 'main',
        filesSnapshot: {},
        stats: { added: 240, modified: 30, deleted: 5 },
      },
      {
        id: 'c-001',
        message: 'chore: initial project scaffolding with PostgreSQL schema and TypeScript config',
        author: 'Genesis AI Agent <agent@genesis.studio>',
        timestamp: Date.now() - 3600000 * 72,
        branch: 'main',
        filesSnapshot: {},
        stats: { added: 580, modified: 0, deleted: 0 },
      },
    ],
    remoteRepoUrl: 'https://github.com/developer/social-sphere-genesis.git',
    isSynced: true,
    lastSyncAt: '2026-10-04T12:00:00Z',
  },
  tests: [
    {
      id: 't-1',
      name: 'User authentication & session validation',
      category: 'integration',
      status: 'passed',
      assertion: 'Validates JWT token expiry and user role privileges',
      durationMs: 42,
    },
    {
      id: 't-2',
      name: 'Post creation with validation guardrails',
      category: 'unit',
      status: 'passed',
      assertion: 'Rejects empty content and trims whitespace >= 1 char',
      durationMs: 18,
    },
    {
      id: 't-3',
      name: 'Like counter atomic increment test',
      category: 'api',
      status: 'passed',
      assertion: 'Prevents duplicate likes from same user_id using unique constraint',
      durationMs: 25,
    },
    {
      id: 't-4',
      name: 'Responsive timeline feed render',
      category: 'ui',
      status: 'passed',
      assertion: 'Verified no horizontal overflow on 375px mobile viewport',
      durationMs: 65,
    },
  ],
  deployments: [
    {
      id: 'dep-901',
      target: 'Vercel',
      status: 'ready',
      url: 'https://social-sphere-genesis.vercel.app',
      deployedAt: '2026-10-04T18:42:00Z',
      commitId: 'c-003',
      logs: [
        '[Vercel] Fetching repository commit c-003',
        '[pnpm install] Resolved 142 packages in 1.4s',
        '[pnpm run build] Next.js compilation succeeded in 3.2s',
        '[Deploy] Edge network cache populated. Production URL ready.',
      ],
    },
  ],
  storage: [
    {
      id: 'st-1',
      name: 'hero-banner.png',
      type: 'image/png',
      size: 245000,
      uploadedAt: '2026-10-02T10:00:00Z',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    },
  ],
  logs: [
    {
      id: 'log-1',
      level: 'success',
      source: 'Build',
      message: 'TypeScript compilation completed with 0 errors.',
      timestamp: '2026-10-04 18:40:12',
    },
    {
      id: 'log-2',
      level: 'info',
      source: 'Database',
      message: 'PostgreSQL connection pool ready: 10 connections established.',
      timestamp: '2026-10-04 18:40:15',
    },
  ],
  analytics: [
    { date: '10/01', visitors: 120, views: 350, apiCalls: 890, avgLatencyMs: 24 },
    { date: '10/02', visitors: 280, views: 820, apiCalls: 2100, avgLatencyMs: 22 },
    { date: '10/03', visitors: 490, views: 1450, apiCalls: 3800, avgLatencyMs: 19 },
    { date: '10/04', visitors: 820, views: 2400, apiCalls: 6200, avgLatencyMs: 21 },
    { date: '10/05', visitors: 1100, views: 3600, apiCalls: 9100, avgLatencyMs: 18 },
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
          name: 'social-sphere',
          version: '1.0.0',
          private: true,
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'tsc && vite build',
            preview: 'vite preview',
            test: 'vitest run',
          },
          dependencies: {
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            'lucide-react': '^0.546.0',
            clsx: '^2.1.0',
            'tailwind-merge': '^2.2.0',
            'date-fns': '^3.6.0',
          },
          devDependencies: {
            typescript: '^5.7.0',
            vite: '^6.0.0',
            tailwindcss: '^4.0.0',
            vitest: '^1.6.0',
          },
        },
        null,
        2
      ),
    },
    'tsconfig.json': {
      path: 'tsconfig.json',
      name: 'tsconfig.json',
      language: 'json',
      isFolder: false,
      updatedAt: Date.now(),
      content: JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            useDefineForClassFields: true,
            lib: ['ES2022', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            strict: true,
            jsx: 'react-jsx',
          },
          include: ['src'],
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
      content: `# SocialSphere 🌐

自然言語から構築された高機能フルスタックSNS。

## Requirements
- Node.js >= 22.0.0
- pnpm >= 9.0.0
- PostgreSQL >= 16

## Setup & Local Development
\`\`\`bash
# 1. 依存関係のインストール (pnpm lockfileを使用)
pnpm install

# 2. 環境変数の設定
cp .env.example .env
# .envにPostgreSQL接続文字列を設定

# 3. 開発サーバーの起動
pnpm dev

# 4. テスト実行
pnpm test
\`\`\`

## Architecture & Database
- PostgreSQL: users, posts, comments
- UI: Tailwind CSS + shadcn/ui
- Fully exportable with zero platform lock-in.
`,
    },
    '.env.example': {
      path: '.env.example',
      name: '.env.example',
      language: 'bash',
      isFolder: false,
      updatedAt: Date.now(),
      content: `# SocialSphere Configuration
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/social_sphere"
AUTH_SECRET="REPLACE_WITH_SECURE_RANDOM_SECRET_KEY_32_BYTES"
APP_URL="http://localhost:3000"
`,
    },
    '.gitignore': {
      path: '.gitignore',
      name: '.gitignore',
      language: 'bash',
      isFolder: false,
      updatedAt: Date.now(),
      content: `node_modules/
dist/
.env
*.local
.DS_Store
`,
    },
    'src/App.tsx': {
      path: 'src/App.tsx',
      name: 'App.tsx',
      language: 'typescript',
      isFolder: false,
      updatedAt: Date.now(),
      content: `import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Sparkles, Plus, Image, Send, User } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  handle: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export default function SocialApp() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Alex Dev',
      handle: '@alex_dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      time: '2時間前',
      content: 'Genesis Studioで構築したSNSが稼働開始しました！アーキテクチャが極めてクリーンで気持ちいい。PostgreSQLとの親和性も最高です。',
      likes: 24,
      comments: 5,
      liked: false,
    },
    {
      id: '2',
      author: 'Sarah Designer',
      handle: '@sarah_design',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      time: '5時間前',
      content: '新しいDesign Systemを策定中。ダークモードのコントラストとタイポグラフィ比率にこだわっています🎨',
      likes: 38,
      comments: 8,
      liked: true,
    },
    {
      id: '3',
      author: 'Kenji Tokyo',
      handle: '@kenji_tokyo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      time: '8時間前',
      content: 'TypeScriptの厳格な型安全とPostgreSQLのインデックス最適化を組み合わせると、APIレスポンスが20ms以下に短縮できました！',
      likes: 45,
      comments: 12,
      liked: false,
    },
  ]);

  const [newContent, setNewContent] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'notifications' | 'profile'>('feed');

  const handleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked,
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    const newPost: Post = {
      id: String(Date.now()),
      author: 'You (Genesis User)',
      handle: '@current_user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      time: 'たった今',
      content: newContent,
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts([newPost, ...posts]);
    setNewContent('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              S
            </div>
            <span className="font-semibold tracking-tight text-white">SocialSphere</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button 
              onClick={() => setActiveTab('feed')}
              className={\`px-3 py-1 text-xs font-medium rounded-md transition-all \${activeTab === 'feed' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}\`}
            >
              タイムライン
            </button>
            <button 
              onClick={() => setActiveTab('explore')}
              className={\`px-3 py-1 text-xs font-medium rounded-md transition-all \${activeTab === 'explore' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}\`}
            >
              トレンド
            </button>
          </div>

          <div className="flex items-center gap-2">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" 
              alt="avatar" 
              className="w-7 h-7 rounded-full border border-slate-700 object-cover" 
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-5">
        {/* Post Creation Box */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-sm">
          <form onSubmit={handleCreatePost}>
            <div className="flex gap-3">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" 
                alt="avatar" 
                className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0" 
              />
              <div className="flex-1">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="今どうしてる？アイデアを投稿してみよう..."
                  className="w-full bg-transparent resize-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none min-h-[70px]"
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <button type="button" className="p-1.5 hover:text-cyan-400 rounded-md hover:bg-slate-800/60 transition-colors">
                      <Image className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1.5 hover:text-cyan-400 rounded-md hover:bg-slate-800/60 transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newContent.trim()}
                    className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    投稿する
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Feed List */}
        <div className="space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="bg-slate-900/80 rounded-xl border border-slate-800/90 p-4 transition-all hover:border-slate-700/80">
              <div className="flex items-start gap-3">
                <img 
                  src={post.avatar} 
                  alt={post.author} 
                  className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white truncate">{post.author}</span>
                      <span className="text-xs text-slate-400 font-mono">{post.handle}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{post.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed mb-3 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  
                  {/* Action Bar */}
                  <div className="flex items-center gap-6 pt-2 border-t border-slate-800/60 text-slate-400 text-xs">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={\`flex items-center gap-1.5 transition-colors \${post.liked ? 'text-rose-400 font-semibold' : 'hover:text-rose-400'}\`}
                    >
                      <Heart className={\`w-4 h-4 \${post.liked ? 'fill-rose-400' : ''}\`} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-slate-200 transition-colors ml-auto">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
`,
    },
  },
};
