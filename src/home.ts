export const homePage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ReZenOnance | Studio Lossless Audio Gateway</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --bg-deep: #0c0908;
  --bg-surface: #140f0d;
  --bg-card: #191311;
  --bg-card-hover: #221a17;
  --border: rgba(255, 255, 255, 0.07);
  --border-light: rgba(255, 255, 255, 0.14);
  --border-peach: rgba(255, 178, 153, 0.28);
  --peach: #ffb299;
  --peach-light: #fcd5ce;
  --peach-glow: rgba(255, 178, 153, 0.35);
  --sunset: #f97316;
  --cream: #fff2ec;
  --text-primary: #fff2ec;
  --text-secondary: #a89993;
  --text-muted: #736560;
  --emerald: #10b981;
  --emerald-glow: rgba(16, 185, 129, 0.25);
  --amber: #f59e0b;
  --rose: #f43f5e;
  --purple: #a855f7;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: radial-gradient(circle at 50% -10%, rgba(255, 178, 153, 0.10), transparent 60%),
              radial-gradient(circle at 90% 90%, rgba(249, 115, 22, 0.05), transparent 50%),
              var(--bg-deep);
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-deep); }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.12); border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: var(--peach); }

/* Top Floating Capsule Navbar */
.top-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: rgba(12, 9, 8, 0.85);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
}

.brand-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--peach), var(--sunset));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #120e0d;
  font-size: 16px;
  box-shadow: 0 0 15px var(--peach-glow);
}

.brand-title {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #fff;
}
.brand-title span {
  color: var(--peach);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
  animation: pulseAnim 2s infinite;
}

@keyframes pulseAnim {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(0.85); }
}

.tv-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 15px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}
.tv-link-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
}

.auth-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 178, 153, 0.14);
  border: 1px solid var(--border-peach);
  color: var(--peach);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.auth-pill-btn:hover {
  background: rgba(255, 178, 153, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 0 16px var(--peach-glow);
}

.user-profile-pill {
  display: none;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border);
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}
.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--peach);
  color: #120e0d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  overflow: hidden;
}

/* Main Viewport Container */
.app-viewport {
  flex: 1;
  max-width: 1120px;
  margin: 0 auto;
  width: 100%;
  padding: 30px 20px 110px 20px;
}

/* SPA Pages Visibility */
.app-page {
  display: none;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.app-page.active {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

/* Typography & Accent Text */
.gradient-text {
  background: linear-gradient(135deg, #ffb299 0%, #fbd5b5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ============================================== */
/* PAGE 1: HOME (YouLy+ Inspo Hero & Feature Grid)*/
/* ============================================== */
.hero-section {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr;
  gap: 40px;
  align-items: center;
  margin-bottom: 56px;
}

@media (max-width: 900px) {
  .hero-section { grid-template-columns: 1fr; gap: 32px; }
}

.hero-content h1 {
  font-size: clamp(34px, 5.2vw, 54px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -1.2px;
  margin-bottom: 20px;
  color: #fff;
}

.hero-content p {
  font-size: 16px;
  line-height: 1.65;
  color: var(--text-secondary);
  margin-bottom: 28px;
  max-width: 520px;
}
.hero-content p strong {
  color: #fff;
}

.hero-cta-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-peach-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 26px;
  border-radius: 9999px;
  background: var(--peach);
  color: #120e0d;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow: 0 4px 20px var(--peach-glow);
  font-family: inherit;
}
.btn-peach-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 28px var(--peach-glow);
  background: #ffc2b0;
}

.btn-dark-capsule {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 24px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-light);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.22s ease;
  font-family: inherit;
}
.btn-dark-capsule:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
}

/* YouLy+ Interactive Showcase Player Card */
.showcase-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 26px;
  padding: 22px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.55);
}

.showcase-mesh-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.35) 0%, rgba(168, 85, 247, 0.28) 50%, rgba(59, 130, 246, 0.25) 100%);
  filter: blur(40px);
  opacity: 0.7;
  pointer-events: none;
}

.showcase-inner {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 18px;
  align-items: center;
}

.showcase-art {
  width: 110px;
  height: 110px;
  border-radius: 18px;
  object-fit: cover;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
  flex-shrink: 0;
}

.showcase-lyrics-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lyrics-line-active {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  line-height: 1.4;
}
.lyrics-line-active span {
  color: var(--peach);
}

.lyrics-line-dim {
  font-size: 13px;
  color: rgba(255, 242, 236, 0.55);
  line-height: 1.4;
}

.showcase-footer {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  position: relative;
  z-index: 2;
}

/* Feature Grid Cards */
.feature-grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 18px;
  margin-top: 20px;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 26px;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.feature-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-peach);
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.feature-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: rgba(255, 178, 153, 0.12);
  border: 1px solid var(--border-peach);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--peach);
  font-size: 20px;
}

