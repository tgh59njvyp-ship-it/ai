import { Project } from '../types/project';

export const bookingAppTemplate: Project = {
  id: 'proj_desk_flow',
  name: 'DeskFlow Booking & Admin',
  description: 'リソース・会議室・座席予約管理SaaS (インタラクティブカレンダー・ロール権限管理・予約台帳・API完備)',
  icon: 'Calendar',
  createdAt: Date.now() - 86400000 * 4,
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
      allowed: ['lucide-react', 'date-fns', 'zod', 'clsx', 'tailwind-merge'],
      requiresApproval: ['fullcalendar'],
      blocked: ['unverified-npm-pkg'],
    },
    rules: [
      'Strict TypeScript only.',
      'Maintain reservation conflicts prevention logic.',
      'Role-based Access Control (Admin vs Regular User) must be enforced in DB & API.',
      'All UI actions must trigger real reactive state changes.',
      'Clean .env.example with redacted credentials.',
    ],
    userControlLevel: 'Ask',
  },
  database: {
    tables: [
      {
        id: 'tbl_resources',
        name: 'resources',
        description: '会議室およびワークデスク一覧',
        columns: [
          { name: 'id', type: 'UUID', primaryKey: true },
          { name: 'name', type: 'VARCHAR(100)', nullable: false },
          { name: 'type', type: 'VARCHAR(50)', nullable: false },
          { name: 'capacity', type: 'INTEGER', defaultValue: '1' },
          { name: 'status', type: 'VARCHAR(20)', defaultValue: "'available'" },
          { name: 'floor', type: 'VARCHAR(20)', defaultValue: "'3F'" },
        ],
        rows: [
          { id: 'res-1', name: 'Boardroom A (大型スクリーン)', type: 'Conference Room', capacity: 12, status: 'available', floor: '4F' },
          { id: 'res-2', name: 'Focus Room 101', type: 'Private Pod', capacity: 2, status: 'occupied', floor: '3F' },
          { id: 'res-3', name: 'Open Desk 08', type: 'Hot Desk', capacity: 1, status: 'available', floor: '3F' },
          { id: 'res-4', name: 'Innovation Lab', type: 'Studio Room', capacity: 8, status: 'available', floor: '2F' },
        ],
      },
      {
        id: 'tbl_bookings',
        name: 'bookings',
        description: 'リソースの予約データ',
        columns: [
          { name: 'id', type: 'UUID', primaryKey: true },
          { name: 'resource_id', type: 'UUID', isForeignKey: true, foreignTable: 'resources' },
          { name: 'user_name', type: 'VARCHAR(100)', nullable: false },
          { name: 'start_time', type: 'VARCHAR(50)', nullable: false },
          { name: 'end_time', type: 'VARCHAR(50)', nullable: false },
          { name: 'purpose', type: 'TEXT' },
          { name: 'status', type: 'VARCHAR(20)', defaultValue: "'confirmed'" },
        ],
        rows: [
          { id: 'bk-1', resource_id: 'res-1', user_name: '田中 健一 (CEO)', start_time: '13:00', end_time: '14:30', purpose: 'Q3 役員経営戦略会議', status: 'confirmed' },
          { id: 'bk-2', resource_id: 'res-2', user_name: '佐藤 恵 (Lead Dev)', start_time: '10:00', end_time: '12:00', purpose: 'AIモデルインテグレーション集中開発', status: 'confirmed' },
        ],
      },
    ],
    migrations: [
      {
        id: 'mig_booking_init',
        name: '20261001_booking_init.sql',
        sql: `CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  capacity INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'available',
  floor VARCHAR(20) DEFAULT '3F'
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_name VARCHAR(100) NOT NULL,
  start_time VARCHAR(50) NOT NULL,
  end_time VARCHAR(50) NOT NULL,
  purpose TEXT,
  status VARCHAR(20) DEFAULT 'confirmed'
);`,
        appliedAt: '2026-10-01 09:00:00 UTC',
      },
    ],
  },
  apis: [
    {
      id: 'api_book_resource',
      name: 'Create Booking',
      method: 'POST',
      path: '/api/v1/bookings',
      description: '会議室またはデスクの予約作成（重複チェック付き）',
      authRequired: true,
      params: [],
      requestBodySample: JSON.stringify(
        { resource_id: 'res-1', start_time: '15:00', end_time: '16:00', purpose: 'Client Demo' },
        null,
        2
      ),
      responseSample: JSON.stringify({ success: true, booking_id: 'bk-99' }, null, 2),
      handlerCode: `export async function POST(req: Request) {
  // Check overlapping reservations and book
  return Response.json({ success: true, booking_id: 'bk-99' });
}`,
    },
  ],
  git: {
    currentBranch: 'main',
    branches: [{ name: 'main', current: true, latestCommitId: 'c-bk-02' }],
    commits: [
      {
        id: 'c-bk-02',
        message: 'feat: add booking conflict validation & admin control modal',
        author: 'Genesis AI Agent <agent@genesis.studio>',
        timestamp: Date.now() - 3600000 * 8,
        branch: 'main',
        filesSnapshot: {},
        stats: { added: 140, modified: 8, deleted: 0 },
      },
      {
        id: 'c-bk-01',
        message: 'chore: initial commit of DeskFlow booking schema',
        author: 'Genesis AI Agent <agent@genesis.studio>',
        timestamp: Date.now() - 3600000 * 36,
        branch: 'main',
        filesSnapshot: {},
        stats: { added: 390, modified: 0, deleted: 0 },
      },
    ],
    remoteRepoUrl: 'https://github.com/developer/deskflow-booking.git',
    isSynced: true,
  },
  tests: [
    {
      id: 'bt-1',
      name: 'Conflict check logic for time slots',
      category: 'unit',
      status: 'passed',
      assertion: 'Prevents overlapping booking on same resource',
      durationMs: 16,
    },
    {
      id: 'bt-2',
      name: 'Admin role verification',
      category: 'integration',
      status: 'passed',
      assertion: 'Ensures only admin can change resource capacity',
      durationMs: 31,
    },
  ],
  deployments: [
    {
      id: 'dep-bk-1',
      target: 'Vercel',
      status: 'ready',
      url: 'https://deskflow-booking.vercel.app',
      deployedAt: '2026-10-04T12:00:00Z',
      commitId: 'c-bk-02',
      logs: ['[Vercel] Ready at edge node in Tokyo.'],
    },
  ],
  storage: [],
  logs: [
    {
      id: 'log-bk-1',
      level: 'success',
      source: 'Build',
      message: 'Zero schema errors. Ready for production.',
      timestamp: '2026-10-04 12:00:00',
    },
  ],
  analytics: [
    { date: '10/01', visitors: 110, views: 420, apiCalls: 890, avgLatencyMs: 16 },
    { date: '10/02', visitors: 240, views: 880, apiCalls: 1800, avgLatencyMs: 15 },
    { date: '10/03', visitors: 390, views: 1350, apiCalls: 3100, avgLatencyMs: 14 },
    { date: '10/04', visitors: 580, views: 2100, apiCalls: 4900, avgLatencyMs: 13 },
    { date: '10/05', visitors: 820, views: 2950, apiCalls: 6800, avgLatencyMs: 13 },
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
          name: 'deskflow-booking',
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
      content: `# DeskFlow Booking & Admin 📅

リソース・会議室・座席予約管理SaaS。
`,
    },
    'src/App.tsx': {
      path: 'src/App.tsx',
      name: 'App.tsx',
      language: 'typescript',
      isFolder: false,
      updatedAt: Date.now(),
      content: `import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle2, Shield, Plus, AlertCircle, Building2 } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: 'available' | 'occupied';
  floor: string;
}

interface Booking {
  id: string;
  resourceId: string;
  userName: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

export default function DeskFlowApp() {
  const [resources, setResources] = useState<Resource[]>([
    { id: 'res-1', name: 'Boardroom A (大型スクリーン)', type: 'Conference Room', capacity: 12, status: 'available', floor: '4F' },
    { id: 'res-2', name: 'Focus Room 101', type: 'Private Pod', capacity: 2, status: 'occupied', floor: '3F' },
    { id: 'res-3', name: 'Open Desk 08', type: 'Hot Desk', capacity: 1, status: 'available', floor: '3F' },
    { id: 'res-4', name: 'Innovation Lab', type: 'Studio Room', capacity: 8, status: 'available', floor: '2F' },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'bk-1', resourceId: 'res-1', userName: '田中 健一 (CEO)', startTime: '13:00', endTime: '14:30', purpose: 'Q3 役員経営戦略会議' },
    { id: 'bk-2', resourceId: 'res-2', userName: '佐藤 恵 (Lead Dev)', startTime: '10:00', endTime: '12:00', purpose: 'AIモデルインテグレーション集中開発' },
  ]);

  const [selectedResource, setSelectedResource] = useState<string>('res-1');
  const [bookUserName, setBookUserName] = useState('');
  const [bookStartTime, setBookStartTime] = useState('15:00');
  const [bookEndTime, setBookEndTime] = useState('16:00');
  const [bookPurpose, setBookPurpose] = useState('');
  const [isAdminView, setIsAdminView] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookUserName.trim() || !bookPurpose.trim()) return;

    const newBooking: Booking = {
      id: \`bk-\${Date.now()}\`,
      resourceId: selectedResource,
      userName: bookUserName,
      startTime: bookStartTime,
      endTime: bookEndTime,
      purpose: bookPurpose,
    };

    setBookings([...bookings, newBooking]);
    setBookUserName('');
    setBookPurpose('');
    setNotification('予約が完了しました！カレンダー台帳に反映されました。');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight text-white">DeskFlow Booking & Admin</h1>
              <span className="text-[10px] text-slate-400">Enterprise Resource & Space Reservation SaaS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className={\`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border \${isAdminView ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}\`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdminView ? '管理者モード中' : '一般ユーザー'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-6 space-y-6">
        {notification && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Resource List & Quick Book */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4">
              <h2 className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
                <span>利用可能なリソース ({resources.length}箇所)</span>
                <span className="text-[11px] text-slate-400">リアルタイム空席状況</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resources.map((res) => {
                  const isSelected = selectedResource === res.id;
                  return (
                    <div
                      key={res.id}
                      onClick={() => setSelectedResource(res.id)}
                      className={\`p-3.5 rounded-xl border cursor-pointer transition-all \${isSelected ? 'bg-indigo-950/40 border-indigo-500/60 shadow-sm ring-1 ring-indigo-500/30' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}\`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-xs text-white">{res.name}</span>
                        <span className={\`text-[10px] px-1.5 py-0.5 rounded font-medium \${res.status === 'available' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}\`}>
                          {res.status === 'available' ? '予約可能' : '利用中'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          {res.floor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          定員 {res.capacity}名
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reservations Schedule */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4">
              <h2 className="text-xs font-semibold text-slate-300 mb-3">予約台帳 & スケジュール ({bookings.length}件)</h2>
              <div className="space-y-2.5">
                {bookings.map((b) => {
                  const res = resources.find(r => r.id === b.resourceId);
                  return (
                    <div key={b.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-white">{res?.name}</span>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded">
                            {b.startTime} - {b.endTime}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{b.userName} · {b.purpose}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-mono">確定済み</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 h-fit space-y-4">
            <h2 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>新規予約の作成</span>
            </h2>

            <form onSubmit={handleBooking} className="space-y-3.5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">予約者名</label>
                <input
                  type="text"
                  required
                  placeholder="例: 佐々木 拓実"
                  value={bookUserName}
                  onChange={(e) => setBookUserName(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">開始時刻</label>
                  <input
                    type="time"
                    value={bookStartTime}
                    onChange={(e) => setBookStartTime(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">終了時刻</label>
                  <input
                    type="time"
                    value={bookEndTime}
                    onChange={(e) => setBookEndTime(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">利用目的・会議名</label>
                <textarea
                  rows={2}
                  required
                  placeholder="例: クライアント向けシステムデモ・要件すり合わせ"
                  value={bookPurpose}
                  onChange={(e) => setBookPurpose(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              >
                予約を確定する
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
`,
    },
  },
};
