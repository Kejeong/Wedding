"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/data/wedding";

// 피그마 갤러리: 262x411 폴라로이드(사진 250x375, 좌우·위 6px / 아래 30px 여백)가 0° · 5° · 10° 기울어 겹친 스택
const STACK_ROTATIONS = [0, -5, -10];
const SWIPE_THRESHOLD = 80;
const FLY_MS = 450;

// fromX: 손을 뗀 위치에서 이어서 날아가도록 시작 위치를 기억한다
type Fly = { photo: number; dir: 1 | -1; fromX: number };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Polaroid({ photo, index, priority }: { photo?: GalleryPhoto; index: number; priority?: boolean }) {
  return (
    <div className="relative bg-white p-[6px] pb-[30px] shadow-note">
      <div className="relative h-[375px] w-[250px] overflow-hidden bg-line">
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt ?? `웨딩 사진 ${index + 1}`}
            fill
            sizes="250px"
            className="pointer-events-none object-cover select-none"
            draggable={false}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-sm text-muted">사진 {index + 1}</span>
        )}
      </div>
    </div>
  );
}

/** 피그마 클립(37x57)을 받기 전까지 쓰는 SVG 클립. 카드 오른쪽 위에서 17px 위로 걸쳐 있다 */
function PaperClip() {
  return (
    <svg
      width="37"
      height="57"
      viewBox="0 0 37 57"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute -top-[17px] left-[211px] drop-shadow-[0_1px_1px_rgb(0_0_0_/_0.25)]"
    >
      <path
        d="M14 50V12a7 7 0 0 1 14 0v32a11 11 0 0 1-22 0V16"
        transform="rotate(-12 18 28)"
        stroke="#a9a9a9"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon({ flip }: { flip?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden className={flip ? "rotate-180" : undefined}>
      <path d="M1 8h14M13 6l2 2-2 2" />
    </svg>
  );
}

export function GalleryStack({ photos, placeholderCount }: { photos: GalleryPhoto[]; placeholderCount: number }) {
  const total = photos.length || placeholderCount;
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [fly, setFly] = useState<Fly | null>(null);
  // 이전 버튼: 새 맨 앞 카드가 왼쪽 밖에서 날아 들어오도록 한 프레임 동안 시작 위치에 둔다
  const [enterFrom, setEnterFrom] = useState<1 | -1 | null>(null);
  const start = useRef<{ x: number; y: number; t: number; locked?: "x" | "y" } | null>(null);
  const flyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const at = (offset: number) => (((index + offset) % total) + total) % total;

  useEffect(() => {
    if (enterFrom === null) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEnterFrom(null)));
    return () => cancelAnimationFrame(id);
  }, [enterFrom]);

  useEffect(() => () => clearTimeout(flyTimer.current), []);

  function next(dir: 1 | -1 = 1, fromX = 0) {
    clearTimeout(flyTimer.current);
    setFly({ photo: index, dir, fromX });
    setIndex((i) => (i + 1) % total);
    setDragX(0);
    flyTimer.current = setTimeout(() => setFly(null), FLY_MS);
  }

  function prev() {
    clearTimeout(flyTimer.current);
    setFly(null);
    setIndex((i) => (i - 1 + total) % total);
    setEnterFrom(-1);
  }

  function onPointerDown(e: React.PointerEvent) {
    start.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    const s = start.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    // 세로로 먼저 움직이면 페이지 스크롤로 넘기고, 가로면 카드를 잡는다
    if (!s.locked && Math.hypot(dx, dy) > 6) {
      s.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (s.locked === "x") (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (s.locked === "x") setDragX(dx);
  }

  function onPointerUp(e: React.PointerEvent) {
    const s = start.current;
    start.current = null;
    setDragging(false);
    if (!s || s.locked !== "x") return setDragX(0);
    const dx = e.clientX - s.x;
    const velocity = Math.abs(dx) / Math.max(performance.now() - s.t, 1);
    if (Math.abs(dx) > SWIPE_THRESHOLD || velocity > 0.6) next(dx > 0 ? 1 : -1, dx);
    else setDragX(0);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  }

  const visible = Math.min(total, STACK_ROTATIONS.length + 1);

  return (
    <div>
      <div
        className="relative mx-auto h-[437px] w-[262px] touch-pan-y outline-none"
        role="region"
        aria-roledescription="carousel"
        aria-label="웨딩 사진 갤러리. 좌우로 넘겨보세요"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* 뒤 카드부터 그린다. 맨 뒤(4번째)는 다음 넘김 때 자연스럽게 나타나도록 투명하게 대기 */}
        {Array.from({ length: visible }, (_, k) => visible - 1 - k).map((pos) => {
          const photo = at(pos);
          const isTop = pos === 0;
          const rotate = STACK_ROTATIONS[Math.min(pos, STACK_ROTATIONS.length - 1)];
          let transform = `rotate(${rotate}deg)`;
          if (isTop && dragX) transform = `translateX(${dragX}px) rotate(${dragX / 18}deg)`;
          if (isTop && enterFrom) transform = `translateX(${enterFrom * 420}px) rotate(${enterFrom * 18}deg)`;
          return (
            <div
              key={photo}
              className="gallery-card absolute top-0 left-0 cursor-grab active:cursor-grabbing"
              style={{
                transform,
                opacity: pos >= STACK_ROTATIONS.length ? 0 : 1,
                transition: (isTop && dragging) || (isTop && enterFrom) ? "none" : undefined,
                zIndex: visible - pos,
              }}
              aria-hidden={!isTop}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerUp : undefined}
            >
              <Polaroid photo={photos[photo]} index={photo} priority={pos < 2} />
              {isTop && <PaperClip />}
            </div>
          );
        })}

        {fly && (
          <div
            key={`fly-${fly.photo}`}
            className="gallery-card gallery-fly absolute top-0 left-0 z-50"
            style={{ "--fly-dir": fly.dir, transform: `translateX(${fly.fromX}px) rotate(${fly.fromX / 18}deg)` } as React.CSSProperties}
            aria-hidden
          >
            <Polaroid photo={photos[fly.photo]} index={fly.photo} />
            <PaperClip />
          </div>
        )}
      </div>

      <div className="mt-[34px] flex items-center justify-center gap-3.5 text-sm leading-normal">
        <button type="button" onClick={prev} className="p-2 text-ink" aria-label="이전 사진">
          <ArrowIcon flip />
        </button>
        <p className="flex w-[52px] justify-between tabular-nums" aria-live="polite">
          <span className="text-ink">{pad(index + 1)}</span>
          <span className="text-muted">/</span>
          <span className="text-muted">{pad(total)}</span>
        </p>
        <button type="button" onClick={() => next()} className="p-2 text-ink" aria-label="다음 사진">
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}
