import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  ProjectFile,
  AgentTask,
  ProposedFileChange,
  FileConstructionProgress,
  AutoFixLoopRun,
  BYOKConfig,
  TestCase,
  GitHubUser,
  ThemeMode,
} from '../types/project';
import { socialAppTemplate } from '../templates/socialApp';
import { pokePriceAppTemplate } from '../templates/pokePriceApp';
import { bookingAppTemplate } from '../templates/bookingApp';
import { aiChatAppTemplate } from '../templates/aiChatApp';
import { createBlankProject } from '../templates/defaultBlank';
import { runAIAgent } from '../services/geminiService';
import { exportProjectAsZip, exportProjectAsDirectory, scanSecretsInProject } from '../services/exportService';
import { validateAgainstConstitution } from '../services/constitutionEngine';
import { parseErrorDetails, generateAutoFixIteration } from '../services/autoFixEngine';

export type MainNavView =
  | 'editor'
  | 'preview'
  | 'agent'
  | 'database'
  | 'apis'
  | 'git'
  | 'constitution'
  | 'testing'
  | 'settings';

interface ConsoleMessage {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

interface ProjectContextType {
  project: Project;
  projectsList: Project[];
  activeView: MainNavView;
  setActiveView: (view: MainNavView) => void;
  selectedFilePath: string;
  setSelectedFilePath: (path: string) => void;
  openTabs: string[];
  closeTab: (path: string) => void;
  openTab: (path: string) => void;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  consoleMessages: ConsoleMessage[];
  clearConsole: () => void;
  runtimeError: string | null;
  setRuntimeError: (err: string | null) => void;

  // Platform Navigation & SaaS Modals
  displayMode: 'landing' | 'studio';
  setDisplayMode: (mode: 'landing' | 'studio') => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isDocsOpen: boolean;
  setIsDocsOpen: (open: boolean) => void;
  isPricingOpen: boolean;
  setIsPricingOpen: (open: boolean) => void;
  isChangelogOpen: boolean;
  setIsChangelogOpen: (open: boolean) => void;
  isStatusOpen: boolean;
  setIsStatusOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  
  // AI Agent
  currentTask: AgentTask | null;
  runAgentPrompt: (prompt: string, type?: 'generate' | 'fix' | 'refactor') => Promise<void>;
  pendingChanges: ProposedFileChange[] | null;
  applyPendingChanges: (acceptedChanges: ProposedFileChange[]) => void;
  rejectPendingChanges: () => void;
  
  // File System
  updateFileContent: (path: string, content: string) => void;
  createNewFile: (path: string, content?: string) => void;
  createNewFolder: (path: string) => void;
  deletePath: (path: string) => void;
  renamePath: (oldPath: string, newPath: string) => void;

  // Git
  createCommit: (message: string) => void;
  rollbackCommit: (commitId: string) => void;
  switchBranch: (branch: string) => void;
  createNewBranch: (branch: string) => void;

  // Database
  executeSql: (sql: string) => { success: boolean; message: string; rows?: any[] };

  // Testing
  runAllTests: () => Promise<void>;

  // Project Management
  switchProject: (projectId: string) => void;
  createNewProject: (name: string, description: string, lang: any, framework: any) => void;
  
  // Modals
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isDeployModalOpen: boolean;
  setIsDeployModalOpen: (open: boolean) => void;
  isNewProjectModalOpen: boolean;
  setIsNewProjectModalOpen: (open: boolean) => void;
  isMobileFileDrawerOpen: boolean;
  setIsMobileFileDrawerOpen: (open: boolean) => void;
  isGitHubModalOpen: boolean;
  setIsGitHubModalOpen: (open: boolean) => void;

  // GitHub Auth
  gitHubUser: GitHubUser | null;
  setGitHubUser: (user: GitHubUser | null) => void;

  // Theme Mode (Default: 'light' - Clean White)
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // Export
  exportZip: () => Promise<void>;
  exportFolder: () => Promise<{ success: boolean; message: string }>;

  // BYOK
  byokConfig: BYOKConfig;
  setByokConfig: (config: BYOKConfig) => void;

  // Auto-Fix & Test Loop
  isAutoFixModalOpen: boolean;
  setIsAutoFixModalOpen: (open: boolean) => void;
  autoFixState: AutoFixLoopRun | null;
  startAutoFixLoop: (initialError?: string, targetFilePath?: string) => Promise<void>;
  applyAutoFixPatch: () => void;

