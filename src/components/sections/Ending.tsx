"use client";

import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { copyText } from "@/lib/clipboard";

export function Ending() {
  const toast = useToast();

  async function copyLink() {
    if (await copyText(window.location.href)) toast("링크가 복사되었습니다");
  }

  // TODO: Kakao JS SDK 연동 (NEXT_PUBLIC_KAKAO_JS_KEY, Kakao Developers에 배포 도메인 등록 필요)
  function shareKakao() {
    toast("카카오톡 공유는 준비 중입니다");
  }

  return (
    <section className="mt-30 px-5 pb-10">
      <div className="flex aspect-[335/246] flex-col items-center justify-between bg-ink py-5 text-[40px] leading-none text-white">
        <p>
          <span className="font-script">H</span>
          <span className="font-display">APPY</span>
        </p>
        <p>
          <span className="font-script">W</span>
          <span className="font-display">EDDING</span>
        </p>
      </div>
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
