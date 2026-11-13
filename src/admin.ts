import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Config } from './config.js';
import type { AddonDatabase } from './db.js';
import type { RacingProvider, DynamicSource } from './providers/racing.js';
import { RemoteAddonProvider } from './providers/remote-addon.js';

export function generateAdminToken(config: Config): string {
  return createHmac('sha256', config.idSecret)
    .update(`admin_auth_session:${config.adminPassword}`)
    .digest('hex');
}

export function verifyAdminToken(token: string | undefined, config: Config): boolean {
  if (!token) return false;
  const expected = generateAdminToken(config);
  try {
    return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export function verifyAdminPassword(candidate: string | undefined, config: Config): boolean {
  if (!candidate) return false;
  try {
    const candidateBuf = Buffer.from(candidate);
    const expectedBuf = Buffer.from(config.adminPassword);
    if (candidateBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(candidateBuf, expectedBuf);
  } catch {
    return false;
  }
}

export interface BenchmarkResult {
  ok: boolean;
  id?: string;
  name?: string;
  baseUrl?: string;
  latencyMs?: number;
  trackCount?: number;
  sampleTitle?: string;
  error?: string;
}

export async function benchmarkAndVerifyAddon(rawUrl: string, config: Config): Promise<BenchmarkResult> {
  let target = rawUrl.trim();
  if (!target) return { ok: false, error: 'Addon URL is required' };
  if (!/^https?:\/\//i.test(target)) target = `https://${target}`;

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return { ok: false, error: 'Invalid URL format' };
  }

  // Base URL without manifest.json
  const basePath = parsed.pathname.replace(/\/manifest\.json$/i, '').replace(/\/+$/, '');
  const baseUrl = `${parsed.origin}${basePath}`;
  const manifestUrl = `${baseUrl}/manifest.json`;

  const startTime = Date.now();

  // 1. Manifest verification
  let manifestName = 'External Lossless Addon';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(manifestUrl, {
      headers: { accept: 'application/json', 'user-agent': 'ReZenOnance-AddonTester/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return { ok: false, error: `Manifest returned HTTP ${res.status} ${res.statusText}` };
    const manifest: any = await res.json();
    if (!manifest || typeof manifest !== 'object') {
      return { ok: false, error: 'Manifest did not return a valid JSON object' };
    }
    if (manifest.name) manifestName = String(manifest.name);
  } catch (err: any) {
    return { ok: false, error: `Could not reach manifest.json: ${err?.message || err}` };
  }

  // 2. Search probe (benchmark known song)
  const probe = new RemoteAddonProvider(config, baseUrl);
  let tracks: any[] = [];
  try {
    tracks = await probe.search('Hotel California', 'LOSSLESS', 'auto');
    if (!tracks || tracks.length === 0) {
      tracks = await probe.search('Daft Punk', 'LOSSLESS', 'auto');
    }
  } catch (err: any) {
    return { ok: false, error: `Search probe failed: ${err?.message || err}` };
  }

  if (!tracks || tracks.length === 0) {
    return { ok: false, error: 'Benchmark search query returned 0 tracks from addon' };
  }

  const sampleTrack = tracks[0];
  const latencyMs = Date.now() - startTime;

  // 3. Stream resolution probe
  try {
    const stream = await probe.getStream(sampleTrack.upstreamId, 'LOSSLESS', 'auto');
    if (!stream || !stream.url || !/^https:\/\//i.test(stream.url)) {
      return { ok: false, error: 'Stream probe returned an invalid or non-HTTPS media URL' };
    }
  } catch (err: any) {
    return { ok: false, error: `Stream probe failed: ${err?.message || err}` };
  }

  // Generate clean slug ID from hostname and path
  const hostSlug = parsed.hostname.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const pathSlug = basePath ? basePath.replace(/[^a-z0-9]/gi, '_').toLowerCase() : '';
  const id = `ext_${hostSlug}${pathSlug ? '_' + pathSlug : ''}`.slice(0, 36);

  return {
    ok: true,
    id,
    name: manifestName,
    baseUrl,
    latencyMs,
    trackCount: tracks.length,
    sampleTitle: `${sampleTrack.title}${sampleTrack.artist ? ' - ' + sampleTrack.artist : ''}`,
  };
}

export function renderAdminHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ReZenOnance Control Center &middot; Master Console</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #030712;
      --card-bg: rgba(17, 24, 39, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --cyan: #00f2fe;
      --cyan-dim: rgba(0, 242, 254, 0.15);
      --emerald: #10b981;
      --emerald-dim: rgba(16, 185, 129, 0.15);
      --rose: #f43f5e;
      --rose-dim: rgba(244, 63, 94, 0.15);
      --amber: #f59e0b;
      --amber-dim: rgba(245, 158, 11, 0.15);
      --text-main: #f9fafb;
      --text-muted: #9ca3af;
      --text-dim: #6b7280;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .ambient-glow {
      position: fixed;
      top: -200px;
      right: -100px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }
    .header {
      border-bottom: 1px solid var(--card-border);
      background: rgba(3, 7, 18, 0.8);
      backdrop-filter: blur(12px);
      padding: 16px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand-wrap { display: flex; align-items: center; gap: 12px; }
    .brand-logo {
      width: 38px; height: 38px; border-radius: 10px;
      background: linear-gradient(135deg, #00f2fe, #4facfe);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
      color: #030712;
    }
    .brand-title { font-weight: 800; font-size: 18px; letter-spacing: -0.5px; }
    .badge-master {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      padding: 3px 8px; border-radius: 6px;
      background: var(--cyan-dim); color: var(--cyan);
      border: 1px solid rgba(0, 242, 254, 0.3);
      margin-left: 8px;
    }
    .header-actions { display: flex; align-items: center; gap: 12px; }
    .btn {
      padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
      border: 1px solid transparent; font-family: inherit;
    }
    .btn-primary { background: linear-gradient(135deg, #00f2fe, #4facfe); color: #030712; border: none; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(0, 242, 254, 0.35); }
    .btn-secondary { background: rgba(255, 255, 255, 0.05); color: var(--text-main); border: 1px solid var(--card-border); }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }
    .btn-danger { background: var(--rose-dim); color: var(--rose); border: 1px solid rgba(244, 63, 94, 0.3); }
    .btn-danger:hover { background: rgba(244, 63, 94, 0.25); }
    .btn-success { background: var(--emerald-dim); color: var(--emerald); border: 1px solid rgba(16, 185, 129, 0.3); }
    .btn-success:hover { background: rgba(16, 185, 129, 0.25); }
    
    .container { max-width: 1320px; width: 100%; margin: 0 auto; padding: 28px 20px; position: relative; z-index: 1; flex: 1; }

    /* Auth Overlay */
    #auth-screen {
      position: fixed; inset: 0; background: rgba(3, 7, 18, 0.95);
      backdrop-filter: blur(20px); z-index: 100; display: flex;
      align-items: center; justify-content: center; padding: 20px;
    }
    .login-card {
      width: 100%; max-width: 440px; background: var(--card-bg);
      border: 1px solid var(--card-border); border-radius: 16px;
      padding: 36px 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      text-align: center;
    }
    .login-icon {
      width: 56px; height: 56px; border-radius: 14px; margin: 0 auto 16px;
      background: var(--cyan-dim); border: 1px solid rgba(0, 242, 254, 0.3);
      display: flex; align-items: center; justify-content: center; color: var(--cyan);
    }
    .input-field {
      width: 100%; background: rgba(0, 0, 0, 0.4); border: 1px solid var(--card-border);
      border-radius: 10px; padding: 12px 16px; color: #fff; font-size: 14px;
      margin: 18px 0 12px; outline: none; transition: border-color 0.2s;
      font-family: inherit;
    }
    .input-field:focus { border-color: var(--cyan); box-shadow: 0 0 12px var(--cyan-dim); }

    /* Nav Tabs */
    .tabs {
      display: flex; gap: 8px; border-bottom: 1px solid var(--card-border);
      margin-bottom: 24px; padding-bottom: 8px;
    }
    .tab-btn {
      padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600;
      color: var(--text-muted); background: transparent; border: none; cursor: pointer;
      display: flex; align-items: center; gap: 8px; transition: all 0.2s;
    }
    .tab-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.04); }
    .tab-btn.active { color: var(--cyan); background: var(--cyan-dim); border: 1px solid rgba(0, 242, 254, 0.2); }

    /* Stats Grid */
    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px; margin-bottom: 24px;
    }
    .stat-card {
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 12px; padding: 20px;
    }
    .stat-label { font-size: 12px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 28px; font-weight: 800; color: #fff; margin-top: 6px; }

    /* Cards & Panels */
    .panel {
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 14px; padding: 24px; margin-bottom: 24px;
    }
    .panel-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
    }
    .panel-title { font-size: 17px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; }

    /* Tables */
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th {
      padding: 12px 16px; font-weight: 600; color: var(--text-muted);
      border-bottom: 1px solid var(--card-border); font-size: 12px; text-transform: uppercase;
    }
    td { padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); }
    tr:hover td { background: rgba(255, 255, 255, 0.02); }

    /* Status Badges */
    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 9px; border-radius: 6px; font-size: 11px; font-weight: 600;
    }
    .badge-active { background: var(--emerald-dim); color: var(--emerald); border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-revoked { background: var(--rose-dim); color: var(--rose); border: 1px solid rgba(244, 63, 94, 0.3); }
    .badge-healthy { background: var(--emerald-dim); color: var(--emerald); }
    .badge-disabled { background: rgba(255, 255, 255, 0.08); color: var(--text-muted); }

    /* Switch Toggle */
    .switch {
      position: relative; display: inline-block; width: 44px; height: 24px;
    }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute; cursor: pointer; inset: 0;
      background-color: rgba(255, 255, 255, 0.1);
      transition: .3s; border-radius: 24px; border: 1px solid var(--card-border);
    }
    .slider:before {
      position: absolute; content: ""; height: 16px; width: 16px;
      left: 3px; bottom: 3px; background-color: #fff;
      transition: .3s; border-radius: 50%;
    }
    input:checked + .slider { background-color: var(--cyan); border-color: var(--cyan); }
    input:checked + .slider:before { transform: translateX(20px); background-color: #030712; }

    .url-chip {
      font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--cyan);
      background: rgba(0, 0, 0, 0.4); padding: 4px 8px; border-radius: 6px;
      border: 1px solid rgba(0, 242, 254, 0.15); max-width: 260px;
      display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 200;
      padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600;
      background: rgba(17, 24, 39, 0.95); border: 1px solid var(--card-border);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px);
      display: none; align-items: center; gap: 8px;
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>

  <!-- Header -->
  <header class="header">
    <div class="brand-wrap">
      <div class="brand-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div>
        <div style="display:flex; align-items:center;">
          <span class="brand-title">ReZenOnance</span>
          <span class="badge-master">Master Console</span>
        </div>
      </div>
    </div>
    <div class="header-actions">
      <a href="/" class="btn btn-secondary" target="_blank">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Public Portal
      </a>
      <button class="btn btn-danger" onclick="adminLogout()">Sign Out</button>
    </div>
  </header>

  <main class="container">
    <!-- Top Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Minted Endpoints</div>
        <div class="stat-value" id="stat-total-addons">-</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Provider Pool</div>
        <div class="stat-value" id="stat-active-providers">-</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Racing Engine State</div>
        <div class="stat-value" style="color:var(--emerald);">OPERATIONAL</div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="tabs">
      <button class="tab-btn active" id="tab-btn-providers" onclick="switchTab('providers')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Provider Control Center
      </button>
      <button class="tab-btn" id="tab-btn-addons" onclick="switchTab('addons')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        User Addon Links
      </button>
      <button class="tab-btn" id="tab-btn-import" onclick="switchTab('import')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        Auto-Benchmark Addon Importer
      </button>
    </div>

    <!-- Tab 1: Providers Control -->
    <section id="tab-providers">
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              Live Upstream Racing Pool
            </div>
            <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">
              One-click disable or enable resolvers. Toggling immediately removes/adds the provider to the multi-source racing loop without server restarts.
            </p>
          </div>
          <button class="btn btn-secondary" onclick="loadProviders()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh Pool
          </button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Provider Name</th>
                <th>Type</th>
                <th>Base Endpoint</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="providers-table-body">
              <tr><td colspan="5" style="text-align:center; color:var(--text-dim); padding:24px;">Loading providers...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Tab 2: User Addons -->
    <section id="tab-addons" style="display:none;">
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Generated User Addon Endpoints
            </div>
            <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">
              Inspect all claimed endpoints, owners, and instantly revoke compromised or abusive links.
            </p>
          </div>
          <div style="display:flex; gap:8px;">
            <input type="text" id="addon-search-input" placeholder="Search email or slug..." class="input-field" style="margin:0; width:220px; padding:8px 12px; font-size:13px;" onkeyup="handleAddonSearch(event)">
            <button class="btn btn-secondary" onclick="loadAddons()">Search</button>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>User / Email</th>
                <th>Addon Manifest</th>
                <th>Created</th>
                <th>Daily Limit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="addons-table-body">
              <tr><td colspan="6" style="text-align:center; color:var(--text-dim); padding:24px;">Loading addons...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Tab 3: Benchmark Importer -->
    <section id="tab-import" style="display:none;">
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Automated Benchmark Addon Importer
            </div>
            <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">
              Paste any Stremio / Qobuz / Lossless manifest URL. The tester automatically runs a live benchmark query (testing manifest schema, search probe for known tracks, and stream link resolution). If it passes, it is added to the active racing pool.
            </p>
          </div>
        </div>

        <div style="max-width:680px;">
          <label style="font-size:13px; font-weight:600; color:var(--text-muted);">Upstream Manifest URL</label>
          <div style="display:flex; gap:10px; margin-top:6px;">
            <input type="url" id="import-url-input" class="input-field" placeholder="https://abc-addon.hostyay.xyz/manifest.json" style="margin:0;">
            <button class="btn btn-primary" id="btn-import-addon" onclick="importAddonCandidate()" style="white-space:nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Run Benchmark & Add
            </button>
          </div>

          <div id="import-feedback" style="margin-top:16px; display:none; padding:16px; border-radius:10px; font-size:13px; line-height:1.5;"></div>
        </div>
      </div>
    </section>
  </main>

  <!-- Login Modal -->
  <div id="auth-screen" style="display:none;">
    <div class="login-card">
      <div class="login-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <h2 style="font-size:22px; font-weight:800; color:#fff;">Master Admin Access</h2>
      <p style="font-size:13px; color:var(--text-muted); margin-top:6px;">Enter the master cryptographic key to unlock platform controls</p>
      
      <form onsubmit="handleAdminLogin(event)">
        <input type="password" id="admin-password-input" class="input-field" placeholder="Master Administrative Key" required autocomplete="current-password">
        <button type="submit" class="btn btn-primary" id="login-submit-btn" style="width:100%; justify-content:center; padding:12px;">Unlock Console</button>
      </form>
      <div id="login-error-msg" style="color:var(--rose); font-size:13px; margin-top:12px; display:none;"></div>
    </div>
  </div>

  <div id="toast-el" class="toast"></div>

  <script>
    var currentTab = 'providers';

    function showToast(msg, isError) {
      var t = document.getElementById('toast-el');
      t.innerText = msg;
      t.style.display = 'flex';
      t.style.borderColor = isError ? 'var(--rose)' : 'var(--cyan)';
      t.style.color = isError ? 'var(--rose)' : 'var(--cyan)';
      setTimeout(function() { t.style.display = 'none'; }, 2500);
    }

    function switchTab(name) {
      currentTab = name;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('tab-btn-' + name).classList.add('active');
      document.getElementById('tab-providers').style.display = name === 'providers' ? 'block' : 'none';
      document.getElementById('tab-addons').style.display = name === 'addons' ? 'block' : 'none';
      document.getElementById('tab-import').style.display = name === 'import' ? 'block' : 'none';

      if (name === 'providers') loadProviders();
      if (name === 'addons') loadAddons();
    }

    async function checkAuth() {
      try {
        var res = await fetch('/api/admin/overview');
        if (res.status === 401) {
          document.getElementById('auth-screen').style.display = 'flex';
          return false;
        }
        document.getElementById('auth-screen').style.display = 'none';
        var data = await res.json();
        if (data.ok) {
          document.getElementById('stat-total-addons').innerText = (data.totalAddons || 0).toLocaleString();
          document.getElementById('stat-active-providers').innerText = (data.activeProviders || 0) + ' Upstreams';
        }
        return true;
      } catch (err) {
        return false;
      }
    }

    async function handleAdminLogin(e) {
      e.preventDefault();
      var passInput = document.getElementById('admin-password-input');
      var errEl = document.getElementById('login-error-msg');
      var btn = document.getElementById('login-submit-btn');

      btn.disabled = true;
      btn.innerText = 'Verifying...';
      errEl.style.display = 'none';

      try {
        var res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: passInput.value })
        });
        var data = await res.json();
        if (res.ok && data.ok) {
          document.getElementById('auth-screen').style.display = 'none';
          passInput.value = '';
          loadOverview();
          loadProviders();
        } else {
          errEl.innerText = data.error || 'Invalid credentials';
          errEl.style.display = 'block';
        }
      } catch (err) {
        errEl.innerText = 'Network error: ' + err.message;
        errEl.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.innerText = 'Unlock Console';
      }
    }

    async function adminLogout() {
      await fetch('/api/admin/logout', { method: 'POST' });
      document.getElementById('auth-screen').style.display = 'flex';
    }

    async function loadOverview() {
      try {
        var res = await fetch('/api/admin/overview');
        if (res.ok) {
          var data = await res.json();
          document.getElementById('stat-total-addons').innerText = (data.totalAddons || 0).toLocaleString();
          document.getElementById('stat-active-providers').innerText = (data.activeProviders || 0) + ' Upstreams';
        }
      } catch {}
    }

    async function loadProviders() {
      var tbody = document.getElementById('providers-table-body');
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-dim); padding:24px;">Refreshing pool...</td></tr>';
      try {
        var res = await fetch('/api/admin/providers');
        if (res.status === 401) return checkAuth();
        var data = await res.json();
        if (!data.providers || data.providers.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-dim); padding:24px;">No providers in pool</td></tr>';
          return;
        }

        tbody.innerHTML = data.providers.map(function(p) {
          var isChecked = p.enabled ? 'checked' : '';
          var statusBadge = p.enabled 
            ? '<span class="badge badge-active"><span style="width:6px;height:6px;border-radius:50%;background:var(--emerald);"></span> Active</span>'
            : '<span class="badge badge-disabled">Disabled</span>';
          
          var deleteBtn = p.type === 'remote-addon' 
            ? '<button class="btn btn-danger" style="padding:4px 8px; font-size:11px;" onclick="deleteProvider(\\'' + p.id + '\\')">Delete</button>'
            : '<span style="color:var(--text-dim); font-size:11px;">Built-in</span>';

          return '<tr>' +
            '<td>' + statusBadge + '</td>' +
            '<td><strong style="color:#fff;">' + p.name + '</strong><br><span style="font-size:11px; color:var(--text-dim); font-family:monospace;">' + p.id + '</span></td>' +
            '<td><span class="badge badge-disabled">' + (p.type || 'built-in') + '</span></td>' +
            '<td><span class="url-chip">' + (p.baseUrl || 'native') + '</span></td>' +
            '<td><div style="display:flex; align-items:center; gap:12px;">' +
              '<label class="switch"><input type="checkbox" ' + isChecked + ' onchange="toggleProvider(\\'' + p.id + '\\', this.checked)"><span class="slider"></span></label>' +
              deleteBtn +
            '</div></td>' +
          '</tr>';
        }).join('');
      } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--rose); padding:24px;">Error: ' + err.message + '</td></tr>';
      }
    }

    async function toggleProvider(id, enabled) {
      try {
        var res = await fetch('/api/admin/providers/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id, enabled: enabled })
        });
        var data = await res.json();
        if (res.ok && data.ok) {
          showToast(id + (enabled ? ' enabled' : ' disabled') + ' in racing loop');
          loadProviders();
          loadOverview();
        } else {
          showToast('Failed to toggle provider: ' + (data.error || 'Unknown error'), true);
          loadProviders();
        }
      } catch (err) {
        showToast('Error: ' + err.message, true);
        loadProviders();
      }
    }

    async function deleteProvider(id) {
      if (!confirm('Are you sure you want to remove ' + id + ' from the provider pool?')) return;
      try {
        var res = await fetch('/api/admin/providers/' + encodeURIComponent(id), { method: 'DELETE' });
        var data = await res.json();
        if (res.ok && data.ok) {
          showToast('Provider ' + id + ' removed');
          loadProviders();
          loadOverview();
        } else {
          showToast('Delete failed: ' + (data.error || 'Unknown error'), true);
        }
      } catch (err) {
        showToast('Error: ' + err.message, true);
      }
    }

    async function importAddonCandidate() {
      var input = document.getElementById('import-url-input');
      var btn = document.getElementById('btn-import-addon');
      var fb = document.getElementById('import-feedback');
      var url = input.value.trim();
      if (!url) {
        showToast('Please enter an addon manifest URL', true);
        return;
      }

      btn.disabled = true;
      btn.innerText = 'Probing & Benchmarking...';
      fb.style.display = 'block';
      fb.style.background = 'var(--cyan-dim)';
      fb.style.color = 'var(--cyan)';
      fb.style.border = '1px solid rgba(0, 242, 254, 0.3)';
      fb.innerText = 'Connecting to ' + url + ' & running automated test pipeline...';

      try {
        var res = await fetch('/api/admin/providers/test-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ manifestUrl: url })
        });
        var data = await res.json();
        if (res.ok && data.ok) {
          fb.style.background = 'var(--emerald-dim)';
          fb.style.color = 'var(--emerald)';
          fb.style.border = '1px solid rgba(16, 185, 129, 0.3)';
          fb.innerHTML = '<strong>Benchmark Passed!</strong><br>' +
            'Name: ' + data.provider.name + '<br>' +
            'Latency: ' + data.details.latencyMs + 'ms<br>' +
            'Tracks Found: ' + data.details.trackCount + '<br>' +
            'Verified Sample: ' + data.details.sampleTitle + '<br>' +
            '<span style="color:#fff;">Provider has been added to the active racing loop!</span>';
          input.value = '';
          showToast('Addon successfully added to pool!');
          loadOverview();
        } else {
          fb.style.background = 'var(--rose-dim)';
          fb.style.color = 'var(--rose)';
          fb.style.border = '1px solid rgba(244, 63, 94, 0.3)';
          fb.innerHTML = '<strong>Benchmark Failed</strong><br>' + (data.error || 'Failed validation');
        }
      } catch (err) {
        fb.style.background = 'var(--rose-dim)';
        fb.style.color = 'var(--rose)';
        fb.innerHTML = '<strong>Request Failed</strong>: ' + err.message;
      } finally {
        btn.disabled = false;
        btn.innerText = 'Run Benchmark & Add';
      }
    }

    var addonSearchTerm = '';
    function handleAddonSearch(e) {
      if (e.key === 'Enter') {
        addonSearchTerm = e.target.value.trim();
        loadAddons();
      }
    }

    async function loadAddons() {
      var tbody = document.getElementById('addons-table-body');
      var searchInput = document.getElementById('addon-search-input');
      var query = searchInput ? searchInput.value.trim() : '';

      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-dim); padding:24px;">Loading endpoints...</td></tr>';
      try {
        var url = '/api/admin/addons?limit=50';
        if (query) url += '&search=' + encodeURIComponent(query);
        var res = await fetch(url);
        if (res.status === 401) return checkAuth();
        var data = await res.json();
        if (!data.addons || data.addons.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-dim); padding:24px;">No matching user addons found</td></tr>';
          return;
        }

        tbody.innerHTML = data.addons.map(function(a) {
          var isRevoked = a.is_revoked === true;
          var statusBadge = isRevoked 
            ? '<span class="badge badge-revoked">REVOKED</span>'
            : '<span class="badge badge-active">ACTIVE</span>';

          var actionBtn = isRevoked
            ? '<button class="btn btn-success" style="padding:4px 10px; font-size:12px;" onclick="toggleAddonRevocation(\\'' + a.addon_slug + '\\', false)">Restore</button>'
            : '<button class="btn btn-danger" style="padding:4px 10px; font-size:12px;" onclick="toggleAddonRevocation(\\'' + a.addon_slug + '\\', true)">Revoke</button>';

          var fullUrl = window.location.origin + '/u/' + a.addon_slug + '/manifest.json';
          var dateStr = a.created_at ? new Date(a.created_at).toLocaleDateString() : 'N/A';

          return '<tr>' +
            '<td>' + statusBadge + '</td>' +
            '<td><strong style="color:#fff;">' + (a.email || 'Anonymous') + '</strong></td>' +
            '<td><span class="url-chip" title="' + fullUrl + '">' + a.addon_slug + '</span> ' +
              '<button onclick="navigator.clipboard.writeText(\\'' + fullUrl + '\\'); showToast(\\'URL copied!\\');" style="background:none; border:none; color:var(--cyan); cursor:pointer;" title="Copy URL">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button></td>' +
            '<td><span style="color:var(--text-muted);">' + dateStr + '</span></td>' +
            '<td>' + (a.daily_limit || 300) + ' tracks/day</td>' +
            '<td>' + actionBtn + '</td>' +
          '</tr>';
        }).join('');
      } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--rose); padding:24px;">Error: ' + err.message + '</td></tr>';
      }
    }

    async function toggleAddonRevocation(slug, isRevoked) {
      try {
        var res = await fetch('/api/admin/addon/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: slug, isRevoked: isRevoked })
        });
        var data = await res.json();
        if (res.ok && data.ok) {
          showToast(slug + (isRevoked ? ' revoked' : ' restored'));
          loadAddons();
        } else {
          showToast('Failed to update: ' + (data.error || 'Unknown error'), true);
        }
      } catch (err) {
        showToast('Error: ' + err.message, true);
      }
    }

    // Initialize
    checkAuth().then(function(authed) {
      if (authed) {
        loadOverview();
        loadProviders();
      }
    });
  </script>
</body>
</html>`;
}
