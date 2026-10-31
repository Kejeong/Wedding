"use client";

import Image from "next/image";
import Script from "next/script";
import envelope from "../../../public/images/ending-envelope.webp";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/Toast";
import { CopyIcon } from "@/components/sections/Accounts";
import { closing, couple, site } from "@/data/wedding";
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
    <section className="mt-30 px-5 pb-10">
      <Script src={KAKAO_SDK_URL} integrity={KAKAO_SDK_INTEGRITY} crossOrigin="anonymous" onReady={initKakao} />
      <Reveal>
        <Image src={envelope} alt="HAPPY WEDDING" className="h-auto w-full" sizes="335px" />
      </Reveal>
      <div className="mt-10 text-center">
        <Reveal as="p" className="text-base leading-normal font-semibold">
          {couple.groom.name} · {couple.bride.name} 올림
        </Reveal>
        <Reveal as="p" className="mt-1 text-base leading-normal whitespace-pre-line">
          {closing.message}
        </Reveal>
        <Reveal as="p" className="mt-4 font-display text-[13px] leading-[1.2] whitespace-pre-line text-muted">
          {closing.english}
        </Reveal>
      </div>
      <Reveal className="mt-10 grid grid-cols-2 gap-2.5">
        <Button variant="line" onClick={shareKakao}>
          <KakaoIcon />
          카카오톡 공유
        </Button>
        <Button variant="line" onClick={copyLink}>
          <CopyIcon />
          링크 복사
        </Button>
      </Reveal>
      <p className="mt-30 text-center text-xs leading-[1.15] text-muted">
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
