import JSZip from 'jszip';
import { Project } from '../types/project';

export interface SecretScanResult {
  hasSecrets: boolean;
  findings: {
    file: string;
    line: number;
    match: string;
    patternType: string;
  }[];
}

const SECRET_PATTERNS = [
  { type: 'OpenAI / Gemini Key', regex: /(?:sk-[a-zA-Z0-9_-]{20,}|AIzaSy[a-zA-Z0-9_-]{33})/g },
  { type: 'Generic Secret Token', regex: /(?:secret|password|api_key|private_key|token)\s*[:=]\s*["']([^"']{8,})["']/gi },
  { type: 'AWS Access Key', regex: /(?:AKIA[0-9A-Z]{16})/g },
  { type: 'GitHub Personal Token', regex: /(?:ghp_[a-zA-Z0-9]{36})/g },
];

export function scanSecretsInProject(project: Project): SecretScanResult {
  const findings: SecretScanResult['findings'] = [];

  for (const [filePath, file] of Object.entries(project.files)) {
    if (filePath.endsWith('.env.example') || filePath.endsWith('.gitignore') || filePath.endsWith('README.md')) {
      continue;
    }
    const lines = file.content.split('\n');
    lines.forEach((line, index) => {
      for (const pattern of SECRET_PATTERNS) {
        let match;
        // reset regex state
        pattern.regex.lastIndex = 0;
        while ((match = pattern.regex.exec(line)) !== null) {
          // Ignore comment or placeholder examples
          if (line.includes('YOUR_') || line.includes('REPLACE_') || line.includes('process.env.')) {
            continue;
          }
          findings.push({
            file: filePath,
            line: index + 1,
            match: match[0].slice(0, 24) + '...',
            patternType: pattern.type,
          });
        }
      }
    });
  }

  return {
    hasSecrets: findings.length > 0,
    findings,
  };
}

export async function exportProjectAsZip(project: Project): Promise<void> {
  const zip = new JSZip();
  const rootFolderName = project.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const root = zip.folder(rootFolderName) || zip;

  // Add all project files
  for (const [filePath, file] of Object.entries(project.files)) {
    root.file(filePath, file.content);
  }

  // Ensure README.md is always present and up to date
  if (!project.files['README.md']) {
    const readmeContent = `# ${project.name}

${project.description}

## Project Constitution
- **Language**: ${project.constitution.language}
- **Framework**: ${project.constitution.framework}
- **Runtime**: ${project.constitution.runtimeVersion || project.constitution.runtime}
- **Package Manager**: ${project.constitution.packageManager}
- **Database**: ${project.constitution.database}
- **Auth**: ${project.constitution.auth}

## Setup & Local Development
\`\`\`bash
# 1. Install dependencies
${project.constitution.packageManager} install

# 2. Configure environment
cp .env.example .env

# 3. Start development server
${project.constitution.packageManager} dev
\`\`\`

Exported completely from Genesis Studio AI Full-Stack Dev OS.
`;
    root.file('README.md', readmeContent);
  }

  // Ensure .env.example exists and has no leaked secrets
  if (!project.files['.env.example']) {
    const envExample = `# ${project.name} Environment Variables
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
AUTH_SECRET="REPLACE_WITH_SECURE_RANDOM_SECRET"
APP_URL="http://localhost:3000"
`;
    root.file('.env.example', envExample);
  }

  // Generate zip blob
  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${rootFolderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

export async function exportProjectAsDirectory(project: Project): Promise<{ success: boolean; message: string }> {
  // Check if browser supports File System Access API
  if (!('showDirectoryPicker' in window)) {
    return {
      success: false,
      message: 'お使いのブラウザはFile System Access API (フォルダ保存) に対応していません。ZIP Exportをご利用ください。',
    };
  }

  try {
    const dirHandle = await (window as any).showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents',
    });

    const rootFolderName = project.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const projectDirHandle = await dirHandle.getDirectoryHandle(rootFolderName, { create: true });

    for (const [filePath, file] of Object.entries(project.files)) {
      const parts = filePath.split('/');
      let currentDir = projectDirHandle;

      // Create intermediate directories
      for (let i = 0; i < parts.length - 1; i++) {
        currentDir = await currentDir.getDirectoryHandle(parts[i], { create: true });
      }

      // Write file
      const fileName = parts[parts.length - 1];
      const fileHandle = await currentDir.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(file.content);
      await writable.close();
    }

    return {
      success: true,
      message: `フォルダ「${rootFolderName}」へ正常に全ファイルを書き出しました！`,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { success: false, message: 'ユーザーによりキャンセルされました。' };
    }
    return {
      success: false,
      message: `フォルダ書き出し中にエラーが発生しました: ${err.message}`,
    };
  }
}
