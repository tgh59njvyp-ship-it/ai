import React, { useState } from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Header } from './components/Header';
import { SidebarNav } from './components/SidebarNav';
import { FileTree } from './components/FileExplorer/FileTree';
import { CodeEditor } from './components/CodeEditor/CodeEditor';
import { DiffViewer } from './components/CodeEditor/DiffViewer';
import { LivePreview } from './components/Preview/LivePreview';
import { AgentChatPanel } from './components/AIAgent/AgentChatPanel';
import { DatabaseStudio } from './components/DatabaseStudio/DatabaseStudio';
import { ApiWorkbench } from './components/ApiWorkbench/ApiWorkbench';
import { GitManager } from './components/GitManager/GitManager';
import { ConstitutionEditor } from './components/Constitution/ConstitutionEditor';
import { TestingStudio } from './components/TestingStudio/TestingStudio';
import { SettingsModal } from './components/Settings/SettingsModal';
import { ExportModal } from './components/Export/ExportModal';
import { DeploymentModal } from './components/Deployment/DeploymentModal';
import { ProjectModal } from './components/ProjectDashboard/ProjectModal';
import { LandingPage } from './components/Landing/LandingPage';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { DocsModal } from './components/Docs/DocsModal';
import { ChangelogModal } from './components/Changelog/ChangelogModal';
import { StatusModal } from './components/Status/StatusModal';
import { ShortcutsModal } from './components/Shortcuts/ShortcutsModal';
import { AutoFixModal } from './components/AutoFix/AutoFixModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { GitHubAuthModal } from './components/Auth/GitHubAuthModal';
import { Columns, Square, CheckCircle2, AlertCircle, Info } from 'lucide-react';

function StudioWorkspace() {
  const {
    activeView,
    pendingChanges,
    applyPendingChanges,
    rejectPendingChanges,
    isMobileFileDrawerOpen,
    setIsMobileFileDrawerOpen,
  } = useProject();

  const [isSplitMode, setIsSplitMode] = useState<boolean>(true);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-100 text-slate-800 select-none">
      {/* Top Universal Header */}
      <Header />

      {/* Main OS Layout: Sidebar Dock + Active View Area */}
      <div className="flex-1 flex overflow-hidden pb-14 md:pb-0">
        {/* Vertical Dock (hidden on mobile, replaced by MobileBottomNav) */}
        <SidebarNav />

        {/* View Switcher Container */}
        <div className="flex-1 flex overflow-hidden relative bg-white">
          {activeView === 'editor' && (
            <div className="flex-1 flex overflow-hidden relative">
              {/* Desktop File Explorer Tree */}
              <div className="hidden md:flex h-full">
                <FileTree />
              </div>

              {/* Mobile Slide-over Drawer for File Explorer */}
              {isMobileFileDrawerOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
                  <div className="w-72 h-full max-w-[85vw] shadow-2xl animate-slideRight bg-white">
                    <FileTree />
                  </div>
                  <div
                    className="flex-1"
                    onClick={() => setIsMobileFileDrawerOpen(false)}
                  />
                </div>
              )}

              {/* Code Editor */}
              <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-200 relative bg-white">
                {/* Split Toggle in Editor Header (Desktop Only) */}
                <div className="hidden md:flex absolute top-2 right-24 z-10 items-center gap-1 bg-white/95 border border-slate-200 rounded-md p-0.5 shadow-xs">
                  <button
                    onClick={() => setIsSplitMode(false)}
                    title="エディタ単体表示"
                    className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                      !isSplitMode ? 'bg-slate-100 text-cyan-700' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsSplitMode(true)}
                    title="エディタ + プレビュー分割表示"
                    className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                      isSplitMode ? 'bg-slate-100 text-cyan-700' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                  </button>
                </div>

                <CodeEditor />
              </div>

              {/* Side-by-side Live Preview if Split is enabled (Desktop Only) */}
              {isSplitMode && (
                <div className="flex-1 hidden md:flex flex-col h-full overflow-hidden bg-slate-50">
                  <LivePreview />
                </div>
              )}
            </div>
          )}

          {activeView === 'preview' && <LivePreview />}

          {activeView === 'agent' && <AgentChatPanel />}

          {activeView === 'database' && <DatabaseStudio />}

          {activeView === 'apis' && <ApiWorkbench />}

          {activeView === 'git' && <GitManager />}

          {activeView === 'constitution' && <ConstitutionEditor />}

          {activeView === 'testing' && <TestingStudio />}

          {activeView === 'settings' && <SettingsModal />}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Diff Review Modal when AI proposes modifications */}
      {pendingChanges && (
        <DiffViewer
          proposedChanges={pendingChanges}
          onAccept={applyPendingChanges}
          onReject={rejectPendingChanges}
        />
      )}
    </div>
  );
}

function MainAppShell() {
  const { displayMode, toast, isGitHubModalOpen, setIsGitHubModalOpen } = useProject();

  return (
    <>
      {displayMode === 'landing' ? <LandingPage /> : <StudioWorkspace />}

      {/* Global Modals & Utilities */}
      <GitHubAuthModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
      <CommandPalette />
      <DocsModal />
      <ChangelogModal />
      <StatusModal />
      <ShortcutsModal />
      <AutoFixModal />
      <ExportModal />
      <DeploymentModal />
      <ProjectModal />

      {/* Global Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xl animate-fadeIn">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-600 shrink-0" />}
          <span className="text-slate-800 font-medium">{toast.message}</span>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <MainAppShell />
    </ProjectProvider>
  );
}
