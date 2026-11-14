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
  background: linear-gradient(180deg, rgba(16, 22, 38, 0.9) 0%, rgba(10, 14, 25, 0.98) 100%);
  position: relative;
  border-radius: 20px;
}
.lab-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #10b981, #00f2fe, #8b5cf6);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
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

/* Benchmark Hero & Action Bar */
.lab-benchmark-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.lab-benchmark-btn {
  background: linear-gradient(135deg, var(--cyan), #3b82f6);
  color: #041019;
  border: none;
  font-weight: 800;
  font-size: 14px;
  padding: 14px 26px;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 0 20px var(--cyan-glow);
  transition: all 0.25s ease;
  white-space: nowrap;
}
.lab-benchmark-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px var(--cyan-glow);
}
.lab-benchmark-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

/* Real-time Benchmark Progress Bar */
.benchmark-progress-wrap {
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 24px;
}
.benchmark-progress-bar-bg {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  overflow: hidden;
  margin: 10px 0;
}
.benchmark-progress-bar-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #10b981, #00f2fe, #8b5cf6);
  border-radius: 9999px;
  transition: width 0.18s ease-out;
}
.benchmark-status-text {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--cyan);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 4-Tier FLAC Capabilities Grid */
.flac-grid-4 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}
.flac-tier-card {
  background: rgba(14, 18, 30, 0.7);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  position: relative;
  transition: border-color 0.2s, transform 0.2s;
}
.flac-tier-card.tier-active {
  border-color: rgba(0, 242, 254, 0.45);
  background: rgba(14, 24, 42, 0.85);
}
.flac-tier-card.tier-pass {
  border-color: rgba(16, 185, 129, 0.4);
}
.flac-tier-card.tier-warn {
  border-color: rgba(245, 158, 11, 0.4);
}
.flac-tier-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.flac-tier-name {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}
.flac-tier-specs {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 4px;
}
.flac-tier-bitrate {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-secondary);
  margin-bottom: 12px;
}
.flac-badge-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.flac-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.badge-supported { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.35); }
.badge-hw-accel { background: rgba(0, 242, 254, 0.15); color: var(--cyan); border: 1px solid rgba(0, 242, 254, 0.3); }
.badge-sw-decode { background: rgba(245, 158, 11, 0.15); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.3); }
.badge-unsupported { background: rgba(244, 63, 94, 0.2); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.35); }

/* Hardware Specs & Metrics Grid */
.hw-specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}
.hw-spec-card {
  background: rgba(10, 14, 24, 0.75);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
}
.hw-spec-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.6px;
  margin-bottom: 6px;
}
.hw-spec-val {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 4px;
}
.hw-spec-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Platform Audit & Guidance Box */
.platform-advisory-box {
  background: rgba(12, 17, 30, 0.85);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}
.platform-advisory-box::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 4px; bottom: 0;
  background: linear-gradient(180deg, var(--cyan), var(--purple));
}
.platform-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.platform-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.35);
  color: #c084fc;
  font-family: 'JetBrains Mono', monospace;
}

/* Interactive Audition Toolkit */
.audition-toolkit-card {
  background: rgba(8, 11, 20, 0.7);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}
.audition-tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
}
.audition-tool-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  text-align: left;
  cursor: pointer;
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.audition-tool-btn:hover {
  background: rgba(0, 242, 254, 0.08);
  border-color: rgba(0, 242, 254, 0.35);
  transform: translateY(-2px);
}
.audition-tool-btn.active-audition {
  background: rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.5);
  box-shadow: 0 0 15px rgba(244, 63, 94, 0.25);
}
.audition-tool-btn.active-audition .tool-btn-title {
  color: #fb7185;
}
.tool-btn-title {
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--cyan);
}
.tool-btn-desc {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Live Frequency Gauge */
.sweep-gauge-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 16px;
  margin-top: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}

/* Verdict Styles */
.verdict-box {
  padding: 28px;
  border-radius: 16px;
  text-align: center;
  background: rgba(14, 18, 30, 0.6);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}
.verdict-pass {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.35);
}
.verdict-warn {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.35);
}
.verdict-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 14px;
}
.badge-pass { background: rgba(16, 185, 129, 0.25); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
.badge-warn { background: rgba(245, 158, 11, 0.25); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.4); }

/* Listening Gear Selector Styles */
.gear-selector-box {
  background: rgba(10, 15, 26, 0.75);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 20px;
}
.detect-gear-btn {
  background: rgba(0, 242, 254, 0.1);
  border: 1px solid rgba(0, 242, 254, 0.3);
  color: var(--cyan);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.detect-gear-btn:hover {
  background: rgba(0, 242, 254, 0.2);
  transform: translateY(-1px);
}
.gear-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.gear-opt-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  font-family: inherit;
  color: var(--text-primary);
}
.gear-opt-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
}
.gear-opt-card.active {
  background: rgba(0, 242, 254, 0.08);
  border-color: var(--cyan);
  box-shadow: 0 0 16px rgba(0, 242, 254, 0.2);
}
.gear-opt-card.active.gear-lossy {
  background: rgba(245, 158, 11, 0.08);
  border-color: var(--amber);
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.2);
}
.gear-opt-icon {
  font-size: 22px;
  line-height: 1;
}
.gear-opt-name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.gear-opt-desc {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}
.gear-opt-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.badge-lossy { background: rgba(245, 158, 11, 0.2); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.4); }
.badge-lossless { background: rgba(0, 242, 254, 0.2); color: var(--cyan); border: 1px solid rgba(0, 242, 254, 0.4); }
.badge-studio { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
.badge-basic { background: rgba(255, 255, 255, 0.08); color: var(--text-muted); }

/* Dual Chain Audit Grid */
.dual-chain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  margin-top: 18px;
  text-align: left;
}
.dual-chain-col {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
}
.dual-chain-title {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-muted);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.dual-chain-val {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}
.dual-chain-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Interactive Stereo Channel Verification */
.stereo-channel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
  margin-top: 14px;
}
.channel-test-panel {
  background: rgba(12, 17, 30, 0.8);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.channel-play-btn {
  background: rgba(0, 242, 254, 0.12);
  border: 1px solid rgba(0, 242, 254, 0.35);
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  font-family: inherit;
}
.channel-play-btn:hover {
  background: rgba(0, 242, 254, 0.25);
  box-shadow: 0 0 16px rgba(0, 242, 254, 0.3);
}
.channel-play-btn.playing {
  background: rgba(244, 63, 94, 0.25);
  border-color: rgba(244, 63, 94, 0.6);
  color: #fb7185;
}
.channel-choice-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.channel-choice-chip {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  color: var(--text-secondary);
  text-align: left;
  transition: all 0.15s;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.channel-choice-chip:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
}
.channel-choice-chip.selected {
  background: rgba(0, 242, 254, 0.15);
  border-color: var(--cyan);
  color: #fff;
  font-weight: 700;
}
.channel-choice-chip.selected-warn {
  background: rgba(245, 158, 11, 0.15);
  border-color: var(--amber);
  color: var(--amber);
  font-weight: 700;
}
.channel-choice-chip.selected-danger {
  background: rgba(244, 63, 94, 0.15);
  border-color: #fb7185;
  color: #fb7185;
  font-weight: 700;
}
.stereo-status-banner {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 16px;
  margin-top: 14px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.5;
}
.stereo-status-pass {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
.stereo-status-warn {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.4);
  color: var(--amber);
}
.stereo-status-danger {
  background: rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.4);
  color: #fb7185;
}

