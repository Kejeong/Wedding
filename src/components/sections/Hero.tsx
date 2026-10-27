import Image from "next/image";
import heroImage from "../../../public/images/hero-main.webp";
import { Reveal } from "@/components/Reveal";
import { ceremony, couple } from "@/data/wedding";

export function Hero() {
  return (
    <section className="pt-20 text-center">
      <Reveal as="p" className="font-display text-sm leading-none text-muted">
        THE WEDDING OF
      </Reveal>
      <Reveal as="h1" delay={0.32} className="mt-6 flex flex-col items-center gap-1">
        <span className="font-display text-[72px] leading-none">{couple.groom.en}</span>
        <span className="font-script text-4xl leading-none text-muted">And</span>
        <span className="font-display text-[72px] leading-none">{couple.bride.en}</span>
      </Reveal>
      {/* 봉투·폴라로이드·날짜가 합쳐진 이미지. 왼쪽 봉투가 화면 끝에 닿도록 좌우 여백 없이 전체 폭 */}
      <Reveal delay={0.64} className="mt-10">
        <Image
          src={heroImage}
          alt={`${couple.groom.name}와 ${couple.bride.name}의 웨딩 사진. OUR WEDDING DAY ${ceremony.dateDot}`}
          className="h-auto w-full"
          sizes="(max-width: 430px) 100vw, 430px"
          // 첫 화면에 보이는 가장 큰 이미지(LCP)라 지연 로딩하지 않는다. Next 16에서 priority는 deprecated
          loading="eager"
          fetchPriority="high"
        />
      </Reveal>
    </section>
  );
}
