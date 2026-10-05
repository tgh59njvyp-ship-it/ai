import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { X, FileCode, FileJson, FileText, File } from 'lucide-react';

export const EditorTabs: React.FC = () => {
  const { openTabs, selectedFilePath, setSelectedFilePath, closeTab } = useProject();

  const getTabIcon = (path: string) => {
    if (path.endsWith('.tsx') || path.endsWith('.ts')) return <FileCode className="w-3.5 h-3.5 text-cyan-400" />;
    if (path.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-amber-400" />;
    if (path.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-blue-400" />;
    return <File className="w-3.5 h-3.5 text-slate-400" />;
  };

  if (openTabs.length === 0) return null;

  return (
    <div className="h-9 bg-slate-100/80 border-b border-slate-200 flex items-center overflow-x-auto select-none shrink-0 px-1 gap-1">
      {openTabs.map((path) => {
        const isActive = selectedFilePath === path;
        const fileName = path.split('/').pop() || path;

        return (
          <div
            key={path}
            onClick={() => setSelectedFilePath(path)}
            className={`group h-7 px-2.5 rounded-md flex items-center gap-2 text-xs cursor-pointer transition-colors border ${
              isActive
                ? 'bg-white text-cyan-800 border-slate-200 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent'
            }`}
          >
            {getTabIcon(path)}
            <span className="truncate max-w-[120px]">{fileName}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(path);
              }}
              className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
