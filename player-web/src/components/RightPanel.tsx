import { useEffect, useRef, useState } from 'react';
import { formatTime, getTrack } from '../data';
import { AUTOEQ_PRESETS, EQ_FREQUENCIES, usePlayer } from '../store';
import type { PanelTab, ProviderRoute, QualityTier, ThemeId } from '../types';
import { Cover, Equalizer } from './Cover';
import { Icon, type IconName } from './Icon';

const TABS: Array<{ id: PanelTab; label: string; icon: IconName }> = [
  { id: 'queue', label: 'Queue', icon: 'queue' },
  { id: 'lyrics', label: 'Lyrics', icon: 'lyrics' },
  { id: 'eq', label: 'AutoEQ', icon: 'sliders' },
  { id: 'visuals', label: 'Visuals', icon: 'palette' },
];

const themes: Array<{ id: ThemeId; name: string; description: string; hues: [number, number] }> = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Follows the artwork. Violet bloom on near-black glass.',
    hues: [268, 196],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm ember wash with a low amber horizon.',
    hues: [18, 330],
  },
  {
    id: 'noir',
    name: 'Noir',
    description: 'Almost no colour — just depth, grain and slow light.',
    hues: [238, 268],
  },
  {
    id: 'mono',
    name: 'Mono',
    description: 'Pure greyscale for black-and-white artwork.',
    hues: [214, 228],
  },
];

export function RightPanel() {
  const { state, dispatch } = usePlayer();
  const active: PanelTab = state.panel === 'none' ? 'queue' : state.panel;

  return (
    <aside className="panel" aria-label="Player side panel">
      <div className="panel__tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            className={`panel__tab ${active === tab.id ? 'is-active' : ''}`.trim()}
            onClick={() => dispatch({ type: 'SET_PANEL', panel: tab.id })}
          >
            <Icon name={tab.icon} size={15} />
            {tab.label}
          </button>
        ))}
        <button
          className="icon-btn icon-btn--tiny panel__close"
          onClick={() => dispatch({ type: 'SET_PANEL', panel: 'none' })}
          aria-label="Close panel"
        >
          <Icon name="close" size={15} />
        </button>
      </div>

      <div className="panel__body">
        {active === 'queue' ? <QueueTab /> : null}
        {active === 'lyrics' ? <LyricsTab /> : null}
        {active === 'eq' ? <EqTab /> : null}
        {active === 'visuals' ? <VisualsTab /> : null}
      </div>
    </aside>
  );
}

