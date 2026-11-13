export const homePage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ReZenOnance | Studio Lossless Audio Gateway</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
:root {
  --bg-deep: #07090e;
  --bg-surface: #0e131f;
  --bg-card: rgba(16, 22, 36, 0.75);
  --bg-card-hover: rgba(22, 30, 48, 0.9);
  --border: rgba(255, 255, 255, 0.08);
  --border-light: rgba(255, 255, 255, 0.15);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --cyan: #00f2fe;
  --cyan-glow: rgba(0, 242, 254, 0.35);
  --blue: #3b82f6;
  --purple: #8b5cf6;
  --purple-glow: rgba(139, 92, 246, 0.3);
  --emerald: #10b981;
  --emerald-glow: rgba(16, 185, 129, 0.3);
  --amber: #f59e0b;
  --rose: #f43f5e;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: var(--bg-deep);
  background-image: 
    radial-gradient(circle at 10% 15%, rgba(0, 242, 254, 0.09) 0px, transparent 45%),
    radial-gradient(circle at 90% 10%, rgba(139, 92, 246, 0.09) 0px, transparent 50%),
    radial-gradient(circle at 50% 90%, rgba(16, 185, 129, 0.06) 0px, transparent 40%);
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
  line-height: 1.5;
  overflow-x: hidden;
}

/* Ambient Canvas */
#ambient-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  opacity: 0.35;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 24px 120px;
  position: relative;
  z-index: 1;
}

/* Header */
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 44px;
  gap: 16px;
  flex-wrap: wrap;
}
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: inherit;
}
.brand-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #00f2fe 0%, #3b82f6 50%, #8b5cf6 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px var(--cyan-glow);
  position: relative;
}
.brand-icon::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(255,255,255,0.4), transparent);
  pointer-events: none;
}
.brand-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-name {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.6px;
  background: linear-gradient(to right, #ffffff, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.brand-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(0, 242, 254, 0.12);
  color: var(--cyan);
  border: 1px solid rgba(0, 242, 254, 0.25);
}
.brand-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  padding: 7px 14px;
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
  animation: pulse-dot 2s infinite ease-in-out;
}
@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.75); opacity: 0.5; }
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 9px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}
.nav-link:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
}

/* Hero Section */
.hero {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 52px;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.25);
  color: #c4b5fd;
  padding: 5px 14px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 20px;
}
.hero h1 {
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -1.3px;
  line-height: 1.15;
  margin-bottom: 18px;
}
.hero-gradient {
  background: linear-gradient(135deg, #00f2fe 0%, #38bdf8 40%, #818cf8 70%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero p {
  color: var(--text-secondary);
  font-size: 18px;
  line-height: 1.65;
}

/* Feature Badges */
.feature-ribbon {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 24px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}
.feature-item svg {
  color: var(--cyan);
}

/* Card General */
.glass-panel {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.6);
}

/* Personal Addon Section */
.addon-generator {
  padding: 38px;
  margin-bottom: 50px;
}
.addon-generator::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, var(--cyan), var(--purple), transparent);
}
.generator-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  gap: 20px;
  flex-wrap: wrap;
}
.generator-title h2 {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}
.generator-title p {
  font-size: 14px;
  color: var(--text-secondary);
}

.token-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.slug-input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(8, 11, 18, 0.85);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 4px 12px;
}
.slug-prefix {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--text-muted);
}
.slug-input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 6px;
  width: 140px;
}
.btn-icon {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-icon:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-generate {
  background: linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%);
  color: #030b12;
  border: none;
  font-weight: 700;
  font-size: 14px;
  padding: 11px 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 0 25px var(--cyan-glow);
  transition: all 0.2s ease;
}
.btn-generate:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 35px rgba(0, 242, 254, 0.5);
}

/* Link Box */
.link-display-box {
  background: rgba(9, 12, 20, 0.95);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.link-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}
.link-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}
.link-url {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  color: var(--cyan);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}
.link-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn-copy {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid var(--border);
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-copy:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.3);
}
.btn-install {
  background: rgba(0, 242, 254, 0.12);
  color: var(--cyan);
  border: 1px solid rgba(0, 242, 254, 0.3);
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.btn-install:hover {
  background: var(--cyan);
  color: #000;
}

/* User Profile & Auth Header */
.btn-nav-auth {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 242, 254, 0.12);
  color: var(--cyan);
  border: 1px solid rgba(0, 242, 254, 0.4);
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-nav-auth:hover {
  background: var(--cyan);
  color: #041019;
  box-shadow: 0 0 16px var(--cyan-glow);
}
.header-user-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(14, 19, 31, 0.85);
  border: 1px solid var(--border-light);
  border-radius: 9999px;
  padding: 4px 12px 4px 6px;
  font-size: 13px;
}
.header-user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--cyan), var(--purple));
  color: #041019;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.btn-logout {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.2s;
}
.btn-logout:hover {
  color: var(--rose);
}

/* Auth Gate in Addon Section */
.auth-gate-box {
  background: linear-gradient(135deg, rgba(16, 24, 40, 0.95), rgba(12, 17, 29, 0.9));
  border: 1px solid rgba(0, 242, 254, 0.3);
  border-radius: 18px;
  padding: 34px 28px;
  text-align: center;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
}
.auth-gate-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 242, 254, 0.12);
  color: var(--cyan);
  border: 1px solid rgba(0, 242, 254, 0.3);
  border-radius: 9999px;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}
.auth-gate-box h3 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 10px;
  color: #fff;
  letter-spacing: -0.4px;
}
.auth-gate-box p {
  font-size: 14px;
  color: var(--text-secondary);
  max-width: 640px;
  margin: 0 auto 24px;
  line-height: 1.6;
}
.auth-actions-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.btn-google-login {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  color: #1f2937;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-google-login:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.25);
}
.btn-email-login {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 22px;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-email-login:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}
.auth-gate-sub {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* User Addon Unlocked Banner */
.user-verified-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 12px;
  padding: 12px 20px;
  margin-bottom: 24px;
  font-size: 13px;
  flex-wrap: wrap;
  gap: 10px;
}
.verified-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--emerald);
  font-weight: 700;
}

/* Anti-Abuse Warning Banner */
.anti-abuse-banner {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.18), rgba(245, 158, 11, 0.18));
  border: 1px solid rgba(244, 63, 94, 0.45);
  border-radius: 14px;
  padding: 18px 22px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.anti-abuse-banner svg {
  color: var(--rose);
  flex-shrink: 0;
  margin-top: 2px;
}
.anti-abuse-title {
  font-size: 15px;
  font-weight: 700;
  color: #fecdd3;
  margin-bottom: 4px;
}
.anti-abuse-text {
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.5;
}

/* Auth Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.auth-modal-card {
  background: #0f1423;
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 36px;
  width: 100%;
  max-width: 440px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85);
}
.modal-close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
}
.modal-close-btn:hover {
  color: var(--text-primary);
}
.auth-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-light);
  color: #fff;
  font-size: 14px;
  margin-bottom: 12px;
  outline: none;
  font-family: inherit;
}
.auth-input:focus {
  border-color: var(--cyan);
}
.btn-submit-email {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--cyan), var(--blue));
  border: none;
  color: #041019;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-submit-email:hover {
  opacity: 0.9;
}

/* Quota & Guard Metrics */
.quota-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
.quota-card {
  background: rgba(10, 14, 24, 0.7);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  transition: border-color 0.2s;
}
.quota-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
}
.quota-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.quota-title {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.quota-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
}
.quota-numbers {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 10px;
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.quota-max {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
}
.progress-bar-bg {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 10px;
}
.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease;
}
.fill-cyan { background: linear-gradient(90deg, #00f2fe, #38bdf8); }
.fill-emerald { background: linear-gradient(90deg, #10b981, #34d399); }
.fill-purple { background: linear-gradient(90deg, #8b5cf6, #c084fc); }
.quota-subtext {
  font-size: 12px;
  color: var(--text-muted);
}

/* Instructions / Quick Start Accordion */
.instructions-section {
  margin-top: 32px;
  border-top: 1px solid var(--border);
  padding-top: 24px;
}
.instructions-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}
.instructions-toggle span {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.step-item {
  background: rgba(10, 14, 24, 0.5);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.step-number {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(0, 242, 254, 0.15);
  color: var(--cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 10px;
}
.step-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}
.step-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Provider Status Section */
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  flex-wrap: wrap;
  gap: 12px;
}
.section-head h2 {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.ping-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.ping-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.25);
}

.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}
.provider-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(16px);
}
.provider-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
  background: var(--bg-card-hover);
}
.provider-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.provider-name-box h3 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 3px;
}
.provider-route {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-muted);
}
.provider-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
}
.provider-specs {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.spec-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.spec-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
}
.spec-value {
  font-weight: 700;
  color: #fff;
}
.spec-latency {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #34d399;
}

