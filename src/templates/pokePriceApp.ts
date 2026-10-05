import { Project } from '../types/project';

export const pokePriceAppTemplate: Project = {
  id: 'proj_poke_price',
  name: 'PokePrice Vault',
  description: 'ポケモンカード相場価格追跡 & ポートフォリオ資産管理システム (価格チャート・レア度フィルター・DB・API完備)',
  icon: 'TrendingUp',
  createdAt: Date.now() - 86400000 * 2,
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
      requiresApproval: ['recharts', 'chart.js'],
      blocked: ['unverified-npm-pkg'],
    },
    rules: [
      'Strict TypeScript only; no untyped JS.',
      'Maintain price history schemas and decimal precision.',
      'Keep currency formatting accurate (JPY ¥).',
      'No dead buttons or fake indicators.',
      'Full exportability with zero platform vendor lock-in.',
    ],
    userControlLevel: 'Ask',
  },
  database: {
    tables: [
      {
        id: 'tbl_cards',
        name: 'pokemon_cards',
        description: 'カードマスターデータと現在の市場価格',
        columns: [
          { name: 'id', type: 'VARCHAR(32)', primaryKey: true },
          { name: 'card_number', type: 'VARCHAR(20)', nullable: false },
          { name: 'name_ja', type: 'VARCHAR(100)', nullable: false },
          { name: 'name_en', type: 'VARCHAR(100)' },
          { name: 'set_name', type: 'VARCHAR(100)', nullable: false },
          { name: 'rarity', type: 'VARCHAR(20)', nullable: false },
          { name: 'current_price_jpy', type: 'INTEGER', nullable: false },
          { name: 'change_24h_pct', type: 'NUMERIC(5,2)', defaultValue: '0.00' },
          { name: 'image_url', type: 'TEXT' },
        ],
        rows: [
          {
            id: 'card-001',
            card_number: '151/165',
            name_ja: 'リザードンex SAR',
            name_en: 'Charizard ex SAR',
            set_name: 'ポケモンカード151',
            rarity: 'SAR',
            current_price_jpy: 42800,
            change_24h_pct: 3.8,
            image_url: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=300',
          },
          {
            id: 'card-002',
            card_number: '205/165',
            name_ja: 'ミュウex UR',
            name_en: 'Mew ex UR',
            set_name: 'ポケモンカード151',
            rarity: 'UR',
            current_price_jpy: 18500,
            change_24h_pct: -1.2,
            image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300',
          },
          {
            id: 'card-003',
            card_number: '085/071',
            name_ja: 'ナンジャモ SAR',
            name_en: 'Iono SAR',
            set_name: 'クレイバースト',
            rarity: 'SAR',
            current_price_jpy: 89000,
            change_24h_pct: 6.4,
            image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300',
          },
          {
            id: 'card-004',
            card_number: '096/069',
            name_ja: 'ピカチュウ AR',
            name_en: 'Pikachu AR',
            set_name: 'VSTARユニバース',
            rarity: 'AR',
            current_price_jpy: 22000,
            change_24h_pct: 1.5,
            image_url: 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?w=300',
          },
        ],
      },
      {
        id: 'tbl_portfolio',
        name: 'user_portfolio',
        description: 'ユーザーが保有するカードと取得価格',
        columns: [
          { name: 'id', type: 'UUID', primaryKey: true },
          { name: 'card_id', type: 'VARCHAR(32)', isForeignKey: true, foreignTable: 'pokemon_cards' },
          { name: 'purchase_price_jpy', type: 'INTEGER', nullable: false },
          { name: 'quantity', type: 'INTEGER', defaultValue: '1' },
          { name: 'acquired_date', type: 'DATE', defaultValue: 'CURRENT_DATE' },
        ],
        rows: [
          {
            id: 'pf-1',
            card_id: 'card-001',
            purchase_price_jpy: 38000,
            quantity: 1,
            acquired_date: '2026-08-10',
          },
          {
            id: 'pf-2',
            card_id: 'card-003',
            purchase_price_jpy: 75000,
            quantity: 1,
            acquired_date: '2026-07-22',
          },
        ],
      },
    ],
    migrations: [
      {
        id: 'mig_poke_init',
        name: '20261002_poke_tables.sql',
        sql: `CREATE TABLE pokemon_cards (
  id VARCHAR(32) PRIMARY KEY,
  card_number VARCHAR(20) NOT NULL,
  name_ja VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  set_name VARCHAR(100) NOT NULL,
  rarity VARCHAR(20) NOT NULL,
  current_price_jpy INTEGER NOT NULL,
  change_24h_pct NUMERIC(5,2) DEFAULT 0.00,
  image_url TEXT
);

CREATE TABLE user_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id VARCHAR(32) REFERENCES pokemon_cards(id),
  purchase_price_jpy INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  acquired_date DATE DEFAULT CURRENT_DATE
);`,
        appliedAt: '2026-10-02 14:00:00 UTC',
      },
    ],
  },
  apis: [
    {
      id: 'api_get_cards',
      name: 'Search & List Cards',
      method: 'GET',
      path: '/api/v1/cards',
      description: 'カード一覧と市場価格の検索・フィルタリング',
      authRequired: false,
      params: [
        { key: 'q', type: 'string', required: false, description: 'カード名または番号' },
        { key: 'rarity', type: 'string', required: false, description: 'SAR, UR, ARなど' },
      ],
      responseSample: JSON.stringify(
        {
          success: true,
          cards: [
            { id: 'card-001', name_ja: 'リザードンex SAR', current_price_jpy: 42800 },
          ],
        },
        null,
        2
      ),
      handlerCode: `export async function GET(req: Request) {
  // Query db for matching cards
  return Response.json({ success: true, count: 4, cards: [] });
}`,
    },
  ],
  git: {
    currentBranch: 'main',
    branches: [{ name: 'main', current: true, latestCommitId: 'c-poke-02' }],
    commits: [
      {
        id: 'c-poke-02',
        message: 'feat: add portfolio profit/loss calculation and rarity filter chips',
        author: 'Genesis AI Agent <agent@genesis.studio>',
        timestamp: Date.now() - 3600000 * 12,
        branch: 'main',
        filesSnapshot: {},
        stats: { added: 180, modified: 12, deleted: 0 },
      },
      {
        id: 'c-poke-01',
        message: 'chore: initial commit of PokePrice Vault with PostgreSQL migration',
        author: 'Genesis AI Agent <agent@genesis.studio>',
        timestamp: Date.now() - 3600000 * 48,
        branch: 'main',
        filesSnapshot: {},
        stats: { added: 420, modified: 0, deleted: 0 },
      },
    ],
    remoteRepoUrl: 'https://github.com/developer/pokeprice-vault.git',
    isSynced: true,
  },
  tests: [
    {
      id: 'pt-1',
      name: 'Portfolio ROI Calculation',
      category: 'unit',
      status: 'passed',
      assertion: 'Verified accurate JPY profit/loss percentage calculation',
      durationMs: 12,
    },
    {
      id: 'pt-2',
      name: 'Rarity Filter Query',
      category: 'api',
      status: 'passed',
      assertion: 'Filtering by SAR returns only SAR rarity items',
      durationMs: 22,
    },
  ],
  deployments: [
    {
      id: 'dep-poke-1',
      target: 'Vercel',
      status: 'ready',
      url: 'https://pokeprice-vault.vercel.app',
      deployedAt: '2026-10-04T15:00:00Z',
      commitId: 'c-poke-02',
      logs: ['[Vercel] Deployed in 2.1s with edge caching'],
    },
  ],
  storage: [],
  logs: [
    {
      id: 'log-poke-1',
      level: 'info',
      source: 'App',
      message: 'Card market data cache refreshed.',
      timestamp: '2026-10-05 02:00:00',
    },
  ],
  analytics: [
    { date: '10/01', visitors: 340, views: 1200, apiCalls: 3100, avgLatencyMs: 14 },
    { date: '10/02', visitors: 610, views: 2400, apiCalls: 6200, avgLatencyMs: 15 },
    { date: '10/03', visitors: 940, views: 3900, apiCalls: 8900, avgLatencyMs: 13 },
    { date: '10/04', visitors: 1420, views: 5600, apiCalls: 12400, avgLatencyMs: 12 },
    { date: '10/05', visitors: 1850, views: 7200, apiCalls: 16100, avgLatencyMs: 12 },
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
          name: 'pokeprice-vault',
          version: '1.0.0',
          private: true,
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'tsc && vite build',
          },
          dependencies: {
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            'lucide-react': '^0.546.0',
          },
          devDependencies: {
            typescript: '^5.7.0',
            vite: '^6.0.0',
            tailwindcss: '^4.0.0',
          },
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
      content: `# PokePrice Vault ⚡

ポケモンカード相場価格追跡 & ポートフォリオ資産管理システム。

## Quick Start
\`\`\`bash
pnpm install
pnpm dev
\`\`\`
`,
    },
    'src/App.tsx': {
      path: 'src/App.tsx',
      name: 'App.tsx',
      language: 'typescript',
      isFolder: false,
      updatedAt: Date.now(),
      content: `import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, Wallet, ShieldCheck, Sparkles, Filter } from 'lucide-react';

interface CardItem {
  id: string;
  name: string;
  set: string;
  rarity: string;
  price: number;
  change: number;
  owned: boolean;
  purchasePrice?: number;
}

export default function PokePriceApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('ALL');
  const [cards, setCards] = useState<CardItem[]>([
    { id: '1', name: 'リザードンex SAR (151/165)', set: 'ポケモンカード151', rarity: 'SAR', price: 42800, change: 3.8, owned: true, purchasePrice: 38000 },
    { id: '2', name: 'ナンジャモ SAR (085/071)', set: 'クレイバースト', rarity: 'SAR', price: 89000, change: 6.4, owned: true, purchasePrice: 75000 },
    { id: '3', name: 'ミュウex UR (205/165)', set: 'ポケモンカード151', rarity: 'UR', price: 18500, change: -1.2, owned: false },
    { id: '4', name: 'ピカチュウ AR (096/069)', set: 'VSTARユニバース', rarity: 'AR', price: 22000, change: 1.5, owned: false },
    { id: '5', name: 'ギラティナV SA (111/100)', set: 'ロストアビス', rarity: 'SA', price: 98000, change: 4.2, owned: false },
  ]);

  const filteredCards = cards.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.set.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRarity = selectedRarity === 'ALL' || c.rarity === selectedRarity;
    return matchSearch && matchRarity;
  });

  // Calculate portfolio totals
  const ownedCards = cards.filter(c => c.owned);
  const totalValue = ownedCards.reduce((acc, c) => acc + c.price, 0);
  const totalCost = ownedCards.reduce((acc, c) => acc + (c.purchasePrice || c.price), 0);
  const totalProfit = totalValue - totalCost;
  const profitPct = totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight text-white">PokePrice Vault</h1>
              <span className="text-[10px] text-slate-400">Real-time Pokemon Card Market & Portfolio</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Live API Connected</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-6 space-y-6">
        {/* Portfolio Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>保有資産評価額</span>
              <Wallet className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              ¥{totalValue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">保有カード: {ownedCards.length}枚</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>含み損益 (未実現)</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              +¥{totalProfit.toLocaleString()} ({profitPct}%)
            </div>
            <div className="text-[11px] text-slate-500 mt-1">取得原価: ¥{totalCost.toLocaleString()}</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>市場トレンド (24H)</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Bullish</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">+3.6%</div>
            <div className="text-[11px] text-slate-500 mt-1">集計対象: 1,420取引 / 本日</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="カード名、型番、収録パックで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'SAR', 'UR', 'AR', 'SA'].map((rarity) => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={\`px-3 py-1 text-xs rounded-lg transition-colors shrink-0 \${selectedRarity === rarity ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'}\`}
              >
                {rarity}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Table / Grid */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">相場ランキング & 保有状況 ({filteredCards.length}件)</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {filteredCards.map((card) => (
              <div key={card.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400">
                    {card.rarity}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white">{card.name}</span>
                      {card.owned && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                          保有中
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{card.set}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-semibold text-sm text-white">
                    ¥{card.price.toLocaleString()}
                  </div>
                  <div className={\`text-xs font-mono flex items-center justify-end gap-0.5 \${card.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}\`}>
                    {card.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{card.change >= 0 ? \`+\${card.change}%\` : \`\${card.change}%\`}</span>
                  </div>
                </div>
              </div>
            ))}
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
