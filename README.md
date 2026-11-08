# ReZenOnance

> **Studio-Grade Lossless Music Aggregator & Personal Gateway for BitChord**

**ReZenOnance** aggregates verified high-resolution FLAC streams (up to **24-bit / 192 kHz**) into a unified, high-performance BitChord music addon. It operates in a dual-distribution architecture:

1. **Hosted Web Portal & Gateway**: A modern, glassmorphic audiophile hub providing live provider health telemetry, an interactive hardware & gear diagnostic lab, an in-browser lossless player with real-time frequency visualizer, and personalized rate-limited addon endpoints (`/u/:userSlug/manifest.json`).
2. **Standalone Community Release**: A plug-and-play, zero-database, zero-auth Node.js deployment for self-hosters on Docker, Vercel, Railway, or home servers.

---

## ✨ Key Features

- **Genuine 24-Bit / 192 kHz FLAC**: Direct edge delivery via Akamai CDN and lossless core APIs with zero transcoding loss.
- **Sub-Second Provider Racing**: The multi-source racing engine queries verified operational backends concurrently and resolves the fastest usable result.
- **Personal Gateway Endpoints**: Users generate isolated addon URLs (`/u/:userSlug/manifest.json`) with customizable aliases and instant QR code generation for Android TV and mobile scanning.
- **Abuse & Upstream Guard**:
  - **300 Tracks / Day**: Rolling daily stream allocation resetting at `00:00 UTC`.
  - **Max 2 Concurrent Devices**: Sliding window session leases prevent credential sharing while keeping desktop and mobile synced.
  - **Max 15 Unique IPs / Day**: Anti-sybil protection that easily accommodates cellular/Wi-Fi transitions.
- **Lossless Audio & Gear Diagnostic Lab**: Browser-based Web Audio API suite that audits your DAC clock, detects lossy Bluetooth compression bottlenecks (SBC/AAC @ 256kbps), and conducts 32 Hz sub-bass, 17.5 kHz treble air, and -45 dBFS noise floor acoustic tests.
- **Legacy TV Support**: Preserved lightweight, CSS3-minimal interface at `/tv` specifically optimized for older Sony Bravia / Vewd TV browsers.

---

## 🛰️ Active Providers & Telemetry

ReZenOnance focuses on verified, high-throughput lossless backends:

| Provider | Route | Delivery Protocol | Audio Fidelity | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Studio Lossless Source** (Heisenberg) | `/g` | Direct Akamai CDN | **24-bit / 192 kHz FLAC** | `Operational` |
| **Lossless Core Source** (Arcod) | `/f` | Direct Stream API | **FLAC Lossless** | `Operational` |
| **Lossless Alternate** | `/e` | Remote Addon Proxy | DASH / FLAC | `Standby` |
| **Monochrome Core** | `/c` | Direct FLAC | FLAC | `Offline (Monitored)` |

*Inactive/dead legacy upstreams are excluded from the default racing loop to guarantee sub-500ms search latency.*

---

## 📡 API Contract & Endpoints

All manifests strictly declare `"allowDownloads": 0` for direct streaming compatibility.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Audiophile web portal, link generator, gear diagnostic lab, and player |
| `/tv` | `GET` | Lightweight client for Sony Bravia & legacy Vewd TV browsers |
| `/manifest.json` | `GET` | Root BitChord addon contract (`id: com.bitchord.qobuz`, `allowDownloads: 0`) |
| `/u/:userSlug/manifest.json` | `GET` | Isolated personal gateway manifest with rate-limiting context |
| `/search?q=...&quality=LOSSLESS` | `GET` | Races active lossless backends; returns normalized tracks with signed IDs |
| `/stream/:id?quality=LOSSLESS` | `GET` | Resolves signed opaque track ID to direct playable HTTPS stream URL |
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

# Provider Strategy: multi (races Heisenberg & Arcod), qobuzdl, or stub
QOBUZ_PROVIDER=multi

# Upstream Endpoints
HEISENBERG_BASE_URL=https://heisenbergbackaaahh.de.deplexo.com/a
INSTABLE_BASE_URL=https://arcod.xyz

# Security & ID Signing Secret
QOBUZ_ID_SECRET=change-me-in-production-to-a-secure-random-string

# Request Timeouts & Cache
REQUEST_TIMEOUT_MS=10000
CACHE_TTL_MS=300000
UPSTREAM_RETRIES=2
```

---

## 📱 Adding to BitChord

1. Open the ReZenOnance web portal at `https://your-deployment-url/`.
2. Under **Personal BitChord Addon Gateway**, customize your slug or click **Generate New Token**.
3. Click **Copy URL** (or click **Install** to trigger `bitchord://install-addon?url=...`).
   - Alternatively, open the **QR Code Modal** and scan with your mobile device or Android TV camera.
4. In BitChord, go to **Settings → Addons → Add Addon from URL**, paste your link, and save.
5. Enjoy pure 24-bit studio FLAC across all your devices.

---

## 🔒 Security & Privacy

- **Opaque Signed IDs**: Track identifiers are cryptographically signed with HMAC to prevent tampering, injection, and unauthorized parameter manipulation.
- **Stateless Privacy**: Upstream authorization tokens, private backend URLs, and cookies are never leaked to the client or logged in plain text.
- **Strict Media Validation**: Only valid HTTPS streaming renditions with verified FLAC/DASH containers are returned; unencrypted or malformed URLs are rejected.

---

## 📄 License

MIT © [KATx-dev](https://github.com/KATx-dev)
