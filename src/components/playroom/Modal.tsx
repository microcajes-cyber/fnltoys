'use client';
import { useEffect, useId, useRef } from 'react';
import { Icon } from './Art';

export default function Modal({
  open,
  onClose,
  title,
  children,
  className = 'dialog',
  closeLabel = 'Close dialog',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  closeLabel?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const opener = document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement && opener.isConnected && opener !== document.body)
        opener.focus({ preventScroll: true });
      else document.getElementById('main-content')?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={className}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <span id={titleId} className="sr-only">
        {title}
      </span>
      <button
        type="button"
        className={className.includes('welcome-intro') ? 'intro-skip' : 'dialog-close'}
        onClick={onClose}
        aria-label={closeLabel}
      >
        {className.includes('welcome-intro') ? (
          <>
            Skip intro <Icon name="arrow" size={16} />
          </>
        ) : (
          <Icon name="close" size={18} />
        )}
      </button>
      {open ? children : null}
    </dialog>
  );
}
