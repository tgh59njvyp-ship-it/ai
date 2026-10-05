import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { DBTable } from '../../types/project';
import {
  Database,
  Table as TableIcon,
  Play,
  Plus,
  Key,
  Link,
  Code2,
  FileText,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export const DatabaseStudio: React.FC = () => {
  const { project, executeSql, showToast } = useProject();
  const tables = project.database.tables;

  const [selectedTableId, setSelectedTableId] = useState<string>(tables[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'schema' | 'data' | 'sql' | 'migrations'>('schema');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM ' + (tables[0]?.name || 'users') + ' LIMIT 10;');
  const [queryResult, setQueryResult] = useState<any>(null);

  const currentTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  const handleRunSql = () => {
    const res = executeSql(sqlQuery);
    setQueryResult(res);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Studio Header */}
      <div className="h-auto sm:h-12 border-b border-slate-200 bg-white px-3 sm:px-4 py-2 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Database Studio ({project.constitution.database})</h2>
            <p className="text-[10px] text-slate-500 hidden xs:block">スキーマ設計・データ閲覧・SQLクエリ実行・マイグレーション</p>
          </div>
        </div>

        {/* View mode switcher (horizontally scrollable on mobile) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'schema' ? 'bg-white text-cyan-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ERスキーマ
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'data' ? 'bg-white text-cyan-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            データ閲覧
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'sql' ? 'bg-white text-cyan-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SQLエディタ
          </button>
          <button
            onClick={() => setActiveTab('migrations')}
            className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'migrations' ? 'bg-white text-cyan-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            マイグレーション
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Table Selector (< md) */}
      <div className="md:hidden flex items-center gap-1.5 p-2 bg-white border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0 shadow-2xs">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 shrink-0 px-1">
          Tables:
        </span>
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTableId(t.id)}
            className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors border cursor-pointer ${
              t.id === selectedTableId
                ? 'bg-slate-900 text-white font-medium border-slate-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <TableIcon className="w-3 h-3 text-emerald-500" />
            <span>{t.name}</span>
            <span className="text-[9px] text-slate-400 font-mono">({t.rows.length})</span>
          </button>
        ))}
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table Selector Sidebar (Desktop Only) */}
        <div className="hidden md:flex w-56 bg-white border-r border-slate-200 p-3 flex-col shrink-0 text-xs">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2">
            Tables ({tables.length})
          </div>
          <div className="space-y-1 flex-1 overflow-y-auto">
            {tables.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTableId(t.id)}
                className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  t.id === selectedTableId
                    ? 'bg-cyan-50 text-cyan-900 font-semibold border border-cyan-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <TableIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{t.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{t.rows.length}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
            RDBMS: {project.constitution.database}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-3 sm:p-5">
          {/* TAB 1: SCHEMA VIEW */}
          {activeTab === 'schema' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>テーブル: {currentTable.name}</span>
                    <span className="text-xs text-slate-500 font-normal">({currentTable.description})</span>
                  </h3>
                </div>
              </div>

              {/* Columns Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">カラム名</th>
                      <th className="py-2.5 px-4 font-semibold">型 (Type)</th>
                      <th className="py-2.5 px-4 font-semibold">PK / 制約</th>
                      <th className="py-2.5 px-4 font-semibold">デフォルト値</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-slate-700">
                    {currentTable.columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          {col.primaryKey && <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          {col.isForeignKey && <Link className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                          <span>{col.name}</span>
                        </td>
                        <td className="py-2.5 px-4 text-cyan-700 font-semibold">{col.type}</td>
                        <td className="py-2.5 px-4">
                          {col.primaryKey && (
                            <span className="text-[10px] bg-amber-50 text-amber-750 px-1.5 py-0.5 rounded border border-amber-200 mr-1 font-bold">
                              PRIMARY KEY
                            </span>
                          )}
                          {col.isForeignKey && (
                            <span className="text-[10px] bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded border border-cyan-200">
                              FK &rarr; {col.foreignTable}
                            </span>
                          )}
                          {!col.nullable && !col.primaryKey && (
                            <span className="text-[10px] text-slate-400">NOT NULL</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500">{col.defaultValue || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: DATA TABLE VIEW */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  {currentTable.name} のレコード ({currentTable.rows.length}件)
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                    <tr>
                      {currentTable.columns.map((col) => (
                        <th key={col.name} className="py-2 px-3 font-semibold whitespace-nowrap">
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-slate-700">
                    {currentTable.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors">
                        {currentTable.columns.map((col) => (
                          <td key={col.name} className="py-2 px-3 max-w-[200px] truncate text-[11px]">
                            {typeof row[col.name] === 'object' ? JSON.stringify(row[col.name]) : String(row[col.name] ?? '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SQL RUNNER */}
          {activeTab === 'sql' && (
            <div className="space-y-4 h-full flex flex-col">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-600" />
                    <span>SQL Query Runner ({project.constitution.database})</span>
                  </span>
                  <button
                    onClick={handleRunSql}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>クエリ実行 (Run)</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-cyan-600 rounded-xl p-3 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none leading-relaxed shadow-xs"
                />
              </div>

              {/* Query Result */}
              {queryResult && (
                <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 overflow-auto shadow-xs">
                  <div className="text-[11px] font-mono text-emerald-700 mb-2 font-semibold">
                    &gt; {queryResult.message}
                  </div>
                  {queryResult.rows && queryResult.rows.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="border-b border-slate-200 text-slate-600">
                          <tr>
                            {Object.keys(queryResult.rows[0]).map((k) => (
                              <th key={k} className="py-1 px-2 font-semibold">
                                {k}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {queryResult.rows.map((r: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              {Object.values(r).map((v: any, cIdx: number) => (
                                <td key={cIdx} className="py-1 px-2 max-w-[200px] truncate text-[11px]">
                                  {String(v)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MIGRATIONS */}
          {activeTab === 'migrations' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-800 block">
                マイグレーション履歴 ({project.database.migrations.length}件)
              </span>

              {project.database.migrations.map((m) => (
                <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 font-mono">{m.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{m.appliedAt}</span>
                  </div>
                  <pre className="p-3 bg-slate-50 rounded-lg text-cyan-800 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-200">
                    {m.sql}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
