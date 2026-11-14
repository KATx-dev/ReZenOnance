# ReZenOnance

> **Universal Studio-Grade Lossless Music Aggregator & Addon Gateway**

**ReZenOnance** aggregates verified high-resolution FLAC streams (up to **24-bit / 192 kHz**) into a unified, high-performance lossless music addon compatible with **Mochy**, **Metrofuse**, **EchoMusic**, and custom players. It operates in a dual-distribution architecture:

1. **Hosted Web Portal & Gateway**: A modern, glassmorphic audiophile hub providing live provider health telemetry, an interactive hardware & gear diagnostic lab, an in-browser lossless player with real-time frequency visualizer, and personalized rate-limited addon endpoints (`/u/:userSlug/manifest.json`).
2. **Standalone Community Release**: A plug-and-play, zero-database, zero-auth Node.js deployment for self-hosters on Docker, Vercel, Railway, or home servers.

---

## ✨ Key Features

- **Genuine 24-Bit / 192 kHz FLAC**: Direct edge delivery via Akamai CDN and lossless core APIs with zero transcoding loss.
- **Sub-Second Provider Racing**: The multi-source racing engine queries verified operational backends concurrently and resolves the fastest usable result.
- **Personal Gateway Endpoints**: Users generate isolated addon URLs (`/u/:userSlug/manifest.json`) with customizable aliases and instant QR code generation for Android TV and mobile scanning.
- **Enterprise Anti-Abuse & Hardware Guard**:
  - **Self-Healing Zombie Vault**: Triple-storage identity synchronization across Cookies, `localStorage`, and `IndexedDB` that auto-resurrects cleared cookies.
  - **Hardware & Canvas Fingerprinting**: WebGL GPU signature and 2D canvas sub-pixel rasterization hash that enforces a 1-addon policy even in Incognito mode.
  - **Disposable Email Blacklist**: Rejects burner email domains to enforce authentic accounts.
  - **300 Tracks / Day**: Rolling daily stream allocation resetting at `00:00 UTC`.
  - **Max 2 Concurrent Devices**: Sliding 10-minute window leases prevent credential sharing while keeping desktop and mobile in sync.
  - **Max 15 Unique IPs / Day**: Anti-sybil ceiling accommodating cellular/Wi-Fi transitions.
- **Lossless Audio & Gear Diagnostic Lab**: Browser-based Web Audio API suite that audits your DAC clock, detects lossy Bluetooth compression bottlenecks (SBC/AAC @ 256kbps), and conducts 32 Hz sub-bass, 17.5 kHz treble air, and -45 dBFS noise floor acoustic tests.
- **Legacy TV Support**: Preserved lightweight, CSS3-minimal interface at `/tv` specifically optimized for older Sony Bravia / Vewd TV browsers.

---

## 🛰️ Active Providers & Telemetry

ReZenOnance focuses on verified, high-throughput lossless backends:

| Provider | Route | Delivery Protocol | Audio Fidelity | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Monochrome Lossless Core** | `/c` | Direct FLAC Stream API | **24-bit / 192 kHz FLAC** | `Operational` |
| **Lossless Core Source** (Arcod) | `/f` | Direct Stream API | **FLAC Lossless** | `Operational` |
| **Lossless Alternate** | `/e` | Remote Addon Proxy | DASH / FLAC | `Standby` |
| **Legacy Source** | `/a` | Remote Addon Proxy | FLAC / MP3 | `Standby` |

*Inactive/dead legacy upstreams are excluded from the default racing loop to guarantee sub-500ms search latency.*

---

## 📡 API Contract & Endpoints