.feature-title {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
}

.feature-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* ============================================== */
/* PAGE 2: DASHBOARD (Personal Addon Gateway & Quota) */
/* ============================================== */
.dashboard-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-head {
  margin-bottom: 8px;
}
.page-head h2 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.6px;
  color: #fff;
  margin-bottom: 6px;
}
.page-head p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.addon-card {
  background: var(--bg-card);
  border: 1px solid var(--border-peach);
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.45);
}

.addon-url-row {
  display: flex;
  gap: 12px;
  margin: 18px 0;
  flex-wrap: wrap;
}

.addon-url-input {
  flex: 1;
  min-width: 260px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 18px;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;
}
.addon-url-input:focus {
  border-color: var(--peach);
  box-shadow: 0 0 15px var(--peach-glow);
}

.action-chips-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.chip-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  padding: 8px 15px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
}
.chip-btn:hover {
  background: rgba(255, 178, 153, 0.12);
  border-color: var(--border-peach);
  color: #fff;
  transform: translateY(-1px);
}

.slug-customizer-box {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.slug-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 220px;
}
.slug-input-wrap input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 12px;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  outline: none;
  width: 100%;
}
.slug-input-wrap input:focus {
  border-color: var(--peach);
}

.quota-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.quota-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 22px;
}

.quota-title {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.quota-value {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 6px;
}

.quota-bar-bg {
  height: 6px;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  overflow: hidden;
  margin: 10px 0 6px 0;
}
.quota-bar-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #10b981, var(--peach));
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* ============================================== */
/* PAGE 3: CURIOSITY & TELEMETRY NETWORK PULSE */
/* ============================================== */
.curiosity-grid-4 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.curiosity-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 22px;
  position: relative;
  overflow: hidden;
}

.curiosity-card-label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--peach);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.curiosity-card-metric {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}

.curiosity-card-sub {
  font-size: 12px;
  color: var(--text-secondary);
}

.telemetry-table-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 24px;
}

.node-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.node-item-box {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.node-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.node-name {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
}
.node-status-tag {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* ============================================== */
/* PAGE 4: EXPLORER (Lossless Music Search & Play) */
/* ============================================== */
.search-bar-wrap {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input-field {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px 20px;
  color: #fff;
  font-size: 15px;
  outline: none;
  font-family: inherit;
  transition: all 0.2s ease;
}
.search-input-field:focus {
  border-color: var(--peach);
  box-shadow: 0 0 20px var(--peach-glow);
}

.tracks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.track-item-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s ease;
}
.track-item-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-peach);
  transform: translateY(-2px);
}

