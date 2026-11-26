import { useEffect, useRef } from 'react';
import { usePlayer } from '../store';
import type { View } from '../types';
import { Icon, type IconName } from './Icon';

/** Section switcher shown only when the sidebar is hidden (<= 820px). */
const mobileLinks: Array<{ label: string; icon: IconName; view: View }> = [
  { label: 'Home', icon: 'home', view: { kind: 'home' } },
  { label: 'Search', icon: 'search', view: { kind: 'search' } },
  { label: 'Library', icon: 'library', view: { kind: 'library' } },
  { label: 'Liked', icon: 'heartFilled', view: { kind: 'liked' } },
];

export function TopBar() {
  const { state, dispatch, back, forward, navigate } = usePlayer();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.closest('input, textarea, select, [contenteditable="true"]');
      if (event.key === '/' && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const updateSearch = (value: string) => {
    dispatch({ type: 'SET_SEARCH', value });
    if (state.view.kind !== 'search') navigate({ kind: 'search' });
  };

  return (
    <header className="topbar">
      <div className="topbar__history">
        <button
          className="icon-btn"
          onClick={back}
          disabled={state.history.length === 0}
          aria-label="Go back"
        >
          <Icon name="back" size={18} />
        </button>
        <button
          className="icon-btn"
          onClick={forward}
          disabled={state.future.length === 0}
          aria-label="Go forward"
        >
          <Icon name="forward" size={18} />
        </button>
      </div>

      <label className="searchfield">
        <Icon name="search" size={16} />
        <input
          ref={inputRef}
          type="search"
          value={state.search}
          placeholder="Search tracks, albums, artists"
          onChange={(event) => updateSearch(event.target.value)}
          onFocus={() => {
            if (state.view.kind !== 'search') navigate({ kind: 'search' });
          }}
          aria-label="Search the library"
        />
        {state.search ? (
          <button
            className="searchfield__clear"
            onClick={() => dispatch({ type: 'SET_SEARCH', value: '' })}
            aria-label="Clear search"
          >
            <Icon name="close" size={13} />
          </button>
        ) : (
          <kbd className="searchfield__hint">/</kbd>
        )}
      </label>

      <div className="topbar__actions">
        <button
          className={`icon-btn ${state.panel === 'eq' ? 'is-active' : ''}`.trim()}
          onClick={() => dispatch({ type: 'SET_PANEL', panel: state.panel === 'eq' ? 'none' : 'eq' })}
          aria-label="AutoEQ and stream settings"
          title="AutoEQ & Engine (E)"
        >
          <Icon name="sliders" size={18} />
        </button>
        <button
          className={`icon-btn ${state.panel === 'queue' ? 'is-active' : ''}`.trim()}
          onClick={() => dispatch({ type: 'SET_PANEL', panel: state.panel === 'queue' ? 'none' : 'queue' })}
          aria-label={state.panel === 'queue' ? 'Close queue' : 'Open queue'}
        >
          <Icon name="queue" size={18} />
        </button>
        <button
          className="pill-btn"
          onClick={() => dispatch({ type: 'SET_PANEL', panel: 'visuals' })}
        >
          <Icon name="sparkles" size={14} />
          Backgrounds
        </button>
      </div>

      <nav className="mobile-nav" aria-label="Sections">
        {mobileLinks.map((link) => {
          const active = state.view.kind === link.view.kind;
          return (
            <button
              key={link.label}
              className={`mobile-nav__item ${active ? 'is-active' : ''}`.trim()}
              onClick={() => navigate(link.view)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon name={link.icon} size={15} />
              {link.label}
            </button>
          );
        })}
        <a href="/" className="mobile-nav__item">
          <Icon name="portal" size={15} />
          Portal
        </a>
      </nav>
    </header>
  );
}
