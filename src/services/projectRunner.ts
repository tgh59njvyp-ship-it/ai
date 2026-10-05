import { Project } from '../types/project';

export function buildPreviewHtml(project: Project): string {
  // Find primary App component or index.html
  const appFile = project.files['src/App.tsx'] || project.files['src/App.jsx'] || project.files['App.tsx'];
  const appCode = appFile ? appFile.content : `export default function App() { return <div>No App.tsx found</div>; }`;

  // Strip TypeScript types or export defaults to make it executable with Babel standalone in browser
  const sanitizedCode = appCode
    .replace(/import\s+.*?\s+from\s+['"][^'"]+['"];?/g, '') // remove import statements
    .replace(/export\s+default\s+function/g, 'function App') // replace export default function with function App
    .replace(/export\s+default\s+class/g, 'class App')
    .replace(/export\s+default\s+\w+;?/g, '');

  return `<!DOCTYPE html>
<html lang="ja" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { 500: '#06b6d4', 600: '#0891b2' }
          }
        }
      }
    }
  </script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; background: #020617; color: #f8fafc; font-family: ui-sans-serif, system-ui, sans-serif; }
    /* Scrollbars */
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <div id="root"></div>

  <script>
    // Console log interception to parent
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    function postToParent(type, message) {
      try {
        window.parent.postMessage({
          type: 'GENESIS_PREVIEW_CONSOLE',
          level: type,
          message: typeof message === 'object' ? JSON.stringify(message) : String(message),
          timestamp: new Date().toLocaleTimeString()
        }, '*');
      } catch(e) {}
    }

    console.log = function(...args) {
      originalLog.apply(console, args);
      postToParent('info', args.join(' '));
    };
    console.error = function(...args) {
      originalError.apply(console, args);
      postToParent('error', args.join(' '));
    };
    console.warn = function(...args) {
      originalWarn.apply(console, args);
      postToParent('warn', args.join(' '));
    };

    window.onerror = function(msg, url, lineNo, columnNo, error) {
      postToParent('error', msg + ' (Line ' + lineNo + ')');
      const root = document.getElementById('root');
      if (root) {
        root.innerHTML = \`
          <div style="padding: 24px; color: #f87171; background: #450a0a; border: 1px solid #991b1b; border-radius: 8px; margin: 16px; font-family: monospace; font-size: 13px;">
            <div style="font-weight: bold; margin-bottom: 8px;">⚠️ Runtime Execution Error</div>
            <div>\${msg}</div>
            <div style="margin-top: 8px; opacity: 0.8; font-size: 11px;">Line \${lineNo}:\${columnNo}</div>
          </div>
        \`;
      }
      return false;
    };
  </script>

  <!-- Lucide Icon Shim -->
  <script type="text/babel">
    const { useState, useEffect, useMemo, useRef, useCallback } = React;

    // SVG icon mock fallback so icons render cleanly without bundle failures
    function createIcon(svgPath, name) {
      return function IconComponent(props) {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size || 18}
            height={props.size || 18}
            viewBox="0 0 24 24"
            fill={props.fill || "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className || "w-4 h-4"}
          >
            {svgPath}
          </svg>
        );
      };
    }

    const Heart = createIcon(<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>, "Heart");
    const MessageSquare = createIcon(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, "MessageSquare");
    const Share2 = createIcon(<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></>, "Share2");
    const Sparkles = createIcon(<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>, "Sparkles");
    const Plus = createIcon(<><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></>, "Plus");
    const Send = createIcon(<><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>, "Send");
    const Image = createIcon(<><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>, "Image");
    const User = createIcon(<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>, "User");
    const Search = createIcon(<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>, "Search");
    const TrendingUp = createIcon(<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>, "TrendingUp");
    const TrendingDown = createIcon(<><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></>, "TrendingDown");
    const Wallet = createIcon(<><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></>, "Wallet");
    const ShieldCheck = createIcon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></>, "ShieldCheck");
    const Calendar = createIcon(<><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></>, "Calendar");
    const Clock = createIcon(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, "Clock");
    const Users = createIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, "Users");
    const Shield = createIcon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>, "Shield");
    const CheckCircle2 = createIcon(<><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></>, "CheckCircle2");
    const Building2 = createIcon(<><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></>, "Building2");
    const Bot = createIcon(<><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></>, "Bot");
    const Copy = createIcon(<><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>, "Copy");
    const Check = createIcon(<path d="M20 6 9 17l-5-5"/>, "Check");
    const Terminal = createIcon(<><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></>, "Terminal");
    const Filter = createIcon(<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>, "Filter");

    // Project Code Execution
    try {
      ${sanitizedCode}

      if (typeof App !== 'undefined') {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      } else {
        document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #f59e0b;">Component "App" not found in code.</div>';
      }
    } catch(err) {
      console.error(err);
      document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #f87171;">Compilation Error: ' + err.message + '</div>';
    }
  </script>
</body>
</html>`;
}
