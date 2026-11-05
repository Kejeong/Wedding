"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { preload } from "react-dom";

// 첫 진입 인트로: 실링이 붙은 봉투가 화면을 덮고 있다가, 준비가 끝나면 저절로(그 전에 누르면 바로)
// 덮개(실링 포함)는 위로, 몸통은 아래로 빠지며 그 아래 어둡던 첫 화면이 밝아진다.
// 봉투 윗면·아랫면 이미지 두 장(750x1333, 투명 배경)을 겹쳐 움직인다 (globals.css의 .intro)
const FLAP_SRC = "/images/intro/envelope-top.webp";
const BODY_SRC = "/images/intro/envelope-bottom.webp";
// 누른 뒤 인트로가 사라질 때까지 (globals.css의 intro 애니메이션 길이와 맞춘다)
const PLAY_MS = 3100;
// 준비가 늦어도 이 시간이 지나면 연다
const MAX_WAIT_MS = 1500;
// 준비된 뒤 봉투를 잠깐 보여주고 연다
const HOLD_MS = 400;

type Phase = "loading" | "ready" | "playing" | "done";

function decode(src: string) {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => undefined);
}

export function Intro() {
  // 봉투 이미지를 HTML <head>에서 미리 받아 첫 화면부터 봉투가 보이게 한다
  preload(FLAP_SRC, { as: "image", fetchPriority: "high" });
  preload(BODY_SRC, { as: "image", fetchPriority: "high" });

  // "mounted"가 되기 전(서버 HTML·JS 실패)에는 CSS가 6초 뒤 인트로를 알아서 숨긴다
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const phaseRef = useRef<Phase>("loading");
  const doneTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const go = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const open = useCallback(() => {
    // 준비 전에 눌러도 바로 연다 (봉투 이미지는 미리 받아 두어 대부분 이미 보이는 상태)
    if (phaseRef.current !== "loading" && phaseRef.current !== "ready") return;
    go("playing");
    doneTimer.current = setTimeout(() => {
      document.documentElement.style.overflow = "";
      go("done");
    }, PLAY_MS);
  }, [go]);

  useEffect(() => {
    // 움직임 줄이기 설정이면 CSS가 인트로를 숨기므로 스크롤도 잠그지 않는다
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => go("done"), 0);
      return () => clearTimeout(id);
    }

    const root = document.documentElement;
    root.style.overflow = "hidden";
    const mountId = setTimeout(() => setMounted(true), 0);
    let cancelled = false;

    // 봉투가 움직이는 도중에 아래 페이지가 사진 해독·글꼴 교체로 다시 그려지면 버벅이므로,
    // 봉투 이미지·첫 화면 메인 사진·글꼴이 준비된 뒤 잠깐 있다가 연다
    // (requestAnimationFrame은 화면이 가려져 있으면 멈추므로 타이머로 시작한다)
    let holdId: ReturnType<typeof setTimeout>;
    const heroImage = document.querySelector<HTMLImageElement>("main section img");
    Promise.race([
      Promise.all([decode(FLAP_SRC), decode(BODY_SRC), heroImage?.decode().catch(() => undefined), document.fonts.ready]),
      new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
    ]).then(() => {
      if (cancelled || phaseRef.current !== "loading") return;
      go("ready");
      holdId = setTimeout(open, HOLD_MS);
    });

    // 키보드로도 열 수 있게 (Enter·Space)
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") open();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      cancelled = true;
      clearTimeout(mountId);
      clearTimeout(holdId);
      clearTimeout(doneTimer.current);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = "";
    };
  }, [go, open]);

  if (phase === "done") return null;

  return (
    <div
      className="intro"
      data-js={mounted || undefined}
      data-ready={phase === "ready" || undefined}
      data-playing={phase === "playing" || undefined}
      onClick={open}
      aria-hidden
    >
      <div className="intro-dim" />
      <div className="intro-envelope">
        <div className="intro-body" />
        <div className="intro-flap" />
      </div>
    </div>
  );
}
