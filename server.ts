import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Server-side Gemini initialization
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(apiKey),
      hasGitHubOAuth: Boolean(process.env.GITHUB_CLIENT_ID || process.env.CLIENT_ID),
      platform: 'Genesis Studio AI Dev OS',
      timestamp: new Date().toISOString(),
    });
  });

  // In-memory GitHub Auth state
  let currentGitHubUser: any = null;

  // 1. GitHub OAuth URL construction endpoint
  app.get('/api/auth/github/url', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${baseUrl}/auth/github/callback`;
    const clientId = process.env.GITHUB_CLIENT_ID || process.env.CLIENT_ID || '';

    if (!clientId) {
      return res.json({
        configured: false,
        redirectUri,
        url: '',
        message: 'GITHUB_CLIENT_ID is not configured in environment variables.',
      });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'read:user,user:email,repo',
      state: Math.random().toString(36).substring(2),
    });

    res.json({
      configured: true,
      redirectUri,
      url: `https://github.com/login/oauth/authorize?${params.toString()}`,
    });
  });

  // 2. GitHub OAuth Callback (Popup communication via postMessage)
  app.get(['/auth/github/callback', '/auth/github/callback/'], async (req, res) => {
    const { code } = req.query;
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${baseUrl}/auth/github/callback`;
    const clientId = process.env.GITHUB_CLIENT_ID || process.env.CLIENT_ID || '';
    const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.CLIENT_SECRET || '';

    try {
      if (!code) {
        throw new Error('Authorization code missing in callback');
      }

      if (!clientId || !clientSecret) {
        throw new Error('GitHub Client ID or Client Secret is not set on the server.');
      }

      // Exchange code for token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();
      if (tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error);
      }

      const accessToken = tokenData.access_token;

      // Fetch user profile from GitHub
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'Genesis-Studio-App',
        },
      });

      if (!userRes.ok) {
        throw new Error('Failed to retrieve GitHub user profile');
      }

      const userData = await userRes.json();

      currentGitHubUser = {
        id: userData.id,
        login: userData.login,
        name: userData.name || userData.login,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        email: userData.email,
        public_repos: userData.public_repos,
        followers: userData.followers,
        token: `${accessToken.slice(0, 4)}...${accessToken.slice(-4)}`,
      };

      // Send postMessage to window.opener and auto-close
      res.send(`
        <!DOCTYPE html>
        <html lang="ja">
          <head>
            <meta charset="UTF-8" />
            <title>GitHub 認証完了</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #f8fafc;
                color: #0f172a;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
              }
              .box {
                background: #ffffff;
                padding: 32px;
                border-radius: 16px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
                text-align: center;
                max-width: 320px;
              }
              .spinner {
                width: 36px;
                height: 36px;
                border: 3px solid #e2e8f0;
                border-top-color: #0284c7;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin: 0 auto 16px;
              }
              @keyframes spin { to { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="box">
              <div class="spinner"></div>
              <h3 style="margin: 0 0 8px; font-size: 16px;">GitHub連携に成功しました</h3>
              <p style="font-size: 12px; color: #64748b; margin: 0;">Genesis Studio に戻ります...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'OAUTH_AUTH_SUCCESS',
                  provider: 'github',
                  user: ${JSON.stringify(currentGitHubUser)}
                }, '*');
                setTimeout(() => window.close(), 600);
              } else {
                setTimeout(() => { window.location.href = '/'; }, 1000);
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('GitHub Callback Error:', err);
      res.status(500).send(`
        <!DOCTYPE html>
        <html lang="ja">
          <head>
            <meta charset="UTF-8" />
            <title>GitHub 認証エラー</title>
            <style>
              body { font-family: sans-serif; background: #fff1f2; color: #9f1239; padding: 40px; text-align: center; }
              .card { background: white; max-width: 400px; margin: 40px auto; padding: 24px; border-radius: 12px; border: 1px solid #fecdd3; }
              button { background: #e11d48; color: white; border: none; padding: 8px 18px; border-radius: 8px; cursor: pointer; }
            </style>
          </head>
          <body>
            <div class="card">
              <h3 style="margin-top: 0;">GitHub 認証に失敗しました</h3>
              <p style="font-size: 13px; color: #64748b;">${err.message || 'エラーが発生しました'}</p>
              <button onclick="window.close()">ウィンドウを閉じる</button>
            </div>
          </body>
        </html>
      `);
    }
  });

  // 3. GitHub PAT (Personal Access Token) Login endpoint
  app.post('/api/auth/github/token-login', async (req, res) => {
    try {
      const { token } = req.body;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'GitHubトークンを入力してください' });
      }

      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          'User-Agent': 'Genesis-Studio-App',
        },
      });

      if (!userRes.ok) {
        return res.status(401).json({ error: '無効なGitHubトークンです。権限 (read:user, repo) をご確認ください。' });
      }

      const userData = await userRes.json();
      currentGitHubUser = {
        id: userData.id,
        login: userData.login,
        name: userData.name || userData.login,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        email: userData.email,
        public_repos: userData.public_repos,
        followers: userData.followers,
        token: `${token.trim().slice(0, 4)}...${token.trim().slice(-4)}`,
      };

      res.json({ success: true, user: currentGitHubUser });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'GitHub認証処理に失敗しました' });
    }
  });

  // 4. Current GitHub User state endpoint
  app.get('/api/auth/github/user', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${baseUrl}/auth/github/callback`;
    const clientId = process.env.GITHUB_CLIENT_ID || process.env.CLIENT_ID || '';

    res.json({
      authenticated: Boolean(currentGitHubUser),
      user: currentGitHubUser,
      oauthConfig: {
        configured: Boolean(clientId),
        redirectUri,
        clientId: clientId ? `${clientId.slice(0, 6)}...` : '',
      },
    });
  });

  // 5. GitHub Logout endpoint
  app.post('/api/auth/github/logout', (req, res) => {
    currentGitHubUser = null;
    res.json({ success: true });
  });

  // AI Agent Endpoint
  app.post('/api/ai/agent', async (req, res) => {
    try {
      const { prompt, constitution, files, taskType = 'generate', currentError } = req.body;

      if (!ai) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please configure it in Settings Secrets or provide BYOK in the client.',
        });
      }

      const constitutionText = JSON.stringify(constitution, null, 2);
      const fileSummary = Object.keys(files || {})
        .map(
          (f) =>
            `- ${f} (${files[f]?.content ? files[f].content.length : 0} bytes)`
        )
        .join('\n');

      const systemPrompt = `You are Genesis Studio Core AI Agent, an elite full-stack software architect and engineer.
You strictly uphold the PROJECT CONSTITUTION:
${constitutionText}

Current project files:
${fileSummary}

Rules:
1. ALWAYS respect the Project Constitution (Language, Framework, Runtime, Dependencies, Forbidden items, Rules).
2. NEVER switch framework or programming language without explicit approval.
3. Every generated feature must be REAL, functional, self-contained, and bug-free.
4. Output MUST be valid JSON conforming to this schema:
{
  "summary": "Brief 1-2 sentence overview of what was designed/built",
  "plan": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "constitutionValidation": {
    "compliant": true,
    "notes": "Verified language is TS and framework is maintained"
  },
  "filesToUpdate": [
    {
      "path": "path/to/file.tsx",
      "content": "Full source code",
      "operation": "create" | "update" | "delete",
      "description": "Why this file was modified"
    }
  ],
  "databaseChanges": {
    "tablesAddedOrModified": ["tableName"],
    "sqlMigration": "CREATE TABLE IF NOT EXISTS ... ;"
  },
  "testPlan": [
    {
      "name": "Test Name",
      "type": "unit" | "integration" | "ui",
      "command": "Simulated assertion description"
    }
  ],
  "securityAudit": {
    "secretsExposed": false,
    "notes": "No hardcoded credentials found"
  }
}`;

      const userMessage = taskType === 'fix'
        ? `Task: Fix the following error while strictly upholding the constitution.\nError details:\n${currentError}\nUser instructions:\n${prompt}`
        : `Task: ${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '{}';
      let parsed = {};
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        parsed = {
          summary: 'Generated updates',
          rawResponse: responseText,
          filesToUpdate: [],
        };
      }

      res.json({ success: true, result: parsed });
    } catch (err: any) {
      console.error('AI Agent Error:', err);
      res.status(500).json({
        error: err.message || 'Failed to process AI Agent request',
      });
    }
  });

  // Code inspection / review endpoint
  app.post('/api/ai/audit', async (req, res) => {
    try {
      const { files } = req.body;
      if (!ai) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const sampleFiles = Object.entries(files || {})
        .slice(0, 10)
        .map(([p, f]: [string, any]) => `FILE: ${p}\n${(f.content || '').slice(0, 1000)}`)
        .join('\n\n---\n\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Audit the following codebase for:
1. Hardcoded API keys / secrets / credentials.
2. Portability & export readiness.
3. Code quality & error risks.
Files:\n${sampleFiles}`,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'Return JSON: { "secretsDetected": string[], "warnings": string[], "recommendations": string[], "score": number }',
        },
      });

      res.json({ success: true, audit: JSON.parse(response.text || '{}') });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mount Vite middleware in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Genesis Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
