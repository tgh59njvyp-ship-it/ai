import { ProjectConstitution, ProposedFileChange } from '../types/project';

export interface ValidationReport {
  compliant: boolean;
  violations: string[];
  warnings: string[];
}

export function validateAgainstConstitution(
  constitution: ProjectConstitution,
  proposedChanges: ProposedFileChange[],
  newDependencies: string[] = []
): ValidationReport {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Check Forbidden Languages in proposed file extensions
  const forbiddenExtMap: Record<string, string> = {
    Python: '.py',
    PHP: '.php',
    Ruby: '.rb',
    Java: '.java',
    'C#': '.cs',
    Go: '.go',
    Rust: '.rs',
  };

  for (const forbiddenLang of constitution.forbiddenLanguages) {
    const ext = forbiddenExtMap[forbiddenLang];
    if (ext) {
      const offending = proposedChanges.find((c) => c.path.endsWith(ext));
      if (offending) {
        violations.push(
          `Project Constitution違反: 禁止言語 ${forbiddenLang} のファイル (${offending.path}) が検出されました。`
        );
      }
    }
  }

  // Check language constraint (e.g. TypeScript only)
  if (constitution.language === 'TypeScript') {
    const jsFiles = proposedChanges.filter((c) => c.path.endsWith('.js') && !c.path.includes('config'));
    if (jsFiles.length > 0) {
      warnings.push(`警告: TypeScript ONLY構成ですが、JavaScriptファイル (${jsFiles.map(f => f.path).join(', ')}) が生成されています。`);
    }
  }

  // Check Dependencies
  for (const dep of newDependencies) {
    if (constitution.dependencyControl.blocked.includes(dep)) {
      violations.push(`Project Constitution違反: ブロック対象パッケージ [${dep}] の追加は禁止されています。`);
    } else if (constitution.dependencyControl.requiresApproval.includes(dep)) {
      warnings.push(`承認が必要なパッケージ: [${dep}] の追加にはユーザー承認が必要です。`);
    }
  }

  // Check for hardcoded API keys in proposed new content
  for (const change of proposedChanges) {
    if (/(?:sk-[a-zA-Z0-9_-]{20,}|AIzaSy[a-zA-Z0-9_-]{33})/.test(change.newContent)) {
      violations.push(`セキュリティ違反: ${change.path} にハードコードされたAPIキーが検出されました。必ず.env.exampleと環境変数を使用してください。`);
    }
  }

  return {
    compliant: violations.length === 0,
    violations,
    warnings,
  };
}