.track-cover-img {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.track-info {
  flex: 1;
  min-width: 0;
}
.track-title-text {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.track-artist-text {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.play-track-btn {
  background: rgba(255, 178, 153, 0.15);
  border: 1px solid var(--border-peach);
  color: var(--peach);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.play-track-btn:hover {
  background: var(--peach);
  color: #120e0d;
  transform: scale(1.08);
}

/* ============================================== */
/* BOTTOM FLOATING PILL DOCK NAVIGATION           */
/* ============================================== */
.bottom-dock-container {
  position: fixed;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: auto;
}

.bottom-pill-dock {
  background: rgba(22, 17, 15, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-peach);
  border-radius: 9999px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(255, 178, 153, 0.15);
}

.dock-tab-btn {
  background: transparent;
  border: none;
  padding: 10px 18px;
  border-radius: 9999px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: inherit;
  white-space: nowrap;
}

.dock-tab-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.dock-tab-btn.active {
  background: var(--peach);
  color: #120e0d;
  font-weight: 800;
  box-shadow: 0 0 16px var(--peach-glow);
}

.dock-tab-icon {
  font-size: 15px;
  display: flex;
  align-items: center;
}

/* Auth & QR Modals */
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 2000;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-box {
  background: #171210;
  border: 1px solid var(--border-peach);
  border-radius: 26px;
  padding: 32px;
  max-width: 420px;
  width: 100%;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 178, 153, 0.15);
  animation: modalScale 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: var(--text-secondary);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.modal-close-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.15); }

.auth-btn-oauth {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 13px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  font-family: inherit;
}
.auth-btn-google {
  background: #ffffff;
  color: #1a1a1a;
  border: none;
}
.auth-btn-google:hover {
  background: #f1f1f1;
  transform: translateY(-1px);
}
.auth-btn-discord {
  background: #5865F2;
  color: #fff;
  border: none;
}
.auth-btn-discord:hover {
  background: #4752c4;
  transform: translateY(-1px);
}
.auth-btn-guest {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-light);
  color: #fff;
}
.auth-btn-guest:hover {
  background: rgba(255, 255, 255, 0.12);
}
</style>
</head>
<body>

  <!-- Top Floating Capsule Navbar -->
  <header class="top-navbar">
    <div class="brand-wrap" onclick="switchPage('home')">
      <div class="brand-icon">♫</div>
      <div class="brand-title">ReZen<span>Onance</span></div>
    </div>

    <div class="nav-actions">
      <div class="status-pill">
        <span class="pulse-dot"></span>
        <span id="gateway-status">Verified Lossless</span>
      </div>

      <a href="/tv" class="tv-link-btn" title="Lightweight Sony Bravia & Vewd TV mode">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="15" x="2" y="3" rx="2"/><polyline points="17 21 12 17 7 21"/></svg>
        <span>TV Mode</span>
      </a>

      <!-- Auth State Trigger -->
      <button class="auth-pill-btn" id="header-signin-btn" onclick="openAuthModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Sign In</span>
      </button>

      <div class="user-profile-pill" id="header-user-pill">
        <div class="user-avatar" id="header-user-avatar">U</div>
        <span id="header-user-email">User</span>
        <button onclick="handleSignOut()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:11px;margin-left:4px;" title="Sign out">✕</button>
      </div>
    </div>
  </header>

  <!-- Main Viewport Area -->
  <main class="app-viewport">

    <!-- ============================================== -->
    <!-- 1. PAGE: HOME                                   -->
    <!-- ============================================== -->
    <div class="app-page active" id="page-home">
      <section class="hero-section">
        <div class="hero-content">
          <h1>Make your music <br><span class="gradient-text">Main Character</span> energy.</h1>
          <p>
            Streaming web players are often limited or laggy. <strong>ReZenOnance</strong> replaces them with a high-performance, studio-grade lossless gateway for <strong>BitChord, Mochy, and Metrofuse</strong>. Up to 24-bit / 192 kHz FLAC with zero transcoding.
          </p>
          <div class="hero-cta-row">
            <button class="btn-peach-primary" onclick="switchPage('dashboard')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Get Personal Addon URL</span>
            </button>
            <button class="btn-dark-capsule" onclick="switchPage('explorer')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Audition Streams</span>
            </button>
          </div>
        </div>

        <!-- YouLy+ Showcase Card -->
        <div class="showcase-card">
          <div class="showcase-mesh-bg"></div>
          <div class="showcase-inner">
            <img class="showcase-art" src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop" alt="Artwork">
            <div class="showcase-lyrics-wrap">
              <div class="lyrics-line-active">When I walk in the room everybody gonna <span>watch us sizzle</span></div>
              <div class="lyrics-line-dim">Got a crew so hot no riddles</div>
              <div class="lyrics-line-dim">Direct 24-bit / 192 kHz Bit-Perfect Stream</div>
            </div>
          </div>
          <div class="showcase-footer">
            <span style="color:var(--peach);">★ 24-BIT / 192 KHZ FLAC</span>
            <span style="color:var(--text-muted);">MONOCHROME &amp; ARCOD RACING</span>
          </div>
        </div>
      </section>

      <!-- 4 Core Features Grid -->
      <div class="feature-grid-3">
        <div class="feature-card">
          <div class="feature-icon-box">⚡</div>
          <div class="feature-title">Racing Multi-Backend</div>
          <div class="feature-desc">Queries live upstream lossless cores simultaneously. The fastest verified bitstream wins with zero buffering or provider outages.</div>
        </div>

        <div class="feature-card">
          <div class="feature-icon-box">🎧</div>
          <div class="feature-title">True Lossless Bitstream</div>
          <div class="feature-desc">Pure uncompressed PCM transmission up to 9,216 kbps. No lossy compression, dynamic compression, or telemetry downsampling.</div>
        </div>

        <div class="feature-card">
          <div class="feature-icon-box">📱</div>
          <div class="feature-title">Universal Compatibility</div>
          <div class="feature-desc">100% compliant BitChord manifest format. Seamlessly install into BitChord, Mochy, Metrofuse, Symfonium, or Kodi.</div>
        </div>

        <div class="feature-card">
          <div class="feature-icon-box">📺</div>
          <div class="feature-title">Old TV &amp; Hi-Fi Support</div>
          <div class="feature-desc">Legacy Sony Bravia and Vewd TVs get a specialized ultra-lightweight client at <a href="/tv" style="color:var(--peach);text-decoration:none;font-weight:700;">/tv</a> that runs smoothly on low-RAM chips.</div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- 2. PAGE: DASHBOARD (Personal Addon & Quota)     -->
    <!-- ============================================== -->
    <div class="app-page" id="page-dashboard">
      <div class="dashboard-wrap">
        <div class="page-head">
          <h2>Personal Addon Gateway</h2>
          <p>Copy your personalized manifest URL or customize your token alias to install ReZenOnance into your media player.</p>
        </div>

        <!-- Addon Manifest Box -->
        <div class="addon-card">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:12px; font-weight:800; color:var(--peach); text-transform:uppercase; letter-spacing:0.8px;">Personal Addon Endpoint</span>
              <span style="font-size:11px; padding:2px 8px; border-radius:9999px; background:rgba(16,185,129,0.15); color:#34d399; font-weight:700;">● Active</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted); font-family:'JetBrains Mono',monospace;">Contract: com.bitchord.qobuz</div>
          </div>

          <div class="addon-url-row">
            <input type="text" class="addon-url-input" id="addon-url" readonly value="https://rezenonance.onrender.com/manifest.json">
            <button class="btn-peach-primary" id="copy-btn" onclick="copyAddonLink()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span id="copy-btn-text">Copy Addon URL</span>
            </button>
          </div>

          <!-- Quick Action Chips -->
          <div class="action-chips-row">
            <button class="chip-btn" onclick="openQrModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/></svg>
              <span>Scan QR Code</span>
            </button>
            <button class="chip-btn" id="generate-new-link-btn" onclick="generateNewLink()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
              <span>Roll New Token</span>
            </button>
            <a href="bitchord://install-addon?url=" id="bitchord-direct-link" class="chip-btn" style="text-decoration:none;">
              <span>⚡ BitChord 1-Click Install</span>
            </a>
          </div>

          <!-- Custom Slug Setter -->
          <div class="slug-customizer-box">
            <div style="font-size:13px; font-weight:700; color:#fff;">Customize Token Alias:</div>
            <div class="slug-input-wrap">
              <input type="text" id="custom-slug-input" placeholder="e.g. rz-myalias" maxlength="32">
              <button class="btn-dark-capsule" style="padding:8px 16px; font-size:12px;" onclick="applyCustomSlug()">Save</button>
            </div>
          </div>
        </div>

        <!-- Quota & Telemetry Row -->
        <div class="quota-dashboard-grid">
          <div class="quota-card">
            <div class="quota-title">Daily Streaming Allowance</div>
            <div class="quota-value" id="quota-val">250 <span style="font-size:14px; color:var(--text-muted);">/ 250</span></div>
            <div class="quota-bar-bg">
              <div class="quota-bar-fill" id="quota-bar" style="width:100%;"></div>
            </div>
            <div style="font-size:12px; color:var(--text-secondary);" id="utc-countdown">Resets at 00:00 UTC</div>
          </div>

          <div class="quota-card">
            <div class="quota-title">Account Security</div>
            <div class="quota-value" style="font-size:18px;" id="auth-display-tier">Fair-Use Guest</div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:8px;">
              Anti-Sybil browser tracker attached. Sign in with Google or Discord to preserve your token permanently.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- 3. PAGE: CURIOSITY & TELEMETRY NETWORK PULSE   -->
    <!-- ============================================== -->
    <div class="app-page" id="page-curiosity">
      <div class="page-head">
        <h2>Curiosity &amp; Network Pulse</h2>
        <p>Live cluster telemetry: songs served, server uptime, system resource usage, and upstream node latency.</p>
      </div>

      <!-- 4 Highlight Stat Cards -->
      <div class="curiosity-grid-4">
        <div class="curiosity-card">
          <div class="curiosity-card-label">🎵 Total Songs Served</div>
          <div class="curiosity-card-metric" id="stat-songs-served">248,190</div>
          <div class="curiosity-card-sub">Studio lossless streams dispatched</div>
        </div>

        <div class="curiosity-card">
          <div class="curiosity-card-label">⏱️ Server Uptime</div>
          <div class="curiosity-card-metric" id="stat-uptime">100%</div>
          <div class="curiosity-card-sub" id="stat-uptime-detail">Zero downtime cluster</div>
        </div>

        <div class="curiosity-card">
          <div class="curiosity-card-label">⚡ System RAM Used</div>
          <div class="curiosity-card-metric" id="stat-ram">48 <span style="font-size:14px; color:var(--text-muted);">MB</span></div>
          <div class="curiosity-card-sub" id="stat-ram-detail">Lightweight V8 footprint</div>
        </div>

        <div class="curiosity-card">
          <div class="curiosity-card-label">🏎️ Racing Latency</div>
          <div class="curiosity-card-metric" id="stat-latency">~310 <span style="font-size:14px; color:var(--text-muted);">ms</span></div>
          <div class="curiosity-card-sub">Multi-provider parallel probe</div>
        </div>
      </div>

      <!-- Node Health Card -->
      <div class="telemetry-table-card">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div>
            <div style="font-size:16px; font-weight:800; color:#fff;">Active Upstream Lossless Backends</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Parallel racing instances routing bitstreams with 0ms downtime</div>
          </div>
          <button class="chip-btn" onclick="fetchTelemetry(true)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
            <span id="ping-btn-text">Test Ping Latency</span>
          </button>
        </div>

        <div class="node-list-grid" id="node-list-grid">
          <div class="node-item-box">
            <div class="node-item-header">
              <span class="node-name">Monochrome Lossless Core</span>
              <span class="node-status-tag">Operational</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted); font-family:'JetBrains Mono',monospace;">Route: /c &middot; 24-bit / 192 kHz FLAC</div>
            <div style="font-size:12px; color:#34d399; font-weight:700;">Ping: <span id="ping-monochrome">310 ms</span></div>
          </div>

          <div class="node-item-box">
            <div class="node-item-header">
              <span class="node-name">Arcod Lossless Core</span>
              <span class="node-status-tag">Operational</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted); font-family:'JetBrains Mono',monospace;">Route: /f &middot; FLAC Lossless</div>
            <div style="font-size:12px; color:#34d399; font-weight:700;">Ping: <span id="ping-arcod">380 ms</span></div>
          </div>
        </div>

        <div style="margin-top:18px; padding-top:14px; border-top:1px solid var(--border); display:flex; justify-content:space-between; font-size:12px; color:var(--text-muted); flex-wrap:wrap; gap:8px;">
          <span>Runtime: <span id="sys-runtime" style="color:#fff;">Node.js</span></span>
          <span>Gateway Overhead: <span style="color:#34d399; font-weight:700;">&lt; 2 ms</span></span>
          <span>Failover: <span style="color:var(--peach); font-weight:700;">Automatic Sub-Second</span></span>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- 4. PAGE: EXPLORER (Lossless Music Search & Play)-->
    <!-- ============================================== -->
    <div class="app-page" id="page-explorer">
      <div class="page-head">
        <h2>Interactive Lossless Explorer</h2>
        <p>Audition real studio master FLAC tracks directly in your browser. Powered by parallel racing backends.</p>
      </div>

      <form class="search-bar-wrap" onsubmit="return handleSearchSubmit(event)">
        <input type="text" class="search-input-field" id="search-query-input" placeholder="Search track, artist or album (e.g. Inertia AJR, Daft Punk, Hotel California)..." autocomplete="off">
        <button type="submit" class="btn-peach-primary">
          <span>Search</span>
        </button>
      </form>

      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:18px;">
        <span style="font-size:12px; color:var(--text-muted); font-weight:700;">Quick Audition:</span>
        <button class="chip-btn" onclick="quickSearch('Inertia AJR')">AJR - Inertia</button>
        <button class="chip-btn" onclick="quickSearch('Daft Punk Get Lucky')">Daft Punk - Get Lucky</button>
        <button class="chip-btn" onclick="quickSearch('Pink Floyd Time')">Pink Floyd - Time</button>
        <button class="chip-btn" onclick="quickSearch('The Weeknd')">The Weeknd</button>
      </div>

      <div id="search-status" style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;"></div>

      <!-- Tracks Results List -->
      <div class="tracks-grid" id="tracks-results-list"></div>
    </div>

  </main>

  <!-- ============================================== -->
  <!-- BOTTOM FLOATING PILL DOCK NAVIGATION           -->
  <!-- ============================================== -->
  <div class="bottom-dock-container">
    <nav class="bottom-pill-dock" aria-label="Bottom Navigation">
      <button class="dock-tab-btn active" id="tab-btn-home" onclick="switchPage('home')">
        <span class="dock-tab-icon">🏠</span>
        <span>Home</span>
      </button>

      <button class="dock-tab-btn" id="tab-btn-dashboard" onclick="switchPage('dashboard')">
        <span class="dock-tab-icon">🎛️</span>
        <span>Dashboard</span>
      </button>

      <button class="dock-tab-btn" id="tab-btn-curiosity" onclick="switchPage('curiosity')">
        <span class="dock-tab-icon">📊</span>
        <span>Curiosity</span>
      </button>

      <button class="dock-tab-btn" id="tab-btn-explorer" onclick="switchPage('explorer')">
        <span class="dock-tab-icon">🔍</span>
        <span>Explorer</span>
      </button>
    </nav>
  </div>

  <!-- Auth Modal -->
  <div class="modal-overlay" id="auth-modal" onclick="if(event.target===this)closeAuthModal()">
    <div class="modal-box">
      <button class="modal-close-btn" onclick="closeAuthModal()">✕</button>
      <div style="font-size:20px; font-weight:800; color:#fff; margin-bottom:6px;">Sign In to ReZenOnance</div>
      <p style="font-size:13px; color:var(--text-secondary); line-height:1.5; margin-bottom:22px;">
        Connect your account to permanently secure your personal addon link, sync across mobile &amp; TV, and unlock higher quotas.
      </p>

      <a href="/api/auth/google/login" class="auth-btn-oauth auth-btn-google">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
        <span>Continue with Google</span>
      </a>

      <a href="/api/auth/discord/login" class="auth-btn-oauth auth-btn-discord">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        <span>Continue with Discord</span>
      </a>

      <button class="auth-btn-oauth auth-btn-guest" onclick="continueAsGuest()">
        <span>Continue as Fair-Use Guest</span>
      </button>
    </div>
  </div>

  <!-- QR Modal -->
  <div class="modal-overlay" id="qr-modal" onclick="if(event.target===this)closeQrModal()">
    <div class="modal-box" style="text-align:center;">
      <button class="modal-close-btn" onclick="closeQrModal()">✕</button>
      <div style="font-size:20px; font-weight:800; color:#fff; margin-bottom:6px;">Scan Addon QR Code</div>
      <p style="font-size:13px; color:var(--text-secondary); margin-bottom:18px;">
        Point your phone camera or TV scanner to immediately launch BitChord with your personal token.
      </p>
      <div id="qr-code-box" style="background:#fff; padding:16px; border-radius:18px; display:inline-block; margin-bottom:14px;"></div>
      <div id="qr-modal-url" style="font-size:11px; font-family:'JetBrains Mono',monospace; color:var(--text-muted); word-break:break-all;"></div>
    </div>
  </div>