All manifests strictly declare `"allowDownloads": 0` for direct streaming compatibility.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Audiophile web portal, link generator, gear diagnostic lab, and player |
| `/tv` | `GET` | Lightweight client for Sony Bravia & legacy Vewd TV browsers |
| `/manifest.json` | `GET` | Universal addon manifest contract (`id: com.bitchord.qobuz`, `allowDownloads: 0`) |
| `/u/:userSlug/manifest.json` | `GET` | Isolated personal gateway manifest with rate-limiting context |
| `/search?q=...&quality=LOSSLESS` | `GET` | Races active lossless backends; returns normalized tracks with signed IDs |
| `/stream/:id?quality=LOSSLESS` | `GET` | Resolves signed opaque track ID to direct playable HTTPS stream URL |
| `/admin` | `GET` | Master Admin Console (user endpoint revocation & provider management) |
| `/api/admin/*` | `POST/GET` | Administrative management APIs (protected by master key) |
| `/api/telemetry` | `GET` | Real-time upstream health status, latencies, and route availability |
| `/health` | `GET` | Health check endpoint returning `{ ok: true }` |

---

## 🎧 Lossless Audio & Gear Diagnostic Lab

Located on the home portal (`#hardware-lab`), this interactive tool helps users verify whether their physical hardware can genuinely reproduce lossless audio:

1. **System & DAC Probe**: Evaluates browser audio engine clock rate (44.1 kHz, 48 kHz, 96 kHz, or 192 kHz) and native FLAC decoder support.
2. **Bluetooth Bottleneck Detector**: Flags wireless headsets operating on lossy codecs (SBC/AAC @ ~256 kbps), alerting the user that 24-bit FLAC is being downsampled over the air.
3. **Sub-Bass Extension (32 Hz)**: Generates a calibrated 32 Hz sine tone to evaluate low-frequency driver linearity vs. housing rattling and harmonic distortion.
4. **High-Frequency Air (17.5 kHz)**: Checks for clean ultrasonic air extension vs. reconstruction aliasing or Bluetooth low-pass brickwall filter cutoffs.
5. **Micro-Dynamics & Noise Floor (-45 dBFS)**: Tests DAC signal-to-noise ratio and background static floor as quiet notes decay into silence.
6. **Verdict & Recommendations**: Provides an overall Grade (Studio Ready vs. Lossy Bottleneck Warning) with clear hardware recommendations.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js 20+ (ESM modules support)
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/KATx-dev/ReZenOnance.git
cd ReZenOnance

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run unit & integration test suite (20/20 tests)
npm test

# Launch development server
npm run dev
```

The service will listen on `http://127.0.0.1:3000`.

---

## ⚙️ Environment Variables

Configure via `.env` or your hosting provider dashboard:

```dotenv
# Server Network Settings
PORT=3000
HOST=0.0.0.0

# Provider Strategy: multi (races Monochrome & Arcod), qobuzdl, or stub
QOBUZ_PROVIDER=multi

# Upstream Endpoints
INSTABLE_BASE_URL=https://arcod.xyz
MONOCHROME_BASE_URL=https://tracks.monochrome.st

# Master Admin Key
ADMIN_PASSWORD=ReZen#QuantumFLAC-2026!Vault

# Direct OAuth Credentials (No Third-Party Dependencies)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
APP_BASE_URL=https://rezenonance.onrender.com

# Database Settings (Optional - Seamless In-Memory Fallback if Supabase is Offline)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
DISABLE_SUPABASE=false

# Security & ID Signing Secret
QOBUZ_ID_SECRET=change-me-in-production-to-a-secure-random-string

# Request Timeouts & Cache
REQUEST_TIMEOUT_MS=10000
CACHE_TTL_MS=300000
UPSTREAM_RETRIES=2
```

---

## 📱 Universal App Compatibility

ReZenOnance provides standard addon manifest endpoints compatible with popular audio players:
- **Mochy**
- **Metrofuse**
- **EchoMusic**
- Custom players implementing addon manifest protocols

Users can copy their private addon manifest URL or scan the dynamic QR code directly from the web portal.

---

## 🔑 Authentication & Zero-Friction Access

