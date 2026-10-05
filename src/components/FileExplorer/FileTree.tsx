import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  FileCode,
  FileJson,
  FileText,
  File,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Download,
  Search,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';

export const FileTree: React.FC = () => {
  const {
    project,
    selectedFilePath,
    openTab,
    createNewFile,
    createNewFolder,
    deletePath,
    renamePath,
    showToast,
    isMobileFileDrawerOpen,
    setIsMobileFileDrawerOpen,
  } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const toggleFolder = (folderPath: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const getFileIcon = (path: string) => {
    if (path.endsWith('.tsx') || path.endsWith('.ts') || path.endsWith('.jsx') || path.endsWith('.js')) {
      return <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    }
    if (path.endsWith('.json')) {
      return <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }
    if (path.endsWith('.md')) {
      return <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
    return <File className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  };

  // Build hierarchical folder tree from project.files
  const filePaths = Object.keys(project.files).sort();

  // Filter paths
  const filteredPaths = searchQuery
    ? filePaths.filter((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
    : filePaths;

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        createNewFile(file.name, content);
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="w-60 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 select-none text-xs">
      {/* File Tree Header */}
      <div className="p-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <span className="font-semibold text-slate-800 tracking-wider text-[11px] uppercase">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsCreatingFile(true);
              setIsCreatingFolder(false);
            }}
            title="新規ファイル"
            className="p-1 hover:bg-slate-200/70 text-slate-500 hover:text-slate-900 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsCreatingFolder(true);
              setIsCreatingFile(false);
            }}
            title="新規フォルダ"
            className="p-1 hover:bg-slate-200/70 text-slate-500 hover:text-slate-900 rounded transition-colors cursor-pointer"
          >
            <Folder className="w-3.5 h-3.5" />
          </button>
          <label
            title="ファイルアップロード"
            className="p-1 hover:bg-slate-200/70 text-slate-500 hover:text-slate-900 rounded transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <input type="file" multiple className="hidden" onChange={handleFileUpload} />
          </label>
          {isMobileFileDrawerOpen && (
            <button
              onClick={() => setIsMobileFileDrawerOpen(false)}
              title="閉じる"
              className="md:hidden p-1 hover:bg-slate-200 text-slate-500 hover:text-rose-600 rounded transition-colors ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-2 py-1.5 border-b border-slate-200 bg-slate-50/40">
        <div className="relative">
          <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ファイルを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md pl-6 pr-2 py-1 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-600 shadow-2xs"
          />
        </div>
      </div>

      {/* New File Input */}
      {isCreatingFile && (
        <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1 animate-fadeIn">
          <input
            type="text"
            autoFocus
            placeholder="例: src/components/Card.tsx"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newFileName.trim()) {
                createNewFile(newFileName.trim(), '// New component\n');
                setNewFileName('');
                setIsCreatingFile(false);
              } else if (e.key === 'Escape') {
                setIsCreatingFile(false);
              }
            }}
            className="w-full bg-white border border-cyan-500 rounded px-2 py-1 text-xs text-slate-900 focus:outline-none shadow-xs"
          />
        </div>
      )}

      {/* New Folder Input */}
      {isCreatingFolder && (
        <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1 animate-fadeIn">
          <input
            type="text"
            autoFocus
            placeholder="例: src/utils"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newFolderName.trim()) {
                createNewFolder(newFolderName.trim());
                setNewFolderName('');
                setIsCreatingFolder(false);
              } else if (e.key === 'Escape') {
                setIsCreatingFolder(false);
              }
            }}
            className="w-full bg-white border border-cyan-500 rounded px-2 py-1 text-xs text-slate-900 focus:outline-none shadow-xs"
          />
        </div>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {filteredPaths.map((filePath) => {
          const isSelected = selectedFilePath === filePath;
          const isRenaming = renamingPath === filePath;
          const depth = filePath.split('/').length - 1;

          if (isRenaming) {
            return (
              <div key={filePath} className="px-2 py-1 flex items-center gap-1 bg-slate-100 rounded">
                <input
                  type="text"
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && renameValue.trim()) {
                      renamePath(filePath, renameValue.trim());
                      setRenamingPath(null);
                    } else if (e.key === 'Escape') {
                      setRenamingPath(null);
                    }
                  }}
                  className="w-full bg-white border border-cyan-500 rounded px-1.5 py-0.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            );
          }

          return (
            <div
              key={filePath}
              onClick={() => openTab(filePath)}
              style={{ paddingLeft: `${Math.max(4, depth * 12)}px` }}
              className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-cyan-50 text-cyan-800 font-semibold border-l-2 border-cyan-600'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0 truncate">
                {getFileIcon(filePath)}
                <span className="truncate">{filePath.split('/').pop()}</span>
              </div>

              {/* Context Actions (Rename / Delete) */}
              <div className="hidden group-hover:flex items-center gap-0.5 text-slate-400">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingPath(filePath);
                    setRenameValue(filePath);
                  }}
                  title="リネーム"
                  className="p-1 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`「${filePath}」を削除してもよろしいですか？`)) {
                      deletePath(filePath);
                    }
                  }}
                  title="削除"
                  className="p-1 hover:text-rose-600 hover:bg-slate-200 rounded cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total files counter */}
      <div className="p-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono flex items-center justify-between bg-slate-50/60">
        <span>Files: {filePaths.length}</span>
        <span className="text-slate-700 font-medium">{project.constitution.packageManager}</span>
      </div>
    </div>
  );
};