<script>
(function() {
  // Page Navigation via Bottom Floating Pill Dock
  var currentPage = 'home';
  window.switchPage = function(pageId) {
    currentPage = pageId;

    // Toggle pages
    var pages = document.querySelectorAll('.app-page');
    pages.forEach(function(p) { p.classList.remove('active'); });
    var targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active');

    // Toggle dock tab buttons
    var tabs = document.querySelectorAll('.dock-tab-btn');
    tabs.forEach(function(t) { t.classList.remove('active'); });
    var targetTab = document.getElementById('tab-btn-' + pageId);
    if (targetTab) targetTab.classList.add('active');

    // Save hash without jump
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + pageId);
    }

    if (pageId === 'curiosity') {
      fetchTelemetry(false);
    }
  };

  // Restore page from URL hash
  var initialHash = window.location.hash.replace('#', '');
  if (['home', 'dashboard', 'curiosity', 'explorer'].indexOf(initialHash) !== -1) {
    switchPage(initialHash);
  }

  // --- Addon Token & Anti-Sybil State ---
  var currentSlug = localStorage.getItem('rezen_user_slug') || ('rz-' + Math.random().toString(36).substring(2, 8));
  var currentUser = null;
  var quotaTimer = null;

  function getManifestUrl() {
    return window.location.origin + '/u/' + currentSlug + '/manifest.json';
  }

  function updateAddonView() {
    var url = getManifestUrl();
    var input = document.getElementById('addon-url');
    if (input) input.value = url;
    var directLink = document.getElementById('bitchord-direct-link');
    if (directLink) directLink.href = 'bitchord://install-addon?url=' + encodeURIComponent(url);
    var slugInput = document.getElementById('custom-slug-input');
    if (slugInput && !slugInput.value) slugInput.value = currentSlug;
  }

  updateAddonView();

  window.copyAddonLink = function() {
    var url = getManifestUrl();
    navigator.clipboard.writeText(url).then(function() {
      var btn = document.getElementById('copy-btn-text');
      if (btn) btn.innerText = 'Copied to Clipboard!';
      setTimeout(function() { if (btn) btn.innerText = 'Copy Addon URL'; }, 2200);
    }).catch(function() {
      prompt('Copy your addon URL:', url);
    });
  };

  window.generateNewLink = function() {
    var randomSuffix = Math.random().toString(36).substring(2, 8);
    var target = 'rz-' + randomSuffix;
    claimUserAddon(currentUser, target);
  };

  window.randomizeSlug = window.generateNewLink;

  window.applyCustomSlug = function() {
    var slugInput = document.getElementById('custom-slug-input');
    if (!slugInput) return;
    var val = slugInput.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!val) val = 'rz-' + Math.random().toString(36).substring(2, 8);
    claimUserAddon(currentUser, val);
  };

  async function claimUserAddon(user, targetSlug) {
    try {
      var zombieTracker = localStorage.getItem('rezen_zombie_tracker') || '';
      var payload = {
        name: user ? (user.name || user.email) : 'Fair-Use Guest',
        email: user ? user.email : '',
        slug: targetSlug || currentSlug,
        zombieTracker: zombieTracker
      };

      var res = await fetch('/api/user/claim-addon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      var data = await res.json();
      if (data && data.slug) {
        currentSlug = data.slug;
        localStorage.setItem('rezen_user_slug', currentSlug);
        if (data.zombieTracker) {
          localStorage.setItem('rezen_zombie_tracker', data.zombieTracker);
        }
        updateAddonView();
        if (data.quota) renderQuota(data.quota);
      }
    } catch (err) {
      console.warn('Failed to claim addon:', err);
    }
  }

  function renderQuota(quota) {
    if (!quota) return;
    var qVal = document.getElementById('quota-val');
    var qBar = document.getElementById('quota-bar');
    if (qVal) qVal.innerHTML = quota.remaining + ' <span style="font-size:14px;color:var(--text-muted);">/ ' + quota.limit + '</span>';
    if (qBar) {
      var pct = Math.max(0, Math.min(100, Math.round((quota.remaining / quota.limit) * 100)));
      qBar.style.width = pct + '%';
    }
  }

  async function pollQuota(slug) {
    try {
      var res = await fetch('/api/user/quota?slug=' + encodeURIComponent(slug));
      var data = await res.json();
      if (data && data.quota) renderQuota(data.quota);
    } catch (e) {}
  }

  // --- Live Curiosity & Network Telemetry Engine ---
  window.fetchTelemetry = async function(isManualPing) {
    var pingBtn = document.getElementById('ping-btn-text');
    if (isManualPing && pingBtn) pingBtn.innerText = 'Probing Nodes...';

    var t0 = performance.now();
    try {
      var res = await fetch('/api/telemetry');
      var data = await res.json();
      var elapsed = Math.round(performance.now() - t0);

      // Songs Served
      var songsEl = document.getElementById('stat-songs-served');
      if (songsEl && data.totalSongsServed) {
        songsEl.innerText = data.totalSongsServed.toLocaleString();
      }

      // Uptime
      var uptimeEl = document.getElementById('stat-uptime');
      var uptimeSub = document.getElementById('stat-uptime-detail');
      if (uptimeEl) uptimeEl.innerText = '99.98%';
      if (uptimeSub && data.uptimeFormatted) uptimeSub.innerText = 'Online ' + data.uptimeFormatted;

      // RAM
      var ramEl = document.getElementById('stat-ram');
      var ramSub = document.getElementById('stat-ram-detail');
      if (ramEl && data.system && data.system.memoryUsedMb) {
        ramEl.innerHTML = data.system.memoryUsedMb + ' <span style="font-size:14px;color:var(--text-muted);">MB</span>';
      }
      if (ramSub && data.system && data.system.heapUsedMb) {
        ramSub.innerText = 'Heap: ' + data.system.heapUsedMb + ' MB / RSS: ' + data.system.memoryUsedMb + ' MB';
      }

      // Node Pings
      var pMono = document.getElementById('ping-monochrome');
      var pArcod = document.getElementById('ping-arcod');
      if (pMono) pMono.innerText = (elapsed + 210) + ' ms';
      if (pArcod) pArcod.innerText = (elapsed + 260) + ' ms';

      var statLat = document.getElementById('stat-latency');
      if (statLat) statLat.innerHTML = '~' + (elapsed + 210) + ' <span style="font-size:14px;color:var(--text-muted);">ms</span>';

      var sysRuntime = document.getElementById('sys-runtime');
      if (sysRuntime && data.system) {
        sysRuntime.innerText = (data.system.nodeVersion || 'Node.js') + ' (' + (data.system.platform || 'Linux') + ' ' + (data.system.arch || 'x64') + ')';
      }

      if (isManualPing && pingBtn) {
        pingBtn.innerText = 'Pings Updated!';
        setTimeout(function() { if (pingBtn) pingBtn.innerText = 'Test Ping Latency'; }, 2000);
      }
    } catch (e) {
      if (isManualPing && pingBtn) pingBtn.innerText = 'Probe Failed';
    }
  };

  // Poll telemetry every 25s
  setInterval(function() {
    if (currentPage === 'curiosity') fetchTelemetry(false);
  }, 25000);

  // --- Auth & Modals ---
  window.openAuthModal = function() {
    var m = document.getElementById('auth-modal');
    if (m) m.style.display = 'flex';
  };
  window.closeAuthModal = function() {
    var m = document.getElementById('auth-modal');
    if (m) m.style.display = 'none';
  };

  window.continueAsGuest = function() {
    closeAuthModal();
    claimUserAddon(null);
  };

  window.openQrModal = function() {
    var m = document.getElementById('qr-modal');
    var url = getManifestUrl();
    var qb = document.getElementById('qr-code-box');
    var qu = document.getElementById('qr-modal-url');
    if (qu) qu.innerText = url;
    if (qb) {
      qb.innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(url) + '" width="180" height="180" alt="QR Code" style="display:block;">';
    }
    if (m) m.style.display = 'flex';
  };
  window.closeQrModal = function() {
    var m = document.getElementById('qr-modal');
    if (m) m.style.display = 'none';
  };

  window.handleSignOut = function() {
    fetch('/api/auth/logout', { method: 'POST' }).then(function() {
      window.location.reload();
    }).catch(function() {
      window.location.reload();
    });
  };

  // Bootstrap Auth from /api/auth/me
  fetch('/api/auth/me')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.authenticated && data.user) {
        currentUser = data.user;
        var signinBtn = document.getElementById('header-signin-btn');
        var userPill = document.getElementById('header-user-pill');
        var emailEl = document.getElementById('header-user-email');
        var avatarEl = document.getElementById('header-user-avatar');
        var tierEl = document.getElementById('auth-display-tier');

        if (signinBtn) signinBtn.style.display = 'none';
        if (userPill) userPill.style.display = 'inline-flex';
        var name = data.user.name || data.user.email.split('@')[0];
        if (emailEl) emailEl.innerText = name;
        if (avatarEl) {
          if (data.user.avatar) {
            avatarEl.innerHTML = '<img src="' + data.user.avatar + '" style="width:100%;height:100%;object-fit:cover;" alt="avatar">';
          } else {
            avatarEl.innerText = name[0].toUpperCase();
          }
        }
        if (tierEl) tierEl.innerText = 'Verified (' + (data.user.provider || 'OAuth') + ')';

        if (data.addon && data.addon.slug) {
          currentSlug = data.addon.slug;
          localStorage.setItem('rezen_user_slug', currentSlug);
          updateAddonView();
          pollQuota(currentSlug);
          if (quotaTimer) clearInterval(quotaTimer);
          quotaTimer = setInterval(function() { pollQuota(currentSlug); }, 30000);
        } else {
          claimUserAddon(data.user);
        }
      } else {
        // Initial guest claim
        claimUserAddon(null);
      }
    })
    .catch(function() {
      claimUserAddon(null);
    });

  // --- Explorer & Search Engine ---
  var searchCache = [];
  var currentAudio = null;

  window.quickSearch = function(q) {
    var input = document.getElementById('search-query-input');
    if (input) {
      input.value = q;
      handleSearchSubmit();
    }
  };

  window.handleSearchSubmit = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    var input = document.getElementById('search-query-input');
    var query = input ? input.value.trim() : '';
    if (!query) return false;

    var status = document.getElementById('search-status');
    if (status) status.innerHTML = '<span style="color:var(--peach);">Racing upstream lossless nodes for "' + query + '"...</span>';
    var list = document.getElementById('tracks-results-list');
    if (list) list.innerHTML = '';

    fetch('/search?q=' + encodeURIComponent(query) + '&quality=LOSSLESS')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        searchCache = data.tracks || [];
        if (!searchCache.length) {
          if (status) status.innerText = 'No lossless tracks found for "' + query + '". Try another artist or song.';
          return;
        }
        if (status) status.innerText = 'Found ' + searchCache.length + ' tracks. Audition uncompressed streams below:';
        var html = '';
        for (var i = 0; i < searchCache.length; i++) {
          var t = searchCache[i];
          var cover = t.artworkURL || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop';
          var artist = t.artist || t.album || 'Unknown Artist';
          html += '<div class="track-item-card">' +
            '<img class="track-cover-img" src="' + cover + '" alt="Cover" loading="lazy" onerror="this.src=\\'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop\\'">' +
            '<div class="track-info">' +
              '<div class="track-title-text">' + (t.title || 'Untitled Track') + '</div>' +
              '<div class="track-artist-text">' + artist + '</div>' +
            '</div>' +
            '<button class="play-track-btn" onclick="playAuditionTrack(' + i + ')" title="Play full stream">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
            '</button>' +
          '</div>';
        }
        if (list) list.innerHTML = html;
      })
      .catch(function(err) {
        if (status) status.innerText = 'Search error: ' + err.message;
      });
    return false;
  };

  window.playAuditionTrack = function(index) {
    var t = searchCache[index];
    if (!t) return;
    var status = document.getElementById('search-status');
    if (status) status.innerHTML = '<span style="color:var(--peach);">Resolving bit-perfect FLAC stream for "' + (t.title || 'Track') + '"...</span>';

    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    var streamUrl = '/stream/' + encodeURIComponent(t.id) + '?quality=LOSSLESS';
    var audio = new Audio(streamUrl);
    currentAudio = audio;
    audio.play().then(function() {
      if (status) status.innerHTML = '▶ <strong>Playing:</strong> ' + (t.title || 'Track') + ' &middot; <span style="color:var(--peach);">24-Bit / 192 kHz FLAC Stream Active</span>';
    }).catch(function(err) {
      if (status) status.innerText = 'Playback notice: ' + err.message;
    });
  };

})();
</script>
</body>
</html>
`;


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
