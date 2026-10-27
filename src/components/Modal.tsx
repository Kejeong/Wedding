"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

/** 네이티브 <dialog> 기반: ESC 닫기·포커스 트랩·배경 스크롤 차단을 브라우저에 맡긴다 */
export function Modal({ open, onClose, children, className = "" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`m-auto w-[calc(100%-40px)] max-w-[335px] bg-paper p-5 pt-6 text-ink shadow-note backdrop:bg-black/60 ${className}`}
    >
      <button type="button" onClick={onClose} className="absolute top-2.5 right-2.5 p-1" aria-label="닫기">
        <CloseIcon size={24} />
      </button>
      {children}
    </dialog>
  );
}

export function CloseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}