function QueueTab() {
  const { state, dispatch, currentTrack } = usePlayer();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const duration = currentTrack ? (state.duration > 0 ? state.duration : currentTrack.duration) : 1;
  const progress = currentTrack ? Math.min(100, (state.elapsed / Math.max(1, duration)) * 100) : 0;

  return (
    <div className="panel__section">
      <div className="panel__row">
        <h2 className="panel__title">Playing from queue</h2>
        <button className="text-btn" onClick={() => dispatch({ type: 'CLEAR_QUEUE' })}>
          Clear
        </button>
      </div>

      {currentTrack ? (
        <div className="now-card">
          <Cover
            hue={currentTrack.hue}
            hue2={currentTrack.hue2}
            artworkURL={currentTrack.artworkURL}
            size="md"
            label={currentTrack.album}
          />
          <div className="now-card__body">
            <span className="eyebrow">{currentTrack.format ? `Now playing · ${currentTrack.format}` : 'Now playing'}</span>
            <span className="now-card__title">{currentTrack.title}</span>
            <span className="now-card__artist">{currentTrack.artist}</span>
            <div className="now-card__bar">
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="now-card__times">
              <span>{formatTime(state.elapsed)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel__empty">
          <Icon name="note" size={22} />
          <p>Nothing is playing yet.</p>
          <button className="btn btn--ghost btn--sm" onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}>
            Start the queue
          </button>
        </div>
      )}

      <div className="panel__row">
        <span className="panel__sub">{state.queue.length} tracks</span>
        <span className="panel__sub">Drag to reorder</span>
      </div>

      <div className="queue">
        {state.queue.map((id, index) => {
          const track = getTrack(id);
          if (!track) return null;
          const isCurrent = index === state.index;
          return (
            <div
              key={`${id}-${index}`}
              className={[
                'queue-item',
                isCurrent ? 'is-current' : '',
                overIndex === index && dragIndex !== index ? 'is-over' : '',
                dragIndex === index ? 'is-dragging' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setOverIndex(index);
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (dragIndex !== null) dispatch({ type: 'MOVE_IN_QUEUE', from: dragIndex, to: index });
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDoubleClick={() => dispatch({ type: 'JUMP_QUEUE', index })}
            >
              <span className="queue-item__handle" aria-hidden="true">
                <Icon name="drag" size={13} />
              </span>
              <button
                className="queue-item__play"
                onClick={() => dispatch({ type: 'JUMP_QUEUE', index })}
                aria-label={`Play ${track.title}`}
              >
                {isCurrent ? (
                  <Equalizer playing={state.isPlaying} />
                ) : (
                  <Cover hue={track.hue} hue2={track.hue2} artworkURL={track.artworkURL} size="xs" />
                )}
              </button>
              <div className="queue-item__meta">
                <span className="queue-item__title">{track.title}</span>
                <span className="queue-item__artist">{track.artist}</span>
              </div>
              <span className="queue-item__time">{formatTime(track.duration)}</span>
              <button
                className="icon-btn icon-btn--tiny queue-item__remove"
                onClick={() => dispatch({ type: 'REMOVE_FROM_QUEUE', index })}
                aria-label={`Remove ${track.title} from queue`}
              >
                <Icon name="close" size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LyricsTab() {
  const { state, currentTrack, seek } = usePlayer();
  const activeRef = useRef<HTMLButtonElement>(null);

  const activeIndex = currentTrack
    ? currentTrack.lyrics.reduce((acc, line, index) => (line.t <= state.elapsed ? index : acc), -1)
    : -1;

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeIndex, currentTrack?.id]);

  if (!currentTrack) {
    return (
      <div className="panel__empty">
        <Icon name="lyrics" size={22} />
        <p>Lyrics appear here once a track is playing.</p>
      </div>
    );
  }

  return (
    <div className="panel__section">
      <div className="lyrics-head">
        <Cover hue={currentTrack.hue} hue2={currentTrack.hue2} artworkURL={currentTrack.artworkURL} size="sm" />
        <div>
          <span className="lyrics-head__title">{currentTrack.title}</span>
          <span className="lyrics-head__artist">{currentTrack.artist}</span>
        </div>
      </div>

      <div className="lyrics" aria-live="polite">
        {currentTrack.lyrics.length === 0 ? (
          <p className="empty-note">Searching LRCLIB for synced lyrics, or none indexed for this track.</p>
        ) : (
          currentTrack.lyrics.map((line, index) => (
            <button
              key={`${line.t}-${index}`}
              ref={index === activeIndex ? activeRef : undefined}
              className={[
                'lyrics__line',
                index === activeIndex ? 'is-active' : '',
                index < activeIndex ? 'is-past' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => seek(line.t)}
            >
              {line.text}
            </button>
          ))
        )}
      </div>

      <p className="panel__footnote">
        Synced lyrics powered by <code>/api/lyrics</code> via LRCLIB. Click any line to seek.
      </p>
    </div>
  );
}

const ROUTES: Array<{ route: ProviderRoute; label: string; sub: string }> = [
  { route: '', label: 'Master Engine', sub: 'Parallel race across all active lossless sources' },
  { route: '/p/arcod', label: 'Arcod Split', sub: 'Force /p/arcod hi-res mirror' },
  { route: '/p/monochrome', label: 'Monochrome Split', sub: 'Force /p/monochrome FLAC cluster' },
];

const QUALITIES: Array<{ tier: QualityTier; label: string }> = [
  { tier: 'LOSSLESS', label: 'FLAC Lossless' },
  { tier: 'HIGH', label: '320kbps AAC' },
  { tier: 'LOW', label: 'Data Saver' },
];

function formatHz(hz: number): string {
  return hz >= 1000 ? `${hz / 1000}k` : `${hz}`;
}

function EqTab() {
  const { state, dispatch } = usePlayer();

  return (
    <div className="panel__section">
      <div>
        <h2 className="panel__title">AutoEQ &amp; Engine</h2>
        <p className="panel__copy">
          10-band Web Audio biquad equalizer and lossless addon route selector.
        </p>
      </div>

      <div className="eq-block">
        <span className="eyebrow">Addon Route</span>
        <div className="eq-pills">
          {ROUTES.map((item) => (
            <button
              key={item.label}
              className={`eq-pill ${state.providerRoute === item.route ? 'is-active' : ''}`.trim()}
              onClick={() => dispatch({ type: 'SET_PROVIDER_ROUTE', route: item.route })}
              title={item.sub}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="eq-block">
        <span className="eyebrow">Stream Quality</span>
        <div className="eq-pills">
          {QUALITIES.map((q) => (
            <button
              key={q.tier}
              className={`eq-pill ${state.quality === q.tier ? 'is-active' : ''}`.trim()}
              onClick={() => dispatch({ type: 'SET_QUALITY', quality: q.tier })}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <div className="eq-block">
        <span className="eyebrow">AutoEQ Target Curve</span>
        <div className="eq-pills">
          {Object.entries(AUTOEQ_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              className={`eq-pill ${state.eqPreset === key ? 'is-active' : ''}`.trim()}
              onClick={() => dispatch({ type: 'SET_EQ_PRESET', preset: key })}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="eq-bands">
        {EQ_FREQUENCIES.map((freq, idx) => {
          const val = state.eqGains[idx] ?? 0;
          return (
            <div key={freq} className="eq-band">
              <span className="eq-band__freq">{formatHz(freq)}Hz</span>
              <input
                type="range"
                className="slider"
                min={-12}
                max={12}
                step={0.5}
                value={val}
                aria-label={`${formatHz(freq)}Hz gain`}
                onChange={(e) => dispatch({ type: 'SET_EQ_BAND', band: idx, gain: Number(e.target.value) })}
                style={{ '--progress': `${((val + 12) / 24) * 100}%` } as React.CSSProperties}
              />
              <span className="eq-band__val">{val > 0 ? `+${val}` : val} dB</span>
            </div>
          );
        })}
      </div>

      <p className="panel__footnote">
        Automatic failover routes CORS-locked streams through <code>/stream/:id/audio</code> so EQ DSP remains live.
      </p>
    </div>
  );
}

function VisualsTab() {
  const { state, dispatch, currentTrack } = usePlayer();
  const hue = currentTrack?.hue ?? 268;
  const hue2 = currentTrack?.hue2 ?? 196;

  return (
    <div className="panel__section">
      <div>
        <h2 className="panel__title">Backgrounds</h2>
        <p className="panel__copy">
          The stage follows the current artwork — change the mood and every surface picks it up.
        </p>
      </div>

      <div className="palette-preview">
        <div
          className="palette-preview__swatch"
          style={{ background: `linear-gradient(135deg, hsl(${hue} 85% 62%), hsl(${hue2} 80% 55%))` }}
        />
        <div className="palette-preview__meta">
          <span>Live palette</span>
          <small>
            hsl({hue}) / hsl({hue2})
          </small>
        </div>
      </div>

      <div className="theme-list">
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={`theme-card ${state.theme === theme.id ? 'is-active' : ''}`.trim()}
            onClick={() => dispatch({ type: 'SET_THEME', theme: theme.id })}
            aria-pressed={state.theme === theme.id}
          >
            <span
              className="theme-card__swatch"
              style={{
                background: `radial-gradient(120% 120% at 20% 10%, hsl(${theme.hues[0]} 80% 55% / 0.9), transparent 60%), radial-gradient(120% 120% at 90% 90%, hsl(${theme.hues[1]} 80% 45% / 0.8), transparent 65%), #0b0b12`,
              }}
            />
            <span className="theme-card__body">
              <span className="theme-card__name">{theme.name}</span>
              <span className="theme-card__desc">{theme.description}</span>
            </span>
            {state.theme === theme.id ? (
              <span className="theme-card__check">
                <Icon name="check" size={13} />
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="shortcuts">
        <h3>Keyboard</h3>
        <ul>
          <li>
            <kbd>Space</kbd> play / pause
          </li>
          <li>
            <kbd>←</kbd> <kbd>→</kbd> seek 5s
          </li>
          <li>
            <kbd>Shift</kbd> + <kbd>←</kbd>/<kbd>→</kbd> previous / next
          </li>
          <li>
            <kbd>L</kbd> lyrics · <kbd>Q</kbd> queue · <kbd>E</kbd> eq · <kbd>M</kbd> mute
          </li>
          <li>
            <kbd>/</kbd> focus search
          </li>
        </ul>
      </div>

      <p className="panel__footnote">
        Themes are CSS variables on <code>[data-theme]</code> in <code>src/styles.css</code>.
      </p>
    </div>
  );
}
