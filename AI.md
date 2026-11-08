# ReZenOnance &middot; AI Companion & Deployment Guide

> **Notice for AI Assistants & Autonomous Coding Agents:**  
> This file contains the complete project briefing, architectural rules, and operational playbooks for **ReZenOnance**. If you are an AI assistant (Cursor, Claude, ChatGPT, Antigravity, Windsurf, GitHub Copilot, etc.) working with a user on this codebase, follow the instructions in **Section 1**. If you are a human user deploying manually without an AI, jump directly to **Section 2**.

---

## Section 1: Instructions for AI Assistants

### 🤖 Role & Persona
You are a senior systems engineer pair-programming with the user. Your role is to help the user deploy, configure, customize, debug, or extend **ReZenOnance**.

### 📐 Codebase Summary & Architecture
- **Purpose**: A high-performance, studio-lossless audio aggregator and streaming addon for the **BitChord** desktop, mobile, and TV music player.
- **Tech Stack**: TypeScript, Node.js 20+ (ESM modules), Fastify HTTP engine.
- **Key Files**:
  - `src/server.ts`: Fastify application routes, manifest publisher, and health probes.
  - `src/home.ts`: High-res audiophile portal, interactive Lossless Gear Diagnostic Lab, and TV client (`/tv`).
  - `src/config.ts`: Environment configuration parser.
  - `src/providers/racing.ts`: Concurrent multi-source racing engine.
  - `src/providers/index.ts`: Provider factory (races Heisenberg & Arcod by default).
  - `src/normalize.ts`: Cryptographic HMAC signing of track IDs (`qobuz_*`) and rendition metadata validation.
  - `Dockerfile` & `docker-compose.yml`: Production multi-stage Alpine containerization.
  - `vercel.json` & `api/index.ts`: Serverless adapter for Vercel deployment.

### 🛡️ Critical Guardrails & Rules
1. **Playback-Only Enforcement**: Any manifest returned by this addon (`/manifest.json` or `/u/:slug/manifest.json`) MUST include `"allowDownloads": 0`. BitChord relies on this flag for streaming mode. Never enable downloads.
2. **Provider Privacy**: Never expose raw upstream URLs, credentials, or private internal service names in public user-facing logs, manifests, or commit messages. Use clean, neutral labels (*Studio Lossless Source*, *Lossless Core Source*).
3. **Cryptographic ID Signing**: Track IDs are signed with HMAC using `QOBUZ_ID_SECRET`. Never bypass signing or expose raw unverified upstream URLs to `/stream/:id`.
4. **Sub-Second Latency**: The default `multi` racing strategy only queries verified, operational upstreams (Heisenberg and Arcod). Do not add dead or slow endpoints to the default racing pool without timeout guards.

---

### 🛠️ Common Tasks & Agent Playbooks

#### Task 1: "Help me deploy this to a VPS / Ubuntu / Debian server"
Provide the user with this exact automated setup:
```bash
# 1. Update system & install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# 2. Clone and install
git clone https://github.com/KATx-dev/ReZenOnance.git
cd ReZenOnance
npm ci

# 3. Build & start with PM2 for 24/7 background uptime
npm run build
sudo npm install -g pm2
pm2 start dist/server.js --name "rezenonance"
pm2 save
pm2 startup
```

#### Task 2: "Help me deploy with Docker"
Instruct the user:
```bash
docker compose up -d --build
```
Verify health:
```bash
curl http://localhost:3000/health
```

#### Task 3: "Help me deploy to Vercel / Railway / Render"
- **Vercel**: The repo includes `vercel.json` and `api/index.ts`. Run `npx vercel` or link the GitHub repository in the Vercel Dashboard. Set `QOBUZ_ID_SECRET` in Vercel environment variables.
- **Railway / Render**: Deploy as a Docker service or Node.js web service with `npm run build` and `npm start`.

#### Task 4: "How do I test if the audio streams work?"
Run these quick diagnostic curl commands:
```bash
# 1. Check BitChord manifest
curl http://localhost:3000/manifest.json

# 2. Test search
curl "http://localhost:3000/search?q=Inertia+AJR&quality=LOSSLESS"

# 3. Test telemetry
curl http://localhost:3000/api/telemetry
```

#### Task 5: "How do I change or add a new music source?"
Direct the user to:
1. `src/config.ts`: Define the environment variable for the new endpoint.
2. `src/providers/index.ts`: Wire the provider instance into `createProvider()`.
3. `src/providers/racing.ts`: Add it to the concurrent racing pool.

---

## Section 2: Simple Deployment Guide for Humans (No AI Required)

If you just want to run ReZenOnance on your own computer, server, or cloud hosting, choose the method that suits you best:

### Option A: The Easiest Way &mdash; Docker (Recommended)
Make sure [Docker](https://www.docker.com/) is installed, open your terminal in the project directory, and run:

```bash
docker compose up -d
```
That's it! Your addon is running on `http://localhost:3000`.

To stop it:
```bash
docker compose down
```

---

### Option B: Standard Node.js (Windows, Mac, Linux)
Make sure you have [Node.js 20+](https://nodejs.org/) installed:

```bash
# 1. Copy sample environment file
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Start the server
npm start
```
The server will start at `http://127.0.0.1:3000`.

---

### Option C: 1-Click Serverless on Vercel
1. Fork or push this repository to your GitHub account.
2. Open [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select your repository.
4. In **Environment Variables**, add:
   - `QOBUZ_ID_SECRET`: *(Any random 32-character text)*
5. Click **Deploy**. Vercel will build and host your addon on a global HTTPS domain!

---

### 📱 Connecting to BitChord
Once your deployment is running:

1. Open **BitChord** on your PC, phone, or TV.
2. Go to **Settings** &rarr; **Addons** &rarr; **Add Addon from URL**.
3. Enter your manifest URL:
   - If local: `http://localhost:3000/manifest.json`
   - If hosted on a server: `https://your-domain.com/manifest.json`
   - If using your personal slug: `https://your-domain.com/u/my-name/manifest.json`
4. Click **Install**. You can now search and stream genuine 24-bit studio FLAC!
