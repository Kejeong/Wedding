"use client";

import Image from "next/image";
import Script from "next/script";
import { useRef, useState } from "react";
import polaroid1 from "../../../public/images/ending/polaroid-1.webp";
import polaroid2 from "../../../public/images/ending/polaroid-2.webp";
import rings from "../../../public/images/ending/rings.webp";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { Modal } from "@/components/Modal";
import { SectionTitle } from "@/components/SectionTitle";
import { useToast } from "@/components/Toast";
import { CopyIcon } from "@/components/sections/Accounts";
import { ceremony, closingNotes, flowers, kakaoShare } from "@/data/wedding";
import { copyText } from "@/lib/clipboard";
import { initKakao, KAKAO_SDK_INTEGRITY, KAKAO_SDK_URL, prepareKakaoImage, shareToKakao } from "@/lib/kakao";

export function Ending() {
  const toast = useToast();
  const [flowersOpen, setFlowersOpen] = useState(false);
  // 카카오 CDN에 올려 둔 공유 이미지 주소 (준비 전에는 사이트 주소를 쓴다)
  const kakaoImageRef = useRef<string | null>(null);

  // 배포 후에는 NEXT_PUBLIC_SITE_URL(실제 도메인) 기준으로 공유한다. 쿼리스트링 등은 붙이지 않는다
  function siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
  }

  async function copyLink() {
    if (await copyText(siteUrl())) toast("링크가 복사되었습니다");
  }

  function onKakaoReady() {
    initKakao();
    prepareKakaoImage(new URL(kakaoShare.image, siteUrl()).toString()).then((src) => {
      kakaoImageRef.current = src;
    });
  }

  function shareKakao() {
    const url = siteUrl();
    const link = { mobileWebUrl: url, webUrl: url };
    const sent = shareToKakao({
      objectType: "feed",
      content: {
        title: kakaoShare.title,
        description: kakaoShare.description,
        // 카카오 CDN 주소가 준비됐으면 그걸 쓰고, 아니면 배포된 사이트의 https 주소 (localhost 이미지는 표시되지 않음)
        imageUrl: kakaoImageRef.current ?? new URL(kakaoShare.image, url).toString(),
        imageWidth: 800,
        imageHeight: 800,
        link,
      },
      buttons: [{ title: kakaoShare.buttonTitle, link }],
    });
    if (!sent) toast("잠시 후 다시 시도해주세요");
  }

  return (
    <section className="mt-30 pb-10">
      <Script src={KAKAO_SDK_URL} integrity={KAKAO_SDK_INTEGRITY} crossOrigin="anonymous" onReady={onKakaoReady} />
      {/* 피그마 하단: 375px 기준으로 폴라로이드 2장과 손글씨 메모 2장을 겹쳐 놓은 구성. 좌표는 이 상자 기준 */}
      <div className="relative left-1/2 h-[1088px] w-[375px] -translate-x-1/2">
        <Reveal className="absolute top-0 left-5 w-[262px]">
          <Image src={polaroid1} alt="두 사람이 꽃다발을 들고 입맞추는 사진" sizes="262px" className="h-auto w-full" />
        </Reveal>
        <Reveal className="absolute top-[342px] left-[103px]">
          <Note text={closingNotes[0]} rotate={-5} />
        </Reveal>
        <Reveal className="absolute top-[541px] left-[56px] w-[262px]">
          <Image
            src={polaroid2}
            alt="Marry me?와 YES!!가 적힌 야구공을 든 사진"
            sizes="262px"
            className="h-auto w-full -rotate-5"
          />
        </Reveal>
        <Reveal className="absolute top-[879px] left-[25px]">
          <Note text={closingNotes[1]} rotate={4} />
        </Reveal>
      </div>
      <Reveal>
        <Image src={rings} alt="반지 케이스를 머리에 올린 사진" sizes="(max-width: 430px) 100vw, 430px" className="h-auto w-full" />
      </Reveal>
      <div className="mt-30">
        <SectionTitle title="THANK YOU" subtitle={flowers.description} />
        {/* 버튼은 기본이 가득 채우기라 163px 상자로 폭을 정한다 */}
        <Reveal className="mx-auto mt-10 w-[163px]">
          <Button variant="line" size="sm" onClick={() => setFlowersOpen(true)}>
            축하 화환 보내기
          </Button>
        </Reveal>
      </div>
      <FlowersModal open={flowersOpen} onClose={() => setFlowersOpen(false)} />
      <Reveal className="mt-30 grid grid-cols-2 gap-2.5 px-5">
        <Button variant="line" size="sm" onClick={shareKakao}>
          <KakaoIcon />
          카카오톡 공유
        </Button>
        <Button variant="line" size="sm" onClick={copyLink}>
          <CopyIcon />
          링크 복사
        </Button>
      </Reveal>
      <p className="mt-30 px-5 text-center text-xs leading-[1.15] text-muted">
        COPYRIGHT ©JS.EH
        <br />
        ALL RIGHTS RESERVED.
      </p>
    </section>
  );
}

function KakaoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" aria-hidden>
      <path d="M8 2.5c-3.6 0-6.5 2.2-6.5 5 0 1.7 1.1 3.2 2.8 4.1l-.6 2.4 2.7-1.7c.5.1 1 .2 1.6.2 3.6 0 6.5-2.2 6.5-5S11.6 2.5 8 2.5Z" />
    </svg>
  );
}

/**
 * 피그마 메모: 모눈 줄이 있는 246x116 흰 메모지에 손글씨, 오른쪽 위에 클립.
 * 클립이 종이에 끼워진 모양이 되도록 같은 클립을 두 장 겹친다:
 *  - 종이 뒤 클립: 종이 위로 나온 부분만 보이고, 종이와 겹치는 부분은 종이에 가려진다
 *  - 종이 앞 클립: 왼쪽 짧은 철사(종이 뒤로 들어가는 쪽)를 잘라내고 안쪽 U자 철사만 종이 위에 보인다
 */
function Note({ text, rotate }: { text: string; rotate: number }) {
  return (
    <div className="relative h-[116px] w-[246px]" style={{ transform: `rotate(${rotate}deg)` }}>
      <NoteClip />
      <div className="note-paper absolute inset-0 px-4 py-[15px] shadow-note">
        {/* 손글씨가 가늘어 보여서 글자색 외곽선(0.4px)으로 살짝 굵게 */}
        <p className="font-hand text-base leading-[1.3] whitespace-pre-line text-ink [-webkit-text-stroke:0.4px_currentColor]">{text}</p>
      </div>
      <NoteClip front />
    </div>
  );
}

/**
 * 클립(20x44): 위 8px만 종이 밖으로 나오고 오른쪽 끝에서 12px 안쪽.
 * 클립 이미지 자체가 10°쯤 기울어 있고 10° 더 돌려서, 아래쪽이 오른쪽으로 20°쯤 비스듬히 꽂힌 모양
 */
function NoteClip({ front }: { front?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 작은 장식 이미지
    <img
      src="/images/ui/clip.png"
      alt=""
      width={20}
      height={44}
      className="pointer-events-none absolute -top-2 right-3 -rotate-10"
      // 앞 클립은 위 15%(종이 밖 고리)와 오른쪽 75%(안쪽 U자 철사)만 남긴다
      style={front ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 25% 100%, 25% 15%, 0 15%)" } : undefined}
    />
  );
}

/** 축하 화환 팝업: 예식 정보를 보여주고 화환 주문 페이지(새 탭)로 보낸다. 예식장·일시는 주문 페이지에 미리 입력되어 있다 */
function FlowersModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const info = [
    { icon: <CalendarIcon />, text: ceremony.dateLabel },
    { icon: <MapIcon />, text: flowers.address },
    { icon: <PinIcon />, text: ceremony.hall },
  ];
  return (
    <Modal open={open} onClose={onClose}>
      <header className="text-center">
        <h2 className="text-base leading-normal font-semibold">축하 화환 보내기</h2>
        <p className="mt-1.5 text-sm leading-normal whitespace-pre-line text-body">{flowers.popupMessage}</p>
      </header>
      <ul className="mx-auto mt-10 w-fit space-y-2.5 text-sm leading-normal">
        {info.map(({ icon, text }) => (
          <li key={text} className="flex items-center gap-1.5">
            <span className="text-muted">{icon}</span>
            {text}
          </li>
        ))}
      </ul>
      <a
        href={flowers.orderUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 flex h-[45px] w-full items-center justify-center bg-ink text-sm leading-normal text-white"
      >
        축하 화환 보내기
      </a>
    </Modal>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" strokeLinecap="round" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" aria-hidden>
      <path d="M1.5 4 5.5 2.5l5 1.5 4-1.5v9.5l-4 1.5-5-1.5-4 1.5V4ZM5.5 2.5V12M10.5 4v9.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <path d="M8 14.5s4.5-4.2 4.5-7.7a4.5 4.5 0 0 0-9 0c0 3.5 4.5 7.7 4.5 7.7Z" strokeLinejoin="round" />
      <circle cx="8" cy="6.8" r="1.6" />
    </svg>
  );
}
