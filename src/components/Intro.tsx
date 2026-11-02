"use client";

import { useEffect, useState } from "react";

// 첫 진입 인트로 (참고 영상: 영상 인트로.mp4, 약 3초)
// 실링이 붙은 봉투가 덮개 V자 선을 따라 갈라져 덮개는 실링과 함께 위로, 몸통은 아래로 빠지고
// 그 아래 어둡던 첫 화면이 밝아진다. 봉투 이미지(영상 첫 프레임 440x720)를 두 조각으로 잘라 움직인다
const DURATION_MS = 3000;

export function Intro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // 움직임 줄이기 설정이면 CSS가 인트로를 숨기므로 스크롤도 잠그지 않는다
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    if (!reduced) root.style.overflow = "hidden";
    const timer = setTimeout(
      () => {
        root.style.overflow = "";
        setDone(true);
      },
      reduced ? 0 : DURATION_MS,
    );
    return () => {
      clearTimeout(timer);
      root.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div className="intro" aria-hidden>
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
