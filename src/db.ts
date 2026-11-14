// Polyfill WebSocket in Node.js environments if missing for Supabase client initialization
if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class DummyWebSocket {};
}

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createHash, randomBytes } from 'node:crypto';
import type { Config } from './config.js';

export interface UserAddonRecord {
  id: string;
  user_id: string | null;
  email: string;
  addon_slug: string;
  device_fingerprint: string | null;
  hardware_fingerprint?: string | null;
  daily_limit: number;
  is_revoked: boolean;
  created_at: string;
}

export interface QuotaStatus {
  slug: string;
  streamCount: number;
  maxStreams: number;
  activeDevices: number;
  maxDevices: number;
  ipCount: number;
  maxIps: number;
  isRevoked: boolean;
  resetsAtUtc: string;
}

function createTimeoutFetch(timeoutMs: number) {
  return (input: any, init?: any) => {
    const signal = init?.signal ?? AbortSignal.timeout(timeoutMs);
    return fetch(input, { ...init, signal });
  };
}

export class AddonDatabase {
  private client: SupabaseClient | null = null;
  private supabaseHealthy = true;
  private lastCircuitTrip = 0;
  private localAddons: Map<string, UserAddonRecord> = new Map();
  private localDailyUsage: Map<string, { count: number; date: string }> = new Map();
  private localDevices: Map<string, Set<string>> = new Map();
  private localIps: Map<string, Set<string>> = new Map();
  private localProviders: Map<string, any> = new Map([
    ['monochrome', { id: 'monochrome', name: 'Monochrome Lossless Core', type: 'built-in', base_url: 'https://tracks.monochrome.st', is_enabled: true, health_status: 'operational', created_at: new Date().toISOString() }],
    ['instable', { id: 'instable', name: 'Arcod Lossless Source', type: 'built-in', base_url: 'https://arcod.xyz', is_enabled: false, health_status: 'offline', created_at: new Date().toISOString() }],
  ]);

  constructor(private readonly config: Config) {
    const url = process.env.SUPABASE_URL ?? this.config.supabaseUrl;
    const key = process.env.SUPABASE_KEY ?? this.config.supabaseKey;
    const timeout = process.env.NODE_ENV === 'test' ? 800 : 2000;
    if (url && key && process.env.DISABLE_SUPABASE !== 'true') {
      try {
        this.client = createClient(url, key, {
          auth: { persistSession: false },
          global: {
            fetch: createTimeoutFetch(timeout),
          },
        });
      } catch {
        this.client = null;
      }
    }
  }

  get isConfigured(): boolean {
    return this.client !== null;
  }

  private isSupabaseAvailable(): boolean {
    if (!this.client) return false;
    if (!this.supabaseHealthy) {
      if (Date.now() - this.lastCircuitTrip < 60000) {
        return false; // Circuit open: skip dead Supabase
      }
    }
    return true;
  }

  private tripCircuit(): void {
    this.supabaseHealthy = false;
    this.lastCircuitTrip = Date.now();
  }

  private markHealthy(): void {
    this.supabaseHealthy = true;
  }

  // Anti-sybil device fingerprint hasher
  hashDeviceFingerprint(rawCookie: string, secret: string): string {
    return createHash('sha256').update(`${rawCookie}:${secret}`).digest('hex');
  }

  // Verify Supabase Auth JWT Token
  async verifyUser(token: string): Promise<{ id: string; email: string } | null> {
    if (!this.isSupabaseAvailable()) return null;
    try {
      const { data: { user }, error } = await this.client!.auth.getUser(token);
      if (error || !user || !user.email) {
        if (error) this.tripCircuit();
        return null;
      }
      this.markHealthy();
      return { id: user.id, email: user.email };
    } catch {
      this.tripCircuit();
      return null;
    }
  }

