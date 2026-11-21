import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadStaticHtml(relativePath: string, fallback: string): string {
  try {
    const fullPath = path.resolve(__dirname, '..', relativePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
  } catch {
    // Fallback if bundled or file read fails
  }
  return fallback;
}

export const homePage = loadStaticHtml('public/index.html', `<!doctype html><html><head><title>ReZenOnance Nightly</title></head><body><h1>ReZenOnance Nightly</h1><p><a href="/manifest.json">Universal Addon Manifest</a></p></body></html>`);

export const legacyTvPage = loadStaticHtml('public/tv/index.html', `<!doctype html><html><head><title>ReZenOnance TV</title></head><body><h1>ReZenOnance TV</h1></body></html>`);
