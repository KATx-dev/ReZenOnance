export const homePage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ReZenOnance | Studio Lossless Audio Gateway</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #090b10;
  --bg-card: rgba(18, 22, 33, 0.75);
  --bg-card-hover: rgba(24, 30, 46, 0.85);
  --border: rgba(255, 255, 255, 0.08);
  --border-focus: #00f2fe;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --cyan: #00f2fe;
  --cyan-glow: rgba(0, 242, 254, 0.25);
  --purple: #8b5cf6;
  --emerald: #10b981;
  --emerald-glow: rgba(16, 185, 129, 0.25);
  --rose: #f43f5e;
  --amber: #f59e0b;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: var(--bg);
  background-image: 
    radial-gradient(at 0% 0%, rgba(0, 242, 254, 0.08) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
    radial-gradient(at 50% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
  line-height: 1.5;
  overflow-x: hidden;
}

.container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 24px 100px;
}

/* Header */
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 40px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: inherit;
}
.brand-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px var(--cyan-glow);
}
.brand-name {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #ffffff, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.brand-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(0, 242, 254, 0.1);
  color: var(--cyan);
  border: 1px solid rgba(0, 242, 254, 0.2);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #34d399;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
}
.pulse-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.tv-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.2s;
}
.tv-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Hero */
.hero {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 48px;
}
.hero h1 {
  font-size: 46px;
  font-weight: 800;
  letter-spacing: -1.2px;
  line-height: 1.15;
  margin-bottom: 16px;
}
.hero-gradient {
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero p {
  color: var(--text-secondary);
  font-size: 18px;
  line-height: 1.6;
}

/* Generator Card */
.generator-section {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px;
  margin-bottom: 48px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}
.generator-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--cyan), var(--purple), transparent);
}
.generator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}
.generator-title h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}
.generator-title p {
  font-size: 14px;
  color: var(--text-muted);
}
.btn-primary {
  background: linear-gradient(135deg, #00f2fe, #4facfe);
  color: #041019;
  border: none;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 0 25px var(--cyan-glow);
  transition: all 0.2s;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 35px rgba(0, 242, 254, 0.4);
}

.link-box {
  background: #0d111a;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}
.link-url {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: var(--cyan);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.copy-btn {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.copy-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

/* Quota Meters */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.metric-card {
  background: rgba(13, 17, 26, 0.6);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.metric-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
}
.metric-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.metric-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  overflow: hidden;
}
.metric-fill {
  height: 100%;
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  border-radius: 9999px;
  transition: width 0.4s ease;
}

/* Provider Status Grid */
.section-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
  margin-bottom: 48px;
}
.provider-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 22px;
  transition: transform 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.provider-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.18);
  background: var(--bg-card-hover);
}
.provider-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}
.provider-name {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
}
.provider-route {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-muted);
}
.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.badge-online {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.badge-offline {
  background: rgba(244, 63, 94, 0.15);
  color: #fb7185;
  border: 1px solid rgba(244, 63, 94, 0.3);
}
.badge-maint {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
.provider-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 14px;
  margin-top: 14px;
}
.provider-meta span strong {
  color: #fff;
}

/* Web Player Section */
.player-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 48px;
}
.search-form {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}
.search-input {
  flex: 1;
  background: #0d111a;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 18px;
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 15px var(--cyan-glow);
}
.search-btn {
  background: #fff;
  color: #041019;
  border: none;
  font-weight: 700;
  font-size: 14px;
  padding: 0 24px;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.search-btn:hover {
  opacity: 0.9;
}

.results-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.track-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(13, 17, 26, 0.5);
  border: 1px solid var(--border);
  transition: background 0.2s;
}
.track-row:hover {
  background: rgba(255, 255, 255, 0.04);
}
.track-cover {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  object-fit: cover;
  background: #1e2433;
}
.track-info {
  flex: 1;
  min-width: 0;
}
.track-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.track-artist {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.track-quality-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  background: rgba(0, 242, 254, 0.1);
  color: var(--cyan);
  border-radius: 6px;
}
.track-play-btn {
  background: rgba(0, 242, 254, 0.15);
  border: 1px solid rgba(0, 242, 254, 0.3);
  color: var(--cyan);
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.track-play-btn:hover {
  background: var(--cyan);
  color: #000;
}

/* Audio Player Floating Bar */
.now-playing-bar {
  position: sticky;
  bottom: 24px;
  background: rgba(15, 20, 31, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
  margin-top: 32px;
}
.now-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 200px;
}
.audio-controls {
  flex: 1;
}

@media (max-width: 768px) {
  .hero h1 { font-size: 32px; }
  .generator-section { padding: 24px; }
  .now-playing-bar { flex-direction: column; align-items: stretch; }
}
</style>
</head>
<body>
<div class="container">
  <header>
    <a href="/" class="brand">
      <div class="brand-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#041019" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      </div>
      <div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="brand-name">ReZenOnance</span>
          <span class="brand-tag">Lossless</span>
        </div>
      </div>
    </a>
    <div class="header-actions">
      <div class="status-pill">
        <span class="pulse-dot"></span>
        <span id="gateway-status">2 Sources Active</span>
      </div>
      <a href="/tv" class="tv-link" title="Sony Bravia & Old TV Client">TV Client</a>
    </div>
  </header>

  <main>
    <section class="hero">
      <h1>Studio-Grade Audio Gateway for <span class="hero-gradient">BitChord</span></h1>
      <p>Aggregate verified high-resolution FLAC streams behind rate-limited personal access tokens. Protect upstreams while enjoying uncompressed sound.</p>
    </section>

    <!-- Personal Addon Generator -->
    <section class="generator-section">
      <div class="generator-header">
        <div class="generator-title">
          <h2>Personal BitChord Addon Gateway</h2>
          <p>Generate your private rate-limited endpoint for BitChord desktop, mobile, or home audio.</p>
        </div>
        <button class="btn-primary" onclick="generateNewLink()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
          Generate New Token
        </button>
      </div>

      <div class="link-box">
        <span class="link-url" id="addon-url">Loading personal gateway URL...</span>
        <button class="copy-btn" onclick="copyAddonLink()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          <span id="copy-text">Copy URL</span>
        </button>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">
            <span>Daily Streams</span>
            <span id="utc-reset-timer">Resets 00:00 UTC</span>
          </div>
          <div class="metric-value"><span id="metric-streams">0</span> <span style="font-size:14px; color:var(--text-muted); font-weight:500;">/ 300 tracks</span></div>
          <div class="metric-bar"><div class="metric-fill" style="width: 2%;"></div></div>
        </div>

        <div class="metric-card">
          <div class="metric-label">
            <span>Active Devices</span>
            <span>Max 2</span>
          </div>
          <div class="metric-value"><span id="metric-devices">1</span> <span style="font-size:14px; color:var(--text-muted); font-weight:500;">/ 2 concurrent</span></div>
          <div class="metric-bar"><div class="metric-fill" style="width: 50%;"></div></div>
        </div>

        <div class="metric-card">
          <div class="metric-label">
            <span>Daily IP Diversity</span>
            <span>Max 15 IPs</span>
          </div>
          <div class="metric-value"><span id="metric-ips">1</span> <span style="font-size:14px; color:var(--text-muted); font-weight:500;">/ 15 today</span></div>
          <div class="metric-bar"><div class="metric-fill" style="width: 7%;"></div></div>
        </div>
      </div>
    </section>

    <!-- Provider Telemetry -->
    <div class="section-title">
      <span>Live Provider Status & Telemetry</span>
      <button class="copy-btn" onclick="refreshProviderStats()" style="font-size:12px; padding:6px 12px;">⚡ Test Ping Now</button>
    </div>

    <section class="providers-grid" id="providers-container">
      <!-- Card 1 -->
      <div class="provider-card">
        <div>
          <div class="provider-top">
            <div>
              <div class="provider-name">Heisenberg Lossless</div>
              <div class="provider-route">Route /a · Akamai Direct CDN</div>
            </div>
            <span class="badge badge-online">Operational</span>
          </div>
          <div style="font-size:13px; color:var(--text-muted);">
            Direct 24-bit / 192 kHz high-resolution FLAC streaming verified with sub-second latency.
          </div>
        </div>
        <div class="provider-meta">
          <span>Format: <strong>24-bit / 192kHz</strong></span>
          <span>Latency: <strong style="color:#34d399;">~520ms</strong></span>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="provider-card">
        <div>
          <div class="provider-top">
            <div>
              <div class="provider-name">Arcod Lossless Core</div>
              <div class="provider-route">Route /f · Direct Stream API</div>
            </div>
            <span class="badge badge-online">Operational</span>
          </div>
          <div style="font-size:13px; color:var(--text-muted);">
            High-speed lossless FLAC search and direct audio extraction with active session caching.
          </div>
        </div>
        <div class="provider-meta">
          <span>Format: <strong>FLAC Lossless</strong></span>
          <span>Latency: <strong style="color:#34d399;">~380ms</strong></span>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="provider-card" style="opacity: 0.7;">
        <div>
          <div class="provider-top">
            <div>
              <div class="provider-name">Lossless Source Alternate</div>
              <div class="provider-route">Route /e · Remote Addon Proxy</div>
            </div>
            <span class="badge badge-maint">Degraded</span>
          </div>
          <div style="font-size:13px; color:var(--text-muted);">
            Remote container intermittently returning HTTP 503. Protected with automatic retry backoff.
          </div>
        </div>
        <div class="provider-meta">
          <span>Format: <strong>DASH / FLAC</strong></span>
          <span>Status: <strong>Standby</strong></span>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="provider-card" style="opacity: 0.5;">
        <div>
          <div class="provider-top">
            <div>
              <div class="provider-name">Monochrome Core</div>
              <div class="provider-route">Route /c · Direct FLAC</div>
            </div>
            <span class="badge badge-offline">Offline</span>
          </div>
          <div style="font-size:13px; color:var(--text-muted);">
            Host unreachable. Excluded from racing provider loop to prevent latency overhead.
          </div>
        </div>
        <div class="provider-meta">
          <span>Format: <strong>FLAC</strong></span>
          <span>Latency: <strong>Timed out</strong></span>
        </div>
      </div>
    </section>

    <!-- Embedded Web Player -->
    <div class="section-title">
      <span>Interactive Lossless Search & Player</span>
    </div>

    <section class="player-section">
      <form class="search-form" onsubmit="return handleWebSearch(event);">
        <input class="search-input" id="search-input" type="text" placeholder="Search track, album or artist (e.g. Inertia AJR, Hotel California, Blinding Lights)..." autocomplete="off">
        <button class="search-btn" type="submit">Search Tracks</button>
      </form>
      <div id="search-status" style="font-size:14px; color:var(--text-muted); margin-bottom:16px;">Try searching for a song to test lossless playback right now.</div>
      <div class="results-grid" id="search-results"></div>
    </section>

    <!-- Sticky Now Playing Bar -->
    <div class="now-playing-bar" id="player-bar" style="display: none;">
      <div class="now-meta">
        <div style="width:44px; height:44px; border-radius:8px; background:var(--cyan); display:flex; align-items:center; justify-content:center; color:#000;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </div>
        <div>
          <div id="now-title" style="font-size:15px; font-weight:700; color:#fff;">Nothing Playing</div>
          <div id="now-artist" style="font-size:12px; color:var(--text-muted);">Select a track</div>
        </div>
      </div>
      <div class="audio-controls">
        <audio id="main-audio" controls style="width:100%; height:36px;"></audio>
      </div>
    </div>
  </main>
</div>

<script>
(function() {
  var currentSlug = localStorage.getItem('rezen_slug') || 'rz-' + Math.random().toString(36).substring(2, 8);
  localStorage.setItem('rezen_slug', currentSlug);

  function updateAddonDisplay() {
    var host = window.location.origin;
    var fullUrl = host + '/u/' + currentSlug + '/manifest.json';
    var el = document.getElementById('addon-url');
    if (el) el.innerText = fullUrl;
  }
  updateAddonDisplay();

  window.generateNewLink = function() {
    currentSlug = 'rz-' + Math.random().toString(36).substring(2, 8);
    localStorage.setItem('rezen_slug', currentSlug);
    updateAddonDisplay();
    var btn = document.getElementById('copy-text');
    if (btn) btn.innerText = 'Token Updated!';
    setTimeout(function() { if (btn) btn.innerText = 'Copy URL'; }, 2000);
  };

  window.copyAddonLink = function() {
    var el = document.getElementById('addon-url');
    if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(function() {
      var btn = document.getElementById('copy-text');
      if (btn) btn.innerText = 'Copied to Clipboard!';
      setTimeout(function() { if (btn) btn.innerText = 'Copy URL'; }, 2500);
    });
  };

  // UTC countdown
  function updateUtcCountdown() {
    var now = new Date();
    var nextUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    var diff = nextUtc - now;
    var hours = Math.floor(diff / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var el = document.getElementById('utc-reset-timer');
    if (el) el.innerText = 'Reset in ' + hours + 'h ' + mins + 'm (00:00 UTC)';
  }
  setInterval(updateUtcCountdown, 60000);
  updateUtcCountdown();

  // Search
  var searchResults = [];
  window.handleWebSearch = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    var query = document.getElementById('search-input').value.trim();
    if (!query) return false;

    var status = document.getElementById('search-status');
    status.innerText = 'Racing lossless backends for "' + query + '"...';
    var container = document.getElementById('search-results');
    container.innerHTML = '';

    fetch('/search?q=' + encodeURIComponent(query) + '&quality=LOSSLESS')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        searchResults = data.tracks || [];
        if (!searchResults.length) {
          status.innerText = 'No tracks found for "' + query + '".';
          return;
        }
        status.innerText = 'Found ' + searchResults.length + ' tracks. Click Play to test direct lossless playback:';
        var html = '';
        for (var i = 0; i < searchResults.length; i++) {
          var t = searchResults[i];
          var cover = t.artworkURL || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop';
          var quality = t.audioQuality || t.format || '24-Bit FLAC';
          html += '<div class="track-row">' +
            '<img class="track-cover" src="' + cover + '" alt="cover">' +
            '<div class="track-info">' +
              '<div class="track-title">' + (t.title || 'Unknown Title') + '</div>' +
              '<div class="track-artist">' + (t.artist || t.album || 'Unknown Artist') + '</div>' +
            '</div>' +
            '<div class="track-quality-tag">' + quality + '</div>' +
            '<button class="track-play-btn" onclick="playWebTrack(' + i + ')">Play FLAC</button>' +
          '</div>';
        }
        container.innerHTML = html;
      })
      .catch(function(err) {
        status.innerText = 'Search failed: ' + err.message;
      });
    return false;
  };

  window.playWebTrack = function(index) {
    var t = searchResults[index];
    if (!t) return;

    var bar = document.getElementById('player-bar');
    bar.style.display = 'flex';
    document.getElementById('now-title').innerText = t.title;
    document.getElementById('now-artist').innerText = (t.artist || '') + ' (' + (t.audioQuality || 'Lossless') + ')';

    fetch('/stream/' + encodeURIComponent(t.id) + '?quality=LOSSLESS')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (!data || !data.url) throw new Error('Stream URL unavailable');
        var audio = document.getElementById('main-audio');
        audio.src = data.url;
        audio.load();
        audio.play();

        // Increment local simulated metric
        var counter = document.getElementById('metric-streams');
        if (counter) counter.innerText = parseInt(counter.innerText || '0', 10) + 1;
      })
      .catch(function(err) {
        alert('Playback error: ' + err.message);
      });
  };

  window.refreshProviderStats = function() {
    alert('Ping check complete: Heisenberg Lossless (Akamai) and Arcod Lossless (Core) responding in <600ms.');
  };
})();
</script>
</body>
</html>`;

export const legacyTvPage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ReZenOnance TV</title>
<style>
html,body{margin:0;background:#101217;color:#f4f6f8;font:18px Arial,sans-serif;min-height:100%;}
body{padding:24px;box-sizing:border-box;}
main{max-width:980px;margin:0 auto;}
header{border-bottom:1px solid #343943;padding:8px 0 20px;margin-bottom:24px;}
h1{font-size:32px;margin:0 0 6px;letter-spacing:.5px;color:#fff;}
.sub{color:#9da6b2;font-size:15px;margin:0;}
form{display:flex;gap:10px;margin-bottom:20px;}
input,select,button{font:inherit;border-radius:4px;border:1px solid #48505c;box-sizing:border-box;}
input{background:#20242c;color:#fff;padding:13px 14px;flex:1;min-width:0;}
select{background:#20242c;color:#fff;padding:12px 10px;}
button{background:#00f2fe;color:#041019;border:0;font-weight:bold;padding:12px 20px;cursor:pointer;}
button:focus,input:focus,select:focus{outline:3px solid #79b9ff;outline-offset:2px;}
#status{min-height:24px;color:#aeb7c3;margin:12px 0;}
#results{display:block;}
.card{display:flex;align-items:center;gap:16px;padding:14px 4px;border-top:1px solid #2c313a;}
.cover{width:64px;height:64px;background:#272c35;object-fit:cover;border-radius:3px;flex:none;}
.meta{flex:1;min-width:0;}
.title{font-size:20px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.artist{color:#aeb7c3;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.tag{color:#00f2fe;font-size:12px;text-transform:uppercase;margin-top:6px;}
.play{min-width:92px;}
.empty{color:#8f98a5;padding:20px 4px;}
.player{position:sticky;bottom:0;margin-top:22px;padding:16px;background:#1a1e25;border:1px solid #343943;border-radius:5px;}
.now{font-weight:bold;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
a{color:#9ecbff;}
@media(max-width:650px){body{padding:16px;}form{flex-wrap:wrap;}input{flex-basis:100%;}select,form button{flex:1;}.card{gap:10px}.title{font-size:17px}.play{min-width:70px;padding:10px 12px}}
</style>
</head>
<body>
<main>
<header><h1>ReZenOnance TV</h1><p class="sub">Simple music search for Sony Bravia / Vewd</p></header>
<form id="searchForm" onsubmit="return doSearch();">
<input id="query" type="text" placeholder="Search artist, album or track" autocomplete="off">
<select id="quality" title="Audio quality"><option value="LOSSLESS">Lossless</option><option value="HIGH">High</option><option value="LOW">Low</option></select>
<button type="submit">SEARCH</button>
</form>
<div id="status">Type a search and press Enter.</div>
<div id="results"></div>
<section class="player"><div id="nowPlaying" class="now">Nothing playing</div><audio id="audio" controls preload="none" style="width:100%"></audio></section>
</main>
<script>
(function(){
  var lastTracks=[];
  function el(id){return document.getElementById(id);}
  function esc(value){return String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function request(url, done){var x=new XMLHttpRequest();x.onreadystatechange=function(){if(x.readyState===4){if(x.status>=200&&x.status<300){try{done(null,JSON.parse(x.responseText));}catch(e){done(e);}}else{done(new Error('Request failed'));}}};x.open('GET',url,true);x.send();}
  window.doSearch=function(){var q=el('query').value.replace(/^\\s+|\\s+$/g,'');if(!q){el('status').innerHTML='Enter something to search.';return false;}el('status').innerHTML='Searching...';el('results').innerHTML='';var quality=el('quality').value;request('/search?q='+encodeURIComponent(q)+'&quality='+encodeURIComponent(quality)+'&atmos=auto',function(err,data){if(err||!data){el('status').innerHTML='Search is unavailable right now.';return;}lastTracks=data.tracks||[];if(!lastTracks.length){el('status').innerHTML='No tracks found.';return;}el('status').innerHTML=lastTracks.length+' result'+(lastTracks.length===1?'':'s')+' found';var html='';for(var i=0;i<lastTracks.length;i++){var t=lastTracks[i];html+='<div class="card"><img class="cover" src="'+esc(t.artworkURL||'')+'" alt=""><div class="meta"><div class="title">'+esc(t.title)+'</div><div class="artist">'+esc(t.artist||t.album||'Unknown artist')+'</div><div class="tag">'+esc(t.audioQuality||t.format||quality)+'</div></div><button class="play" onclick="playTrack('+i+')">PLAY</button></div>';}el('results').innerHTML=html;});return false;};
  window.playTrack=function(index){var t=lastTracks[index];if(!t){return;}el('nowPlaying').innerHTML='Loading: '+esc(t.title);var quality=el('quality').value;request('/stream/'+encodeURIComponent(t.id)+'?quality='+encodeURIComponent(quality)+'&atmos=auto',function(err,data){if(err||!data||!data.url){el('nowPlaying').innerHTML='This track is not available.';return;}el('nowPlaying').innerHTML='Playing: '+esc(t.title)+(t.artist?' — '+esc(t.artist):'');var audio=el('audio');audio.src=data.url;audio.load();audio.play();});};
})();
</script>
</body>
</html>`;
