import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { Config } from './config.js';

export interface AuthSession {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'discord' | 'guest';
  createdAt: number;
}

export function createAuthToken(session: AuthSession, secret: string): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyAuthToken(token: string | undefined, secret: string): AuthSession | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadBase64, providedSig] = parts;

  const expectedSig = createHmac('sha256', secret).update(payloadBase64).digest('base64url');
  try {
    const provBuf = Buffer.from(providedSig);
    const expBuf = Buffer.from(expectedSig);
    if (provBuf.length !== expBuf.length || !timingSafeEqual(provBuf, expBuf)) {
      return null;
    }
    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const session = JSON.parse(jsonStr) as AuthSession;
    if (!session || !session.id || !session.email) return null;
    return session;
  } catch {
    return null;
  }
}

export function createGuestSession(): AuthSession {
  const rand = randomBytes(6).toString('hex');
  return {
    id: `guest_${rand}`,
    email: `guest_${rand}@guest.rezen.local`,
    name: `Guest_${rand.slice(0, 4).toUpperCase()}`,
    provider: 'guest',
    createdAt: Date.now(),
  };
}

export function getBaseUrl(request: { headers: Record<string, any>; protocol?: string; hostname?: string }, config: Config): string {
  if (config.appBaseUrl && /^https?:\/\//i.test(config.appBaseUrl)) {
    return config.appBaseUrl.replace(/\/+$/, '');
  }
  const proto = (request.headers['x-forwarded-proto'] as string) || request.protocol || 'http';
  const host = (request.headers['x-forwarded-host'] as string) || request.headers.host || request.hostname || 'localhost:3000';
  return `${proto}://${host}`;
}

// Google OAuth Helpers
export function getGoogleAuthUrl(params: { clientId: string; redirectUri: string; state: string }): string {
  const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  u.searchParams.set('client_id', params.clientId);
  u.searchParams.set('redirect_uri', params.redirectUri);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', 'openid email profile');
  u.searchParams.set('state', params.state);
  u.searchParams.set('access_type', 'online');
  u.searchParams.set('prompt', 'select_account');
  return u.toString();
}

export async function exchangeGoogleCode(params: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<{ accessToken: string; idToken?: string }> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: params.code,
      client_id: params.clientId,
      client_secret: params.clientSecret,
      redirect_uri: params.redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Google token exchange failed (${res.status}): ${text}`);
  }
  const data = await res.json() as any;
  if (!data.access_token) throw new Error('Missing access_token from Google response');
  return { accessToken: data.access_token, idToken: data.id_token };
}

export async function fetchGoogleProfile(accessToken: string): Promise<{ id: string; email: string; name: string; avatar?: string }> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Google userinfo fetch failed (${res.status})`);
  const data = await res.json() as any;
  if (!data.email) throw new Error('Google userinfo has no email');
  return {
    id: `google_${data.id || data.email}`,
    email: data.email.toLowerCase().trim(),
    name: data.name || data.email.split('@')[0],
    avatar: data.picture,
  };
}

// Discord OAuth Helpers
export function getDiscordAuthUrl(params: { clientId: string; redirectUri: string; state: string }): string {
  const u = new URL('https://discord.com/api/oauth2/authorize');
  u.searchParams.set('client_id', params.clientId);
  u.searchParams.set('redirect_uri', params.redirectUri);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', 'identify email');
  u.searchParams.set('state', params.state);
  u.searchParams.set('prompt', 'consent');
  return u.toString();
}

export async function exchangeDiscordCode(params: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<{ accessToken: string }> {
  const res = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: params.code,
      client_id: params.clientId,
      client_secret: params.clientSecret,
      redirect_uri: params.redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Discord token exchange failed (${res.status}): ${text}`);
  }
  const data = await res.json() as any;
  if (!data.access_token) throw new Error('Missing access_token from Discord response');
  return { accessToken: data.access_token };
}

export async function fetchDiscordProfile(accessToken: string): Promise<{ id: string; email: string; name: string; avatar?: string }> {
  const res = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Discord user fetch failed (${res.status})`);
  const data = await res.json() as any;
  const email = data.email ? data.email.toLowerCase().trim() : `${data.id}@discord.rezen.local`;
  let avatarUrl: string | undefined;
  if (data.avatar && data.id) {
    avatarUrl = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
  }
  return {
    id: `discord_${data.id}`,
    email,
    name: data.global_name || data.username || 'Discord User',
    avatar: avatarUrl,
  };
}