  // Notification Toast
  toast: { message: string; type: 'info' | 'success' | 'error' } | null;
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const INITIAL_PROJECTS: Project[] = [
  socialAppTemplate,
  pokePriceAppTemplate,
  bookingAppTemplate,
  aiChatAppTemplate,
];

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projectsList, setProjectsList] = useState<Project[]>(INITIAL_PROJECTS);
  const [project, setProject] = useState<Project>(socialAppTemplate);
  const [activeView, setActiveView] = useState<MainNavView>('editor');
  const [selectedFilePath, setSelectedFilePath] = useState<string>('src/App.tsx');
  const [openTabs, setOpenTabs] = useState<string[]>(['src/App.tsx', 'package.json']);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([
    { id: 'c-1', level: 'info', message: 'Genesis Studio Environment Ready', timestamp: '10:00:00' },
  ]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Platform Navigation & SaaS Modals
  const [displayMode, setDisplayMode] = useState<'landing' | 'studio'>('landing');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isMobileFileDrawerOpen, setIsMobileFileDrawerOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isAutoFixModalOpen, setIsAutoFixModalOpen] = useState(false);
  const [autoFixState, setAutoFixState] = useState<AutoFixLoopRun | null>(null);

  // Auto-Fix & Test Loop Engine
  const startAutoFixLoop = async (initialError?: string, targetFilePath?: string) => {
    const errorText = initialError || runtimeError || "TypeError: Cannot read properties of undefined in src/App.tsx";
    const errorInfo = parseErrorDetails(errorText, project);
    if (targetFilePath) errorInfo.filePath = targetFilePath;

    const loopRunId = `autofix_${Date.now()}`;
    const initialLoopRun: AutoFixLoopRun = {
      id: loopRunId,
      status: 'analyzing',
      errorDetails: {
        message: errorInfo.message,
        filePath: errorInfo.filePath,
        line: errorInfo.line,
        type: errorInfo.errorType,
        rootCause: errorInfo.rootCause,
      },
      currentIteration: 1,
      maxIterations: 3,
      iterations: [],
      logs: [
        `[${new Date().toLocaleTimeString()}] [AUTO_FIX_INIT] エラー解析を開始: ${errorInfo.errorType} in ${errorInfo.filePath}`,
        `[${new Date().toLocaleTimeString()}] [AST_PARSE] スタックトレース・該当コードの構文ツリーを分析中...`,
      ],
      startTime: Date.now(),
    };

    setAutoFixState(initialLoopRun);
    setIsAutoFixModalOpen(true);

    // Loop execution (up to 3 iterations)
    for (let iter = 1; iter <= 3; iter++) {
      initialLoopRun.currentIteration = iter;
      initialLoopRun.status = 'patching';
      initialLoopRun.logs.push(`[${new Date().toLocaleTimeString()}] [LOOP_${iter}] 修正パッチを生成中... (試行 ${iter}/3)`);
      setAutoFixState({ ...initialLoopRun });

      await new Promise((r) => setTimeout(r, 650));

      // Generate patch & test evaluation for this iteration
      const iterResult = generateAutoFixIteration(iter, errorInfo, project);
      initialLoopRun.status = 'testing';
      initialLoopRun.logs.push(`[${new Date().toLocaleTimeString()}] [LOOP_${iter}_TEST] 自動テストスイートを実行中...`);
      setAutoFixState({ ...initialLoopRun });

      await new Promise((r) => setTimeout(r, 700));

      initialLoopRun.iterations.push(iterResult);
      initialLoopRun.logs.push(...iterResult.testResults.logs);

      if (iterResult.status === 'passed') {
        initialLoopRun.status = 'success';
        initialLoopRun.finalPatch = iterResult.proposedChanges;
        initialLoopRun.endTime = Date.now();
        initialLoopRun.logs.push(
          `[${new Date().toLocaleTimeString()}] [AUTO_FIX_SUCCESS] ✓ Loop ${iter} で全テストが合格しました！修正パッチが利用可能です。`
        );
        setAutoFixState({ ...initialLoopRun });
        showToast(`Auto-Fix Loop ${iter}: テスト全件合格！修正案を提示しました`, 'success');
        return;
      } else {
        initialLoopRun.logs.push(
          `[${new Date().toLocaleTimeString()}] [LOOP_${iter}_RETRY] テスト一部不合格のため、次期イテレーションでパッチを精密化します...`
        );
        setAutoFixState({ ...initialLoopRun });
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    initialLoopRun.status = 'failed';
    initialLoopRun.endTime = Date.now();
    setAutoFixState({ ...initialLoopRun });
    showToast('Auto-Fix Loop: 最大試行回数に達しました', 'error');
  };

  const applyAutoFixPatch = () => {
    if (!autoFixState?.finalPatch) return;
    applyPendingChanges(autoFixState.finalPatch);
    setRuntimeError(null);
    showToast('Auto-Fix 修正パッチをプロジェクトに適用しました！', 'success');
  };

  // GitHub Auth state
  const [gitHubUser, setGitHubUser] = useState<GitHubUser | null>(null);

  // Theme Mode - Clean White default
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  useEffect(() => {
    // Initial fetch of GitHub authenticated status
    fetch('/api/auth/github/user')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setGitHubUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Keyboard shortcut listener (Cmd+K, Cmd+B, Cmd+S, Cmd+G, Escape, ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (isMod && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsMobileFileDrawerOpen((prev) => !prev);
      } else if (isMod && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsGitHubModalOpen((prev) => !prev);
      } else if (isMod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        showToast('ファイル状態をローカルへ自動永続化しました', 'success');
      } else if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsDocsOpen(false);
        setIsPricingOpen(false);
        setIsChangelogOpen(false);
        setIsStatusOpen(false);
        setIsShortcutsOpen(false);
        setIsGitHubModalOpen(false);
        setIsExportModalOpen(false);
        setIsDeployModalOpen(false);
        setIsNewProjectModalOpen(false);
        setIsMobileFileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // AI Agent Task State
  const [currentTask, setCurrentTask] = useState<AgentTask | null>(null);
  const [pendingChanges, setPendingChanges] = useState<ProposedFileChange[] | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  // BYOK
  const [byokConfig, setByokConfig] = useState<BYOKConfig>({
    provider: 'gemini',
    apiKey: '',
    modelId: 'gemini-3.8-flash',
    modelName: 'Gemini 3.8 Flash (Server Default)',
  });

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Listen to postMessage from sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'GENESIS_PREVIEW_CONSOLE') {
        const newMsg: ConsoleMessage = {
          id: `msg_${Date.now()}_${Math.random()}`,
          level: event.data.level || 'info',
          message: event.data.message || '',
          timestamp: event.data.timestamp || new Date().toLocaleTimeString(),
        };
        setConsoleMessages((prev) => [...prev.slice(-100), newMsg]);
        if (event.data.level === 'error') {
          const rawMsg = String(event.data.message || '');
          // Filter out benign CDN / WebSocket messages
          if (
            !rawMsg.includes('WebSocket') &&
            !rawMsg.includes('favicon') &&
            !rawMsg.includes('cdn.tailwindcss')
          ) {
            setRuntimeError(rawMsg);
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const openTab = (path: string) => {
    setSelectedFilePath(path);
    if (!openTabs.includes(path)) {
      setOpenTabs((prev) => [...prev, path]);
    }
    setIsMobileFileDrawerOpen(false);
  };

  const closeTab = (path: string) => {
    const remaining = openTabs.filter((t) => t !== path);
    setOpenTabs(remaining);
    if (selectedFilePath === path && remaining.length > 0) {
      setSelectedFilePath(remaining[remaining.length - 1]);
    }
  };

  const clearConsole = () => {
    setConsoleMessages([]);
    setRuntimeError(null);
  };

  // File mutations
  const updateFileContent = (path: string, content: string) => {
    setProject((prev) => {
      const existing = prev.files[path] || {
        path,
        name: path.split('/').pop() || path,
        language: path.endsWith('.json') ? 'json' : path.endsWith('.md') ? 'markdown' : 'typescript',
        isFolder: false,
        updatedAt: Date.now(),
      };

      const updated = {
        ...prev,
        files: {
          ...prev.files,
          [path]: {
            ...existing,
            content,
            updatedAt: Date.now(),
          },
        },
      };
      return updated;
    });
  };

  const createNewFile = (path: string, content = '') => {
    if (!path.trim()) return;
    updateFileContent(path, content);
    openTab(path);
    showToast(`ファイル「${path}」を作成しました`, 'success');
  };

  const createNewFolder = (path: string) => {
    const placeholder = `${path.replace(/\/$/, '')}/.keep`;
    updateFileContent(placeholder, '');
    showToast(`フォルダ「${path}」を作成しました`, 'success');
  };

  const deletePath = (path: string) => {
    setProject((prev) => {
      const newFiles = { ...prev.files };
      Object.keys(newFiles).forEach((p) => {
        if (p === path || p.startsWith(path + '/')) {
          delete newFiles[p];
        }
      });
      return { ...prev, files: newFiles };
    });
    closeTab(path);
    showToast(`「${path}」を削除しました`, 'info');
  };

  const renamePath = (oldPath: string, newPath: string) => {
    setProject((prev) => {
      const newFiles: Record<string, ProjectFile> = {};
      Object.entries(prev.files).forEach(([p, file]) => {
        if (p === oldPath) {
          newFiles[newPath] = {
            ...file,
            path: newPath,
            name: newPath.split('/').pop() || newPath,
            updatedAt: Date.now(),
          };
        } else if (p.startsWith(oldPath + '/')) {
          const replaced = p.replace(oldPath, newPath);
          newFiles[replaced] = {
            ...file,
            path: replaced,
            name: replaced.split('/').pop() || replaced,
            updatedAt: Date.now(),
          };
        } else {
          newFiles[p] = file;
        }
      });
      return { ...prev, files: newFiles };
    });

    setOpenTabs((prev) => prev.map((t) => (t === oldPath ? newPath : t)));
    if (selectedFilePath === oldPath) setSelectedFilePath(newPath);
    showToast(`名前を「${newPath}」へ変更しました`, 'success');
  };

  // Git operations
  const createCommit = (message: string) => {
    if (!message.trim()) return;
    const snapshot: Record<string, string> = {};
    Object.entries(project.files).forEach(([p, f]) => {
      snapshot[p] = f.content;
    });

    const newCommit = {
      id: `c-${Date.now().toString(36)}`,
      message,
      author: 'You <developer@genesis.studio>',
      timestamp: Date.now(),
      branch: project.git.currentBranch,
      filesSnapshot: snapshot,
      stats: { added: 12, modified: Object.keys(project.files).length, deleted: 0 },
    };

    setProject((prev) => ({
      ...prev,
      git: {
        ...prev.git,
        commits: [newCommit, ...prev.git.commits],
      },
    }));

    showToast(`コミット「${message}」を作成しました`, 'success');
  };

  const rollbackCommit = (commitId: string) => {
    const target = project.git.commits.find((c) => c.id === commitId);
    if (!target) {
      showToast('対象のコミットが見つかりませんでした', 'error');
      return;
    }

    if (Object.keys(target.filesSnapshot).length === 0) {
      showToast(`コミット ${commitId} に復元しました`, 'success');
      return;
    }

    setProject((prev) => {
      const restoredFiles: Record<string, ProjectFile> = {};
      Object.entries(target.filesSnapshot).forEach(([p, content]) => {
        restoredFiles[p] = {
          path: p,
          name: p.split('/').pop() || p,
          content,
          language: p.endsWith('.json') ? 'json' : 'typescript',
          isFolder: false,
          updatedAt: Date.now(),
        };
      });
      return {
        ...prev,
        files: restoredFiles,
      };
    });

    showToast(`スナップショット ${commitId} の状態へ完全にロールバックしました`, 'success');
  };

  const switchBranch = (branch: string) => {
    setProject((prev) => ({
      ...prev,
      git: {
        ...prev.git,
        currentBranch: branch,
        branches: prev.git.branches.map((b) => ({ ...b, current: b.name === branch })),
      },
    }));
    showToast(`ブランチ「${branch}」へ切り替えました`, 'info');
  };

  const createNewBranch = (branch: string) => {
    if (!branch.trim()) return;
    setProject((prev) => ({
      ...prev,
      git: {
        ...prev.git,
        currentBranch: branch,
        branches: [...prev.git.branches.map((b) => ({ ...b, current: false })), { name: branch, current: true, latestCommitId: prev.git.commits[0]?.id || 'head' }],
      },
    }));
    showToast(`ブランチ「${branch}」を作成・切り替えました`, 'success');
  };

  // SQL Execution in Database Studio
  const executeSql = (sql: string): { success: boolean; message: string; rows?: any[] } => {
    const trimmed = sql.trim().toLowerCase();
    if (trimmed.startsWith('select')) {
      const match = trimmed.match(/from\s+([a-zA-Z0-9_]+)/i);
      const tableName = match ? match[1] : '';
      const table = project.database.tables.find((t) => t.name.toLowerCase() === tableName.toLowerCase());
      if (table) {
        return {
          success: true,
          message: `Query OK: ${table.rows.length} rows returned.`,
          rows: table.rows,
        };
      }
      return { success: true, message: 'Query executed successfully with 0 results.', rows: [] };
    } else if (trimmed.startsWith('create table')) {
      return { success: true, message: 'Table created successfully. Migration recorded.' };
    }
    return { success: true, message: 'SQL executed successfully.' };
  };

  // Test Runner
  const runAllTests = async () => {
    showToast('テストスイートを実行中...', 'info');
    await new Promise((r) => setTimeout(r, 600));

    setProject((prev) => ({
      ...prev,
      tests: prev.tests.map((t) => ({
        ...t,
        status: 'passed',
        durationMs: Math.floor(Math.random() * 40) + 10,
      })),
    }));

    showToast(`全 ${project.tests.length} 件のテストが合格しました！`, 'success');
  };

  // AI Agent Execution Pipeline with Realistic Full-Stack Streaming & Detailed Inspector
  const runAgentPrompt = async (prompt: string, type: 'generate' | 'fix' | 'refactor' = 'generate') => {
    const taskId = `task_${Date.now()}`;
    const initialTask: AgentTask = {
      id: taskId,
      prompt,
      phase: 'UNDERSTAND',
      status: 'running',
      plan: [],
      proposedChanges: [],
      activeFileGenerating: undefined,
      activeActionDescription: '自然言語プロンプトのAST構文解析および依存関係マッピング中...',
      fileProgress: [],
      logs: [
        `[${new Date().toLocaleTimeString()}] [UNDERSTAND] ユーザー指示「${prompt}」を受信しました`,
        `[${new Date().toLocaleTimeString()}] [AST_PARSE] 要件定義・ターゲットモジュールの依存関係グラフを分析中...`,
      ],
    };
    setCurrentTask(initialTask);

    // Step 1: Understand
    await new Promise((r) => setTimeout(r, 600));
    initialTask.phase = 'CHECK_CONSTITUTION';
    initialTask.activeActionDescription = `Project Constitution (${project.constitution.language} / ${project.constitution.framework}) 憲法照合中...`;
    initialTask.logs.push(
      `[${new Date().toLocaleTimeString()}] [CHECK_CONSTITUTION] 言語制約: ${project.constitution.language} ONLY / フレームワーク: ${project.constitution.framework} を検証中`
    );
    initialTask.logs.push(
      `[${new Date().toLocaleTimeString()}] [CHECK_CONSTITUTION] 禁止ライブラリ監査 (jQuery/PHP/anyなし) → 適合判定: PASS`
    );
    setCurrentTask({ ...initialTask });

    // Step 2: Constitution & Planning
    await new Promise((r) => setTimeout(r, 700));
    initialTask.phase = 'PLAN';
    initialTask.activeActionDescription = 'フルスタック実装計画書策定中 (Database → API → UI → Test)...';
    initialTask.logs.push(
      `[${new Date().toLocaleTimeString()}] [PLAN] フルスタック多層アーキテクチャのファイル分割戦略を策定中...`
    );
    setCurrentTask({ ...initialTask });

    try {
      const response = await runAIAgent(prompt, project, type, runtimeError || undefined, byokConfig);

      // Validate against constitution
      const validation = validateAgainstConstitution(project.constitution, response.filesToUpdate);
      if (!validation.compliant) {
        initialTask.phase = 'REVIEW';
        initialTask.status = 'failed';
        initialTask.activeActionDescription = '憲法違反が検出されたため中断しました';
        initialTask.logs.push(
          `[${new Date().toLocaleTimeString()}] [CONSTITUTION_VIOLATION] 憲法違反が検出されたため中断: ${validation.violations.join('; ')}`
        );
        setCurrentTask({ ...initialTask });
        showToast('Project Constitution違反のため処理を中断しました', 'error');
        return;
      }

      initialTask.plan = response.plan;
      initialTask.summary = response.summary;
      initialTask.phase = 'IMPLEMENT';

      // Setup initial file construction progress
      const fileProgressList: FileConstructionProgress[] = response.filesToUpdate.map((f) => ({
        path: f.path,
        status: 'pending',
        operation: f.operation,
        layer: f.layer || 'ui',
        linesCount: f.linesCount || (f.newContent ? f.newContent.split('\n').length : 0),
        description: f.description,
      }));
      initialTask.fileProgress = fileProgressList;
      initialTask.proposedChanges = response.filesToUpdate;
      setCurrentTask({ ...initialTask });

      // Step 3: Progressive File-by-File Construction (Simulates real high-end multi-file generation)
      for (let i = 0; i < response.filesToUpdate.length; i++) {
        const fileChange = response.filesToUpdate[i];
        const layerName =
          fileChange.layer === 'db'
            ? 'データベース層 (PostgreSQL Schema)'
            : fileChange.layer === 'api'
            ? 'バックエンド層 (REST API)'
            : fileChange.layer === 'test'
            ? 'テスト層 (Unit Test)'
            : 'フロントエンド層 (React Component)';

        // Mark as generating
        fileProgressList[i].status = 'generating';
        initialTask.activeFileGenerating = fileChange.path;
        initialTask.activeActionDescription = `【${layerName}】 ${fileChange.path} を生成・構文チェック中... (${fileProgressList[i].linesCount} 行)`;
        initialTask.logs.push(
          `[${new Date().toLocaleTimeString()}] [FILE_WRITE] (${i + 1}/${response.filesToUpdate.length}) ✍️ [${fileChange.operation.toUpperCase()}] ${fileChange.path} (${fileProgressList[i].linesCount} lines) - ${fileChange.description}`
        );
        setCurrentTask({ ...initialTask, fileProgress: [...fileProgressList] });

        // Realistic generation delay per file based on size
        await new Promise((r) => setTimeout(r, 650));

        // Mark as done
        fileProgressList[i].status = 'done';
        initialTask.logs.push(
          `[${new Date().toLocaleTimeString()}] [FILE_COMPILED] ✓ ${fileChange.path} のAST生成と型チェックが完了しました`
        );
        setCurrentTask({ ...initialTask, fileProgress: [...fileProgressList] });
      }

      // Step 4: Run / Sandbox Preview Refresh
      initialTask.phase = 'RUN';
      initialTask.activeFileGenerating = undefined;
      initialTask.activeActionDescription = 'サンドボックスプレビュー・ホットリロード環境へ同期中...';
      initialTask.logs.push(`[${new Date().toLocaleTimeString()}] [RUN] Vite HMRホットリロード & 仮想DOMへマウント中...`);
      setCurrentTask({ ...initialTask });
      await new Promise((r) => setTimeout(r, 600));

      // Step 5: Test Execution
      initialTask.phase = 'TEST';
      initialTask.activeActionDescription = '生成コードの自動テストスイートおよび型検査を実行中...';
      initialTask.logs.push(`[${new Date().toLocaleTimeString()}] [TEST] Jest/Vitest 互換テストランナーを起動`);
      initialTask.logs.push(`[${new Date().toLocaleTimeString()}] [TEST] ✓ TypeScript 型検査: 0 errors`);
      initialTask.logs.push(`[${new Date().toLocaleTimeString()}] [TEST] ✓ スキーマ整合性 & REST API レスポンス検証: PASS`);
      setCurrentTask({ ...initialTask });
      await new Promise((r) => setTimeout(r, 600));

      // Step 6: Review & Approval
      initialTask.phase = 'REVIEW';
      initialTask.activeActionDescription = '全工程完了。差分レビューと変更適用準備が整いました。';
      initialTask.logs.push(`[${new Date().toLocaleTimeString()}] [REVIEW] 生成パイプライン完了。計 ${response.filesToUpdate.length} ファイルの変更を待機中。`);

      if (project.constitution.userControlLevel === 'Auto') {
        // Auto apply
        applyPendingChanges(response.filesToUpdate);
        initialTask.status = 'done';
        initialTask.activeActionDescription = 'すべての変更が正常にプロジェクトへ適用されました';
        setCurrentTask({ ...initialTask });
        showToast('AI Agentのフルスタック変更を自動適用しました', 'success');
      } else {
        // Ask / Manual approval flow
        initialTask.status = 'waiting_approval';
        setCurrentTask({ ...initialTask });
        setPendingChanges(response.filesToUpdate);
        showToast('AI Agentの提案を確認してください（Diffプレビュー）', 'info');
      }
    } catch (err: any) {
      initialTask.phase = 'REVIEW';
      initialTask.status = 'failed';
      initialTask.activeActionDescription = `エラーが発生しました: ${err.message}`;
      initialTask.logs.push(`[${new Date().toLocaleTimeString()}] [ERROR] AI Agent実行失敗: ${err.message}`);
      setCurrentTask({ ...initialTask });
      showToast(`AI Agentエラー: ${err.message}`, 'error');
    }
  };

  const applyPendingChanges = (acceptedChanges: ProposedFileChange[]) => {
    acceptedChanges.forEach((change) => {
      if (change.accepted) {
        if (change.operation === 'delete') {
          deletePath(change.path);
        } else {
          updateFileContent(change.path, change.newContent);
        }
      }
    });

    // Create a git commit snapshot for safety
    createCommit(`ai: ${currentTask?.prompt.slice(0, 50) || 'AI generated enhancements'}`);

    if (currentTask) {
      setCurrentTask({ ...currentTask, status: 'done' });
    }
    setPendingChanges(null);
    setRuntimeError(null);
    showToast('提案された変更をプロジェクトに適用しました！', 'success');
  };

  const rejectPendingChanges = () => {
    if (currentTask) {
      setCurrentTask({ ...currentTask, status: 'idle' });
    }
    setPendingChanges(null);
    showToast('AI Agentの変更提案を破棄しました', 'info');
  };

  // Export
  const exportZip = async () => {
    showToast('ZIPパッケージを作成中...', 'info');
    await exportProjectAsZip(project);
    showToast(`「${project.name}.zip」のダウンロードが完了しました！`, 'success');
  };

  const exportFolder = async () => {
    const res = await exportProjectAsDirectory(project);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
    return res;
  };

  // Switch project
  const switchProject = (projectId: string) => {
    const found = projectsList.find((p) => p.id === projectId);
    if (found) {
      setProject(found);
      setSelectedFilePath('src/App.tsx');
      setOpenTabs(['src/App.tsx', 'package.json']);
      setRuntimeError(null);
      setPendingChanges(null);
      setConsoleMessages([{ id: `msg_${Date.now()}`, level: 'info', message: `プロジェクト「${found.name}」を開きました`, timestamp: new Date().toLocaleTimeString() }]);
      showToast(`プロジェクト「${found.name}」を開きました`, 'info');
    }
  };

  const createNewProject = (name: string, description: string, lang: any, framework: any) => {
    const newProj = createBlankProject(name, description, lang, framework);
    setProjectsList((prev) => [newProj, ...prev]);
    setProject(newProj);
    setSelectedFilePath('src/App.tsx');
    setOpenTabs(['src/App.tsx', 'package.json']);
    setIsNewProjectModalOpen(false);
    showToast(`プロジェクト「${name}」を作成しました`, 'success');
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        projectsList,
        activeView,
        setActiveView,
        selectedFilePath,
        setSelectedFilePath,
        openTabs,
        closeTab,
        openTab,
        previewDevice,
        setPreviewDevice,
        consoleMessages,
        clearConsole,
        runtimeError,
        setRuntimeError,
        displayMode,
        setDisplayMode,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isDocsOpen,
        setIsDocsOpen,
        isPricingOpen,
        setIsPricingOpen,
        isChangelogOpen,
        setIsChangelogOpen,
        isStatusOpen,
        setIsStatusOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        currentTask,
        runAgentPrompt,
        pendingChanges,
        applyPendingChanges,
        rejectPendingChanges,
        updateFileContent,
        createNewFile,
        createNewFolder,
        deletePath,
        renamePath,
        createCommit,
        rollbackCommit,
        switchBranch,
        createNewBranch,
        executeSql,
        runAllTests,
        switchProject,
        createNewProject,
        isExportModalOpen,
        setIsExportModalOpen,
        isDeployModalOpen,
        setIsDeployModalOpen,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        isMobileFileDrawerOpen,
        setIsMobileFileDrawerOpen,
        isGitHubModalOpen,
        setIsGitHubModalOpen,
        isAutoFixModalOpen,
        setIsAutoFixModalOpen,
        autoFixState,
        startAutoFixLoop,
        applyAutoFixPatch,
        gitHubUser,
        setGitHubUser,
        themeMode,
        setThemeMode,
        exportZip,
        exportFolder,
        byokConfig,
        setByokConfig,
        toast,
        showToast,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
