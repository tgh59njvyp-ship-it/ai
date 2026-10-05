export type ProgrammingLanguage = 'TypeScript' | 'JavaScript' | 'Python' | 'Go' | 'Rust';
export type Framework = 'Next.js' | 'React' | 'Vue' | 'Nuxt' | 'SvelteKit' | 'FastAPI' | 'Express';
export type Runtime = 'Node.js' | 'Bun' | 'Deno' | 'Python' | 'Go';
export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';
export type UserControlLevel = 'Auto' | 'Ask' | 'Manual';
export type AppDisplayMode = 'landing' | 'studio' | 'docs' | 'pricing' | 'changelog';

export interface ProjectConstitution {
  language: ProgrammingLanguage;
  allowedLanguages: string[];
  forbiddenLanguages: string[];
  framework: Framework;
  runtime: Runtime;
  runtimeVersion: string;
  packageManager: PackageManager;
  uiSystem: string;
  database: string;
  auth: string;
  dependencyControl: {
    allowed: string[];
    requiresApproval: string[];
    blocked: string[];
  };
  rules: string[];
  userControlLevel: UserControlLevel;
}

export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  language: string;
  isFolder: boolean;
  updatedAt: number;
}

export interface DBColumn {
  name: string;
  type: string;
  primaryKey?: boolean;
  nullable?: boolean;
  defaultValue?: string;
  isForeignKey?: boolean;
  foreignTable?: string;
}

export interface DBTable {
  id: string;
  name: string;
  description?: string;
  columns: DBColumn[];
  rows: Record<string, any>[];
}

export interface DBMigration {
  id: string;
  name: string;
  sql: string;
  appliedAt: string;
}

export interface DatabaseSchema {
  tables: DBTable[];
  migrations: DBMigration[];
}

export interface ApiParam {
  key: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authRequired: boolean;
  role?: string;
  params: ApiParam[];
  requestBodySample?: string;
  responseSample: string;
  handlerCode?: string;
}

export interface GitCommit {
  id: string;
  message: string;
  timestamp: number;
  author: string;
  branch: string;
  filesSnapshot: Record<string, string>;
  stats: {
    added: number;
    modified: number;
    deleted: number;
  };
}

export interface GitBranch {
  name: string;
  current: boolean;
  latestCommitId: string;
}

export interface GitState {
  currentBranch: string;
  branches: GitBranch[];
  commits: GitCommit[];
  remoteRepoUrl?: string;
  isSynced: boolean;
  lastSyncAt?: string;
}

export interface TestCase {
  id: string;
  name: string;
  category: 'unit' | 'integration' | 'api' | 'ui';
  status: 'passed' | 'failed' | 'running' | 'idle';
  assertion: string;
  durationMs: number;
  errorMessage?: string;
}

export interface DeploymentRecord {
  id: string;
  target: 'Vercel' | 'Netlify' | 'Cloudflare' | 'Railway' | 'Render';
  status: 'ready' | 'building' | 'failed' | 'queued';
  url: string;
  deployedAt: string;
  commitId: string;
  logs: string[];
}

export interface StorageFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
}

export interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error' | 'success';
  source: 'App' | 'Build' | 'API' | 'Database' | 'Agent' | 'Git';
  message: string;
  timestamp: string;
}

export interface AnalyticsMetric {
  date: string;
  visitors: number;
  views: number;
  apiCalls: number;
  avgLatencyMs: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: number;
  updatedAt: number;
  constitution: ProjectConstitution;
  files: Record<string, ProjectFile>;
  database: DatabaseSchema;
  apis: ApiEndpoint[];
  git: GitState;
  tests: TestCase[];
  deployments: DeploymentRecord[];
  storage: StorageFile[];
  logs: LogEntry[];
  analytics: AnalyticsMetric[];
}

export type AgentPhase =
  | 'IDLE'
  | 'UNDERSTAND'
  | 'CHECK_CONSTITUTION'
  | 'PLAN'
  | 'IMPLEMENT'
  | 'RUN'
  | 'TEST'
  | 'INSPECT'
  | 'FIX'
  | 'REVIEW';

export interface ProposedFileChange {
  path: string;
  originalContent?: string;
  newContent: string;
  operation: 'create' | 'update' | 'delete';
  description: string;
  accepted: boolean;
  layer?: 'db' | 'api' | 'ui' | 'config' | 'test';
  linesCount?: number;
}

export interface FileConstructionProgress {
  path: string;
  status: 'pending' | 'generating' | 'done' | 'failed';
  operation: 'create' | 'update' | 'delete';
  layer: 'db' | 'api' | 'ui' | 'config' | 'test';
  linesCount: number;
  description: string;
}

export interface AgentTask {
  id: string;
  prompt: string;
  phase: AgentPhase;
  status: 'idle' | 'running' | 'waiting_approval' | 'done' | 'failed';
  summary?: string;
  plan: string[];
  activeFileGenerating?: string;
  activeActionDescription?: string;
  fileProgress?: FileConstructionProgress[];
  constitutionReport?: {
    compliant: boolean;
    notes: string;
    violations?: string[];
  };
  proposedChanges: ProposedFileChange[];
  testResults?: { passed: number; failed: number };
  logs: string[];
}

export interface AutoFixIteration {
  iteration: number;
  stage: 'analyzing' | 'patching' | 'testing' | 'evaluating';
  patchDescription: string;
  targetFile: string;
  proposedChanges: ProposedFileChange[];
  testResults: {
    passed: number;
    failed: number;
    total: number;
    tests: { name: string; status: 'passed' | 'failed'; durationMs: number; errorMessage?: string }[];
    logs: string[];
  };
  diagnostics: string;
  status: 'passed' | 'failed' | 'running';
}

export interface AutoFixLoopRun {
  id: string;
  status: 'idle' | 'analyzing' | 'patching' | 'testing' | 'success' | 'failed';
  errorDetails: {
    message: string;
    stack?: string;
    filePath?: string;
    line?: number;
    type?: string;
    rootCause?: string;
  };
  currentIteration: number;
  maxIterations: number;
  iterations: AutoFixIteration[];
  finalPatch?: ProposedFileChange[];
  logs: string[];
  startTime: number;
  endTime?: number;
}

export interface BYOKConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl?: string;
  modelId: string;
  modelName: string;
}

export type ThemeMode = 'light' | 'dark';

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  email?: string;
  public_repos?: number;
  followers?: number;
  token?: string;
}

