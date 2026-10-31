import Image from "next/image";
import heroImage from "../../../public/images/hero-main.webp";
import { ceremony, couple } from "@/data/wedding";

// 첫 화면은 인트로 봉투가 열리면 바로 보여야 해서 등장 애니메이션(Reveal)을 쓰지 않는다
export function Hero() {
  return (
    <section className="pt-20 text-center">
      <p className="font-display text-sm leading-none text-muted">THE WEDDING OF</p>
      <h1 className="mt-6 flex flex-col items-center gap-1">
        <span className="font-display text-[72px] leading-none">{couple.groom.en}</span>
        <span className="font-script text-4xl leading-none text-muted">And</span>
        <span className="font-display text-[72px] leading-none">{couple.bride.en}</span>
      </h1>
      {/* 봉투·폴라로이드·날짜가 합쳐진 이미지. 왼쪽 봉투가 화면 끝에 닿도록 좌우 여백 없이 전체 폭 */}
      <div className="mt-10">
        <Image
          src={heroImage}
          alt={`${couple.groom.name}와 ${couple.bride.name}의 웨딩 사진. OUR WEDDING DAY ${ceremony.dateDot}`}
          className="h-auto w-full"
          sizes="(max-width: 430px) 100vw, 430px"
          // 첫 화면에 보이는 가장 큰 이미지(LCP)라 지연 로딩하지 않는다. Next 16에서 priority는 deprecated
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
