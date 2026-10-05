import React from 'react';
import { useProject, MainNavView } from '../context/ProjectContext';
import {
  Code2,
  Sparkles,
  Eye,
  Database,
  Webhook,
  GitBranch,
  ShieldCheck,
  CheckSquare,
  Settings,
  Terminal,
} from 'lucide-react';

interface NavItem {
  id: MainNavView;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const SidebarNav: React.FC = () => {
  const { activeView, setActiveView, project, currentTask, runtimeError } = useProject();

  const navItems: NavItem[] = [
    { id: 'editor', label: 'Code Editor & Files', icon: Code2 },
    {
      id: 'agent',
      label: 'AI Agent Architect',
      icon: Sparkles,
      badge: currentTask?.status === 'running' ? '●' : undefined,
    },
    { id: 'preview', label: 'Live Interactive Preview', icon: Eye },
    {
      id: 'database',
      label: 'Database Studio',
      icon: Database,
      badge: project.database.tables.length,
    },
    {
      id: 'apis',
      label: 'API Workbench',
      icon: Webhook,
      badge: project.apis.length,
    },
    {
      id: 'git',
      label: 'Git & Version Control',
      icon: GitBranch,
      badge: project.git.commits.length,
    },
    { id: 'constitution', label: 'Project Constitution', icon: ShieldCheck },
    {
      id: 'testing',
      label: 'Testing & Quality',
      icon: CheckSquare,
      badge: project.tests.length,
    },
    { id: 'settings', label: 'Settings & BYOK', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex w-13 bg-slate-50 border-r border-slate-200 flex-col items-center py-2.5 shrink-0 select-none z-10 shadow-xs">
      <div className="flex-1 space-y-1 w-full px-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              title={item.label}
              className={`w-full h-10 rounded-xl flex items-center justify-center relative transition-all group cursor-pointer ${
                isActive
                  ? 'bg-white text-cyan-700 font-semibold shadow-xs border border-slate-200/90'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-cyan-600 rounded-r-full shadow-xs shadow-cyan-500" />
              )}

              {/* Badge */}
              {item.badge !== undefined && (
                <span
                  className={`absolute top-1.5 right-1.5 text-[9px] px-1 py-0.2 rounded-full font-mono font-bold leading-none ${
                    item.id === 'agent' && currentTask?.status === 'running'
                      ? 'bg-cyan-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip on hover */}
              <div className="absolute left-full ml-2.5 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg shadow-xl border border-slate-800 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Status Indicator */}
      <div className="pt-2 border-t border-slate-200 w-full flex justify-center">
        <div
          title={runtimeError ? `Error: ${runtimeError}` : 'Runtime Healthy'}
          className={`w-2.5 h-2.5 rounded-full ${
            runtimeError ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
          }`}
        />
      </div>
    </aside>
  );
};
