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

export class AddonDatabase {
  private client: SupabaseClient | null = null;

  constructor(private readonly config: Config) {
    const url = process.env.SUPABASE_URL ?? this.config.supabaseUrl;
    const key = process.env.SUPABASE_KEY ?? this.config.supabaseKey;
    if (url && key) {
      this.client = createClient(url, key, { auth: { persistSession: false } });
    }
  }

  get isConfigured(): boolean {
    return this.client !== null;
  }

  // Anti-sybil device fingerprint hasher
  hashDeviceFingerprint(rawCookie: string, secret: string): string {
    return createHash('sha256').update(`${rawCookie}:${secret}`).digest('hex');
  }

  // Verify Supabase Auth JWT Token
  async verifyUser(token: string): Promise<{ id: string; email: string } | null> {
    if (!this.client) return null;
    try {
      const { data: { user }, error } = await this.client.auth.getUser(token);
      if (error || !user || !user.email) return null;
      return { id: user.id, email: user.email };
    } catch {
      return null;
    }
  }

  async getAddonBySlug(slug: string): Promise<UserAddonRecord | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('user_addons')
      .select('*')
      .eq('addon_slug', slug)
      .single();
    if (error || !data) return null;
    return data as UserAddonRecord;
  }

  async getAddonByEmail(email: string): Promise<UserAddonRecord | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('user_addons')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();
    if (error || !data) return null;
    return data as UserAddonRecord;
  }

  async getAddonByDevice(deviceFingerprint: string): Promise<UserAddonRecord | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('user_addons')
      .select('*')
      .eq('device_fingerprint', deviceFingerprint)
      .limit(1);
    if (error || !data || data.length === 0) return null;
    return data[0] as UserAddonRecord;
  }

  async getAddonByHardware(hardwareFingerprint: string): Promise<UserAddonRecord | null> {
    if (!this.client || !hardwareFingerprint) return null;
    const { data, error } = await this.client
      .from('user_addons')
      .select('*')
      .eq('hardware_fingerprint', hardwareFingerprint)
      .limit(1);
    if (error || !data || data.length === 0) return null;
    return data[0] as UserAddonRecord;
  }

  async claimAddon(params: {
    userId?: string;
    email: string;
    deviceFingerprint: string;
    hardwareFingerprint?: string;
    customSlug?: string;
  }): Promise<{ addon: UserAddonRecord; isNew: boolean }> {
    if (!this.client) throw new Error('Database is not initialized');
    const normalizedEmail = params.email.toLowerCase().trim();

    // 1. Check if user already has an addon assigned
    const existing = await this.getAddonByEmail(normalizedEmail);
    if (existing) {
      if (params.hardwareFingerprint && !existing.hardware_fingerprint) {
        await this.client
          .from('user_addons')
          .update({ hardware_fingerprint: params.hardwareFingerprint })
          .eq('id', existing.id);
        existing.hardware_fingerprint = params.hardwareFingerprint;
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
      user_id: params.userId ?? null,
      email: normalizedEmail,
      addon_slug: baseSlug,
      device_fingerprint: params.deviceFingerprint,
      daily_limit: 300,
      is_revoked: false,
    };
    if (params.hardwareFingerprint) {
      insertPayload.hardware_fingerprint = params.hardwareFingerprint;
    }

    const { data, error } = await this.client
      .from('user_addons')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      // If slug collision, retry with randomized suffix
      const fallbackSlug = `rz-${randomBytes(6).toString('hex')}`;
      insertPayload.addon_slug = fallbackSlug;
      const { data: retryData, error: retryError } = await this.client
        .from('user_addons')
        .insert(insertPayload)
        .select()
        .single();
      if (retryError) throw new Error(`Could not generate addon link: ${retryError.message}`);
      return { addon: retryData as UserAddonRecord, isNew: true };
    }

    return { addon: data as UserAddonRecord, isNew: true };
  }

  async getQuotaStatus(slug: string): Promise<QuotaStatus> {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const nextUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

    if (!this.client) {
      return {
        slug,
        streamCount: 0,
        maxStreams: 300,
        activeDevices: 1,
        maxDevices: 2,
        ipCount: 1,
        maxIps: 15,
        isRevoked: false,
        resetsAtUtc: nextUtc.toISOString(),
      };
    }

    // Get user limits
    const addon = await this.getAddonBySlug(slug);
    const maxStreams = addon?.daily_limit ?? 300;
    const isRevoked = addon?.is_revoked ?? false;

    // Daily stream count
    const { data: usageData } = await this.client
      .from('addon_daily_usage')
      .select('stream_count')
      .eq('slug', slug)
      .eq('usage_date', today)
      .single();
    const streamCount = usageData?.stream_count ?? 0;

    // Active device leases (sliding 10 min window)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: leaseData } = await this.client
      .from('addon_device_leases')
      .select('device_hash')
      .eq('slug', slug)
      .gte('last_seen_at', tenMinutesAgo);
    const activeDevices = leaseData ? leaseData.length : 1;

    // Daily distinct IPs
    const { data: ipData } = await this.client
      .from('addon_daily_ips')
      .select('ip_address')
      .eq('slug', slug)
      .eq('usage_date', today);
    const ipCount = ipData ? ipData.length : 1;

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
  }

  // Intercept stream execution: verify quota, register device lease & ip
  async recordStreamAccess(slug: string, clientIp: string, userAgent: string): Promise<{ allowed: boolean; reason?: string }> {
    if (!this.client) return { allowed: true };

    const today = new Date().toISOString().split('T')[0];
    const addon = await this.getAddonBySlug(slug);
    if (!addon) return { allowed: true }; // Allow root/legacy queries if not in db

    if (addon.is_revoked) {
      return { allowed: false, reason: 'This personal addon link has been revoked by administration.' };
    }

    // 1. Check & increment daily usage
    const { data: usageData } = await this.client
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
    const { data: ips } = await this.client
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
      await this.client
        .from('addon_daily_ips')
        .upsert({ slug, ip_address: clientIp, usage_date: today });
    }

    // 3. Sliding 10-minute device lease check
    const deviceHash = createHash('sha256').update(`${clientIp}:${userAgent}`).digest('hex').substring(0, 16);
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const { data: activeLeases } = await this.client
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
      this.client.from('addon_device_leases').upsert({ slug, device_hash: deviceHash, last_seen_at: new Date().toISOString() }),
      this.client.from('addon_daily_usage').upsert({ slug, usage_date: today, stream_count: currentStreams + 1 }),
    ]);

    return { allowed: true };
  }

  // --- Admin Console Operations ---

  async getAllUserAddons(options?: {
    search?: string;
    filter?: 'all' | 'active' | 'revoked';
    limit?: number;
    offset?: number;
  }): Promise<{ addons: UserAddonRecord[]; total: number }> {
    if (!this.client) return { addons: [], total: 0 };
    const limit = Math.min(options?.limit ?? 100, 500);
    const offset = options?.offset ?? 0;

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

    if (error || !data) return { addons: [], total: 0 };
    return { addons: data as UserAddonRecord[], total: count ?? data.length };
  }

  async setAddonRevocation(slug: string, isRevoked: boolean): Promise<boolean> {
    if (!this.client) return false;
    const { error } = await this.client
      .from('user_addons')
      .update({ is_revoked: isRevoked })
      .eq('addon_slug', slug);
    return !error;
  }

  async getProviderSettings(): Promise<any[]> {
    if (!this.client) return [];
    const { data, error } = await this.client
      .from('provider_settings')
      .select('*')
      .order('created_at', { ascending: true });
    if (error || !data) return [];
    return data;
  }

  async setProviderEnabled(id: string, isEnabled: boolean): Promise<boolean> {
    if (!this.client) return false;
    const { error } = await this.client
      .from('provider_settings')
      .update({ is_enabled: isEnabled })
      .eq('id', id);
    return !error;
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
    if (!this.client) return false;
    const { error } = await this.client
      .from('provider_settings')
      .upsert(provider);
    return !error;
  }

  async deleteProviderSetting(id: string): Promise<boolean> {
    if (!this.client) return false;
    const { error } = await this.client
      .from('provider_settings')
      .delete()
      .eq('id', id);
    return !error;
  }
}
