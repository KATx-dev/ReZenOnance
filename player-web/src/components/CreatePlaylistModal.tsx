import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../store';
import { Icon } from './Icon';

interface CreatePlaylistModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePlaylistModal({ open, onClose }: CreatePlaylistModalProps) {
  const { dispatch } = usePlayer();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setName('');
    setDescription('');
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-playlist-title"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="modal__card"
        onSubmit={(event) => {
          event.preventDefault();
          dispatch({
            type: 'CREATE_PLAYLIST',
            name: name.trim() || 'New playlist',
            description,
          });
          onClose();
        }}
      >
        <header className="modal__head">
          <div>
            <span className="eyebrow">New playlist</span>
            <h2 id="new-playlist-title">Give it a name</h2>
          </div>
          <button type="button" className="icon-btn icon-btn--tiny" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={16} />
          </button>
        </header>

        <label className="field">
          <span>Name</span>
          <input
            ref={inputRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Late night, again"
            maxLength={48}
          />
        </label>

        <label className="field">
          <span>Description</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this playlist for?"
            maxLength={120}
          />
        </label>

        <footer className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--solid">
            Create playlist
          </button>
        </footer>
      </form>
    </div>
  );
}
