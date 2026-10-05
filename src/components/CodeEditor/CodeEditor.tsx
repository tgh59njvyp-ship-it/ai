import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { EditorTabs } from './EditorTabs';
import {
  Copy,
  Check,
  Search,
  Sparkles,
  Terminal,
  FileCode,
  Save,
  ChevronRight,
  Code,
  Folder,
  Eye,
} from 'lucide-react';

export const CodeEditor: React.FC = () => {
  const {
    project,
    selectedFilePath,
    updateFileContent,
    showToast,
    setActiveView,
    runAgentPrompt,
    setIsMobileFileDrawerOpen,
  } = useProject();

  const file = project.files[selectedFilePath];
  const [content, setContent] = useState(file?.content || '');
  const [isCopied, setIsCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (file) {
      setContent(file.content);
    }
  }, [selectedFilePath, file?.content]);

  // Sync scrolling between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    updateFileContent(selectedFilePath, val);
  };

  const handleCursorMove = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = content.substring(0, pos);
    const lines = textBefore.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    showToast('コードをクリップボードにコピーしました', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const totalLines = content.split('\n').length;
  const lineNumbers = Array.from({ length: totalLines }, (_, i) => i + 1);

  if (!file) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
        ファイルを選択してください
      </div>
    );
  }

  const breadcrumbs = selectedFilePath.split('/');

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none">
      {/* Tabs */}
      <EditorTabs />

      {/* Editor Sub-header: Breadcrumbs & Action Bar */}
      <div className="h-9 bg-slate-50/90 border-b border-slate-200 px-2 sm:px-3 flex items-center justify-between text-xs text-slate-600 shrink-0 gap-2">
        {/* Left: Mobile File Trigger & Breadcrumb Path */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] overflow-hidden">
          {/* Mobile File Explorer Drawer Button */}
          <button
            onClick={() => setIsMobileFileDrawerOpen(true)}
            className="md:hidden flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-slate-100 text-cyan-700 border border-slate-200 text-[11px] shrink-0 font-sans cursor-pointer shadow-xs"
          >
            <Folder className="w-3 h-3 text-cyan-600" />
            <span className="font-medium">ファイル</span>
          </button>

          <span className="hidden sm:inline text-slate-400">{project.name}</span>
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 hidden sm:inline" />
              <span className={`truncate ${idx === breadcrumbs.length - 1 ? 'text-slate-900 font-semibold' : 'hidden sm:inline text-slate-500'}`}>
                {b}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile Quick Preview Button */}
          <button
            onClick={() => setActiveView('preview')}
            title="プレビュー画面へ移動"
            className="md:hidden flex items-center gap-1 px-2 py-1 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 text-[11px] transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>プレビュー</span>
          </button>

          {/* Ask AI to improve this file */}
          <button
            onClick={() => {
              setActiveView('agent');
              runAgentPrompt(`このファイル (${selectedFilePath}) のリファクタリングと型安全性を向上させてください`);
            }}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 text-[11px] transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3 h-3" />
            <span>AIリファクタ</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="コードをコピー"
            className="p-1 sm:p-1.5 hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 rounded transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Textarea with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-xs bg-white">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          className="w-9 sm:w-12 py-3 bg-slate-50/70 text-slate-400 select-none text-right pr-1.5 sm:pr-3 overflow-hidden font-mono text-[10px] sm:text-xs leading-relaxed shrink-0 border-r border-slate-200"
        >
          {lineNumbers.map((num) => (
            <div key={num} className={cursorPos.line === num ? 'text-cyan-700 font-bold' : ''}>
              {num}
            </div>
          ))}
        </div>

        {/* Code Content Area */}
        <div className="flex-1 relative h-full overflow-hidden bg-white">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onScroll={handleScroll}
            onClick={handleCursorMove}
            onKeyUp={handleCursorMove}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="w-full h-full p-2.5 sm:p-3 bg-white text-slate-900 resize-none focus:outline-none font-mono text-[12px] sm:text-xs leading-relaxed selection:bg-cyan-100 selection:text-cyan-900 border-none"
            style={{
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {/* Editor Status Bar */}
      <div className="h-6 bg-slate-50 border-t border-slate-200 px-2 sm:px-3 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500 font-mono shrink-0 select-none overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 sm:gap-3">
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span>{totalLines} lines</span>
          <span className="hidden sm:inline">{content.length} chars</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline">UTF-8</span>
          <span className="text-cyan-700 font-semibold">{file.language.toUpperCase()}</span>
          <span className="text-slate-400 hidden sm:inline">Space: 2</span>
        </div>
      </div>
    </div>
  );
};
