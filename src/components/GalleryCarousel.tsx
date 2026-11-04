"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { GalleryPhoto } from "@/data/wedding";

// 갤러리 디자인: 폭 262px 폴라로이드 카드를 가로로 나열하고 가운데 카드 양옆으로 이전·다음 카드가 살짝 보인다.
// 사진 파일에 테두리·클립이 들어 있고, 사진이 없을 때만 코드로 그린 자리표시 카드를 쓴다
const CARD_WIDTH = 262;
const GAP = 20;
const STEP = CARD_WIDTH + GAP;
// 자동 롤링 (참고: eveholiday tailsofus 갤러리): 3초마다 다음 사진, 끝에서 첫 사진으로 끊김 없이 이어진다
const AUTOPLAY_MS = 3000;
// 손으로 넘기면 이 시간 동안 자동 롤링을 멈춘다
const PAUSE_AFTER_TOUCH_MS = 4000;
// 무한 반복용으로 앞뒤에 붙이는 복제 카드 수 (양옆에 보이는 카드보다 많아야 한다)
const CLONES = 2;

/** 사진이 없을 때 자리표시 카드 */
function Polaroid({ index }: { index: number }) {
  return (
    <div className="relative bg-white p-[6px] pb-[30px] shadow-note">
      <div className="relative flex h-[375px] w-[250px] items-center justify-center bg-line text-sm text-muted">사진 {index + 1}</div>
    </div>
  );
}

/** 디자인의 클립(약 26x40)을 받기 전까지 쓰는 SVG 클립. 카드 위로 12px 걸쳐 있다 */
function PaperClip() {
  return (
    <svg
      width="26"
      height="40"
      viewBox="0 0 37 57"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute -top-3 left-[222px] drop-shadow-[0_1px_1px_rgb(0_0_0_/_0.25)]"
    >
      <path
        d="M14 50V12a7 7 0 0 1 14 0v32a11 11 0 0 1-22 0V16"
        transform="rotate(-12 18 28)"
        stroke="#a9a9a9"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 가로 스크롤 + scroll-snap 캐러셀. 손가락으로 넘기면 브라우저 기본 관성 스크롤로 카드가 가운데에 맞춰진다.
 * 앞뒤에 복제 카드를 두고, 복제 카드에 멈추면 같은 모양의 실제 카드 위치로 순간 이동해서 무한 반복처럼 보이게 한다.
 */
export function GalleryCarousel({ photos, placeholderCount }: { photos: GalleryPhoto[]; placeholderCount: number }) {
  const total = photos.length || placeholderCount;
  const loop = total > CLONES;
  // 화면에 그리는 순서: [끝 CLONES장 복제] + 실제 사진 + [처음 CLONES장 복제]
  const slides = loop
    ? [...Array.from({ length: CLONES }, (_, i) => total - CLONES + i), ...Array.from({ length: total }, (_, i) => i), ...Array.from({ length: CLONES }, (_, i) => i)]
    : Array.from({ length: total }, (_, i) => i);
  const offset = loop ? CLONES : 0;

  const track = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pausedUntil = useRef(0);

  // 처음에는 첫 실제 카드가 가운데 오도록
  useEffect(() => {
    track.current?.scrollTo({ left: offset * STEP, behavior: "instant" });
  }, [offset]);

  // 자동 롤링: 갤러리가 화면에 보이고, 사용자가 최근에 만지지 않았을 때만
  useEffect(() => {
    const el = track.current;
    if (!el || !loop || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.5 });
    observer.observe(el);
    const id = setInterval(() => {
      if (!visible || document.hidden || performance.now() < pausedUntil.current) return;
      el.scrollBy({ left: STEP, behavior: "smooth" });
    }, AUTOPLAY_MS);
    return () => {
      clearInterval(id);
      observer.disconnect();
    };
  }, [loop]);

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  function pause() {
    pausedUntil.current = performance.now() + PAUSE_AFTER_TOUCH_MS;
  }

  function onScroll() {
    const el = track.current;
    if (!el) return;
    // 스크롤이 멈추면 복제 카드에서 실제 카드로 순간 이동
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      if (!loop) return;
      const settled = Math.round(el.scrollLeft / STEP);
      if (settled < offset) el.scrollTo({ left: (settled + total) * STEP, behavior: "instant" });
      else if (settled >= offset + total) el.scrollTo({ left: (settled - total) * STEP, behavior: "instant" });
    }, 120);
  }

  // 위 여백은 카드 위로 걸친 클립, 아래 여백은 카드 그림자가 잘리지 않게
  return (
    <div
      ref={track}
      onScroll={onScroll}
      className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50%-131px)] pt-4 pb-3 outline-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="웨딩 사진 갤러리. 좌우로 넘겨보세요"
      tabIndex={0}
      onPointerDown={pause}
      onTouchStart={pause}
      onWheel={pause}
      onKeyDown={pause}
    >
      {slides.map((photo, position) => {
        const isClone = position < offset || position >= offset + total;
        const src = photos[photo];
        return (
          <div key={position} className="relative w-[262px] shrink-0 snap-center" aria-hidden={isClone || undefined}>
            {src ? (
              // 사진 파일에 폴라로이드 테두리와 클립이 들어 있어서 그대로 보여준다
              <Image
                src={src.src}
                alt={src.alt ?? `웨딩 사진 ${photo + 1}`}
                width={1080}
                height={1718}
                sizes="262px"
                className="pointer-events-none h-auto w-full select-none"
                draggable={false}
              />
            ) : (
              <>
                <Polaroid index={photo} />
                <PaperClip />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