  async getAddonBySlug(slug: string): Promise<UserAddonRecord | null> {
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.client!
          .from('user_addons')
          .select('*')
          .eq('addon_slug', slug)
          .single();
        if (!error && data) {
          this.markHealthy();
          const rec = data as UserAddonRecord;
          this.localAddons.set(rec.addon_slug, rec);
          return rec;
        }
        if (error && error.code !== 'PGRST116') {
          this.tripCircuit();
        }
      } catch {
        this.tripCircuit();
      }
    }
    return this.localAddons.get(slug) || null;
  }

  async getAddonByEmail(email: string): Promise<UserAddonRecord | null> {
    const norm = email.toLowerCase().trim();
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.client!
          .from('user_addons')
          .select('*')
          .eq('email', norm)
          .single();
        if (!error && data) {
          this.markHealthy();
          const rec = data as UserAddonRecord;
          this.localAddons.set(rec.addon_slug, rec);
          return rec;
        }
        if (error && error.code !== 'PGRST116') {
          this.tripCircuit();
        }
      } catch {
        this.tripCircuit();
      }
    }
    for (const addon of this.localAddons.values()) {
      if (addon.email.toLowerCase().trim() === norm) return addon;
    }
    return null;
  }

  async getAddonByDevice(deviceFingerprint: string): Promise<UserAddonRecord | null> {
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.client!
          .from('user_addons')
          .select('*')
          .eq('device_fingerprint', deviceFingerprint)
          .limit(1);
        if (!error && data && data.length > 0) {
          this.markHealthy();
          const rec = data[0] as UserAddonRecord;
          this.localAddons.set(rec.addon_slug, rec);
          return rec;
        }
        if (error) this.tripCircuit();
      } catch {
        this.tripCircuit();
      }
    }
    for (const addon of this.localAddons.values()) {
      if (addon.device_fingerprint === deviceFingerprint) return addon;
    }
    return null;
  }

  async getAddonByHardware(hardwareFingerprint: string): Promise<UserAddonRecord | null> {
    if (!hardwareFingerprint) return null;
    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.client!
          .from('user_addons')
          .select('*')
          .eq('hardware_fingerprint', hardwareFingerprint)
          .limit(1);
        if (!error && data && data.length > 0) {
          this.markHealthy();
          const rec = data[0] as UserAddonRecord;
          this.localAddons.set(rec.addon_slug, rec);
          return rec;
        }
        if (error) this.tripCircuit();
      } catch {
        this.tripCircuit();
      }
    }
    for (const addon of this.localAddons.values()) {
      if (addon.hardware_fingerprint === hardwareFingerprint) return addon;
    }
    return null;
  }

  async claimAddon(params: {
    userId?: string;
    email: string;
    deviceFingerprint: string;
    hardwareFingerprint?: string;
    customSlug?: string;
  }): Promise<{ addon: UserAddonRecord; isNew: boolean }> {
    const normalizedEmail = params.email.toLowerCase().trim();

    // 1. Check if user already has an addon assigned
    const existing = await this.getAddonByEmail(normalizedEmail);
    if (existing) {
      if (params.hardwareFingerprint && !existing.hardware_fingerprint) {
        existing.hardware_fingerprint = params.hardwareFingerprint;
        if (this.isSupabaseAvailable()) {
          try {
            await this.client!
              .from('user_addons')
              .update({ hardware_fingerprint: params.hardwareFingerprint })
              .eq('id', existing.id);
          } catch {
            this.tripCircuit();
          }
        }
      }
      return { addon: existing, isNew: false };
    }

    // 2. Anti-Sybil Check 1: Cookie/Zombie tracker fingerprint check
    const deviceExisting = await this.getAddonByDevice(params.deviceFingerprint);
    if (deviceExisting && deviceExisting.email !== normalizedEmail) {
      throw new Error(
        `Device already registered to another account (${deviceExisting.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}). Only 1 personal addon link is permitted per device/household to prevent abuse.`
      );
    }

    // 3. Anti-Sybil Check 2: Hardware/GPU/Canvas fingerprint check (survives cookie deletion & incognito)
    if (params.hardwareFingerprint) {
      const hwExisting = await this.getAddonByHardware(params.hardwareFingerprint);
      if (hwExisting && hwExisting.email !== normalizedEmail) {
        throw new Error(
          `Hardware signature already registered to another account (${hwExisting.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}). Only 1 personal addon link is permitted per device to prevent abuse.`
        );
      }
    }

    // 4. Generate unique slug
    let baseSlug = (params.customSlug || `rz-${randomBytes(4).toString('hex')}`)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    if (!baseSlug.startsWith('rz-')) baseSlug = `rz-${baseSlug}`;

    const insertPayload: any = {
      id: randomBytes(16).toString('hex'),
      user_id: params.userId ?? null,
      email: normalizedEmail,
      addon_slug: baseSlug,
      device_fingerprint: params.deviceFingerprint,
      daily_limit: 300,
      is_revoked: false,
      created_at: new Date().toISOString(),
    };
    if (params.hardwareFingerprint) {
      insertPayload.hardware_fingerprint = params.hardwareFingerprint;
    }

    if (this.isSupabaseAvailable()) {
      try {
        const { data, error } = await this.client!
          .from('user_addons')
          .insert(insertPayload)
          .select()
          .single();

        if (!error && data) {
          this.markHealthy();
          const rec = data as UserAddonRecord;
          this.localAddons.set(rec.addon_slug, rec);
          return { addon: rec, isNew: true };
        }
        if (error) this.tripCircuit();
      } catch {
        this.tripCircuit();
      }
    }

    // Resilient fallback storage
    this.localAddons.set(baseSlug, insertPayload as UserAddonRecord);
    return { addon: insertPayload as UserAddonRecord, isNew: true };
  }

  async getQuotaStatus(slug: string): Promise<QuotaStatus> {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const nextUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

    const addon = await this.getAddonBySlug(slug);
    const maxStreams = addon?.daily_limit ?? 300;
    const isRevoked = addon?.is_revoked ?? false;

    if (this.isSupabaseAvailable()) {
      try {
        const [usageRes, leaseRes, ipRes] = await Promise.all([
          this.client!.from('addon_daily_usage').select('stream_count').eq('slug', slug).eq('usage_date', today).single(),
          this.client!.from('addon_device_leases').select('device_hash').eq('slug', slug).gte('last_seen_at', new Date(Date.now() - 10 * 60 * 1000).toISOString()),
          this.client!.from('addon_daily_ips').select('ip_address').eq('slug', slug).eq('usage_date', today),
        ]);

        const streamCount = usageRes.data?.stream_count ?? 0;
        const activeDevices = leaseRes.data ? leaseRes.data.length : 1;
        const ipCount = ipRes.data ? ipRes.data.length : 1;

        return {
          slug,
          streamCount,
          maxStreams,
          activeDevices: Math.max(1, activeDevices),
          maxDevices: 2,
          ipCount: Math.max(1, ipCount),
          maxIps: 15,
          isRevoked,
          resetsAtUtc: nextUtc.toISOString(),
        };
      } catch {
        this.tripCircuit();
      }
    }

    // Local fallback quota
    const localUsage = this.localDailyUsage.get(`${slug}:${today}`)?.count ?? 0;
    const activeDevs = this.localDevices.get(slug)?.size ?? 1;
    const activeIps = this.localIps.get(`${slug}:${today}`)?.size ?? 1;

    return {
      slug,
      streamCount: localUsage,
      maxStreams,
      activeDevices: Math.max(1, activeDevs),
      maxDevices: 2,
      ipCount: Math.max(1, activeIps),
      maxIps: 15,
      isRevoked,
      resetsAtUtc: nextUtc.toISOString(),
    };
  }

  // Intercept stream execution: verify quota, register device lease & ip
  async recordStreamAccess(slug: string, clientIp: string, userAgent: string): Promise<{ allowed: boolean; reason?: string }> {
    const today = new Date().toISOString().split('T')[0];
    const addon = await this.getAddonBySlug(slug);
    if (!addon) return { allowed: true }; // Allow root/legacy queries if not in db

    if (addon.is_revoked) {
      return { allowed: false, reason: 'This personal addon link has been revoked by administration.' };
    }

    if (this.isSupabaseAvailable()) {
      try {
        // 1. Check & increment daily usage
        const { data: usageData } = await this.client!
          .from('addon_daily_usage')
          .select('stream_count')
          .eq('slug', slug)
          .eq('usage_date', today)
          .single();

        const currentStreams = usageData?.stream_count ?? 0;
        if (currentStreams >= addon.daily_limit) {
          return {
            allowed: false,
            reason: `Daily stream quota exceeded (${addon.daily_limit} tracks). Resets at 00:00 UTC.`,
          };
        }

        // 2. Check & register IP address
        const { data: ips } = await this.client!
          .from('addon_daily_ips')
          .select('ip_address')
          .eq('slug', slug)
          .eq('usage_date', today);
        const currentIps = (ips ?? []).map((x: { ip_address: string }) => x.ip_address);
        if (!currentIps.includes(clientIp)) {
          if (currentIps.length >= 15) {
            return {
              allowed: false,
              reason: 'Daily IP diversity cap exceeded (Max 15 distinct IPs per 24 hours). Resets at 00:00 UTC.',
            };
          }
          await this.client!
            .from('addon_daily_ips')
            .upsert({ slug, ip_address: clientIp, usage_date: today });
        }

        // 3. Sliding 10-minute device lease check
        const deviceHash = createHash('sha256').update(`${clientIp}:${userAgent}`).digest('hex').substring(0, 16);
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

        const { data: activeLeases } = await this.client!
          .from('addon_device_leases')
          .select('device_hash')
          .eq('slug', slug)
          .gte('last_seen_at', tenMinutesAgo);

        const activeHashes = (activeLeases ?? []).map((x: { device_hash: string }) => x.device_hash);
        if (!activeHashes.includes(deviceHash) && activeHashes.length >= 2) {
          return {
            allowed: false,
            reason: 'Maximum concurrent device limit (2 devices) reached. Stop playback on another device or wait 10 minutes for lease expiry.',
          };
        }

        // Update lease and usage count
        await Promise.all([
          this.client!.from('addon_device_leases').upsert({ slug, device_hash: deviceHash, last_seen_at: new Date().toISOString() }),
          this.client!.from('addon_daily_usage').upsert({ slug, usage_date: today, stream_count: currentStreams + 1 }),
        ]);

        return { allowed: true };
      } catch {
        this.tripCircuit();
      }
    }

    // Local resilient stream recording
    const usageKey = `${slug}:${today}`;
    const curUsage = this.localDailyUsage.get(usageKey)?.count ?? 0;
    if (curUsage >= addon.daily_limit) {
      return { allowed: false, reason: `Daily stream quota exceeded (${addon.daily_limit} tracks). Resets at 00:00 UTC.` };
    }
    this.localDailyUsage.set(usageKey, { count: curUsage + 1, date: today });

    // Track local IPs
    if (!this.localIps.has(usageKey)) this.localIps.set(usageKey, new Set());
    const ipSet = this.localIps.get(usageKey)!;
    if (!ipSet.has(clientIp)) {
      if (ipSet.size >= 15) {
        return { allowed: false, reason: 'Daily IP diversity cap exceeded (Max 15 distinct IPs per 24 hours).' };
      }
      ipSet.add(clientIp);
    }

    // Track local devices
    if (!this.localDevices.has(slug)) this.localDevices.set(slug, new Set());
    const devSet = this.localDevices.get(slug)!;
    const deviceHash = createHash('sha256').update(`${clientIp}:${userAgent}`).digest('hex').substring(0, 16);
    devSet.add(deviceHash);

    return { allowed: true };
  }

  // --- Admin Console Operations ---

  async getAllUserAddons(options?: {
    search?: string;
    filter?: 'all' | 'active' | 'revoked';
    limit?: number;
    offset?: number;
  }): Promise<{ addons: UserAddonRecord[]; total: number }> {
    const limit = Math.min(options?.limit ?? 100, 500);
    const offset = options?.offset ?? 0;

    if (this.client) {
      try {
        let query = this.client
          .from('user_addons')
          .select('*', { count: 'exact' });

        if (options?.filter === 'active') {
          query = query.eq('is_revoked', false);
        } else if (options?.filter === 'revoked') {
          query = query.eq('is_revoked', true);
        }

        if (options?.search) {
          const term = options.search.trim().toLowerCase();
          query = query.or(`email.ilike.%${term}%,addon_slug.ilike.%${term}%`);
        }

        const { data, error, count } = await query
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (!error && data) {
          return { addons: data as UserAddonRecord[], total: count ?? data.length };
        }
      } catch {
        // Fallback to local
      }
    }

    // Local in-memory fallback
    let list = Array.from(this.localAddons.values());
    if (options?.filter === 'active') list = list.filter(a => !a.is_revoked);
    if (options?.filter === 'revoked') list = list.filter(a => a.is_revoked);
    if (options?.search) {
      const term = options.search.trim().toLowerCase();
      list = list.filter(a => a.email.toLowerCase().includes(term) || a.addon_slug.toLowerCase().includes(term));
    }
    const total = list.length;
    const paginated = list.slice(offset, offset + limit);
    return { addons: paginated, total };
  }

  async setAddonRevocation(slug: string, isRevoked: boolean): Promise<boolean> {
    const local = this.localAddons.get(slug);
    if (local) local.is_revoked = isRevoked;
    if (this.client) {
      try {
        const { error } = await this.client
          .from('user_addons')
          .update({ is_revoked: isRevoked })
          .eq('addon_slug', slug);
        return !error;
      } catch {}
    }
    return true;
  }

  async getProviderSettings(): Promise<any[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('provider_settings')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          for (const p of data) this.localProviders.set(p.id, p);
          return data;
        }
      } catch {}
    }
    return Array.from(this.localProviders.values());
  }

  async setProviderEnabled(id: string, isEnabled: boolean): Promise<boolean> {
    const existing = this.localProviders.get(id);
    if (existing) existing.is_enabled = isEnabled;
    if (this.client) {
      try {
        const { error } = await this.client
          .from('provider_settings')
          .update({ is_enabled: isEnabled })
          .eq('id', id);
        return !error;
      } catch {}
    }
    return true;
  }

  async saveProviderSetting(provider: {
    id: string;
    name: string;
    type: string;
    base_url: string;
    is_enabled: boolean;
    health_status: string;
    last_tested_at?: string;
  }): Promise<boolean> {
    this.localProviders.set(provider.id, provider);
    if (this.client) {
      try {
        const { error } = await this.client
          .from('provider_settings')
          .upsert(provider);
        return !error;
      } catch {}
    }
    return true;
  }

  async deleteProviderSetting(id: string): Promise<boolean> {
    this.localProviders.delete(id);
    if (this.client) {
      try {
        const { error } = await this.client
          .from('provider_settings')
          .delete()
          .eq('id', id);
        return !error;
      } catch {}
    }
    return true;
  }
}