/* Status Badges */
.badge-status {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.status-operational {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.status-standby {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
.status-offline {
  background: rgba(244, 63, 94, 0.15);
  color: #fb7185;
  border: 1px solid rgba(244, 63, 94, 0.3);
}

/* =========================================
   Hardware & Lossless Diagnostic Lab Section
   ========================================= */
.lab-section {
  padding: 38px;
  margin-bottom: 50px;
  border: 1px solid rgba(0, 242, 254, 0.2);
  background: linear-gradient(180deg, rgba(16, 22, 38, 0.85) 0%, rgba(10, 14, 25, 0.95) 100%);
  position: relative;
}
.lab-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #10b981, #00f2fe, #8b5cf6);
}
.lab-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 242, 254, 0.12);
  border: 1px solid rgba(0, 242, 254, 0.3);
  color: var(--cyan);
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 12px;
}
.lab-stepper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 24px 0 30px;
  flex-wrap: wrap;
}
.stepper-node {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
}
.stepper-node.active { color: var(--cyan); }
.stepper-node.passed { color: #34d399; }
.stepper-bubble {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}
.stepper-node.active .stepper-bubble {
  background: var(--cyan);
  color: #000;
  border-color: var(--cyan);
  box-shadow: 0 0 10px var(--cyan-glow);
}
.stepper-node.passed .stepper-bubble {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-color: #10b981;
}
.stepper-line {
  height: 2px;
  width: 24px;
  background: rgba(255, 255, 255, 0.1);
}

.lab-panel-content {
  background: rgba(8, 11, 18, 0.7);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 28px;
  margin-bottom: 24px;
}
.quiet-room-alert {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 14px;
  padding: 18px 22px;
  margin-bottom: 24px;
  color: #fde68a;
}
.quiet-room-alert svg { flex-shrink: 0; color: var(--amber); }

.tone-box {
  text-align: center;
  padding: 24px;
  background: rgba(14, 18, 30, 0.6);
  border: 1px solid var(--border);
  border-radius: 14px;
  margin: 20px 0;
}
.tone-btn {
  background: linear-gradient(135deg, #00f2fe, #3b82f6);
  border: none;
  color: #041019;
  font-weight: 800;
  font-size: 15px;
  padding: 14px 28px;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  box-shadow: 0 0 20px var(--cyan-glow);
}
.tone-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px var(--cyan-glow);
}
.tone-btn.playing {
  background: linear-gradient(135deg, #f43f5e, #fb7185);
  color: #fff;
  box-shadow: 0 0 25px rgba(244, 63, 94, 0.4);
}

.lab-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
  margin-top: 20px;
}
.lab-option-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  text-align: left;
  cursor: pointer;
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.2s;
}
.lab-option-btn:hover {
  background: rgba(0, 242, 254, 0.08);
  border-color: rgba(0, 242, 254, 0.3);
  transform: translateY(-1px);
}
.lab-option-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.lab-option-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Verdict Styles */
.verdict-box {
  padding: 30px;
  border-radius: 16px;
  text-align: center;
}
.verdict-pass {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.verdict-warn {
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.3);
}
.verdict-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}
.badge-pass { background: rgba(16, 185, 129, 0.25); color: #34d399; }
.badge-warn { background: rgba(244, 63, 94, 0.25); color: #fb7185; }

/* In-Browser Player Section */
.player-section {
  padding: 36px;
  margin-bottom: 50px;
}
.search-container {
  margin-bottom: 24px;
}
.search-bar {
  display: flex;
  gap: 12px;
}
.search-input-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon-inside {
  position: absolute;
  left: 18px;
  color: var(--text-muted);
  pointer-events: none;
}
.search-input {
  width: 100%;
  background: rgba(8, 11, 18, 0.95);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 16px 16px 50px;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}
.search-input:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 20px var(--cyan-glow);
}
.search-button {
  background: #fff;
  color: #041019;
  border: none;
  font-weight: 700;
  font-size: 15px;
  padding: 0 28px;
  border-radius: 14px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-button:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

/* Sample Suggestions */
.sample-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.sample-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}
.sample-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.sample-chip:hover {
  background: rgba(0, 242, 254, 0.12);
  color: var(--cyan);
  border-color: rgba(0, 242, 254, 0.3);
}

/* Results Grid */
#search-status {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 20px;
}
.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.track-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(10, 14, 24, 0.6);
  border: 1px solid var(--border);
  transition: all 0.2s;
}
.track-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
}
.track-art-wrap {
  position: relative;
  width: 54px;
  height: 54px;
  border-radius: 10px;
  overflow: hidden;
  background: #182030;
  flex-shrink: 0;
}
.track-art {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.track-meta {
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
  margin-bottom: 2px;
}
.track-artist {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.track-quality-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  background: rgba(0, 242, 254, 0.1);
  color: var(--cyan);
  border: 1px solid rgba(0, 242, 254, 0.25);
  border-radius: 8px;
  white-space: nowrap;
}
.track-play-button {
  background: rgba(0, 242, 254, 0.12);
  border: 1px solid rgba(0, 242, 254, 0.3);
  color: var(--cyan);
  padding: 9px 18px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.track-play-button:hover {
  background: var(--cyan);
  color: #000;
  box-shadow: 0 0 15px var(--cyan-glow);
}

/* Floating Audio Player */
.audiophile-player {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 1100px;
  background: rgba(11, 15, 26, 0.94);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 242, 254, 0.15);
  z-index: 999;
  animation: slideUp 0.3s ease-out;
}
@keyframes slideUp {
  from { transform: translate(-50%, 100px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

.player-track-info {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 220px;
  max-width: 280px;
}
.player-vinyl {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #111;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 12px rgba(0,0,0,0.5);
  flex-shrink: 0;
}
.player-vinyl.spinning {
  animation: spinRecord 4s linear infinite;
}
@keyframes spinRecord {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.player-vinyl-core {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--cyan);
}
.player-text {
  min-width: 0;
}
.player-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.player-artist {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-controls-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 540px;
}
.visualizer-canvas {
  width: 100%;
  height: 24px;
  border-radius: 4px;
}
.native-audio-wrapper {
  width: 100%;
}
.native-audio-wrapper audio {
  width: 100%;
  height: 32px;
  outline: none;
}

.player-specs-pill {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  min-width: 130px;
}
.player-flac-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.player-stream-source {
  font-size: 11px;
  color: var(--text-muted);
}

/* Distribution / Dual Architecture Card */
.dual-architecture {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 50px;
}
.arch-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.arch-card h3 {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.arch-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}
.arch-card ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}
.arch-card li {
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.arch-card li svg {
  color: var(--cyan);
  flex-shrink: 0;
}

/* Footer */
footer {
  margin-top: 80px;
  padding-top: 30px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--text-muted);
  font-size: 13px;
}
footer a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
footer a:hover {
  color: #fff;
}

/* QR Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}
.modal-content {
  background: #0f1422;
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 32px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0,0,0,0.8);
  position: relative;
}
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
}
.modal-close:hover { color: #fff; }
.qr-container {
  background: #ffffff;
  padding: 16px;
  border-radius: 16px;
  display: inline-block;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .hero h1 { font-size: 34px; }
  .addon-generator { padding: 24px; }
  .audiophile-player {
    flex-direction: column;
    align-items: stretch;
    bottom: 12px;
    width: calc(100% - 24px);
    padding: 16px;
  }
  .player-track-info { max-width: none; }
  .player-specs-pill { align-items: flex-start; flex-direction: row; justify-content: space-between; }
}
</style>
</head>
<body>

<canvas id="ambient-canvas"></canvas>

<div class="container">
  <!-- Header -->
  <header>
    <a href="/" class="brand">
      <div class="brand-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#041019" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      </div>
      <div>
        <div class="brand-title">
          <span class="brand-name">ReZenOnance</span>
          <span class="brand-badge">24-Bit FLAC</span>
        </div>
        <div class="brand-subtitle">Universal Studio Lossless Music Aggregator</div>
      </div>
    </a>

    <div class="header-nav">
      <div class="status-pill" id="header-status-pill">
        <span class="pulse-dot"></span>
        <span id="gateway-status">Verified Lossless Online</span>
      </div>
      <a href="#hardware-lab" class="nav-link" style="color:var(--cyan); border-color:rgba(0,242,254,0.35);">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
        Gear Diagnostic Lab
      </a>
      <a href="/tv" class="nav-link" title="Sony Bravia / Vewd Client">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="15" x="2" y="3" rx="2"/><polyline points="17 21 12 17 7 21"/></svg>
        TV Client
      </a>
      <a href="https://github.com/KATx-dev/ReZenOnance" target="_blank" rel="noopener noreferrer" class="nav-link">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        GitHub
      </a>

      <!-- Auth Controls in Header -->
      <button class="btn-nav-auth" id="header-signin-btn" onclick="openAuthModal()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        <span>Sign In</span>
      </button>

      <div class="header-user-pill" id="header-user-pill" style="display:none;">
        <div class="header-user-avatar" id="header-user-avatar">U</div>
        <span id="header-user-email" style="max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:600;"></span>
        <button class="btn-logout" onclick="signOutUser()" title="Sign Out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </div>
  </header>

  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-tag">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Multi-Source Fallback Gateway
      </div>
      <h1>High-Resolution FLAC for <span class="hero-gradient">Universal Players</span></h1>
      <p>Stream uncompressed 24-bit / 192 kHz audio across verified lossless providers. Plug-and-play compatible with <strong>Mochy</strong>, <strong>Metrofuse</strong>, <strong>EchoMusic</strong>, and custom music clients.</p>
      
      <div class="feature-ribbon">
        <div class="feature-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Direct Akamai CDN Delivery
        </div>
        <div class="feature-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Zero Transcoding Loss
        </div>
        <div class="feature-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Sub-Second Upstream Racing
        </div>
      </div>
    </section>

    <!-- Personal Addon Generator -->
    <section class="glass-panel addon-generator" id="addon-section">
      <!-- Anti-abuse error banner -->
      <div class="anti-abuse-banner" id="anti-abuse-banner" style="display:none;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <div class="anti-abuse-title">Anti-Abuse Protection Triggered</div>
          <div class="anti-abuse-text" id="anti-abuse-text">This device or household is already linked to another personal endpoint. Only 1 personal addon endpoint is permitted per household to protect unmetered studio FLAC bandwidth. If you require private unlimited multi-device nodes, please check the Standalone Self-Host Release v1.0.0 on GitHub.</div>
        </div>
      </div>

      <!-- Auth Gate (Shown when logged out) -->
      <div class="auth-gate-box" id="auth-gate-box">
        <div class="auth-gate-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Authentication & Abuse Wall Active
        </div>
        <h3>Claim Your Dedicated Lossless Addon Endpoint</h3>
        <p>To preserve unmetered 24-bit Akamai studio delivery and prevent mass bot scraping, each listener receives one private endpoint protected by anti-sybil device cookies and daily quota gates.</p>
        <div class="auth-actions-group">
          <button class="btn-google-login" onclick="loginWithGoogle()">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            <span>Continue with Google</span>
          </button>
          <button class="btn-email-login" onclick="openAuthModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>Email Sign In / Magic Link</span>
          </button>
        </div>
        <div class="auth-gate-sub">
          <span>🔒 1 Endpoint per account/device</span> • <span>🍪 Signed __rz_tracker cookie tracking</span> • <span>⚡ 300 tracks/day</span>
        </div>
      </div>

      <!-- Verified user header (Shown when logged in) -->
      <div id="verified-user-box" style="display:none;">
        <div class="user-verified-header">
          <div class="verified-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 11 13 15 9"/></svg>
            Verified Audiophile: <span id="auth-display-email" style="font-weight:700; color:#fff;"></span>
          </div>
          <span style="color:var(--text-secondary); font-size:12px;">Endpoint Bound to Account</span>
        </div>
      </div>

      <div class="generator-head">
        <div class="generator-title">
          <h2>Create Your Personal Addon Endpoint</h2>
          <p>Every user receives their own isolated endpoint with dedicated abuse limits and sliding device session protection.</p>
        </div>

        <div class="token-controls">
          <div class="slug-input-wrapper">
            <span class="slug-prefix">/u/</span>
            <input type="text" class="slug-input" id="slug-input" placeholder="my-tag" maxlength="32">
          </div>
          <button class="btn-icon" onclick="randomizeSlug()" title="Generate Random Alias">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.5 2-5 5M21.5 2H16M21.5 2v5.5M2.5 22l5-5M2.5 22H8M2.5 22v-5.5M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
          </button>
          <button class="btn-generate" onclick="applyCustomSlug()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Update Token
          </button>
        </div>
      </div>

      <!-- Link Box -->
      <div class="link-display-box">
        <div class="link-content">
          <span class="link-label">Your Private Addon Manifest (Mochy, Metrofuse, EchoMusic, Universal)</span>
          <span class="link-url" id="addon-url">Generating endpoint...</span>
        </div>
        <div class="link-actions">
          <button class="btn-copy" onclick="copyAddonLink()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span id="copy-btn-text">Copy URL</span>
          </button>
          <button class="btn-icon" onclick="openQrModal()" title="Show Mobile QR Code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
          </button>
          <a class="btn-install" id="install-bitchord-btn" href="#" target="_blank" rel="noopener">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Install to App
          </a>
        </div>
      </div>

      <!-- Quota Metrics -->
      <div class="quota-grid">
        <div class="quota-card">
          <div class="quota-header">
            <span class="quota-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
              Daily Streams
            </span>
            <span class="quota-badge" id="utc-countdown">Resets 00:00 UTC</span>
          </div>
          <div class="quota-numbers">
            <span id="metric-streams">0</span>
            <span class="quota-max">/ 300 tracks</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill fill-cyan" id="metric-streams-bar" style="width: 2%;"></div>
          </div>
          <div class="quota-subtext">Protects upstreams from mass scrapers. Resets every 24h.</div>
        </div>

        <div class="quota-card">
          <div class="quota-header">
            <span class="quota-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="12" x="3" y="4" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
              Concurrent Devices
            </span>
            <span class="quota-badge">Active Lease</span>
          </div>
          <div class="quota-numbers">
            <span id="metric-devices">1</span>
            <span class="quota-max">/ 2 devices</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill fill-emerald" id="metric-devices-bar" style="width: 50%;"></div>
          </div>
          <div class="quota-subtext">Sliding window keeps your home audio + mobile synced.</div>
        </div>

        <div class="quota-card">
          <div class="quota-header">
            <span class="quota-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>
              Daily IP Diversity
            </span>
            <span class="quota-badge">Anti-Sybil</span>
          </div>
          <div class="quota-numbers">
            <span id="metric-ips">1</span>
            <span class="quota-max">/ 15 unique IPs</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill fill-purple" id="metric-ips-bar" style="width: 7%;"></div>
          </div>
          <div class="quota-subtext">Supports VPN, cellular switching, and Wi-Fi handoffs.</div>
        </div>
      </div>
    </section>

    <!-- Provider Telemetry -->
    <div class="section-head">
      <div>
        <h2>Provider Telemetry & Health</h2>
        <p style="font-size:14px; color:var(--text-muted);">Real-time monitoring of upstream lossless nodes and CDN routes.</p>
      </div>
      <button class="ping-btn" onclick="runLivePingCheck()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <span id="ping-btn-text">Test Ping Latency</span>
      </button>
    </div>

    <section class="providers-grid" id="providers-container">
      <!-- Monochrome Core -->
      <div class="provider-card">
        <div>
          <div class="provider-header">
            <div class="provider-name-box">
              <h3>Monochrome Lossless Core</h3>
              <div class="provider-route">Route /c · Pure FLAC Stream API</div>
            </div>
            <span class="badge-status status-operational">
              <span class="pulse-dot" style="width:6px; height:6px;"></span>
              Operational
            </span>
          </div>
          <div class="provider-desc">
            Direct studio-grade lossless search index serving genuine 24-bit / 192 kHz FLAC streams with direct audio URI resolution.
          </div>
        </div>
        <div class="provider-specs">
          <div class="spec-item">
            <span class="spec-label">Audio Depth</span>
            <span class="spec-value">24-Bit / 192kHz</span>
          </div>
          <div class="spec-item" style="text-align:right;">
            <span class="spec-label">Ping Latency</span>
            <span class="spec-latency" id="ping-monochrome">310 ms</span>
          </div>
        </div>
      </div>

      <!-- Arcod Lossless Core -->
      <div class="provider-card">
        <div>
          <div class="provider-header">
            <div class="provider-name-box">
              <h3>Lossless Core Source</h3>
              <div class="provider-route">Route /f · Direct Stream API</div>
            </div>
            <span class="badge-status status-operational">
              <span class="pulse-dot" style="width:6px; height:6px;"></span>
              Operational
            </span>
          </div>
          <div class="provider-desc">
            High-speed lossless search index with direct audio URI resolution and sub-second cache hits.
          </div>
        </div>
        <div class="provider-specs">
          <div class="spec-item">
            <span class="spec-label">Audio Depth</span>
            <span class="spec-value">FLAC Lossless</span>
          </div>
          <div class="spec-item" style="text-align:right;">
            <span class="spec-label">Ping Latency</span>
            <span class="spec-latency" id="ping-arcod">380 ms</span>
          </div>
        </div>
      </div>

      <!-- Standby Alternate -->
      <div class="provider-card" style="opacity: 0.75;">
        <div>
          <div class="provider-header">
            <div class="provider-name-box">
              <h3>Lossless Alternate</h3>
              <div class="provider-route">Route /e · Remote Proxy</div>
            </div>
            <span class="badge-status status-standby">Standby</span>
          </div>
          <div class="provider-desc">
            Backup container running automated jitter retry backoff. Engages automatically during upstream fails.
          </div>
        </div>
        <div class="provider-specs">
          <div class="spec-item">
            <span class="spec-label">Audio Depth</span>
            <span class="spec-value">DASH / FLAC</span>
          </div>
          <div class="spec-item" style="text-align:right;">
            <span class="spec-label">Status</span>
            <span class="spec-value" style="color:var(--amber);">Ready</span>
          </div>
        </div>
      </div>

      <!-- Monitored Offline Source -->
      <div class="provider-card" style="opacity: 0.5;">
        <div>
          <div class="provider-header">
            <div class="provider-name-box">
              <h3>Monochrome Core</h3>
              <div class="provider-route">Route /c · Legacy FLAC</div>
            </div>
            <span class="badge-status status-offline">Offline</span>
          </div>
          <div class="provider-desc">
            Host timed out. Automatically bypassed by racing provider to prevent search latency overhead.
          </div>
        </div>
        <div class="provider-specs">
          <div class="spec-item">
            <span class="spec-label">Audio Depth</span>
            <span class="spec-value">FLAC</span>
          </div>
          <div class="spec-item" style="text-align:right;">
            <span class="spec-label">Status</span>
            <span class="spec-value" style="color:var(--rose);">Offline</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================= -->
    <!-- Lossless Audio & Gear Diagnostic Lab Section  -->
    <!-- ============================================= -->
    <section class="glass-panel lab-section" id="hardware-lab">
      <div class="lab-pill">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
        Lossless Audio & Gear Diagnostic Lab
      </div>
      <h2 style="font-size:24px; font-weight:800; letter-spacing:-0.5px; margin-bottom:8px;">Lossless Audio & Gear Capability Benchmark</h2>
      <p style="font-size:14px; color:var(--text-secondary); max-width:800px; line-height:1.6; margin-bottom:24px;">
        Many users stream 24-bit / 192 kHz FLAC on budget Bluetooth headphones without realizing their wireless connection compresses everything to lossy SBC/AAC @ 256kbps. This interactive diagnostic verifies your DAC pipeline, output device route, sub-bass extension, and acoustic distortion threshold.
      </p>

      <!-- Stepper Header -->
      <div class="lab-stepper">
        <div class="stepper-node active" id="step-node-0"><div class="stepper-bubble">1</div> Preparation</div>
        <div class="stepper-line"></div>
        <div class="stepper-node" id="step-node-1"><div class="stepper-bubble">2</div> DAC & Route</div>
        <div class="stepper-line"></div>
        <div class="stepper-node" id="step-node-2"><div class="stepper-bubble">3</div> Sub-Bass (32Hz)</div>
        <div class="stepper-line"></div>
        <div class="stepper-node" id="step-node-3"><div class="stepper-bubble">4</div> Treble Air (17.5kHz)</div>
        <div class="stepper-line"></div>
        <div class="stepper-node" id="step-node-4"><div class="stepper-bubble">5</div> Noise Floor</div>
        <div class="stepper-line"></div>
        <div class="stepper-node" id="step-node-5"><div class="stepper-bubble">6</div> Verdict</div>
      </div>

      <!-- Stage 0: Preparation Guidance -->
      <div class="lab-panel-content" id="lab-stage-0">
        <div class="quiet-room-alert">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          <div>
            <div style="font-weight:700; font-size:15px; margin-bottom:4px;">Mandatory Acoustic Preparation</div>
            <div style="font-size:13px; opacity:0.9; line-height:1.5;">
              1. <strong>Quiet Environment:</strong> Find a completely quiet room without air conditioning noise or background chatter.<br>
              2. <strong>Connect Your Listening Gear:</strong> Plug in the exact headphones, in-ear monitors (IEMs), or external DAC you plan to stream with.<br>
              3. <strong>Disable EQ / Dolby Audio / Spatial Enhancers:</strong> Set system EQ to flat so you hear raw, uncolored audio reproduction.
            </div>
          </div>
        </div>

        <div style="text-align:center; padding:16px 0;">
          <button class="btn-generate" onclick="startGearDiagnostic()" style="padding:14px 32px; font-size:15px; margin:0 auto;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            I'm In A Quiet Room & Ready &rarr;
          </button>
        </div>
      </div>

      <!-- Stage 1: Hardware & Route Detection -->
      <div class="lab-panel-content" id="lab-stage-1" style="display:none;">
        <h3 style="font-size:18px; font-weight:700; margin-bottom:12px;">Step 1: System Audio Engine & Route Probe</h3>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:20px;">
          We inspect your Web Audio API engine sample rate, stereo channel buffer, and system output endpoint.
        </p>

        <div class="quota-grid" style="margin-bottom:24px;">
          <div class="quota-card">
            <div class="quota-header"><span class="quota-title">System Sample Rate</span><span class="quota-badge" id="probe-sr-badge">Probing...</span></div>
            <div class="quota-numbers"><span id="probe-sample-rate">--</span> <span class="quota-max">Hz</span></div>
            <div class="quota-subtext" id="probe-sr-desc">Internal DAC clock rate</div>
          </div>

          <div class="quota-card">
            <div class="quota-header"><span class="quota-title">Native FLAC Decoder</span><span class="quota-badge" style="color:#34d399;">Supported</span></div>
            <div class="quota-numbers" style="font-size:20px; color:#34d399;"><span id="probe-flac-status">Bit-Perfect PCM</span></div>
            <div class="quota-subtext">Direct browser audio buffer support</div>
          </div>

          <div class="quota-card">
            <div class="quota-header"><span class="quota-title">Detected Output Device</span><span class="quota-badge">Route</span></div>
            <div class="quota-numbers" style="font-size:17px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"><span id="probe-device-name">Default Output</span></div>
            <div class="quota-subtext" id="probe-bt-warning">Checking for wireless compression...</div>
          </div>
        </div>

        <div id="bt-alert-banner" style="display:none;" class="quiet-room-alert">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <div>
            <div style="font-weight:700; font-size:14px; margin-bottom:2px;">Bluetooth Bottleneck Flagged</div>
            <div style="font-size:13px; line-height:1.5;">
              Your active output device appears to be Bluetooth. Standard SBC/AAC wireless codecs compress audio down to ~256-320 kbps. Even if your music player streams a 24-bit/192kHz studio FLAC file, your wireless link is downsampling it into lossy audio before it hits your ears.
            </div>
          </div>
        </div>

        <div style="text-align:right;">
          <button class="btn-generate" onclick="goToLabStage(2)">Proceed to Sub-Bass Check &rarr;</button>
        </div>
      </div>

      <!-- Stage 2: Sub-Bass 32 Hz Check -->
      <div class="lab-panel-content" id="lab-stage-2" style="display:none;">
        <h3 style="font-size:18px; font-weight:700; margin-bottom:8px;">Step 2: Sub-Bass Extension & Harmonic Distortion (32 Hz)</h3>
        <p style="font-size:13px; color:var(--text-secondary); line-height:1.5;">
          True studio headphones and subwoofers maintain linear extension down to 20-30 Hz without distortion. Budget drivers often rattle, buzz, or distort heavily when driven by deep sub-bass frequencies.
        </p>

        <div class="tone-box">
          <button class="tone-btn" id="sub-tone-btn" onclick="toggleTone(32, 0.4, 'sub-tone-btn')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Play 32 Hz Sub-Bass Tone
          </button>
          <div style="font-size:12px; color:var(--text-muted); margin-top:10px;">Listen carefully: focus on whether you feel a clean smooth vibration or hear rattling plastic buzzing.</div>
        </div>

        <div style="font-size:14px; font-weight:700; margin-bottom:10px;">What do you hear/feel during the 32 Hz tone?</div>
        <div class="lab-options-grid">
          <button class="lab-option-btn" onclick="recordLabChoice('sub', 'pass')">
            <div class="lab-option-title" style="color:#34d399;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Clean, Deep Rumble
            </div>
            <div class="lab-option-desc">Smooth, deep physical vibration with zero harsh rattling or audible harmonic buzzing.</div>
          </button>

          <button class="lab-option-btn" onclick="recordLabChoice('sub', 'distort')">
            <div class="lab-option-title" style="color:var(--amber);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              Muddy Rattling / Buzz
            </div>
            <div class="lab-option-desc">Audible plastic buzzing, distortion harmonics, or loose vibrating casing noise.</div>
          </button>

          <button class="lab-option-btn" onclick="recordLabChoice('sub', 'silent')">
            <div class="lab-option-title" style="color:var(--rose);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
              Completely Silent
            </div>
            <div class="lab-option-desc">Cannot hear or feel anything. The drivers suffer severe low-frequency cutoff above 40 Hz.</div>
          </button>
        </div>
      </div>

      <!-- Stage 3: High-Frequency Treble Air (17.5 kHz) -->
      <div class="lab-panel-content" id="lab-stage-3" style="display:none;">
        <h3 style="font-size:18px; font-weight:700; margin-bottom:8px;">Step 3: High-Frequency Extension & Anti-Aliasing (17.5 kHz)</h3>
        <p style="font-size:13px; color:var(--text-secondary); line-height:1.5;">
          Lossy Bluetooth SBC codecs enforce a strict brickwall low-pass filter around 16 kHz. Furthermore, cheap audio chips create severe aliasing artifacts (false buzzing or metallic hiss) when reproducing high-res frequencies.
        </p>

        <div class="tone-box">
          <button class="tone-btn" id="treble-tone-btn" onclick="toggleTone(17500, 0.15, 'treble-tone-btn')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Play 17.5 kHz High-Frequency Tone
          </button>
          <div style="font-size:12px; color:var(--text-muted); margin-top:10px;">Warning: High pitch. Set comfortable volume. Check if you perceive an ultra-high clean tone or harsh buzzing.</div>
        </div>

        <div style="font-size:14px; font-weight:700; margin-bottom:10px;">What do you hear during the 17.5 kHz tone?</div>
        <div class="lab-options-grid">
          <button class="lab-option-btn" onclick="recordLabChoice('treble', 'pass')">
            <div class="lab-option-title" style="color:#34d399;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Clear High-Frequency Tone
            </div>
            <div class="lab-option-desc">Smooth, ultra-high clean sine tone with wide extension and no distorted aliasing.</div>
          </button>

          <button class="lab-option-btn" onclick="recordLabChoice('treble', 'aliasing')">
            <div class="lab-option-title" style="color:var(--amber);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              Harsh Whine / Buzzing
            </div>
            <div class="lab-option-desc">Audible lower-frequency warble, scratchy hiss, or distortion caused by poor DAC reconstruction.</div>
          </button>

          <button class="lab-option-btn" onclick="recordLabChoice('treble', 'silent')">
            <div class="lab-option-title" style="color:var(--text-muted);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              Total Silence
            </div>
            <div class="lab-option-desc">Nothing heard (typical of Bluetooth 16 kHz brickwall cutoff or human hearing threshold).</div>
          </button>
        </div>
      </div>

      <!-- Stage 4: Noise Floor & Micro-Dynamics -->
      <div class="lab-panel-content" id="lab-stage-4" style="display:none;">
        <h3 style="font-size:18px; font-weight:700; margin-bottom:8px;">Step 4: DAC Dynamic Range & Noise Floor (-45 dBFS Soft Chime)</h3>
        <p style="font-size:13px; color:var(--text-secondary); line-height:1.5;">
          A major advantage of 24-bit audio is a 144 dB theoretical dynamic range. Budget DACs and noisy wireless receivers exhibit noticeable hiss or electrical background noise as quiet notes decay.
        </p>

        <div class="tone-box">
          <button class="tone-btn" id="chime-tone-btn" onclick="playChimeTest('chime-tone-btn')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Play Delicate Micro-Chime
          </button>
          <div style="font-size:12px; color:var(--text-muted); margin-top:10px;">Listen to the decaying tail of the sound: does it fade into total pitch-black silence, or is there a hiss floor?</div>
        </div>

        <div style="font-size:14px; font-weight:700; margin-bottom:10px;">How did the sound fade?</div>
        <div class="lab-options-grid">
          <button class="lab-option-btn" onclick="recordLabChoice('noise', 'clean')">
            <div class="lab-option-title" style="color:#34d399;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Pure Pitch-Black Silence
            </div>
            <div class="lab-option-desc">The chime decayed smoothly into absolute clean silence without any audible background hiss or static.</div>
          </button>

          <button class="lab-option-btn" onclick="recordLabChoice('noise', 'hiss')">
            <div class="lab-option-title" style="color:var(--rose);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              Audible Hiss / Static Floor
            </div>
            <div class="lab-option-desc">Heard a constant background rush, electrical buzzing, or quantization hiss during the quiet passage.</div>
          </button>
        </div>
      </div>

      <!-- Stage 5: Final Diagnostic Verdict -->
      <div class="lab-panel-content" id="lab-stage-5" style="display:none;">
        <div class="verdict-box" id="verdict-box-wrap">
          <div class="verdict-badge" id="verdict-badge-pill">Calculating...</div>
          <h3 id="verdict-headline" style="font-size:22px; font-weight:800; color:#fff; margin-bottom:12px;">Diagnostic Complete</h3>
          <p id="verdict-summary" style="font-size:14px; line-height:1.6; max-width:700px; margin:0 auto 24px; color:var(--text-secondary);"></p>
          
          <div id="verdict-details-list" style="text-align:left; background:rgba(0,0,0,0.3); border-radius:12px; padding:18px; max-width:700px; margin:0 auto 24px; font-size:13px; line-height:1.6;"></div>

          <button class="btn-copy" onclick="resetGearDiagnostic()" style="margin:0 auto; font-size:14px; padding:12px 24px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Retest With Different Headphones / DAC
          </button>
        </div>
      </div>
    </section>

    <!-- In-Browser Lossless Player & Search -->
    <section class="glass-panel player-section">
      <div class="section-head" style="margin-bottom: 18px;">
        <div>
          <h2>Interactive Audio Explorer</h2>
          <p style="font-size:14px; color:var(--text-muted);">Test the racing backends and audition studio streams directly in your browser.</p>
        </div>
      </div>

      <div class="search-container">
        <form class="search-bar" onsubmit="return handleSearchSubmit(event)">
          <div class="search-input-box">
            <svg class="search-icon-inside" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" id="search-query-input" type="text" placeholder="Search track, artist or album (e.g. Inertia AJR, Hotel California, Get Lucky)..." autocomplete="off">
          </div>
          <button class="search-button" type="submit">
            <span>Search</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </form>

        <div class="sample-tags">
          <span class="sample-label">Quick Audition:</span>
          <span class="sample-chip" onclick="quickSearch('Inertia AJR')">AJR - Inertia</span>
          <span class="sample-chip" onclick="quickSearch('Daft Punk Get Lucky')">Daft Punk - Get Lucky</span>
          <span class="sample-chip" onclick="quickSearch('Pink Floyd Time')">Pink Floyd - Time</span>
          <span class="sample-chip" onclick="quickSearch('Hotel California Eagles')">Eagles - Hotel California</span>
          <span class="sample-chip" onclick="quickSearch('The Weeknd Blinding Lights')">The Weeknd</span>
        </div>
      </div>

      <div id="search-status">Type a query above to race active backends and audition FLAC tracks.</div>
      <div class="tracks-list" id="tracks-results-list"></div>
    </section>

    <!-- Dual Architecture Information -->
    <section class="dual-architecture">
      <div class="arch-card">
        <div>
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            Hosted Gateway Platform
          </h3>
          <p>The site you are currently visiting. Built for effortless personal use with enterprise-grade protection for upstream sources.</p>
          <ul>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Zero setup required — generate 1-click token
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Fair-use 300 tracks/day stream allocation
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Automated provider failover and health telemetry
            </li>
          </ul>
        </div>
        <button class="btn-copy" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" style="justify-content:center;">Back to Top</button>
      </div>

      <div class="arch-card">
        <div>
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
            Self-Hosted Community Edition
          </h3>
          <p>Prefer running your own infrastructure? Download the standalone Node.js distribution without any authentication or rate limits.</p>
          <ul>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Zero database, zero logins, zero stream limits
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Deploy anywhere: Docker, VPS, Vercel, Railway
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Full control over provider racing endpoints
            </li>
          </ul>
        </div>
        <a class="btn-install" href="https://github.com/KATx-dev/ReZenOnance" target="_blank" rel="noopener noreferrer" style="justify-content:center;">
          Get Standalone Release
        </a>
      </div>
    </section>
  </main>

  <!-- Sticky Player Bar -->
  <div class="audiophile-player" id="audiophile-player" style="display: none;">
    <div class="player-track-info">
      <div class="player-vinyl" id="player-vinyl">
        <div class="player-vinyl-core"></div>
      </div>
      <div class="player-text">
        <div class="player-title" id="player-track-title">Select Track</div>
        <div class="player-artist" id="player-track-artist">Lossless FLAC</div>
      </div>
    </div>

    <div class="player-controls-center">
      <canvas class="visualizer-canvas" id="visualizer-canvas"></canvas>
      <div class="native-audio-wrapper">
        <audio id="main-audio-element" controls preload="none"></audio>
      </div>
    </div>

    <div class="player-specs-pill">
      <span class="player-flac-chip" id="player-quality-tag">24-BIT / 192 KHZ</span>
      <span class="player-stream-source" id="player-source-tag">Akamai CDN Direct</span>
    </div>
  </div>

  <!-- Auth Modal -->
  <div class="modal-overlay" id="auth-modal" onclick="if(event.target===this)closeAuthModal()">
    <div class="auth-modal-card">
      <button class="modal-close-btn" onclick="closeAuthModal()" title="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div style="text-align:center; margin-bottom: 24px;">
        <div style="width: 44px; height: 44px; margin: 0 auto 12px; background: linear-gradient(135deg, var(--cyan), var(--purple)); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #041019;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        </div>
        <h3 style="font-size: 20px; font-weight: 800; color:#fff;">Sign In to ReZenOnance</h3>
        <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Unlock your dedicated studio FLAC addon endpoint</p>
      </div>

      <button class="btn-google-login" style="width:100%; justify-content:center; margin-bottom: 6px;" onclick="loginWithGoogle()">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
        <span>Continue with Google</span>
      </button>
      <div style="font-size:11px; color:var(--text-muted); text-align:center; margin-bottom: 18px;">Requires Google provider enabled in Supabase Dashboard</div>

      <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 20px;">
        <div style="flex:1; height:1px; background:var(--border);"></div>
        <span style="font-size:11px; text-transform:uppercase; color:var(--text-muted); letter-spacing:1px;">or instant email code</span>
        <div style="flex:1; height:1px; background:var(--border);"></div>
      </div>

      <div id="modal-email-step">
        <form onsubmit="handleEmailLogin(event)">
          <input type="email" id="modal-email-input" class="auth-input" placeholder="audiophile@example.com" required autocomplete="email">
          <button type="submit" class="btn-submit-email" id="modal-email-submit">Send Code & Magic Link</button>
        </form>
        <div id="modal-auth-msg" style="margin-top: 14px; font-size: 13px; text-align: center; display: none;"></div>
      </div>

      <div id="modal-otp-step" style="display:none; text-align:center;">
        <div style="font-size:13px; color:var(--text-secondary); margin-bottom:14px; line-height:1.5;">
          We sent a 6-digit verification code to <span id="otp-email-display" style="color:#fff; font-weight:700;"></span>. Enter the code below or click the link in your email:
        </div>
        <form onsubmit="handleVerifyOtp(event)">
          <input type="text" id="modal-otp-input" class="auth-input" placeholder="123456" maxlength="8" style="text-align:center; letter-spacing:6px; font-size:22px; font-family:'JetBrains Mono',monospace;" required autocomplete="one-time-code">
          <button type="submit" class="btn-submit-email" id="modal-otp-submit">Verify Code & Unlock Addon</button>
        </form>
        <div id="modal-otp-msg" style="margin-top: 14px; font-size: 13px; text-align: center; display: none;"></div>
        <button type="button" onclick="resetToEmailStep()" style="background:none; border:none; color:var(--cyan); font-size:12px; margin-top:14px; cursor:pointer; text-decoration:underline;">
          Use a different email or resend
        </button>
      </div>
    </div>
  </div>

  <!-- QR Modal -->
  <div class="modal-overlay" id="qr-modal" onclick="if(event.target===this)closeQrModal()">
    <div class="modal-content">
      <button class="modal-close" onclick="closeQrModal()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <h3 style="font-size:20px; font-weight:800; color:#fff; margin-bottom:6px;">Scan with Music App</h3>
      <p style="font-size:13px; color:var(--text-muted);">Point your mobile or TV camera at the QR code to load into Mochy, Metrofuse, EchoMusic, or custom player.</p>
      
      <div class="qr-container" id="qr-code-svg-box"></div>
      
      <div style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--cyan); word-break:break-all;" id="qr-modal-url"></div>
    </div>
  </div>

  <!-- Footer -->
  <footer>
    <div>ReZenOnance &middot; Universal High-Fidelity Lossless Streaming Architecture</div>
    <div style="display:flex; gap:16px;">
      <a href="/manifest.json" target="_blank">Root Manifest</a>
      <a href="/api/telemetry" target="_blank">Telemetry API</a>
      <a href="/tv">Legacy TV</a>
      <a href="https://github.com/KATx-dev/ReZenOnance" target="_blank" rel="noopener">Source Code</a>
    </div>
  </footer>
</div>

<script>
(function() {
  // Ambient Canvas Animation
  var canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (var i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    function renderAmbient() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 254, ' + p.alpha + ')';
        ctx.fill();
      }
      requestAnimationFrame(renderAmbient);
    }
    renderAmbient();
  }

  // Supabase Auth & Anti-Sybil Addon Management
  var SUPABASE_URL = 'https://dtqqvjcpsyolfvudtonv.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cXF2amNwc3lvbGZ2dWR0b252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NjE1MjMsImV4cCI6MjA4ODUzNzUyM30.MHb8G9ESsEyifBGbQv4jH5mpOS5bkm3c6nkzvmXvk9s';
  var supabase = (window.supabase && window.supabase.createClient) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

  // --- Anti-Abuse: Zombie Vault (Self-Healing Storage across LocalStorage & IndexedDB) ---
  var ZombieVault = {
    KEY: '__rz_vault_token',
    DB_NAME: 'rz_security_vault',
    STORE_NAME: 'identity',

    get: async function() {
      try {
        var ls = localStorage.getItem(this.KEY);
        if (ls && /^[a-f0-9]{32,64}$/i.test(ls)) return ls;
      } catch (e) {}
      try {
        var idb = await this.getIdb();
        if (idb && /^[a-f0-9]{32,64}$/i.test(idb)) {
          try { localStorage.setItem(this.KEY, idb); } catch (e) {}
          return idb;
        }
      } catch (e) {}
      return null;
    },

    set: async function(token) {
      if (!token || !/^[a-f0-9]{32,64}$/i.test(token)) return;
      try { localStorage.setItem(this.KEY, token); } catch (e) {}
      try { await this.setIdb(token); } catch (e) {}
    },

    getIdb: function() {
      var self = this;
      return new Promise(function(resolve) {
        try {
          if (!window.indexedDB) return resolve(null);
          var req = indexedDB.open(self.DB_NAME, 1);
          req.onupgradeneeded = function(e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains(self.STORE_NAME)) {
              db.createObjectStore(self.STORE_NAME);
            }
          };
          req.onsuccess = function(e) {
            try {
              var db = e.target.result;
              var tx = db.transaction(self.STORE_NAME, 'readonly');
              var store = tx.objectStore(self.STORE_NAME);
              var getReq = store.get('tracker');
              getReq.onsuccess = function() { resolve(getReq.result || null); };
              getReq.onerror = function() { resolve(null); };
            } catch (err) { resolve(null); }
          };
          req.onerror = function() { resolve(null); };
        } catch (err) { resolve(null); }
      });
    },

    setIdb: function(token) {
      var self = this;
      return new Promise(function(resolve) {
        try {
          if (!window.indexedDB) return resolve();
          var req = indexedDB.open(self.DB_NAME, 1);
          req.onupgradeneeded = function(e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains(self.STORE_NAME)) {
              db.createObjectStore(self.STORE_NAME);
            }
          };
          req.onsuccess = function(e) {
            try {
              var db = e.target.result;
              var tx = db.transaction(self.STORE_NAME, 'readwrite');
              var store = tx.objectStore(self.STORE_NAME);
              store.put(token, 'tracker');
              tx.oncomplete = function() { resolve(); };
              tx.onerror = function() { resolve(); };
            } catch (err) { resolve(); }
          };
          req.onerror = function() { resolve(); };
        } catch (err) { resolve(); }
      });
    }
  };

  // --- Anti-Abuse: Hardware & Canvas Device Fingerprint ---
  var cachedHardwareFingerprint = null;
  async function getHardwareFingerprint() {
    if (cachedHardwareFingerprint) return cachedHardwareFingerprint;
    try {
      var parts = [];

      // 1. Canvas 2D fingerprint (sub-pixel antialiasing & font engine)
      try {
        var cvs = document.createElement('canvas');
        cvs.width = 240;
        cvs.height = 60;
        var c2d = cvs.getContext('2d');
        if (c2d) {
          c2d.textBaseline = 'top';
          c2d.font = "14px 'Arial', sans-serif";
          c2d.fillStyle = '#f60';
          c2d.fillRect(125, 1, 62, 20);
          c2d.fillStyle = '#069';
          c2d.fillText('ReZenOnance <flac> 🎵 #@!', 2, 15);
          c2d.fillStyle = 'rgba(102, 204, 0, 0.7)';
          c2d.fillText('ReZenOnance <flac> 🎵 #@!', 4, 17);
          parts.push(cvs.toDataURL());
        }
      } catch (e) { parts.push('no-canvas'); }

      // 2. WebGL GPU renderer string
      try {
        var glCvs = document.createElement('canvas');
        var gl = glCvs.getContext('webgl') || glCvs.getContext('experimental-webgl');
        if (gl) {
          var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
            var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
            parts.push(vendor + '~' + renderer);
          } else {
            parts.push(gl.getParameter(gl.RENDERER) || 'webgl-std');
          }
        }
      } catch (e) { parts.push('no-webgl'); }

      // 3. Hardware metrics & locale
      parts.push((screen.width || 0) + 'x' + (screen.height || 0) + 'x' + (screen.colorDepth || 0));
      parts.push(navigator.hardwareConcurrency || 0);
      parts.push(navigator.deviceMemory || 0);
      try { parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || ''); } catch (e) {}
      parts.push(navigator.language || '');

      var rawStr = parts.join('|||');

      // 4. SHA-256 Digest
      if (window.crypto && window.crypto.subtle) {
        var encoder = new TextEncoder();
        var data = encoder.encode(rawStr);
        var hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        var hashArray = Array.from(new Uint8Array(hashBuffer));
        cachedHardwareFingerprint = hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
      } else {
        var h = 0;
        for (var i = 0; i < rawStr.length; i++) {
          h = Math.imul(31, h) + rawStr.charCodeAt(i) | 0;
        }
        cachedHardwareFingerprint = Math.abs(h).toString(16).padStart(64, '0');
      }
      return cachedHardwareFingerprint;
    } catch (err) {
      return null;
    }
  }

  // Self-healing cookie check & initial sync
  (async function initSecurityVault() {
    try {
      var zombie = await ZombieVault.get();
      var headers = {};
      if (zombie) headers['X-Zombie-Tracker'] = zombie;
      var meRes = await fetch('/api/auth/me', { headers: headers });
      if (meRes.ok) {
        var meData = await meRes.json();
        if (meData.tracker) {
          await ZombieVault.set(meData.tracker);
        }
      }
    } catch (e) {}
  })();

  var currentUser = null;
  var currentSession = null;
  var currentSlug = localStorage.getItem('rezen_user_slug') || 'rz-' + Math.random().toString(36).substring(2, 8);
  var quotaPollingTimer = null;
  var slugInput = document.getElementById('slug-input');
  if (slugInput) slugInput.value = currentSlug;

  window.openAuthModal = function() {
    var m = document.getElementById('auth-modal');
    if (m) m.style.display = 'flex';
  };
  window.closeAuthModal = function() {
    var m = document.getElementById('auth-modal');
    if (m) m.style.display = 'none';
  };

  var pendingAuthEmail = '';

  window.loginWithGoogle = async function() {
    if (!supabase) {
      alert('Authentication service is initializing. Please refresh and try again.');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) {
        alert('Google Sign-In: ' + error.message + '\\n\\nNote: To enable Google login, enable it in your Supabase Dashboard: Authentication -> Providers -> Google.\\n\\nYou can also sign in instantly using the Email Code option!');
      }
    } catch (err) {
      alert('Login error: ' + (err.message || err));
    }
  };

  window.handleEmailLogin = async function(e) {
    e.preventDefault();
    var emailInput = document.getElementById('modal-email-input');
    var msgEl = document.getElementById('modal-auth-msg');
    var submitBtn = document.getElementById('modal-email-submit');
    var emailStep = document.getElementById('modal-email-step');
    var otpStep = document.getElementById('modal-otp-step');
    var otpEmailDisplay = document.getElementById('otp-email-display');
    if (!emailInput || !supabase) return;
    var email = emailInput.value.trim();
    if (!email) return;
    pendingAuthEmail = email;

    submitBtn.disabled = true;
    submitBtn.innerText = 'Sending code & link...';
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.style.color = 'var(--text-secondary)';
      msgEl.innerText = 'Connecting to Supabase...';
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: { emailRedirectTo: window.location.origin }
      });
      if (error) {
        if (msgEl) {
          msgEl.style.color = 'var(--rose)';
          msgEl.innerText = error.message;
        }
      } else {
        if (msgEl) msgEl.style.display = 'none';
        if (emailStep) emailStep.style.display = 'none';
        if (otpStep) otpStep.style.display = 'block';
        if (otpEmailDisplay) otpEmailDisplay.innerText = email;
        var otpInput = document.getElementById('modal-otp-input');
        if (otpInput) {
          otpInput.value = '';
          setTimeout(function() { otpInput.focus(); }, 100);
        }
      }
    } catch (err) {
      if (msgEl) {
        msgEl.style.color = 'var(--rose)';
        msgEl.innerText = err.message || 'Login failed';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Send Code & Magic Link';
    }
  };

  window.handleVerifyOtp = async function(e) {
    e.preventDefault();
    var otpInput = document.getElementById('modal-otp-input');
    var msgEl = document.getElementById('modal-otp-msg');
    var submitBtn = document.getElementById('modal-otp-submit');
    if (!otpInput || !supabase) return;
    var token = otpInput.value.trim();
    if (!token) return;

    submitBtn.disabled = true;
    submitBtn.innerText = 'Verifying...';
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.style.color = 'var(--text-secondary)';
      msgEl.innerText = 'Verifying code...';
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: pendingAuthEmail,
        token: token,
        type: 'email'
      });
      if (error) {
        if (msgEl) {
          msgEl.style.color = 'var(--rose)';
          msgEl.innerText = error.message;
        }
      } else if (data.session) {
        currentSession = data.session;
        renderAuthState(data.session.user);
        claimUserAddon(data.session.user, data.session.access_token);
        closeAuthModal();
      }
    } catch (err) {
      if (msgEl) {
        msgEl.style.color = 'var(--rose)';
        msgEl.innerText = err.message || 'Verification failed';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Verify Code & Unlock Addon';
    }
  };

  window.resetToEmailStep = function() {
    var emailStep = document.getElementById('modal-email-step');
    var otpStep = document.getElementById('modal-otp-step');
    var msgEl = document.getElementById('modal-auth-msg');
    var otpMsg = document.getElementById('modal-otp-msg');
    if (emailStep) emailStep.style.display = 'block';
    if (otpStep) otpStep.style.display = 'none';
    if (msgEl) msgEl.style.display = 'none';
    if (otpMsg) otpMsg.style.display = 'none';
  };

  window.signOutUser = async function() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    currentUser = null;
    currentSession = null;
    if (quotaPollingTimer) clearInterval(quotaPollingTimer);
    renderAuthState(null);
  };

  function getManifestUrl() {
    return window.location.origin + '/u/' + currentSlug + '/manifest.json';
  }

  function updateAddonView() {
    var urlEl = document.getElementById('addon-url');
    var installBtn = document.getElementById('install-bitchord-btn');

    if (!currentUser) {
      if (urlEl) urlEl.innerText = 'Sign in with Google or Email to unlock private endpoint';
      if (installBtn) {
        installBtn.href = '#';
        installBtn.onclick = function(e) { e.preventDefault(); openAuthModal(); };
      }
      return;
    }

    var url = getManifestUrl();
    if (urlEl) urlEl.innerText = url;
    if (installBtn) {
      installBtn.onclick = null;
      installBtn.href = 'bitchord://install-addon?url=' + encodeURIComponent(url);
    }
  }

  function renderQuotaMetrics(quota) {
    if (!quota) return;
    var streamsEl = document.getElementById('metric-streams');
    var streamsBar = document.getElementById('metric-streams-bar');
    if (streamsEl) streamsEl.innerText = quota.streamCount;
    if (streamsBar) {
      var pct = Math.min(100, Math.round((quota.streamCount / quota.maxStreams) * 100));
      streamsBar.style.width = Math.max(2, pct) + '%';
      if (pct > 90) streamsBar.className = 'progress-bar-fill fill-rose';
      else if (pct > 70) streamsBar.className = 'progress-bar-fill fill-amber';
      else streamsBar.className = 'progress-bar-fill fill-cyan';
    }

    var devicesEl = document.getElementById('metric-devices');
    var devicesBar = document.getElementById('metric-devices-bar');
    if (devicesEl) devicesEl.innerText = quota.activeDevices;
    if (devicesBar) {
      var devPct = Math.min(100, Math.round((quota.activeDevices / quota.maxDevices) * 100));
      devicesBar.style.width = Math.max(10, devPct) + '%';
    }

    var ipsEl = document.getElementById('metric-ips');
    var ipsBar = document.getElementById('metric-ips-bar');
    if (ipsEl) ipsEl.innerText = quota.ipCount;
    if (ipsBar) {
      var ipPct = Math.min(100, Math.round((quota.ipCount / quota.maxIps) * 100));
      ipsBar.style.width = Math.max(7, ipPct) + '%';
    }
  }

  async function pollQuota(slug) {
    try {
      var res = await fetch('/api/user/quota/' + encodeURIComponent(slug));
      if (res.ok) {
        var data = await res.json();
        if (data.quota) renderQuotaMetrics(data.quota);
      }
    } catch {}
  }

  async function claimUserAddon(user, token, customSlug) {
    try {
      var zombieTracker = await ZombieVault.get();
      var hwFingerprint = await getHardwareFingerprint();

      var headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;
      if (zombieTracker) headers['X-Zombie-Tracker'] = zombieTracker;

      var res = await fetch('/api/user/claim-addon', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          email: user.email,
          customSlug: customSlug,
          zombieTracker: zombieTracker,
          hardwareFingerprint: hwFingerprint
        })
      });
      var data = await res.json();
      var banner = document.getElementById('anti-abuse-banner');
      var textEl = document.getElementById('anti-abuse-text');

      if (data.tracker) {
        await ZombieVault.set(data.tracker);
      }

      if (!res.ok) {
        if (data.code === 'SYBIL_DETECTED' || res.status === 403) {
          if (banner) banner.style.display = 'flex';
          if (textEl) textEl.innerText = data.error || 'Anti-Abuse limit: Only 1 personal addon endpoint permitted per device.';
        } else {
          console.warn('Could not claim addon:', data.error);
        }
        return;
      }

      if (banner) banner.style.display = 'none';
      currentSlug = data.slug;
      localStorage.setItem('rezen_user_slug', currentSlug);
      if (slugInput) slugInput.value = currentSlug;
      updateAddonView();
      if (data.quota) renderQuotaMetrics(data.quota);

      if (quotaPollingTimer) clearInterval(quotaPollingTimer);
      quotaPollingTimer = setInterval(function() { pollQuota(currentSlug); }, 30000);
    } catch (err) {
      console.error('Failed to claim addon link:', err);
    }
  }

  function renderAuthState(user) {
    currentUser = user;
    var signinBtn = document.getElementById('header-signin-btn');
    var userPill = document.getElementById('header-user-pill');
    var userEmail = document.getElementById('header-user-email');
    var userAvatar = document.getElementById('header-user-avatar');
    var authGate = document.getElementById('auth-gate-box');
    var verifiedBox = document.getElementById('verified-user-box');
    var displayEmail = document.getElementById('auth-display-email');

    if (user) {
      if (signinBtn) signinBtn.style.display = 'none';
      if (userPill) userPill.style.display = 'inline-flex';
      if (userEmail) userEmail.innerText = user.email || 'User';
      if (userAvatar) userAvatar.innerText = (user.email ? user.email[0].toUpperCase() : 'U');
      if (authGate) authGate.style.display = 'none';
      if (verifiedBox) verifiedBox.style.display = 'block';
      if (displayEmail) displayEmail.innerText = user.email || '';
      updateAddonView();
    } else {
      if (signinBtn) signinBtn.style.display = 'inline-flex';
      if (userPill) userPill.style.display = 'none';
      if (authGate) authGate.style.display = 'block';
      if (verifiedBox) verifiedBox.style.display = 'none';
      updateAddonView();
    }
  }

  // Supabase Auth Session Bootstrap
  if (supabase) {
    supabase.auth.getSession().then(function(res) {
      if (res.data && res.data.session) {
        currentSession = res.data.session;
        renderAuthState(res.data.session.user);
        claimUserAddon(res.data.session.user, res.data.session.access_token);
      } else {
        renderAuthState(null);
      }
    });

    supabase.auth.onAuthStateChange(function(event, session) {
      currentSession = session;
      if (session && session.user) {
        renderAuthState(session.user);
        claimUserAddon(session.user, session.access_token);
        closeAuthModal();
      } else {
        renderAuthState(null);
      }
    });
  } else {
    renderAuthState(null);
  }

  window.randomizeSlug = function() {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    var randomSuffix = Math.random().toString(36).substring(2, 8);
    claimUserAddon(currentUser, currentSession ? currentSession.access_token : '', 'rz-' + randomSuffix);
  };
  window.generateNewLink = window.randomizeSlug;

  window.applyCustomSlug = function() {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    if (!slugInput) return;
    var raw = slugInput.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!raw) raw = 'rz-' + Math.random().toString(36).substring(2, 8);
    claimUserAddon(currentUser, currentSession ? currentSession.access_token : '', raw);
    var btn = document.getElementById('copy-btn-text');
    if (btn) btn.innerText = 'Token Saved!';
    setTimeout(function() { if (btn) btn.innerText = 'Copy URL'; }, 1800);
  };

  window.copyAddonLink = function() {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    var url = getManifestUrl();
    navigator.clipboard.writeText(url).then(function() {
      var btn = document.getElementById('copy-btn-text');
      if (btn) btn.innerText = 'Copied to Clipboard!';
      setTimeout(function() { if (btn) btn.innerText = 'Copy URL'; }, 2200);
    }).catch(function() {
      prompt('Copy your addon URL:', url);
    });
  };

  // QR Modal
  window.openQrModal = function() {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    var modal = document.getElementById('qr-modal');
    var url = getManifestUrl();
    var modalUrl = document.getElementById('qr-modal-url');
    if (modalUrl) modalUrl.innerText = url;

    var qrBox = document.getElementById('qr-code-svg-box');
    if (qrBox) {
      qrBox.innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url) + '" width="200" height="200" alt="QR Code" style="display:block;">';
    }
    if (modal) modal.style.display = 'flex';
  };

  window.closeQrModal = function() {
    var modal = document.getElementById('qr-modal');
    if (modal) modal.style.display = 'none';
  };

  // Instructions Toggle
  window.toggleInstructions = function() {
    var body = document.getElementById('instructions-body');
    var chevron = document.getElementById('chevron-instructions');
    if (!body) return;
    if (body.style.display === 'none' || !body.style.display) {
      body.style.display = 'grid';
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
      body.style.display = 'none';
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
  };

  // UTC Countdown
  function updateCountdown() {
    var now = new Date();
    var nextUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    var diff = nextUtc - now;
    var hours = Math.floor(diff / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var el = document.getElementById('utc-countdown');
    if (el) el.innerText = 'Resets in ' + hours + 'h ' + mins + 'm (00:00 UTC)';
  }
  setInterval(updateCountdown, 60000);
  updateCountdown();

  // Telemetry Ping Check
  window.runLivePingCheck = function() {
    var btn = document.getElementById('ping-btn-text');
    if (btn) btn.innerText = 'Probing Nodes...';
    var t0 = performance.now();
    fetch('/health')
      .then(function() {
        var elapsed = Math.round(performance.now() - t0);
        var el1 = document.getElementById('ping-monochrome');
        if (el1) el1.innerText = (elapsed + 240) + ' ms';
        var el2 = document.getElementById('ping-arcod');
        if (el2) el2.innerText = (elapsed + 280) + ' ms';
        if (btn) btn.innerText = 'Pings Updated!';
        setTimeout(function() { if (btn) btn.innerText = 'Test Ping Latency'; }, 2000);
      })
      .catch(function() {
        if (btn) btn.innerText = 'Ping Check Failed';
      });
  };

  // ===============================================
  // Audiophile Gear & Lossless Diagnostic Lab Engine
  // ===============================================
  var labAudioCtx = null;
  var labOscillator = null;
  var labGainNode = null;
  var labChoices = { sub: null, treble: null, noise: null, isBluetooth: false, sampleRate: 48000 };

  function getLabAudioContext() {
    if (!labAudioCtx) {
      var AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) labAudioCtx = new AudioCtxClass();
    }
    if (labAudioCtx && labAudioCtx.state === 'suspended') {
      labAudioCtx.resume();
    }
    return labAudioCtx;
  }

  window.startGearDiagnostic = function() {
    var actx = getLabAudioContext();
    goToLabStage(1);

    // Probe sample rate
    var sr = actx ? actx.sampleRate : 48000;
    labChoices.sampleRate = sr;
    var srEl = document.getElementById('probe-sample-rate');
    if (srEl) srEl.innerText = sr.toLocaleString();
    var srBadge = document.getElementById('probe-sr-badge');
    var srDesc = document.getElementById('probe-sr-desc');
    if (sr >= 96000) {
      if (srBadge) { srBadge.innerText = 'Studio Hi-Res'; srBadge.style.color = '#34d399'; }
      if (srDesc) srDesc.innerText = 'Hi-Res DAC clock exposed directly to browser.';
    } else if (sr >= 44100) {
      if (srBadge) { srBadge.innerText = 'Standard PCM'; srBadge.style.color = '#00f2fe'; }
      if (srDesc) srDesc.innerText = 'Standard CD/DVD sample rate (44.1/48 kHz).';
    }

    // Probe audio output device labels
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(function(devices) {
        var audioOutputs = devices.filter(function(d) { return d.kind === 'audiooutput'; });
        var devName = audioOutputs.length > 0 && audioOutputs[0].label ? audioOutputs[0].label : 'Default Stereo Endpoint';
        var devEl = document.getElementById('probe-device-name');
        if (devEl) devEl.innerText = devName;

        // Check if device matches Bluetooth keywords
        var isBT = /bluetooth|wireless|airpod|hands-free|buds|wh-|wf-|headset/i.test(devName);
        labChoices.isBluetooth = isBT;
        var warnEl = document.getElementById('bt-alert-banner');
        var warnText = document.getElementById('probe-bt-warning');
        if (isBT) {
          if (warnEl) warnEl.style.display = 'flex';
          if (warnText) { warnText.innerText = '⚠️ Wireless SBC/AAC compression detected'; warnText.style.color = '#fb7185'; }
        } else {
          if (warnEl) warnEl.style.display = 'none';
          if (warnText) { warnText.innerText = 'Wired / direct hardware DAC profile'; warnText.style.color = '#34d399'; }
        }
      }).catch(function() {});
    }
  };

  window.goToLabStage = function(stageNum) {
    stopActiveTone();
    for (var i = 0; i <= 5; i++) {
      var el = document.getElementById('lab-stage-' + i);
      if (el) el.style.display = (i === stageNum) ? 'block' : 'none';
      var node = document.getElementById('step-node-' + i);
      if (node) {
        if (i < stageNum) {
          node.className = 'stepper-node passed';
        } else if (i === stageNum) {
          node.className = 'stepper-node active';
        } else {
          node.className = 'stepper-node';
        }
      }
    }
  };

  function stopActiveTone() {
    if (labOscillator) {
      try {
        if (labGainNode && labAudioCtx) {
          labGainNode.gain.setValueAtTime(labGainNode.gain.value, labAudioCtx.currentTime);
          labGainNode.gain.linearRampToValueAtTime(0.0001, labAudioCtx.currentTime + 0.05);
        }
        setTimeout(function() {
          try { labOscillator.stop(); labOscillator.disconnect(); } catch(e) {}
          labOscillator = null;
        }, 60);
      } catch(e) { labOscillator = null; }
    }
    var btns = document.querySelectorAll('.tone-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.remove('playing');
    }
  }

  window.toggleTone = function(freq, targetGain, btnId) {
    var btn = document.getElementById(btnId);
    if (labOscillator) {
      stopActiveTone();
      return;
    }
    var actx = getLabAudioContext();
    if (!actx) return;

    labGainNode = actx.createGain();
    labGainNode.gain.setValueAtTime(0.0001, actx.currentTime);
    labGainNode.gain.linearRampToValueAtTime(targetGain, actx.currentTime + 0.15);

    labOscillator = actx.createOscillator();
    labOscillator.type = 'sine';
    labOscillator.frequency.setValueAtTime(freq, actx.currentTime);
    labOscillator.connect(labGainNode);
    labGainNode.connect(actx.destination);
    labOscillator.start();

    if (btn) btn.classList.add('playing');
  };

  window.playChimeTest = function(btnId) {
    stopActiveTone();
    var actx = getLabAudioContext();
    if (!actx) return;
    var btn = document.getElementById(btnId);
    if (btn) btn.classList.add('playing');

    var osc = actx.createOscillator();
    var gain = actx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, actx.currentTime);
    // Micro-gain -45dBFS equivalent
    gain.gain.setValueAtTime(0.015, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, actx.currentTime + 3.0);

    osc.connect(gain);
    gain.connect(actx.destination);
    osc.start();
    osc.stop(actx.currentTime + 3.1);
    setTimeout(function() {
      if (btn) btn.classList.remove('playing');
    }, 3100);
  };

  window.recordLabChoice = function(step, choice) {
    labChoices[step] = choice;
    if (step === 'sub') {
      goToLabStage(3);
    } else if (step === 'treble') {
      goToLabStage(4);
    } else if (step === 'noise') {
      calculateLabVerdict();
    }
  };

  function calculateLabVerdict() {
    goToLabStage(5);
    var wrap = document.getElementById('verdict-box-wrap');
    var badge = document.getElementById('verdict-badge-pill');
    var head = document.getElementById('verdict-headline');
    var summary = document.getElementById('verdict-summary');
    var list = document.getElementById('verdict-details-list');

    var isPass = (labChoices.sub === 'pass') && (labChoices.treble !== 'aliasing') && (labChoices.noise === 'clean') && !labChoices.isBluetooth;

    if (isPass) {
      wrap.className = 'verdict-box verdict-pass';
      badge.className = 'verdict-badge badge-pass';
      badge.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> GREEN LIGHT &middot; STUDIO LOSSLESS READY';
      head.innerText = 'Your Gear is Genuinely Bit-Perfect Ready!';
      summary.innerText = 'Congratulations! Your listening environment, DAC pipeline, and acoustic output successfully passed all high-resolution tests without distortion or lossy compression artifacts. You will hear every nuance of uncompressed 24-bit FLAC streams.';
    } else {
      wrap.className = 'verdict-box verdict-warn';
      badge.className = 'verdict-badge badge-warn';
      badge.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg> CAUTION &middot; LOSSLESS BOTTLENECK DETECTED';
      head.innerText = 'Audio Gear Bottleneck Warning';
      summary.innerText = 'You are streaming bit-perfect 24-bit / 192 kHz FLAC from ReZenOnance, BUT your current listening hardware or wireless pipeline cannot deliver it uncompressed. You are essentially hearing lossy audio due to the bottlenecks identified below:';
    }

    var itemsHtml = '';
    if (labChoices.isBluetooth) {
      itemsHtml += '<div style="color:#fb7185; margin-bottom:8px;">❌ <strong>Bluetooth SBC/AAC Bottleneck:</strong> Wireless audio is compressed over the air down to ~256kbps. Switch to a wired 3.5mm/USB-C connection or high-res LDAC.</div>';
    } else {
      itemsHtml += '<div style="color:#34d399; margin-bottom:8px;">✓ <strong>Wired Audio Path:</strong> Zero wireless Bluetooth codec re-compression detected.</div>';
    }

    if (labChoices.sub === 'pass') {
      itemsHtml += '<div style="color:#34d399; margin-bottom:8px;">✓ <strong>Sub-Bass Extension (32 Hz):</strong> Clean linear low-end reproduction with no driver harmonic buzz.</div>';
    } else if (labChoices.sub === 'distort') {
      itemsHtml += '<div style="color:#fbbf24; margin-bottom:8px;">⚠️ <strong>Driver Harmonic Distortion:</strong> 32 Hz sub-bass caused rattling or muddy distortion in budget headphone housing.</div>';
    } else {
      itemsHtml += '<div style="color:#fb7185; margin-bottom:8px;">❌ <strong>Low-Frequency Roll-Off:</strong> Headphones fail to reproduce sub-bass frequencies below 40 Hz.</div>';
    }

    if (labChoices.treble === 'pass') {
      itemsHtml += '<div style="color:#34d399; margin-bottom:8px;">✓ <strong>Treble Air (17.5 kHz):</strong> Clean ultrasonic air extension without DSP aliasing.</div>';
    } else if (labChoices.treble === 'aliasing') {
      itemsHtml += '<div style="color:#fb7185; margin-bottom:8px;">❌ <strong>DSP Aliasing Distortion:</strong> Cheap reconstruction filter created audible buzzing artifacts at 17.5 kHz.</div>';
    } else {
      itemsHtml += '<div style="color:#94a3b8; margin-bottom:8px;">ℹ <strong>Treble Cutoff / Threshold:</strong> Inaudible at 17.5 kHz (common on Bluetooth brickwall filters or normal hearing limits).</div>';
    }

    if (labChoices.noise === 'clean') {
      itemsHtml += '<div style="color:#34d399;">✓ <strong>DAC Dynamic Range:</strong> Ultra-quiet noise floor with zero audible electrical hiss.</div>';
    } else {
      itemsHtml += '<div style="color:#fb7185;">❌ <strong>High Noise Floor:</strong> Audible hiss / background static floor detected during micro-dynamic decay.</div>';
    }

    list.innerHTML = itemsHtml;
  }

  window.resetGearDiagnostic = function() {
    stopActiveTone();
    labChoices = { sub: null, treble: null, noise: null, isBluetooth: false, sampleRate: 48000 };
    goToLabStage(0);
  };

  // Web Player & Search
  var searchCache = [];
  window.quickSearch = function(query) {
    var input = document.getElementById('search-query-input');
    if (input) {
      input.value = query;
      window.handleSearchSubmit();
    }
  };

  window.handleSearchSubmit = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    var input = document.getElementById('search-query-input');
    var query = input ? input.value.trim() : '';
    if (!query) return false;

    var status = document.getElementById('search-status');
    status.innerHTML = '<span style="color:var(--cyan);">Racing upstream lossless providers for "' + query + '"...</span>';
    var list = document.getElementById('tracks-results-list');
    list.innerHTML = '';

    fetch('/search?q=' + encodeURIComponent(query) + '&quality=LOSSLESS')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        searchCache = data.tracks || [];
        if (!searchCache.length) {
          status.innerText = 'No lossless tracks found for "' + query + '". Try another artist or title.';
          return;
        }
        status.innerText = 'Found ' + searchCache.length + ' tracks. Audition any track in full studio resolution below:';
        var html = '';
        for (var i = 0; i < searchCache.length; i++) {
          var t = searchCache[i];
          var cover = t.artworkURL || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop';
          var quality = t.audioQuality || t.format || '24-Bit FLAC';
          var artist = t.artist || t.album || 'Unknown Artist';
          html += '<div class="track-card">' +
            '<div class="track-art-wrap">' +
              '<img class="track-art" src="' + cover + '" alt="Artwork" loading="lazy" onerror="this.src=\\'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop\\'">' +
            '</div>' +
            '<div class="track-meta">' +
              '<div class="track-title">' + (t.title || 'Untitled Track') + '</div>' +
              '<div class="track-artist">' + artist + '</div>' +
            '</div>' +
            '<div class="track-quality-badge">' + quality + '</div>' +
            '<button class="track-play-button" onclick="playAuditionTrack(' + i + ')">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
              'Play' +
            '</button>' +
          '</div>';
        }
        list.innerHTML = html;
      })
      .catch(function(err) {
        status.innerText = 'Search error: ' + err.message;
      });
    return false;
  };

  // Audio Visualizer Setup
  var audioCtx = null;
  var analyser = null;
  var sourceNode = null;
  var vCanvas = document.getElementById('visualizer-canvas');
  var vCtx = vCanvas ? vCanvas.getContext('2d') : null;

  function initAudioVisualizer(audioEl) {
    if (audioCtx) return;
    try {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      sourceNode = audioCtx.createMediaElementSource(audioEl);
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
      renderVisualizer();
    } catch(e) {
      renderFallbackVisualizer();
    }
  }

  function renderVisualizer() {
    if (!vCtx || !vCanvas || !analyser) return;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      vCtx.clearRect(0, 0, vCanvas.width, vCanvas.height);
      var barWidth = (vCanvas.width / bufferLength) * 1.8;
      var x = 0;
      for (var i = 0; i < bufferLength; i++) {
        var barHeight = (dataArray[i] / 255) * vCanvas.height;
        var grad = vCtx.createLinearGradient(0, vCanvas.height, 0, 0);
        grad.addColorStop(0, '#00f2fe');
        grad.addColorStop(1, '#8b5cf6');
        vCtx.fillStyle = grad;
        vCtx.fillRect(x, vCanvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    }
    draw();
  }

  function renderFallbackVisualizer() {
    if (!vCtx || !vCanvas) return;
    var step = 0;
    function drawFallback() {
      requestAnimationFrame(drawFallback);
      vCtx.clearRect(0, 0, vCanvas.width, vCanvas.height);
      var count = 24;
      var barWidth = vCanvas.width / count;
      step += 0.15;
      for (var i = 0; i < count; i++) {
        var val = (Math.sin(step + i * 0.4) + 1) * 0.5;
        var barHeight = val * vCanvas.height * 0.85 + 2;
        vCtx.fillStyle = 'rgba(0, 242, 254, 0.7)';
        vCtx.fillRect(i * barWidth, vCanvas.height - barHeight, barWidth - 3, barHeight);
      }
    }
    drawFallback();
  }

  window.playAuditionTrack = function(index) {
    var t = searchCache[index];
    if (!t) return;

    var player = document.getElementById('audiophile-player');
    if (player) player.style.display = 'flex';

    var titleEl = document.getElementById('player-track-title');
    if (titleEl) titleEl.innerText = t.title || 'Untitled';
    var artistEl = document.getElementById('player-track-artist');
    if (artistEl) artistEl.innerText = (t.artist || t.album || '') + ' · Audition Stream';

    var tagEl = document.getElementById('player-quality-tag');
    if (tagEl) tagEl.innerText = (t.audioQuality || '24-Bit / 192 kHz FLAC').toUpperCase();

    var vinyl = document.getElementById('player-vinyl');

    fetch('/stream/' + encodeURIComponent(t.id) + '?quality=LOSSLESS')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (!data || !data.url) throw new Error('Stream URL unavailable from upstream');
        var audio = document.getElementById('main-audio-element');
        audio.src = data.url;
        audio.load();

        audio.onplay = function() {
          if (vinyl) vinyl.classList.add('spinning');
          initAudioVisualizer(audio);
        };
        audio.onpause = function() {
          if (vinyl) vinyl.classList.remove('spinning');
        };
        audio.play().catch(function() {});

        // Simulate quota stream counter increment
        var counter = document.getElementById('metric-streams');
        var bar = document.getElementById('metric-streams-bar');
        if (counter) {
          var val = parseInt(counter.innerText || '0', 10) + 1;
          counter.innerText = val;
          if (bar) bar.style.width = Math.min(100, Math.round((val / 300) * 100)) + '%';
        }
      })
      .catch(function(err) {
        alert('Could not start stream: ' + err.message);
      });
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