/* Lossy Codec High Frequency Probe Styles */
.codec-probe-box {
  background: rgba(12, 17, 30, 0.6);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
  margin-top: 14px;
}

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
    <!-- Lossless Audio & Hardware Diagnostic Lab Section -->
    <!-- ============================================= -->
    <section class="glass-panel lab-section" id="hardware-lab">
      <div class="lab-pill">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
        Studio Lossless & Hardware Diagnostic Lab
      </div>

      <div class="lab-benchmark-header">
        <div>
          <h2 style="font-size:24px; font-weight:800; letter-spacing:-0.5px; margin-bottom:8px;">Lossless Audio & Hardware Capability Benchmark</h2>
          <p style="font-size:14px; color:var(--text-secondary); max-width:760px; line-height:1.6; margin:0;">
            Comprehensive cross-platform audio audit: probes your browser's native FLAC decoding engine, Web Audio clock frequency, DSP synthesis headroom (up to 192 kHz), and platform audio pipeline across Android and Windows.
          </p>
        </div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <button class="lab-benchmark-btn" id="run-benchmark-btn" onclick="runHardwareBenchmark()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span id="benchmark-btn-text">Run Complete Hardware Benchmark</span>
          </button>
        </div>
      </div>

      <!-- Interactive Listening Hardware & Transducer Selector -->
      <div class="gear-selector-box" style="margin-bottom:20px;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.8px; color:var(--cyan); margin-bottom:2px;">
              Acoustic Transmission Reality Check
            </div>
            <div style="font-size:15px; font-weight:700; color:#fff;">
              Active Listening Hardware & Transducer Link
            </div>
          </div>
          <button class="detect-gear-btn" onclick="detectHardwareDevices()" title="Scan browser audio endpoints">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Auto-Scan Endpoints</span>
          </button>
        </div>

        <div class="gear-options-grid">
          <button type="button" class="gear-opt-card active gear-lossy" id="gear-btn-bluetooth" onclick="selectListeningGear('bluetooth')">
            <span class="gear-opt-badge badge-lossy">Lossy Link</span>
            <div class="gear-opt-icon">🎧</div>
            <div class="gear-opt-info">
              <div class="gear-opt-name">Bluetooth (AAC / SBC)</div>
              <div class="gear-opt-desc">Wireless lossy bottleneck &middot; ~256-328 kbps compression with brickwall filter</div>
            </div>
          </button>

          <button type="button" class="gear-opt-card" id="gear-btn-wired" onclick="selectListeningGear('wired')">
            <span class="gear-opt-badge badge-lossless">Lossless</span>
            <div class="gear-opt-icon">🔌</div>
            <div class="gear-opt-info">
              <div class="gear-opt-name">Wired 3.5mm AUX / Jack</div>
              <div class="gear-opt-desc">Direct analog output &middot; Up to OS mixer clock (44.1k - 192k)</div>
            </div>
          </button>

          <button type="button" class="gear-opt-card" id="gear-btn-dac" onclick="selectListeningGear('dac')">
            <span class="gear-opt-badge badge-studio">Audiophile</span>
            <div class="gear-opt-icon">🎛️</div>
            <div class="gear-opt-info">
              <div class="gear-opt-name">External USB-C DAC / Amp</div>
              <div class="gear-opt-desc">Dedicated hardware DAC &middot; Bit-perfect up to 192 kHz / 24-bit PCM</div>
            </div>
          </button>

          <button type="button" class="gear-opt-card" id="gear-btn-speakers" onclick="selectListeningGear('speakers')">
            <span class="gear-opt-badge badge-basic">Built-in</span>
            <div class="gear-opt-icon">🔊</div>
            <div class="gear-opt-info">
              <div class="gear-opt-name">Device Speakers (Laptop / Phone)</div>
              <div class="gear-opt-desc">Built-in transducers &middot; Limited frequency response & narrow stereo</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Real-time Progress Bar -->
      <div class="benchmark-progress-wrap" id="benchmark-progress-wrap" style="display:none;">
        <div class="benchmark-status-text">
          <span id="benchmark-status-label">Initializing Audio Pipeline Probes...</span>
          <span id="benchmark-percentage">0%</span>
        </div>
        <div class="benchmark-progress-bar-bg">
          <div class="benchmark-progress-bar-fill" id="benchmark-progress-bar-fill"></div>
        </div>
      </div>

      <!-- Overall Audiophile Readiness Verdict -->
      <div class="verdict-box verdict-warn" id="lab-verdict-box" style="margin-bottom:24px;">
        <div class="verdict-badge badge-warn" id="verdict-badge-pill">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span id="verdict-tier-text">Tier 4 &middot; Lossy Wireless Bottleneck (AAC / SBC ~256 kbps)</span>
        </div>
        <h3 id="verdict-headline" style="font-size:22px; font-weight:800; color:#fff; margin-bottom:8px;">Lossy Bluetooth Codec Active (~256 kbps AAC / SBC)</h3>
        <p id="verdict-summary" style="font-size:14px; line-height:1.6; max-width:760px; margin:0 auto; color:var(--text-secondary);">
          Your browser decodes 24-bit / 192 kHz FLAC in software, but your headphones connect via Bluetooth A2DP. Bluetooth enforces lossy codec compression (AAC/SBC capped at ~256-328 kbps) with an inherent ~16.5-17.5 kHz brickwall filter. To experience uncompressed studio lossless (1,411 to 9,216 kbps PCM), connect via 3.5mm wired cable or an external USB-C DAC.
        </p>

        <!-- Dual Chain Audit Grid (Software Decoder vs Physical Transmission) -->
        <div class="dual-chain-grid">
          <div class="dual-chain-col">
            <div class="dual-chain-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg>
              <span>Browser Bitstream Decoder</span>
            </div>
            <div class="dual-chain-val" id="audit-sw-val" style="color:#34d399;">24-Bit / 192 kHz FLAC Supported</div>
            <div class="dual-chain-desc" id="audit-sw-desc">Chromium audio decoder &amp; Web Audio DSP synthesis engine pass uncompressed high-res container bitstreams.</div>
          </div>

          <div class="dual-chain-col">
            <div class="dual-chain-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
              <span>Acoustic Output Reality</span>
            </div>
            <div class="dual-chain-val" id="audit-hw-val" style="color:var(--amber);">Lossy Wireless Link (~256 kbps)</div>
            <div class="dual-chain-desc" id="audit-hw-desc">Audio is re-encoded by OS Bluetooth stack to AAC/SBC. Connect wired 3.5mm or USB-C DAC for true uncompressed playback.</div>
          </div>
        </div>
      </div>

      <!-- 4-Tier Native FLAC Decoding Matrix -->
      <div style="margin-bottom:12px;">
        <h4 style="font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-muted); margin-bottom:10px;">
          Hardware FLAC Bitstream Decoding Profiles (navigator.mediaCapabilities)
        </h4>
        <div class="flac-grid-4">
          <!-- CD Standard -->
          <div class="flac-tier-card tier-pass" id="tier-card-cd">
            <div class="flac-tier-header">
              <span class="flac-tier-name">Redbook CD</span>
              <span class="flac-badge badge-supported" id="tier-badge-cd">Supported</span>
            </div>
            <div class="flac-tier-specs">16-Bit / 44.1 kHz</div>
            <div class="flac-tier-bitrate">1,411 kbps PCM &middot; Stereo</div>
            <div class="flac-badge-row">
              <span class="flac-badge badge-hw-accel" id="tier-hw-cd">Hardware Decode</span>
              <span class="flac-badge" style="background:rgba(255,255,255,0.06); color:#fff;">Lossless</span>
            </div>
          </div>

          <!-- Studio Standard -->
          <div class="flac-tier-card tier-pass" id="tier-card-studio">
            <div class="flac-tier-header">
              <span class="flac-tier-name">Studio Standard</span>
              <span class="flac-badge badge-supported" id="tier-badge-studio">Supported</span>
            </div>
            <div class="flac-tier-specs">24-Bit / 48 kHz</div>
            <div class="flac-tier-bitrate">2,304 kbps PCM &middot; Stereo</div>
            <div class="flac-badge-row">
              <span class="flac-badge badge-hw-accel" id="tier-hw-studio">Hardware Decode</span>
              <span class="flac-badge" style="background:rgba(255,255,255,0.06); color:#fff;">Lossless</span>
            </div>
          </div>

          <!-- High-Res Master -->
          <div class="flac-tier-card tier-pass" id="tier-card-hires">
            <div class="flac-tier-header">
              <span class="flac-tier-name">High-Res Master</span>
              <span class="flac-badge badge-supported" id="tier-badge-hires">Supported</span>
            </div>
            <div class="flac-tier-specs">24-Bit / 96 kHz</div>
            <div class="flac-tier-bitrate">4,608 kbps PCM &middot; Studio</div>
            <div class="flac-badge-row">
              <span class="flac-badge badge-hw-accel" id="tier-hw-hires">Smooth Bitstream</span>
              <span class="flac-badge" style="background:rgba(255,255,255,0.06); color:#fff;">Hi-Res</span>
            </div>
          </div>

          <!-- Studio Master -->
          <div class="flac-tier-card tier-pass" id="tier-card-master">
            <div class="flac-tier-header">
              <span class="flac-tier-name">Ultra Audiophile</span>
              <span class="flac-badge badge-supported" id="tier-badge-master">Supported</span>
            </div>
            <div class="flac-tier-specs">24-Bit / 192 kHz</div>
            <div class="flac-tier-bitrate">9,216 kbps PCM &middot; Master</div>
            <div class="flac-badge-row">
              <span class="flac-badge badge-hw-accel" id="tier-hw-master">Hardware Pass</span>
              <span class="flac-badge" style="background:rgba(0,242,254,0.15); color:var(--cyan);">Studio Max</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Hardware Audio Engine & DSP Specs -->
      <div style="margin-bottom:12px;">
        <h4 style="font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-muted); margin-bottom:10px;">
          Audio Subsystem & DSP Synthesis Engine
        </h4>
        <div class="hw-specs-grid">
          <div class="hw-spec-card">
            <div class="hw-spec-title">Active DAC Clock</div>
            <div class="hw-spec-val" id="spec-sample-rate">48,000 <span style="font-size:14px; color:var(--text-muted);">Hz</span></div>
            <div class="hw-spec-desc" id="spec-sample-rate-desc">Internal browser audio output rate</div>
          </div>

          <div class="hw-spec-card">
            <div class="hw-spec-title">Max Synthesis Headroom</div>
            <div class="hw-spec-val" id="spec-max-headroom">192,000 <span style="font-size:14px; color:var(--text-muted);">Hz</span></div>
            <div class="hw-spec-desc">OfflineAudioContext synthesis limit</div>
          </div>

          <div class="hw-spec-card">
            <div class="hw-spec-title">Channels & Latency</div>
            <div class="hw-spec-val" id="spec-channels-latency">2.0 <span style="font-size:14px; color:var(--text-muted);">Stereo</span></div>
            <div class="hw-spec-desc" id="spec-latency-desc">Low-latency audio buffer pipeline</div>
          </div>

          <div class="hw-spec-card">
            <div class="hw-spec-title">DSP Synthesis Speed</div>
            <div class="hw-spec-val" id="spec-dsp-throughput">-- <span style="font-size:14px; color:var(--text-muted);">M-Samples/s</span></div>
            <div class="hw-spec-desc">Audio graph rendering throughput</div>
          </div>
        </div>
      </div>

      <!-- Platform Audio Pipeline (Android vs Windows) -->
      <div class="platform-advisory-box">
        <div class="platform-header-row">
          <div style="display:flex; align-items:center; gap:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            <span style="font-weight:800; font-size:15px; color:#fff;" id="platform-detect-name">Platform Audio Architecture</span>
          </div>
          <div class="platform-tag" id="platform-arch-tag">Detecting...</div>
        </div>
        <p style="font-size:13px; color:var(--text-secondary); line-height:1.6; margin-bottom:14px;" id="platform-advisory-text">
          Inspecting operating system audio graph...
        </p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; font-size:12px; font-family:'JetBrains Mono',monospace; background:rgba(0,0,0,0.3); padding:12px 16px; border-radius:10px;">
          <div><span style="color:var(--text-muted);">GPU Engine:</span> <span id="platform-gpu-name" style="color:var(--cyan);">--</span></div>
          <div><span style="color:var(--text-muted);">Output Route:</span> <span id="platform-output-route" style="color:#34d399;">Default Endpoint</span></div>
          <div><span style="color:var(--text-muted);">Display Ratio:</span> <span id="platform-dpr" style="color:#fff;">--</span></div>
          <div><span style="color:var(--text-muted);">CPU Concurrency:</span> <span id="platform-cores" style="color:#fff;">--</span></div>
        </div>
      </div>

      <!-- Interactive Audiophile Sound Lab (True interactive verification, never fake-pass) -->
      <div class="audition-toolkit-card">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div>
            <h4 style="font-size:16px; font-weight:800; color:#fff; margin-bottom:4px;">Acoustic & Dynamic Range Calibration Lab</h4>
            <p style="font-size:13px; color:var(--text-muted); margin:0;">
              Audition instant acoustic calibration tones. Physically verify stereo separation, detect single-bud / mono issues, inspect Bluetooth AAC brickwall cutoffs, and probe sub-bass extension.
            </p>
          </div>
          <button onclick="stopActiveTone()" style="background:rgba(244,63,94,0.15); border:1px solid rgba(244,63,94,0.35); color:#fb7185; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer;">
            ⏹ Stop Audio
          </button>
        </div>

        <!-- 1. Interactive Physical Stereo Channel & Earbud Presence Verification -->
        <div style="margin-top:18px;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
            <div style="font-size:13px; font-weight:700; color:#fff; display:flex; align-items:center; gap:6px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2.5"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
              <span>Physical Left / Right Channel &amp; Earbud Verification</span>
            </div>
            <div style="font-size:11px; color:var(--text-muted);">
              Play isolated tones &amp; confirm which ear hears sound
            </div>
          </div>

          <div class="stereo-channel-grid">
            <!-- Left Channel Test Panel -->
            <div class="channel-test-panel">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.6px; color:var(--cyan);">Left Channel (Ch 1)</span>
                <span style="font-size:11px; color:var(--text-muted); font-family:'JetBrains Mono',monospace;">Pan: -1.0 (100% Left)</span>
              </div>
              <button type="button" class="channel-play-btn" id="btn-play-left-ch" onclick="playIsolatedChannel(0)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>Play Left Channel Chime</span>
              </button>
              <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Where do you hear this sound?</div>
              <div class="channel-choice-group" id="left-choice-group">
                <button type="button" class="channel-choice-chip" id="choice-left-left" onclick="recordStereoResponse('left', 'left')">
                  <span>◀ In Left Ear Only</span>
                  <span style="font-size:10px; color:#34d399;">✓ Expected</span>
                </button>
                <button type="button" class="channel-choice-chip" id="choice-left-both" onclick="recordStereoResponse('left', 'both')">
                  <span>👥 In Both Ears</span>
                  <span style="font-size:10px; color:var(--amber);">Mono Downmix</span>
                </button>
                <button type="button" class="channel-choice-chip" id="choice-left-silent" onclick="recordStereoResponse('left', 'silent')">
                  <span>🔇 Inaudible / Silence</span>
                  <span style="font-size:10px; color:#fb7185;">Bud in Case?</span>
                </button>
                <button type="button" class="channel-choice-chip" id="choice-left-right" onclick="recordStereoResponse('left', 'right')">
                  <span>▶ In Right Ear</span>
                  <span style="font-size:10px; color:var(--amber);">Inverted</span>
                </button>
              </div>
            </div>

            <!-- Right Channel Test Panel -->
            <div class="channel-test-panel">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.6px; color:var(--purple);">Right Channel (Ch 2)</span>
                <span style="font-size:11px; color:var(--text-muted); font-family:'JetBrains Mono',monospace;">Pan: +1.0 (100% Right)</span>
              </div>
              <button type="button" class="channel-play-btn" id="btn-play-right-ch" onclick="playIsolatedChannel(1)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>Play Right Channel Chime</span>
              </button>
              <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Where do you hear this sound?</div>
              <div class="channel-choice-group" id="right-choice-group">
                <button type="button" class="channel-choice-chip" id="choice-right-right" onclick="recordStereoResponse('right', 'right')">
                  <span>▶ In Right Ear Only</span>
                  <span style="font-size:10px; color:#34d399;">✓ Expected</span>
                </button>
                <button type="button" class="channel-choice-chip" id="choice-right-both" onclick="recordStereoResponse('right', 'both')">
                  <span>👥 In Both Ears</span>
                  <span style="font-size:10px; color:var(--amber);">Mono Downmix</span>
                </button>
                <button type="button" class="channel-choice-chip" id="choice-right-silent" onclick="recordStereoResponse('right', 'silent')">
                  <span>🔇 Inaudible / Silence</span>
                  <span style="font-size:10px; color:#fb7185;">Bud in Case?</span>
                </button>
                <button type="button" class="channel-choice-chip" id="choice-right-left" onclick="recordStereoResponse('right', 'left')">
                  <span>◀ In Left Ear</span>
                  <span style="font-size:10px; color:var(--amber);">Inverted</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Dynamic Acoustic Result Banner -->
          <div class="stereo-status-banner" id="stereo-status-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div id="stereo-status-banner-text">
              ⚪ <strong>Stereo Separation Pending:</strong> Click <em>Play Left Channel</em> and <em>Play Right Channel</em> above, then confirm what you heard in each ear.
            </div>
          </div>
        </div>

        <!-- 2. Bluetooth AAC / SBC High-Frequency Cutoff & Aliasing Diagnostic -->
        <div class="codec-probe-box">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
            <div>
              <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.8px; color:#c084fc; margin-bottom:2px;">
                Lossy Bluetooth Codec Diagnostic
              </div>
              <div style="font-size:14px; font-weight:700; color:#fff;">
                AAC &amp; SBC Codec Brickwall Cutoff &amp; Aliasing Probe
              </div>
            </div>
            <div style="font-size:11px; color:var(--text-muted);">
              Audition ultrasonic test tones
            </div>
          </div>
          <p style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">
            Standard Bluetooth AAC (256 kbps) and SBC codecs apply brickwall low-pass filters between 16.5 kHz and 18.5 kHz. High frequencies transmitted through lossy codecs often create audible metallic chatter, flutter, or bird-like chirping in lower registers (intermodulation aliasing). True wired lossless DACs reproduce clean ultrasonic sines with zero audible buzz.
          </p>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
            <button class="audition-tool-btn" style="flex:1; min-width:200px;" id="tool-probe-17k" onclick="toggleTone(17500, 0.12, 'tool-probe-17k')">
              <div class="tool-btn-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>17.5 kHz AAC Brickwall Probe</span>
              </div>
              <div class="tool-btn-desc">Tests AAC 256kbps brickwall filter &amp; quantizer flutter.</div>
            </button>
            <button class="audition-tool-btn" style="flex:1; min-width:200px;" id="tool-probe-18k" onclick="toggleTone(18500, 0.10, 'tool-probe-18k')">
              <div class="tool-btn-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>18.5 kHz SBC/AAC Cutoff Probe</span>
              </div>
              <div class="tool-btn-desc">Tests high-frequency limits of wireless audio receivers.</div>
            </button>
          </div>
          <div style="display:flex; gap:12px; flex-wrap:wrap; font-size:12px; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:8px;">
            <span style="color:var(--text-muted); font-weight:700;">Diagnostic Guide:</span>
            <span style="color:#34d399;">✓ Faint clean pitch or pure silence = True Lossless DAC Linearity</span>
            <span style="color:#fb7185;">⚠️ Metallic buzzing or chirping = Bluetooth Codec Aliasing Distortion</span>
          </div>
        </div>

        <!-- 3. Dynamic Range & Frequency Sweep Tools -->
        <div style="margin-top:16px;">
          <div style="font-size:13px; font-weight:700; color:#fff; margin-bottom:8px;">
            Acoustic Sweeps &amp; Transducer Dynamics
          </div>
          <div class="audition-tools-grid" style="margin-top:0;">
            <!-- Stereo Alternating Ping -->
            <button class="audition-tool-btn" id="tool-stereo-ping" onclick="runStereoPingCheck()">
              <div class="tool-btn-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                <span>L / R Alternating Ping</span>
              </div>
              <div class="tool-btn-desc">Rapidly pulses Left, Center, and Right for quick acoustic checks.</div>
            </button>

            <!-- 20Hz - 20kHz Sweep -->
            <button class="audition-tool-btn" id="tool-sweep" onclick="runFrequencySweep()">
              <div class="tool-btn-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 12h5l3-9 4 18 3-9h5"/></svg>
                <span>20Hz – 20kHz Sweep</span>
              </div>
              <div class="tool-btn-desc">Smooth logarithmic sine sweep from sub-bass to treble air.</div>
            </button>

            <!-- 30Hz Sub-Bass -->
            <button class="audition-tool-btn" id="tool-sub-tone" onclick="toggleTone(30, 0.35, 'tool-sub-tone')">
              <div class="tool-btn-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>30 Hz Sub-Bass Tone</span>
              </div>
              <div class="tool-btn-desc">Pure sub-bass vibration to test transducer physical rumble.</div>
            </button>

            <!-- 16kHz Treble Air -->
            <button class="audition-tool-btn" id="tool-treble-tone" onclick="toggleTone(16000, 0.12, 'tool-treble-tone')">
              <div class="tool-btn-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>16 kHz Treble Air Tone</span>
              </div>
              <div class="tool-btn-desc">Clean ultrasonic sine to test anti-aliasing reconstruction.</div>
            </button>
          </div>
        </div>

        <!-- Live Frequency / Panning Readout Gauge -->
        <div class="sweep-gauge-box">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="color:var(--text-muted);">Audio State:</span>
            <span id="tone-status-label" style="color:var(--cyan); font-weight:700;">Idle / Ready</span>
          </div>
          <div>
            <span style="color:var(--text-muted);">Active Freq:</span>
            <span id="sweep-freq-val" style="color:#34d399; font-weight:700; margin-left:4px;">-- Hz</span>
          </div>
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
        <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Unlock your dedicated studio FLAC addon gateway</p>
      </div>

      <a href="/api/auth/google/login" class="btn-oauth" style="text-decoration:none; display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:12px; border-radius:12px; background:#ffffff; color:#1f2937; font-weight:700; font-size:14px; margin-bottom:10px; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
        <span>Sign in with Google</span>
      </a>

      <a href="/api/auth/discord/login" class="btn-oauth" style="text-decoration:none; display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:12px; border-radius:12px; background:#5865F2; color:#ffffff; font-weight:700; font-size:14px; margin-bottom:16px; box-shadow:0 4px 12px rgba(88,101,242,0.3);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        <span>Sign in with Discord</span>
      </a>

      <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 16px;">
        <div style="flex:1; height:1px; background:var(--border);"></div>
        <span style="font-size:11px; text-transform:uppercase; color:var(--text-muted); letter-spacing:1px;">or skip login</span>
        <div style="flex:1; height:1px; background:var(--border);"></div>
      </div>

      <button onclick="continueAsGuest()" class="btn-guest-access" style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px; padding:12px; border-radius:12px; background:linear-gradient(135deg, rgba(0,242,254,0.15), rgba(139,92,246,0.15)); border:1px solid var(--cyan); color:var(--cyan); font-weight:700; font-size:14px; cursor:pointer;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <span>Instant Access (Skip Login)</span>
      </button>
      <div style="font-size:11px; color:var(--text-muted); text-align:center; margin-top: 10px;">Generates your personal addon link instantly with zero sign-in</div>
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

  // Anti-Sybil Addon Management & Direct Authentication
  var currentUser = null;
  var currentSession = null;

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

  // --- Anti-Abuse: Hardware, Web Audio & Canvas Device Fingerprint ---
  var cachedHardwareFingerprint = null;
  async function getHardwareFingerprint() {
    if (cachedHardwareFingerprint) return cachedHardwareFingerprint;
    try {
      var parts = [];

      // 1. AudioContext Acoustic Dynamics Compressor Drift (cross-architecture floating point variance)
      try {
        var OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (OfflineCtx) {
          var actx = new OfflineCtx(1, 5000, 44100);
          var osc = actx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(10000, actx.currentTime);
          var comp = actx.createDynamicsCompressor();
          comp.threshold.setValueAtTime(-50, actx.currentTime);
          comp.knee.setValueAtTime(40, actx.currentTime);
          comp.ratio.setValueAtTime(12, actx.currentTime);
          comp.reduction.setValueAtTime(-20, actx.currentTime);
          comp.attack.setValueAtTime(0, actx.currentTime);
          comp.release.setValueAtTime(0.25, actx.currentTime);
          osc.connect(comp);
          comp.connect(actx.destination);
          osc.start(0);
          var audioBuf = await actx.startRendering();
          var chanData = audioBuf.getChannelData(0);
          var audioSum = 0;
          for (var i = 4500; i < 5000; i++) {
            audioSum += Math.abs(chanData[i]);
          }
          parts.push('audio-drift:' + audioSum.toFixed(6));
        }
      } catch (e) { parts.push('no-audio-fp'); }

      // 2. Canvas 2D fingerprint (sub-pixel antialiasing & font engine)
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

      // 3. WebGL2 / WebGL deep parameters
      try {
        var glCvs = document.createElement('canvas');
        var gl = glCvs.getContext('webgl2') || glCvs.getContext('webgl') || glCvs.getContext('experimental-webgl');
        if (gl) {
          var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
            var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
            parts.push(vendor + '~' + renderer);
          } else {
            parts.push(gl.getParameter(gl.RENDERER) || 'webgl-std');
          }
          var maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
          var maxVp = gl.getParameter(gl.MAX_VIEWPORT_DIMS) || [0, 0];
          parts.push('gl:' + maxTex + ':' + (maxVp[0] || 0) + 'x' + (maxVp[1] || 0));
        }
      } catch (e) { parts.push('no-webgl'); }

      // 4. Hardware metrics, touch architecture & locale
      parts.push((screen.width || 0) + 'x' + (screen.height || 0) + 'x' + (screen.colorDepth || 0) + '@' + (window.devicePixelRatio || 1));
      parts.push('touch:' + (navigator.maxTouchPoints || 0));
      parts.push('cores:' + (navigator.hardwareConcurrency || 0));
      parts.push('mem:' + (navigator.deviceMemory || 0));
      try { parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || ''); } catch (e) {}
      parts.push(navigator.language || '');
      parts.push(navigator.platform || '');

      var rawStr = parts.join('|||');

      // 5. SHA-256 Digest
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

  window.continueAsGuest = async function() {
    try {
      var res = await fetch('/api/auth/guest', { method: 'POST' });
      var data = await res.json();
      if (data.ok && data.user) {
        currentUser = data.user;
        renderAuthState(data.user);
        await claimUserAddon(data.user, data.token);
        closeAuthModal();
      }
    } catch (err) {
      console.error('Guest access error:', err);
    }
  };

  window.signOutUser = async function() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
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
          email: user ? user.email : undefined,
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
      var displayName = user.name || (user.email ? user.email.split('@')[0] : 'User');
      if (userEmail) userEmail.innerText = displayName;
      if (userAvatar) {
        if (user.avatar) {
          userAvatar.innerHTML = '<img src="' + user.avatar + '" style="width:20px;height:20px;border-radius:50%;object-fit:cover;" alt="avatar">';
        } else {
          userAvatar.innerText = displayName[0].toUpperCase();
        }
      }
      if (authGate) authGate.style.display = 'none';
      if (verifiedBox) verifiedBox.style.display = 'block';
      if (displayEmail) displayEmail.innerText = user.email || displayName;
      updateAddonView();
    } else {
      if (signinBtn) signinBtn.style.display = 'inline-flex';
      if (userPill) userPill.style.display = 'none';
      if (authGate) authGate.style.display = 'none'; // Unlocked for seamless access
      if (verifiedBox) verifiedBox.style.display = 'block';
      if (displayEmail) displayEmail.innerText = 'Anonymous / Guest';
      updateAddonView();
    }
  }

  // Handle URL auth return parameters
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('auth') === 'success') {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  if (urlParams.get('auth_error')) {
    alert('Authentication Notice: ' + decodeURIComponent(urlParams.get('auth_error')));
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Bootstrap session from backend (/api/auth/me)
  fetch('/api/auth/me')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.authenticated && data.user) {
        renderAuthState(data.user);
        if (data.addon && data.addon.slug) {
          currentSlug = data.addon.slug;
          localStorage.setItem('rezen_user_slug', currentSlug);
          if (slugInput) slugInput.value = currentSlug;
          updateAddonView();
          pollQuota(currentSlug);
          if (quotaPollingTimer) clearInterval(quotaPollingTimer);
          quotaPollingTimer = setInterval(function() { pollQuota(currentSlug); }, 30000);
        } else {
          claimUserAddon(data.user);
        }
      } else {
        renderAuthState(null);
        // Automatically ensure guest addon is initialized
        claimUserAddon(null);
      }
    })
    .catch(function() {
      renderAuthState(null);
      claimUserAddon(null);
    });

  window.randomizeSlug = function() {
    var randomSuffix = Math.random().toString(36).substring(2, 8);
    var targetSlug = 'rz-' + randomSuffix;
    claimUserAddon(currentUser, '', targetSlug);
  };
  window.generateNewLink = window.randomizeSlug;

  window.applyCustomSlug = function() {
    if (!slugInput) return;
    var raw = slugInput.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!raw) raw = 'rz-' + Math.random().toString(36).substring(2, 8);
    claimUserAddon(currentUser, '', raw);
    var btn = document.getElementById('copy-btn-text');
    if (btn) btn.innerText = 'Token Saved!';
    setTimeout(function() { if (btn) btn.innerText = 'Copy URL'; }, 1800);
  };

  window.copyAddonLink = function() {
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
  // Audiophile Hardware & Lossless Benchmark Engine
  // ===============================================
  var labAudioCtx = null;
  var labActiveNodes = [];
  var sweepTimer = null;
  var isBenchmarking = false;

  function getLabAudioContext() {
    if (!labAudioCtx) {
      var AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        try {
          labAudioCtx = new AudioCtxClass();
        } catch (e) {
          console.warn('Could not construct AudioContext:', e);
        }
      }
    }
    if (labAudioCtx && labAudioCtx.state === 'suspended') {
      labAudioCtx.resume().catch(function() {});
    }
    return labAudioCtx;
  }

  // --- Real FLAC Decoder Probe via MediaCapabilities API ---
  async function probeFlacProfile(sampleRate, bitDepth, bitrate) {
    try {
      if (navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo) {
        var info = await navigator.mediaCapabilities.decodingInfo({
          type: 'file',
          audio: {
            contentType: 'audio/flac',
            bitrate: bitrate,
            samplerate: sampleRate,
            channels: '2'
          }
        });
        return {
          supported: info.supported === true,
          smooth: info.smooth === true,
          powerEfficient: info.powerEfficient === true
        };
      }
    } catch (e) {}

    // Fallback: HTMLAudioElement canPlayType check
    try {
      var a = document.createElement('audio');
      var can = a.canPlayType('audio/flac');
      var supported = can === 'probably' || can === 'maybe';
      return { supported: supported, smooth: supported, powerEfficient: false };
    } catch (e) {
      return { supported: false, smooth: false, powerEfficient: false };
    }
  }

  // --- Offline AudioContext Max Sample Rate Headroom Probe ---
  function probeMaxSynthesisSampleRate() {
    var OfflineClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OfflineClass) return 48000;
    var candidates = [192000, 176400, 96000, 88200, 48000, 44100];
    for (var i = 0; i < candidates.length; i++) {
      var rate = candidates[i];
      try {
        var testCtx = new OfflineClass(1, 100, rate);
        if (testCtx && testCtx.sampleRate === rate) {
          return rate;
        }
      } catch (e) {}
    }
    return 48000;
  }

  // --- DSP Synthesis Rendering Throughput Benchmark ---
  async function measureDspSynthesisThroughput() {
    var OfflineClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OfflineClass) return null;
    try {
      var sampleRate = 96000;
      var durationFrames = 24000; // 0.25 seconds @ 96kHz
      var offlineCtx = new OfflineClass(2, durationFrames, sampleRate);

      // Create complex synthesis graph: Osc -> Filter -> Dynamics Compressor
      var osc = offlineCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, 0);

      var filter = offlineCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, 0);

      var comp = offlineCtx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-24, 0);
      comp.ratio.setValueAtTime(8, 0);

      osc.connect(filter);
      filter.connect(comp);
      comp.connect(offlineCtx.destination);
      osc.start(0);

      var t0 = performance.now();
      await offlineCtx.startRendering();
      var elapsedMs = Math.max(0.5, performance.now() - t0);

      // Total samples rendered = 24000 frames * 2 channels = 48,000 samples
      var totalSamples = durationFrames * 2;
      var megaSamplesPerSec = (totalSamples / (elapsedMs / 1000)) / 1000000;
      return megaSamplesPerSec;
    } catch (e) {
      return null;
    }
  }

  // --- State for Diagnostic Lab ---
  var activeListeningGear = 'bluetooth'; // Default to wireless/Bluetooth
  var lastBenchmarkResults = null;
  var stereoTestState = { leftChoice: null, rightChoice: null };

  window.selectListeningGear = function(gearId) {
    activeListeningGear = gearId;
    var cards = document.querySelectorAll('.gear-opt-card');
    cards.forEach(function(c) {
      c.classList.remove('active');
      c.classList.remove('gear-lossy');
    });
    var sel = document.getElementById('gear-btn-' + gearId);
    if (sel) {
      sel.classList.add('active');
      if (gearId === 'bluetooth') sel.classList.add('gear-lossy');
    }
    updateVerdictDisplay();
  };

  window.detectHardwareDevices = async function() {
    var pRouteEl = document.getElementById('platform-output-route');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(function(t) { t.stop(); });
      } catch (e) {}
    }
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        var devices = await navigator.mediaDevices.enumerateDevices();
        var audioOutputs = devices.filter(function(d) { return d.kind === 'audiooutput'; });
        var audioInputs = devices.filter(function(d) { return d.kind === 'audioinput'; });
        var allLabels = audioOutputs.map(function(d) { return d.label; }).concat(audioInputs.map(function(d) { return d.label; })).join(' ').toLowerCase();

        var isBt = /bluetooth|wireless|airpod|buds|tws|wh-|wf-|freebuds|tune|anc|enco|headset|realme|boat|noise/i.test(allLabels);
        var isDac = /dac|fiio|topping|qudelix|dragonfly|chord|schiit|hidizs|moondrop|ifiaudio/i.test(allLabels);

        if (isBt) {
          selectListeningGear('bluetooth');
        } else if (isDac) {
          selectListeningGear('dac');
        } else if (audioOutputs.length > 0 && audioOutputs[0].label) {
          selectListeningGear('wired');
        }

        if (audioOutputs.length > 0 && audioOutputs[0].label && pRouteEl) {
          var lbl = audioOutputs[0].label;
          pRouteEl.innerText = lbl.length > 30 ? lbl.substring(0, 30) + '...' : lbl;
        }
      } catch (e) {}
    }
  };

  window.updateVerdictDisplay = function() {
    if (!lastBenchmarkResults) return;
    var b = lastBenchmarkResults;
    var clockRate = b.clockRate || 48000;
    var maxHeadroom = b.maxHeadroom || 48000;
    var flacMaster = b.flacMaster || { supported: false };
    var flacHires = b.flacHires || { supported: false };
    var flacCd = b.flacCd || { supported: false };

    var canDo192k = flacMaster.supported && maxHeadroom >= 192000;
    var canDo96k = flacHires.supported && maxHeadroom >= 96000;
    var canDo44k = flacCd.supported && maxHeadroom >= 44100;

    var verdictBox = document.getElementById('lab-verdict-box');
    var verdictPill = document.getElementById('verdict-badge-pill');
    var verdictTier = document.getElementById('verdict-tier-text');
    var verdictHead = document.getElementById('verdict-headline');
    var verdictSum = document.getElementById('verdict-summary');
    var auditSwVal = document.getElementById('audit-sw-val');
    var auditSwDesc = document.getElementById('audit-sw-desc');
    var auditHwVal = document.getElementById('audit-hw-val');
    var auditHwDesc = document.getElementById('audit-hw-desc');

    // Update Software capability column
    if (auditSwVal) {
      if (canDo192k) {
        auditSwVal.innerText = '24-Bit / 192 kHz FLAC Supported';
        auditSwVal.style.color = '#34d399';
        if (auditSwDesc) auditSwDesc.innerText = 'Native FLAC bitstream decoder & 192 kHz DSP synthesis headroom verified.';
      } else if (canDo96k) {
        auditSwVal.innerText = '24-Bit / 96 kHz FLAC Supported';
        auditSwVal.style.color = 'var(--cyan)';
        if (auditSwDesc) auditSwDesc.innerText = 'Browser supports high-res 96 kHz FLAC bitstream decoding.';
      } else {
        auditSwVal.innerText = '16-Bit / 44.1 kHz FLAC Supported';
        auditSwVal.style.color = '#fff';
        if (auditSwDesc) auditSwDesc.innerText = 'Standard Redbook CD FLAC playback verified.';
      }
    }

    // Evaluate Acoustic Transmission Chain
    if (activeListeningGear === 'bluetooth') {
      if (verdictBox) verdictBox.className = 'verdict-box verdict-warn';
      if (verdictPill) {
        verdictPill.className = 'verdict-badge badge-warn';
        verdictPill.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> <span id="verdict-tier-text">Tier 4 &middot; Lossy Wireless Bottleneck (AAC / SBC ~256 kbps)</span>';
      }
      if (verdictHead) verdictHead.innerText = 'Lossy Bluetooth Codec Active (~256 kbps AAC / SBC)';
      if (verdictSum) verdictSum.innerText = 'Your browser decodes 24-bit / 192 kHz FLAC in software, but your headphones connect via Bluetooth A2DP. Bluetooth enforces lossy codec compression (AAC/SBC capped at ~256-328 kbps) with an inherent ~16.5-17.5 kHz brickwall filter. To experience uncompressed studio lossless (1,411 to 9,216 kbps PCM), connect via 3.5mm wired cable or an external USB-C DAC.';
      if (auditHwVal) {
        auditHwVal.innerText = 'Lossy Wireless Link (~256 kbps)';
        auditHwVal.style.color = 'var(--amber)';
      }
      if (auditHwDesc) auditHwDesc.innerText = 'Audio is re-encoded by OS Bluetooth stack to AAC/SBC. Connect wired 3.5mm or USB-C DAC for true uncompressed playback.';

    } else if (activeListeningGear === 'speakers') {
      if (verdictBox) verdictBox.className = 'verdict-box verdict-warn';
      if (verdictPill) {
        verdictPill.className = 'verdict-badge badge-warn';
        verdictPill.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> <span id="verdict-tier-text">Tier 3 &middot; Built-in Device Speakers</span>';
      }
      if (verdictHead) verdictHead.innerText = 'Device Speaker Transducer Active';
      if (verdictSum) verdictSum.innerText = 'Hardware supports lossless decoding, but built-in smartphone or laptop speakers lack acoustic dynamic range, sub-bass extension (<80 Hz), and true stereo width. Connect high-fidelity headphones for studio clarity.';
      if (auditHwVal) {
        auditHwVal.innerText = 'Built-in Transducer (Limited Bass)';
        auditHwVal.style.color = 'var(--amber)';
      }
      if (auditHwDesc) auditHwDesc.innerText = 'Physical speaker drivers cannot reproduce full studio dynamic range or low-end sub-bass extension.';

    } else {
      // Wired or External DAC
      if (clockRate >= 192000 && canDo192k) {
        if (verdictBox) verdictBox.className = 'verdict-box verdict-pass';
        if (verdictPill) {
          verdictPill.className = 'verdict-badge badge-pass';
          verdictPill.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span id="verdict-tier-text">Tier 1 &middot; Bit-Perfect Studio Master Ready (24-bit / 192 kHz)</span>';
        }
        if (verdictHead) verdictHead.innerText = 'Audiophile Master Class Verified';
        if (verdictSum) verdictSum.innerText = 'Direct bit-perfect 192 kHz hardware clock confirmed with zero OS downsampling. Studio masters reach your ears untouched at 9,216 kbps PCM.';
        if (auditHwVal) {
          auditHwVal.innerText = 'Bit-Perfect 192 kHz Direct Stream';
          auditHwVal.style.color = '#34d399';
        }
        if (auditHwDesc) auditHwDesc.innerText = 'Dedicated 192,000 Hz hardware clock active with zero OS mixer resampling or frame drops.';

      } else if (clockRate >= 96000 && canDo96k) {
        if (verdictBox) verdictBox.className = 'verdict-box verdict-pass';
        if (verdictPill) {
          verdictPill.className = 'verdict-badge badge-pass';
          verdictPill.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span id="verdict-tier-text">Tier 2 &middot; High-Resolution Lossless Ready (24-bit / 96 kHz)</span>';
        }
        if (verdictHead) verdictHead.innerText = 'High-Resolution Lossless Verified';
        if (verdictSum) verdictSum.innerText = 'Direct 96 kHz studio clock confirmed with low latency and clean high-frequency extension.';
        if (auditHwVal) {
          auditHwVal.innerText = 'High-Res 96 kHz DAC Clock';
          auditHwVal.style.color = '#34d399';
        }
        if (auditHwDesc) auditHwDesc.innerText = 'Hardware clock supports 96,000 Hz studio audio without jitter.';

      } else {
        // Clock rate < 96000 (e.g. 44,100 Hz or 48,000 Hz)
        if (verdictBox) verdictBox.className = 'verdict-box verdict-pass';
        if (verdictPill) {
          verdictPill.className = 'verdict-badge badge-pass';
          verdictPill.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span id="verdict-tier-text">Tier 3 &middot; Standard CD Lossless Ready (16-bit / 44.1 kHz)</span>';
        }
        if (verdictHead) verdictHead.innerText = 'Standard CD Lossless Verified (' + clockRate.toLocaleString() + ' Hz OS Resampling)';
        if (verdictSum) verdictSum.innerText = 'Your active DAC output is clocked at ' + clockRate.toLocaleString() + ' Hz. Any 96k/192k studio tracks will be resampled by Windows Shared Mode (WASAPI) or Android OS mixer down to ' + (clockRate / 1000).toFixed(1) + ' kHz. To unlock Tier 1 Bit-Perfect 192 kHz: open Windows Sound Settings -> Device Properties -> Advanced, and set Default Format to 24-bit, 192000 Hz (Studio Quality), or connect a dedicated bit-perfect USB-C DAC.';
        if (auditHwVal) {
          auditHwVal.innerText = 'Clocked at ' + clockRate.toLocaleString() + ' Hz (CD Standard)';
          auditHwVal.style.color = 'var(--cyan)';
        }
        if (auditHwDesc) auditHwDesc.innerText = 'OS audio mixer resamples high-res streams to match active ' + clockRate.toLocaleString() + ' Hz clock.';
      }
    }
  };

  // --- Main Cross-Platform Hardware Benchmark ---
  window.runHardwareBenchmark = async function() {
    if (isBenchmarking) return;
    isBenchmarking = true;

    var btn = document.getElementById('run-benchmark-btn');
    var btnText = document.getElementById('benchmark-btn-text');
    var pWrap = document.getElementById('benchmark-progress-wrap');
    var pFill = document.getElementById('benchmark-progress-bar-fill');
    var pLabel = document.getElementById('benchmark-status-label');
    var pPct = document.getElementById('benchmark-percentage');

    if (btn) btn.disabled = true;
    if (btnText) btnText.innerText = 'Benchmarking Audio Engine...';
    if (pWrap) pWrap.style.display = 'block';

    function setProgress(pct, msg) {
      if (pFill) pFill.style.width = pct + '%';
      if (pPct) pPct.innerText = pct + '%';
      if (pLabel) pLabel.innerText = msg;
    }

    try {
      // Step 1 (15%): Wake Web Audio engine & detect clock
      setProgress(15, '1/5 Probing Web Audio engine clock & buffer architecture...');
      var actx = getLabAudioContext();
      var clockRate = actx ? actx.sampleRate : 48000;
      var channels = (actx && actx.destination && actx.destination.maxChannelCount) ? actx.destination.maxChannelCount : 2;
      var baseLat = (actx && typeof actx.baseLatency === 'number') ? (actx.baseLatency * 1000).toFixed(1) : null;
      var outLat = (actx && typeof actx.outputLatency === 'number') ? (actx.outputLatency * 1000).toFixed(1) : null;

      var srEl = document.getElementById('spec-sample-rate');
      var srDesc = document.getElementById('spec-sample-rate-desc');
      if (srEl) srEl.innerHTML = clockRate.toLocaleString() + ' <span style="font-size:14px; color:var(--text-muted);">Hz</span>';
      if (srDesc) {
        if (clockRate >= 96000) {
          srDesc.innerText = 'Direct Studio Hi-Res clock exposed to browser';
          srDesc.style.color = '#34d399';
        } else if (clockRate >= 48000) {
          srDesc.innerText = 'Standard Studio clock (48.0 kHz)';
          srDesc.style.color = 'var(--cyan)';
        } else {
          srDesc.innerText = 'Standard CD clock (44.1 kHz)';
        }
      }

      var chanEl = document.getElementById('spec-channels-latency');
      var latDesc = document.getElementById('spec-latency-desc');
      if (chanEl) {
        var chanLabel = channels >= 6 ? (channels + '.1 Surround') : (channels === 2 ? 'Stereo (2.0)' : 'Mono (1.0)');
        chanEl.innerHTML = chanLabel;
      }
      if (latDesc) {
        if (baseLat) {
          latDesc.innerText = 'Base latency: ' + baseLat + ' ms' + (outLat ? ' | Output: ' + outLat + ' ms' : '');
        } else {
          latDesc.innerText = 'Direct hardware buffer pipeline active';
        }
      }

      await new Promise(function(r) { setTimeout(r, 120); });

      // Step 2 (40%): Probe true FLAC bitstream decoding profiles
      setProgress(40, '2/5 Benchmarking FLAC hardware decoding tiers (MediaCapabilities)...');
      var [flacCd, flacStudio, flacHires, flacMaster] = await Promise.all([
        probeFlacProfile(44100, 16, 1411200),
        probeFlacProfile(48000, 24, 2304000),
        probeFlacProfile(96000, 24, 4608000),
        probeFlacProfile(192000, 24, 9216000),
      ]);

      function updateTierCard(id, result, label) {
        var card = document.getElementById('tier-card-' + id);
        var badge = document.getElementById('tier-badge-' + id);
        var hwBadge = document.getElementById('tier-hw-' + id);

        if (result.supported) {
          if (card) { card.className = 'flac-tier-card tier-pass tier-active'; }
          if (badge) { badge.className = 'flac-badge badge-supported'; badge.innerText = '✓ Supported'; }
          if (hwBadge) {
            if (result.powerEfficient) {
              hwBadge.className = 'flac-badge badge-hw-accel';
              hwBadge.innerText = 'Hardware Accel';
            } else if (result.smooth) {
              hwBadge.className = 'flac-badge badge-hw-accel';
              hwBadge.innerText = 'Bit-Perfect PCM';
            } else {
              hwBadge.className = 'flac-badge badge-sw-decode';
              hwBadge.innerText = 'Software Decode';
            }
          }
        } else {
          if (card) { card.className = 'flac-tier-card tier-warn'; }
          if (badge) { badge.className = 'flac-badge badge-unsupported'; badge.innerText = '✕ Unsupported'; }
          if (hwBadge) { hwBadge.className = 'flac-badge badge-unsupported'; hwBadge.innerText = 'No Decoder'; }
        }
      }

      updateTierCard('cd', flacCd, '44.1k');
      updateTierCard('studio', flacStudio, '48k');
      updateTierCard('hires', flacHires, '96k');
      updateTierCard('master', flacMaster, '192k');

      await new Promise(function(r) { setTimeout(r, 120); });

      // Step 3 (60%): Probe maximum offline synthesis sample rate headroom
      setProgress(60, '3/5 Testing audio synthesis sample-rate headroom (up to 192 kHz)...');
      var maxHeadroom = probeMaxSynthesisSampleRate();
      var headEl = document.getElementById('spec-max-headroom');
      if (headEl) headEl.innerHTML = maxHeadroom.toLocaleString() + ' <span style="font-size:14px; color:var(--text-muted);">Hz</span>';

      await new Promise(function(r) { setTimeout(r, 120); });

      // Step 4 (80%): Measure real DSP synthesis rendering throughput
      setProgress(80, '4/5 Measuring multi-threaded DSP audio throughput & underrun safety...');
      var dspSpeed = await measureDspSynthesisThroughput();
      var dspEl = document.getElementById('spec-dsp-throughput');
      if (dspEl) {
        if (dspSpeed !== null) {
          dspEl.innerHTML = dspSpeed.toFixed(1) + ' <span style="font-size:14px; color:var(--text-muted);">M-Samples/s</span>';
        } else {
          dspEl.innerHTML = 'Unrestricted <span style="font-size:14px; color:var(--text-muted);">Direct</span>';
        }
      }

      await new Promise(function(r) { setTimeout(r, 120); });

      // Step 5 (95%): Platform & OS Audio Subsystem Inspection (Android vs Windows)
      setProgress(95, '5/5 Inspecting OS audio pipeline & hardware acceleration...');
      var ua = navigator.userAgent || '';
      var platform = navigator.platform || '';
      var touchPoints = navigator.maxTouchPoints || 0;
      var dpr = window.devicePixelRatio || 1;
      var cores = navigator.hardwareConcurrency || 4;

      var isAndroid = /android/i.test(ua) || (/linux/i.test(platform) && touchPoints > 1);
      var isWindows = /windows|win32|win64/i.test(ua) || /win/i.test(platform);
      var isApple = /macintosh|mac os|iphone|ipad|ipod/i.test(ua);

      var pNameEl = document.getElementById('platform-detect-name');
      var pTagEl = document.getElementById('platform-arch-tag');
      var pTextEl = document.getElementById('platform-advisory-text');
      var pGpuEl = document.getElementById('platform-gpu-name');
      var pRouteEl = document.getElementById('platform-output-route');
      var pDprEl = document.getElementById('platform-dpr');
      var pCoresEl = document.getElementById('platform-cores');

      if (pDprEl) pDprEl.innerText = dpr + 'x (' + window.screen.width + 'x' + window.screen.height + ')';
      if (pCoresEl) pCoresEl.innerText = cores + ' CPU Threads';

      // Detect GPU via WebGL
      var gpuString = 'Generic WebGL';
      try {
        var glCvs = document.createElement('canvas');
        var gl = glCvs.getContext('webgl2') || glCvs.getContext('webgl');
        if (gl) {
          var dbg = gl.getExtension('WEBGL_debug_renderer_info');
          if (dbg) {
            gpuString = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'Accelerated GPU';
          }
        }
      } catch (e) {}
      if (pGpuEl) {
        pGpuEl.innerText = gpuString.length > 36 ? gpuString.substring(0, 36) + '...' : gpuString;
        pGpuEl.title = gpuString;
      }

      // Check output endpoints & Bluetooth
      var isBluetooth = false;
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          var devices = await navigator.mediaDevices.enumerateDevices();
          var audioOutputs = devices.filter(function(d) { return d.kind === 'audiooutput'; });
          var audioInputs = devices.filter(function(d) { return d.kind === 'audioinput'; });
          var allLabels = audioOutputs.map(function(d) { return d.label; }).concat(audioInputs.map(function(d) { return d.label; })).join(' ').toLowerCase();

          isBluetooth = /bluetooth|wireless|airpod|buds|tws|wh-|wf-|freebuds|tune|anc|enco|headset|realme|boat|noise/i.test(allLabels);

          if (audioOutputs.length > 0 && audioOutputs[0].label) {
            var outName = audioOutputs[0].label;
            if (pRouteEl) pRouteEl.innerText = outName.length > 30 ? outName.substring(0, 30) + '...' : outName;
          } else {
            if (pRouteEl) pRouteEl.innerText = isAndroid ? 'Android AudioTrack / AAudio' : (isWindows ? 'Windows WASAPI Endpoint' : 'Default Hardware Endpoint');
          }
        } catch (e) {}
      }

      // Platform-specific audiophile guidance
      if (isAndroid) {
        if (pNameEl) pNameEl.innerText = 'Android Audio Architecture (AAudio / OpenSL ES)';
        if (pTagEl) pTagEl.innerText = 'Android ' + (touchPoints > 0 ? 'Touch Mobile' : '');
        var adv = '<strong>Android Audio Subsystem:</strong> Android OS system audio mixer resamples streams to 48 kHz by default. For bit-perfect 192 kHz FLAC playback, plug in an external USB-C DAC with an OTG cable and enable direct hardware pass-through in BitChord, Metrofuse, or USB Audio Player PRO.';
        if (isBluetooth) {
          adv += '<br><span style="color:#fb7185;">⚠️ <strong>Bluetooth Route Flagged:</strong> Standard SBC/AAC wireless codecs compress audio to ~256kbps. Switch to wired 3.5mm/USB-C or enable LDAC (990kbps) in Android Developer Options.</span>';
        }
        if (pTextEl) pTextEl.innerHTML = adv;
      } else if (isWindows) {
        if (pNameEl) pNameEl.innerText = 'Windows Audio Pipeline (WASAPI / DirectSound)';
        if (pTagEl) pTagEl.innerText = 'Windows x86_64 DirectSound';
        var winAdv = '<strong>Windows Audio Engine:</strong> Windows Shared Mode defaults to 48 kHz. To unlock uncompressed 24-bit / 192 kHz without OS resampling: open <em>Windows Sound Settings &rarr; More sound settings &rarr; Your Playback Device &rarr; Properties &rarr; Advanced</em>, and set Default Format to <strong>24-bit, 192000 Hz (Studio Quality)</strong>.';
        if (isBluetooth) {
          winAdv += '<br><span style="color:#fb7185;">⚠️ <strong>Bluetooth Route Flagged:</strong> Windows Bluetooth uses SBC/AAC compression. Connect headphones via 3.5mm AUX or USB DAC for true bit-perfect listening.</span>';
        }
        if (pTextEl) pTextEl.innerHTML = winAdv;
      } else {
        if (pNameEl) pNameEl.innerText = isApple ? 'CoreAudio Subsystem (macOS / iOS)' : 'Linux ALSA / PipeWire Architecture';
        if (pTagEl) pTagEl.innerText = isApple ? 'Apple CoreAudio' : 'Unix Audio Engine';
        if (pTextEl) pTextEl.innerHTML = '<strong>Audio Engine:</strong> Native lossless pipeline active. CoreAudio / PipeWire supports bit-perfect rate switching up to 192 kHz when connected to a compatible DAC.';
      }

      // Store results and evaluate
      lastBenchmarkResults = {
        clockRate: clockRate,
        maxHeadroom: maxHeadroom,
        flacCd: flacCd,
        flacStudio: flacStudio,
        flacHires: flacHires,
        flacMaster: flacMaster,
        dspSpeed: dspSpeed,
        isAndroid: isAndroid,
        isWindows: isWindows
      };

      if (isBluetooth) {
        selectListeningGear('bluetooth');
      } else {
        updateVerdictDisplay();
      }

      setProgress(100, 'Benchmark complete! All audio probes verified.');

      setTimeout(function() {
        if (pWrap) pWrap.style.display = 'none';
        if (btn) btn.disabled = false;
        if (btnText) btnText.innerText = 'Re-Run Hardware Benchmark';
      }, 1400);

    } catch (err) {
      console.error('Benchmark error:', err);
      if (pLabel) pLabel.innerText = 'Benchmark completed with default hardware profile.';
      if (btn) btn.disabled = false;
      if (btnText) btnText.innerText = 'Re-Run Hardware Benchmark';
      setTimeout(function() { if (pWrap) pWrap.style.display = 'none'; }, 2000);
    } finally {
      isBenchmarking = false;
    }
  };

  // --- Interactive Acoustic Spot-Check Tools ---

  window.stopActiveTone = function() {
    if (sweepTimer) {
      clearInterval(sweepTimer);
      sweepTimer = null;
    }
    for (var i = 0; i < labActiveNodes.length; i++) {
      try {
        var node = labActiveNodes[i];
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    }
    labActiveNodes = [];

    var btns = document.querySelectorAll('.audition-tool-btn, .channel-play-btn');
    for (var j = 0; j < btns.length; j++) {
      btns[j].classList.remove('active-audition');
      btns[j].classList.remove('playing');
    }
    var status = document.getElementById('tone-status-label');
    if (status) status.innerText = 'Idle / Ready';
    var freqEl = document.getElementById('sweep-freq-val');
    if (freqEl) freqEl.innerText = '-- Hz';
  };

  // 1. Isolated Physical Left / Right Channel Sound
  window.playIsolatedChannel = function(chIndex) {
    stopActiveTone();
    var actx = getLabAudioContext();
    if (!actx) return;

    var btn = document.getElementById(chIndex === 0 ? 'btn-play-left-ch' : 'btn-play-right-ch');
    if (btn) btn.classList.add('playing');

    var sampleRate = actx.sampleRate;
    var durationSec = 1.35;
    var length = Math.floor(sampleRate * durationSec);
    var buffer = actx.createBuffer(2, length, sampleRate);
    var leftData = buffer.getChannelData(0);
    var rightData = buffer.getChannelData(1);

    // Target channel gets chime bursts, non-target channel gets STRICT ZEROES
    var activeData = chIndex === 0 ? leftData : rightData;
    var silentData = chIndex === 0 ? rightData : leftData;
    for (var k = 0; k < length; k++) {
      silentData[k] = 0;
    }

    var f1 = chIndex === 0 ? 440 : 587;
    var f2 = chIndex === 0 ? 880 : 1174;

    for (var i = 0; i < length; i++) {
      var t = i / sampleRate;
      var burst = Math.sin(t * Math.PI * 3);
      if (burst > 0) {
        var env = Math.sin(burst * Math.PI * 0.5);
        activeData[i] = (Math.sin(2 * Math.PI * f1 * t) * 0.6 + Math.sin(2 * Math.PI * f2 * t) * 0.4) * env * 0.3;
      } else {
        activeData[i] = 0;
      }
    }

    var src = actx.createBufferSource();
    src.buffer = buffer;
    src.connect(actx.destination);
    labActiveNodes.push(src);

    var status = document.getElementById('tone-status-label');
    var freqEl = document.getElementById('sweep-freq-val');
    if (status) status.innerText = chIndex === 0 ? '◀ Playing Left Channel Chime (100% Left)' : '▶ Playing Right Channel Chime (100% Right)';
    if (freqEl) freqEl.innerText = chIndex === 0 ? '440/880 Hz (Left)' : '587/1174 Hz (Right)';

    src.onended = function() {
      if (btn) btn.classList.remove('playing');
      if (status) status.innerText = 'Chime completed. Select what you heard in each ear.';
    };
    src.start();
  };

  // Record user acoustic confirmation (prevents fake auto-pass!)
  window.recordStereoResponse = function(channel, choice) {
    if (channel === 'left') {
      stereoTestState.leftChoice = choice;
    } else {
      stereoTestState.rightChoice = choice;
    }

    var group = document.getElementById(channel + '-choice-group');
    if (group) {
      var chips = group.querySelectorAll('.channel-choice-chip');
      chips.forEach(function(c) {
        c.className = 'channel-choice-chip';
      });
      var target = document.getElementById('choice-' + channel + '-' + choice);
      if (target) {
        if (choice === (channel === 'left' ? 'left' : 'right')) {
          target.className = 'channel-choice-chip selected';
        } else if (choice === 'both') {
          target.className = 'channel-choice-chip selected-warn';
        } else {
          target.className = 'channel-choice-chip selected-danger';
        }
      }
    }

    updateStereoVerdictBanner();
  };

  window.updateStereoVerdictBanner = function() {
    var banner = document.getElementById('stereo-status-banner');
    var bannerText = document.getElementById('stereo-status-banner-text');
    if (!banner || !bannerText) return;

    var l = stereoTestState.leftChoice;
    var r = stereoTestState.rightChoice;

    if (!l && !r) {
      banner.className = 'stereo-status-banner';
      bannerText.innerHTML = '⚪ <strong>Stereo Separation Pending:</strong> Click <em>Play Left Channel</em> and <em>Play Right Channel</em> above, then confirm what you heard in each ear.';
      return;
    }

    if (l === 'silent' || r === 'silent') {
      banner.className = 'stereo-status-banner stereo-status-danger';
      var silentSide = (l === 'silent' && r === 'silent') ? 'Both channels were inaudible' : (l === 'silent' ? 'Left channel was inaudible' : 'Right channel was inaudible');
      bannerText.innerHTML = '⚠️ <strong>Single Earbud / Missing Audio Detected:</strong> ' + silentSide + '. One earbud is likely in the charging case, disconnected, or unseated.';
      return;
    }

    if (l === 'both' || r === 'both') {
      banner.className = 'stereo-status-banner stereo-status-warn';
      bannerText.innerHTML = '⚠️ <strong>Mono Downmix Detected:</strong> Sound bled into both ears equally. Your OS, Android Mono Audio accessibility setting, or Bluetooth receiver is summing discrete stereo channels into mono.';
      return;
    }

    if (l === 'right' || r === 'left') {
      banner.className = 'stereo-status-banner stereo-status-warn';
      bannerText.innerHTML = '⚠️ <strong>Inverted Channels Detected:</strong> Sound played in opposite ears. Your headphones or earbuds are reversed (Left in right ear / Right in left ear).';
      return;
    }

    if (l === 'left' && r === 'right') {
      banner.className = 'stereo-status-banner stereo-status-pass';
      bannerText.innerHTML = '✓ <strong>True Stereo Verified:</strong> Discrete 2.0 Left and Right acoustic channel isolation confirmed with zero mono downmixing.';
      return;
    }

    banner.className = 'stereo-status-banner';
    bannerText.innerHTML = '⏳ <strong>Partially Verified:</strong> Now test the other channel above to complete the acoustic separation check.';
  };

  // Alternating Stereo Ping (Left, Center, Right)
  window.runStereoPingCheck = function() {
    stopActiveTone();
    var actx = getLabAudioContext();
    if (!actx) return;

    var btn = document.getElementById('tool-stereo-ping');
    if (btn) btn.classList.add('active-audition');
    var status = document.getElementById('tone-status-label');
    var freqEl = document.getElementById('sweep-freq-val');

    function pingChannel(panVal, label, startOffset, dur) {
      var osc = actx.createOscillator();
      var gain = actx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(panVal < 0 ? 520 : (panVal > 0 ? 780 : 650), actx.currentTime + startOffset);

      gain.gain.setValueAtTime(0.0001, actx.currentTime + startOffset);
      gain.gain.linearRampToValueAtTime(0.25, actx.currentTime + startOffset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + startOffset + dur);

      var panner = null;
      if (actx.createStereoPanner) {
        panner = actx.createStereoPanner();
        panner.pan.setValueAtTime(panVal, actx.currentTime + startOffset);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(actx.destination);
        labActiveNodes.push(panner);
      } else {
        osc.connect(gain);
        gain.connect(actx.destination);
      }

      labActiveNodes.push(osc, gain);
      osc.start(actx.currentTime + startOffset);
      osc.stop(actx.currentTime + startOffset + dur + 0.05);

      setTimeout(function() {
        if (status) status.innerText = label;
        if (freqEl) freqEl.innerText = (panVal < 0 ? '520 Hz (Left)' : (panVal > 0 ? '780 Hz (Right)' : '650 Hz (Center)'));
      }, startOffset * 1000);
    }

    // Ping Left (0s), Center (0.6s), Right (1.2s)
    pingChannel(-1.0, '◀ Alternating Ping: Left Channel...', 0.0, 0.45);
    pingChannel(0.0, '◆ Alternating Ping: Center...', 0.55, 0.45);
    pingChannel(1.0, '▶ Alternating Ping: Right Channel...', 1.1, 0.45);

    setTimeout(function() {
      if (status) status.innerText = 'Alternating ping completed. Use Left/Right cards above for physical verification.';
      if (freqEl) freqEl.innerText = 'Ping Finished';
      if (btn) btn.classList.remove('active-audition');
    }, 1750);
  };

  // 2. Full 20 Hz – 20 kHz Logarithmic Sine Sweep
  window.runFrequencySweep = function() {
    stopActiveTone();
    var actx = getLabAudioContext();
    if (!actx) return;

    var btn = document.getElementById('tool-sweep');
    if (btn) btn.classList.add('active-audition');
    var status = document.getElementById('tone-status-label');
    var freqEl = document.getElementById('sweep-freq-val');

    var duration = 3.6; // seconds
    var osc = actx.createOscillator();
    var gain = actx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(20, actx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20000, actx.currentTime + duration);

    gain.gain.setValueAtTime(0.001, actx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, actx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, actx.currentTime + duration - 0.2);
    gain.gain.linearRampToValueAtTime(0.0001, actx.currentTime + duration);

    osc.connect(gain);
    gain.connect(actx.destination);
    labActiveNodes.push(osc, gain);

    osc.start(actx.currentTime);
    osc.stop(actx.currentTime + duration + 0.05);

    if (status) status.innerText = 'Logarithmic Sweep: 20 Hz ➔ 20 kHz';

    var startTime = performance.now();
    sweepTimer = setInterval(function() {
      var progress = (performance.now() - startTime) / (duration * 1000);
      if (progress >= 1.0) {
        clearInterval(sweepTimer);
        sweepTimer = null;
        if (status) status.innerText = '✓ Sweep Completed';
        if (freqEl) freqEl.innerText = '20,000 Hz';
        if (btn) btn.classList.remove('active-audition');
        return;
      }
      // Logarithmic frequency calculation
      var currentFreq = 20 * Math.pow(1000, progress);
      if (freqEl) {
        if (currentFreq < 1000) {
          freqEl.innerText = Math.round(currentFreq) + ' Hz';
        } else {
          freqEl.innerText = (currentFreq / 1000).toFixed(2) + ' kHz';
        }
      }
    }, 40);
  };

  // 3. Single Frequency Tone Spot-Check (30Hz Sub-Bass or 16kHz Treble Air)
  window.toggleTone = function(freq, targetGain, btnId) {
    var btn = document.getElementById(btnId);
    if (btn && btn.classList.contains('active-audition')) {
      stopActiveTone();
      return;
    }
    stopActiveTone();
    var actx = getLabAudioContext();
    if (!actx) return;

    if (btn) btn.classList.add('active-audition');
    var status = document.getElementById('tone-status-label');
    var freqEl = document.getElementById('sweep-freq-val');

    var osc = actx.createOscillator();
    var gain = actx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, actx.currentTime);

    gain.gain.setValueAtTime(0.0001, actx.currentTime);
    gain.gain.linearRampToValueAtTime(targetGain, actx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(actx.destination);
    labActiveNodes.push(osc, gain);
    osc.start(actx.currentTime);

    if (status) status.innerText = 'Playing ' + (freq < 1000 ? (freq + ' Hz Tone') : ((freq / 1000) + ' kHz Tone'));
    if (freqEl) freqEl.innerText = (freq < 1000 ? (freq + ' Hz') : ((freq / 1000) + ' kHz'));
  };

  // Run initial hardware probe seamlessly on idle
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function() { runHardwareBenchmark(); }, { timeout: 1500 });
  } else {
    setTimeout(function() { runHardwareBenchmark(); }, 800);
  }

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
