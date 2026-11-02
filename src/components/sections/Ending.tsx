"use client";

import Image from "next/image";
import Script from "next/script";
import polaroid1 from "../../../public/images/ending/polaroid-1.webp";
import polaroid2 from "../../../public/images/ending/polaroid-2.webp";
import rings from "../../../public/images/ending/rings.webp";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/Toast";
import { CopyIcon } from "@/components/sections/Accounts";
import { closingNotes, site } from "@/data/wedding";
import { copyText } from "@/lib/clipboard";
import { initKakao, KAKAO_SDK_INTEGRITY, KAKAO_SDK_URL, shareToKakao } from "@/lib/kakao";

export function Ending() {
  const toast = useToast();

  // 배포 후에는 NEXT_PUBLIC_SITE_URL(실제 도메인) 기준으로 공유한다. 쿼리스트링 등은 붙이지 않는다
  function siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
  }

  async function copyLink() {
    if (await copyText(siteUrl())) toast("링크가 복사되었습니다");
  }

  function shareKakao() {
    // 카드 모양·문구·이미지·버튼 링크는 메시지 템플릿 빌더에서 관리한다
    if (!shareToKakao({ templateId: site.kakaoTemplateId })) toast("잠시 후 다시 시도해주세요");
  }

  return (
    <section className="mt-30 pb-10">
      <Script src={KAKAO_SDK_URL} integrity={KAKAO_SDK_INTEGRITY} crossOrigin="anonymous" onReady={initKakao} />
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
      <Reveal className="mt-10 grid grid-cols-2 gap-2.5 px-5">
        <Button variant="line" onClick={shareKakao}>
          <KakaoIcon />
          카카오톡 공유
        </Button>
        <Button variant="line" onClick={copyLink}>
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

/** 피그마 메모: 모눈 줄이 있는 246x116 흰 메모지에 손글씨, 오른쪽 위에 클립 */
function Note({ text, rotate }: { text: string; rotate: number }) {
  return (
    <div className="note-paper relative h-[116px] w-[246px] px-4 py-[15px] shadow-note" style={{ transform: `rotate(${rotate}deg)` }}>
      <p className="font-hand text-base leading-[1.3] whitespace-pre-line text-ink">{text}</p>
      {/* eslint-disable-next-line @next/next/no-img-element -- 작은 장식 이미지 */}
      <img src="/images/ui/clip.png" alt="" width={18} height={40} className="pointer-events-none absolute -top-[22px] right-6 -rotate-20" />
    </div>
  );
}
