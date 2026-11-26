import fs from 'node:fs';
import path from 'node:path';

const indexHtml = fs.readFileSync('public/index.html', 'utf8');
const tvHtml = fs.readFileSync('public/tv/index.html', 'utf8');
const styleCss = fs.readFileSync('public/assets/style.css', 'utf8');
const appJs = fs.readFileSync('public/assets/app.js', 'utf8');
const playerJs = fs.readFileSync('public/assets/player.js', 'utf8');

const playerIndexPath = 'public/player/index.html';
const playerHtml = fs.existsSync(playerIndexPath) ? fs.readFileSync(playerIndexPath, 'utf8') : '';

const playerAssetsDir = 'public/player/assets';
const playerAssetsMap = {};
if (fs.existsSync(playerAssetsDir)) {
  for (const entry of fs.readdirSync(playerAssetsDir)) {
    const full = path.join(playerAssetsDir, entry);
    if (fs.statSync(full).isFile()) {
      let contentType = 'text/plain; charset=utf-8';
      if (entry.endsWith('.css')) contentType = 'text/css; charset=utf-8';
      else if (entry.endsWith('.js')) contentType = 'application/javascript; charset=utf-8';
      else if (entry.endsWith('.svg')) contentType = 'image/svg+xml';
      else if (entry.endsWith('.json')) contentType = 'application/json; charset=utf-8';
      playerAssetsMap[entry] = {
        content: fs.readFileSync(full, 'utf8'),
        contentType,
      };
    }
  }
}

const code = `import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readFileSafe(relPath: string): string | null {
  const candidates = [
    path.resolve(process.cwd(), relPath),
    path.resolve(__dirname, '..', relPath),
    path.resolve(__dirname, '..', '..', relPath),
    path.resolve(__dirname, relPath),
  ];
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) {
        return fs.readFileSync(c, 'utf8');
      }
    } catch {}
  }
  return null;
}

const FALLBACK_INDEX_HTML = ${JSON.stringify(indexHtml)};
const FALLBACK_TV_HTML = ${JSON.stringify(tvHtml)};
const FALLBACK_STYLE_CSS = ${JSON.stringify(styleCss)};
const FALLBACK_APP_JS = ${JSON.stringify(appJs)};
const FALLBACK_PLAYER_JS = ${JSON.stringify(playerJs)};
const FALLBACK_PLAYER_HTML = ${JSON.stringify(playerHtml)};
const FALLBACK_PLAYER_ASSETS: Record<string, { content: string; contentType: string }> = ${JSON.stringify(playerAssetsMap)};

export function getHomePage(): string {
  return readFileSafe('public/index.html') ?? FALLBACK_INDEX_HTML;
}

export function getTvPage(): string {
  return readFileSafe('public/tv/index.html') ?? FALLBACK_TV_HTML;
}

export function getPlayerPage(): string {
  return readFileSafe('public/player/index.html') ?? FALLBACK_PLAYER_HTML;
}

export function getPlayerAsset(filename: string): { content: string; contentType: string } | null {
  const safeName = path.basename(filename);
  const disk = readFileSafe(path.join('public', 'player', 'assets', safeName));
  if (disk !== null) {
    let contentType = 'text/plain; charset=utf-8';
    if (safeName.endsWith('.css')) contentType = 'text/css; charset=utf-8';
    else if (safeName.endsWith('.js')) contentType = 'application/javascript; charset=utf-8';
    else if (safeName.endsWith('.svg')) contentType = 'image/svg+xml';
    else if (safeName.endsWith('.json')) contentType = 'application/json; charset=utf-8';
    return { content: disk, contentType };
  }
  return FALLBACK_PLAYER_ASSETS[safeName] ?? null;
}

export function getAsset(filename: string): { content: string; contentType: string } | null {
  const safeName = path.basename(filename);
  let content: string | null = null;
  let contentType = 'text/plain';

  if (safeName === 'style.css') {
    content = readFileSafe('public/assets/style.css') ?? FALLBACK_STYLE_CSS;
    contentType = 'text/css; charset=utf-8';
  } else if (safeName === 'app.js') {
    content = readFileSafe('public/assets/app.js') ?? FALLBACK_APP_JS;
    contentType = 'application/javascript; charset=utf-8';
  } else if (safeName === 'player.js') {
    content = readFileSafe('public/assets/player.js') ?? FALLBACK_PLAYER_JS;
    contentType = 'application/javascript; charset=utf-8';
  } else {
    content = readFileSafe(path.join('public', 'assets', safeName));
    if (safeName.endsWith('.css')) contentType = 'text/css; charset=utf-8';
    else if (safeName.endsWith('.js')) contentType = 'application/javascript; charset=utf-8';
  }

  if (content === null) return null;
  return { content, contentType };
}
`;

fs.writeFileSync('src/static-assets.ts', code, 'utf8');
console.log('src/static-assets.ts successfully written with', Object.keys(playerAssetsMap).length, 'player assets');
