"use client";

import { useEffect, useState } from "react";
import { preload } from "react-dom";

// 첫 진입 인트로 (참고 영상: 영상 인트로.mp4)
// 실링이 붙은 봉투가 덮개 V자 선을 따라 갈라져 덮개는 실링과 함께 위로, 몸통은 아래로 빠지고
// 그 아래 어둡던 첫 화면이 밝아진다. 봉투 이미지(영상 첫 프레임 440x720)를 두 조각으로 잘라 움직인다
const ENVELOPE_SRC = "/images/intro/envelope.webp";
const SEAL_SRC = "/images/intro/seal.webp";
// 움직임 시작부터 인트로가 사라질 때까지 (globals.css의 intro 애니메이션 길이와 맞춘다)
const PLAY_MS = 3700;
// 이미지가 늦게 와도 이 시간이 지나면 시작한다
const MAX_WAIT_MS = 1200;
// 이미지 준비 후 첫 프레임이 그려질 여유
const START_DELAY_MS = 50;

function decode(src: string) {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => undefined);
}

export function Intro() {
  // 봉투 이미지를 HTML <head>에서 미리 받아 첫 화면부터 봉투가 보이게 한다
  preload(ENVELOPE_SRC, { as: "image", fetchPriority: "high" });
  preload(SEAL_SRC, { as: "image", fetchPriority: "high" });

  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");

  useEffect(() => {
    // 움직임 줄이기 설정이면 CSS가 인트로를 숨기므로 스크롤도 잠그지 않는다
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(id);
    }

    const root = document.documentElement;
    root.style.overflow = "hidden";
    let cancelled = false;
    let doneTimer: ReturnType<typeof setTimeout>;

    // 첫 화면을 그리느라 바쁜 순간을 피해서, 이미지 해독이 끝나고 잠깐 뒤에 움직이기 시작한다
    // (requestAnimationFrame은 화면이 가려져 있으면 멈추므로 타이머로 시작한다)
    const ready = Promise.race([
      Promise.all([decode(ENVELOPE_SRC), decode(SEAL_SRC)]),
      new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
    ]);
    ready.then(() =>
      setTimeout(() => {
        if (cancelled) return;
        setPhase("playing");
        doneTimer = setTimeout(() => {
          root.style.overflow = "";
          setPhase("done");
        }, PLAY_MS);
      }, START_DELAY_MS),
    );

    return () => {
      cancelled = true;
      clearTimeout(doneTimer);
      root.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className="intro" data-playing={phase === "playing" || undefined} aria-hidden>
      <div className="intro-dim" />
      {/* 화면을 꽉 채우도록 봉투 비율(440:720)을 유지한 채 cover 크기로 가운데 정렬 */}
      <div className="intro-envelope">
        <div className="intro-body" />
        <div className="intro-flap">
          <div className="intro-flap-paper" />
          <div className="intro-seal" />
        </div>
      </div>
    </div>
  );
}
