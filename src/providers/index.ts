import type { Config } from '../config.js';
import type { QobuzProvider } from '../types.js';
import { StubQobuzProvider } from './stub.js';
import { HttpQobuzProvider } from './http.js';
import { QobuzDlProvider } from './qobuzdl.js';
import { LastBabeProvider } from './lastbabe.js';
import { RacingProvider, createRacingProvider } from './racing.js';
import { MonochromeProvider } from './monochrome.js';
import { RemoteAddonProvider } from './remote-addon.js';
import { InstableProvider } from './instable.js';

export type IsolatedSource = 'qobuzdl' | 'lastbabe' | 'monochrome' | 'deezer' | 'eljohnzc' | 'instable' | 'arcod';

export interface PublicProviderInfo {
  id: string;
  slug: string;
  name: string;
  format: string;
  quality: string;
  description: string;
  baseUrl: string;
}

export const KNOWN_PROVIDERS: PublicProviderInfo[] = [
  {
    id: 'arcod',
    slug: 'arcod',
    name: 'Arcod Lossless Core',
    format: 'FLAC 24-Bit',
    quality: 'LOSSLESS (Up to 192 kHz)',
    description: 'High-speed studio master bitstream direct from Qobuz audio infrastructure.',
    baseUrl: 'https://arcod.xyz',
  },
  {
    id: 'monochrome',
    slug: 'monochrome',
    name: 'Monochrome Lossless Core',
    format: 'FLAC',
    quality: 'LOSSLESS (Up to 96 kHz)',
    description: 'Independent lossless archive core with 429 rate-limiting failover protection.',
    baseUrl: 'https://tracks.monochrome.st',
  },
];

export function createProvider(config: Config): RacingProvider | QobuzProvider {
  if (config.provider === 'qobuzdl') return new QobuzDlProvider(config);
  if (config.provider === 'multi') {
    return new RacingProvider([
      { id: 'arcod', name: 'Arcod Lossless Source', type: 'built-in', baseUrl: config.instableBaseUrl ?? 'https://arcod.xyz', provider: new InstableProvider(config), enabled: true },
      { id: 'monochrome', name: 'Monochrome Lossless Core', type: 'built-in', baseUrl: config.monochromeBaseUrl ?? 'https://tracks.monochrome.st', provider: new MonochromeProvider(config), enabled: true },
    ]);
  }
  if (config.provider === 'http') return new HttpQobuzProvider(config);
  return new StubQobuzProvider();
}

export function createSourceProvider(config: Config, source: IsolatedSource): QobuzProvider {
  if (source === 'qobuzdl') return new QobuzDlProvider({ ...config, apiBaseUrl: config.apiBaseUrl ?? 'https://qobuz-dll.foreyou.workers.dev' });
  if (source === 'monochrome') return new MonochromeProvider(config);
  if (source === 'deezer') return new RemoteAddonProvider(config);
  if (source === 'eljohnzc') return new RemoteAddonProvider(config, config.eljohnzcBaseUrl);
  if (source === 'instable' || source === 'arcod') return new InstableProvider(config);
  return new LastBabeProvider(config);
}