ReZenOnance does not depend on external authentication services and offers three flexible options:
1. **Instant Access (Skip Login)**: 1-click guest onboarding. Users can generate, customize, and copy personal addon URLs without signing in or providing an email address.
2. **Direct Google OAuth**: Sign in directly with Google (`/api/auth/google/login`). Uses `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Callback: `https://<domain>/api/auth/google/callback`.
3. **Direct Discord OAuth**: Sign in directly with Discord (`/api/auth/discord/login`). Uses `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`. Callback: `https://<domain>/api/auth/discord/callback`.
4. **Resilient Local Storage Fallback**: If Supabase is down, paused, or unreachable, ReZenOnance automatically trips its circuit breaker and runs on autonomous in-memory storage so links, playback, and quotas never fail.

---

## 🔒 Security & Anti-Abuse Architecture

ReZenOnance implements an enterprise-grade, multi-layered anti-abuse and security architecture to protect upstream lossless providers, ensure fair distribution, and stop sybil endpoint minting:

### 1. 🧟 Self-Healing Zombie Vault (Multi-Storage Cross-Sync)
Traditional cookies can be wiped with a single click. ReZenOnance uses a self-healing client vault that mirrors tracking tokens across three independent browser storage engines:
- **`HttpOnly` Cookie** (`__rz_tracker`, 1-year expiration, `SameSite=Lax`, `Secure`)
- **`localStorage`** (`__rz_vault_token`)
- **`IndexedDB`** (`rz_security_vault` / `identity` store)

**Resurrection Flow**: If a visitor clears their cookies or uses a privacy extension, the client immediately detects the missing cookie on page load, retrieves the persistent vault token from `IndexedDB` or `localStorage`, and delivers an `X-Zombie-Tracker` header. The server verifies the token and **automatically resurrects the `__rz_tracker` cookie**.

### 2. 🖥️ Hardware, WebGL & Canvas Fingerprinting *(Incognito Defense)*
To block users who bypass storage entirely via Incognito mode or multi-profile browsers, ReZenOnance extracts a client-side SHA-256 hardware signature without relying on persistent storage:
- **Canvas 2D Engine**: Evaluates GPU sub-pixel antialiasing and emoji font engine rasterization quirks.
- **WebGL GPU Signature**: Unmasked GPU vendor and driver renderer strings via `WEBGL_debug_renderer_info`.
- **System Metrics**: CPU hardware concurrency (`navigator.hardwareConcurrency`), screen dimensions, color depth, and system timezone.

The computed 64-character hex signature is verified in Supabase upon addon claim. If the physical machine already minted an addon under another email, the server immediately triggers an HTTP 403 `SYBIL_DETECTED` wall.

### 3. 🛡️ Authenticated Account Binding & Disposable Email Filter
- **Supabase Auth**: Users authenticate via Google OAuth or 6-digit email OTP.
- **Burner Email Shield**: Blocks disposable email providers (`tempmail`, `10minutemail`, `mailinator`, `guerrillamail`, `yopmail`, `throwawaymail`, etc.) to prevent automated burner account generation.
- **Single-Addon Account Association**: Each verified email or Google account is bound to a single addon endpoint in Postgres.

### 4. ⏱️ Upstream Rate Limiting & Sliding Device Leases
Personal endpoints enforce strict quotas on stream resolution:
- **300 Tracks / Day**: Rolling daily limit resetting at `00:00 UTC`.
- **Max 2 Concurrent Devices**: Enforced via sliding 10-minute device leases (`addon_device_leases`) keyed to IP and User-Agent hashes.
- **Max 15 Unique IPs / Day**: Anti-credential sharing protection that accommodates cellular and Wi-Fi handoffs without false positives.

### 5. 🔐 Cryptographic Privacy & ID Signing
- **Opaque Signed IDs**: Track identifiers are cryptographically signed with HMAC-SHA256 (`qobuz_...`) to prevent parameter tampering and brute-force ID guessing.
- **Stateless Privacy**: Upstream authorization tokens, private backend URLs, and cookies are never leaked to public manifests or client logs.
- **Strict Media Validation**: Only valid HTTPS streaming renditions with verified FLAC/DASH containers are returned; unencrypted or malformed URLs are rejected.

---

## 📄 License

GPL-3.0 © [KATx-dev](https://github.com/KATx-dev)
