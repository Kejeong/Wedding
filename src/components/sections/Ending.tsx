"use client";

import Image from "next/image";
import Script from "next/script";
import envelope from "../../../public/images/ending-envelope.webp";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { site } from "@/data/wedding";
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
    const url = siteUrl();
    const link = { mobileWebUrl: url, webUrl: url };
    const sent = shareToKakao({
      objectType: "feed",
      content: {
        title: site.title,
        description: site.description,
        // 카카오 서버가 직접 가져가므로 공개된 절대 주소여야 한다 (localhost 이미지는 표시되지 않음)
        imageUrl: new URL(site.ogImage, url).toString(),
        imageWidth: 1200,
        imageHeight: 630,
        link,
      },
      buttons: [{ title: "청첩장 보기", link }],
    });
    if (!sent) toast("잠시 후 다시 시도해주세요");
  }

  return (
    <section className="mt-30 px-5 pb-10">
      <Script src={KAKAO_SDK_URL} integrity={KAKAO_SDK_INTEGRITY} crossOrigin="anonymous" onReady={initKakao} />
      <Image src={envelope} alt="HAPPY WEDDING" className="h-auto w-full" sizes="335px" />
      <div className="mt-10 grid grid-cols-2 gap-2.5">
        <Button onClick={shareKakao}>카카오톡 공유</Button>
        <Button onClick={copyLink}>링크 복사</Button>
      </div>
      <p className="mt-30 text-center font-display text-xs leading-normal text-muted">
        COPYRIGHT ©JS.EH
        <br />
        ALL RIGHTS RESERVED.
      </p>
    </section>
  );
}
