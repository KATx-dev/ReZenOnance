import { useEffect, useState } from 'react';
import { coverStyle } from '../data';

interface CoverProps {
  hue: number;
  hue2: number;
  /** Short label rendered inside procedural artwork fallback. */
  label?: string;
  artworkURL?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fill';
  round?: boolean;
}

function initials(label: string): string {
  const words = label.replace(/[^\p{L}\p{N} ]/gu, '').split(/\s+/).filter(Boolean);
  if (words.length === 0) return '♪';
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return (words[0]![0]! + words[1]![0]!).toUpperCase();
}

export function Cover({ hue, hue2, label, artworkURL, size = 'md', round = false }: CoverProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [artworkURL]);

  const pattern = Math.abs(Math.round(hue + hue2)) % 3;
  return (
    <div
      className={`cover cover--${size} ${round ? 'cover--round' : ''}`.trim()}
      style={coverStyle(hue, hue2)}
      data-pattern={pattern}
      aria-hidden="true"
    >
      <span className="cover__rings" />
      <span className="cover__glow" />
      {artworkURL && !imgFailed ? (
        <img
          className="cover__img"
          src={artworkURL}
          alt=""
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : label ? (
        <span className="cover__label">{initials(label)}</span>
      ) : null}
    </div>
  );
}

export function Equalizer({ playing }: { playing: boolean }) {
  return (
    <span className={`eq ${playing ? 'is-playing' : ''}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
