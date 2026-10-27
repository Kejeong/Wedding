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

  // 패딩은 안쪽 div에 둔다. dialog 자체에 두면 패딩 영역 클릭이 배경 클릭으로 잡혀 모달이 닫힌다
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`bg-note m-auto w-[calc(100%-40px)] max-w-[335px] p-0 text-ink backdrop:bg-black/50 ${className}`}
    >
      <div className="relative px-5 pt-[34px] pb-10">
        <button type="button" onClick={onClose} className="absolute top-2.5 right-2.5" aria-label="닫기">
          {/* eslint-disable-next-line @next/next/no-img-element -- 24px 정적 SVG 아이콘 */}
          <img src="/images/ui/icon-close-24.svg" width={24} height={24} alt="" />
        </button>
        {children}
      </div>
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
