"use client";

import Image from "next/image";
import mapImage from "../../../public/images/location-map.webp";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { CopyIcon } from "@/components/sections/Accounts";
import { useToast } from "@/components/Toast";
import { venue } from "@/data/wedding";
import { copyText } from "@/lib/clipboard";

export function Location() {
  const toast = useToast();

  async function copyAddress() {
    if (await copyText(`${venue.name} ${venue.address}`)) toast("주소가 복사되었습니다");
  }

  return (
    <section className="mt-30 px-5">
      <SectionTitle title="LOCATION" subtitle="예식 장소" />

      <Reveal className="mt-10">
        <Image
          src={mapImage}
          alt="약도: 건대입구역(2·7호선) 옆 스타시티 웨딩홀, 건국대학교 병원과 롯데백화점 인근"
          className="h-auto w-full"
          sizes="335px"
        />
      </Reveal>

      <Reveal className="mt-10 text-center text-base leading-normal">
        <p className="font-semibold">{venue.name}</p>
        <p>{venue.address}</p>
      </Reveal>
      <Reveal delay={0.32} className="mt-5 grid grid-cols-2 gap-2.5">
        <Button variant="line" onClick={() => window.open(venue.kakaoMapUrl, "_blank")}>
          <PinIcon />
          카카오맵
        </Button>
        <Button variant="line" onClick={copyAddress}>
          <CopyIcon />
          주소 복사
        </Button>
      </Reveal>

      <hr className="mt-10 border-line" />

      {/* 피그마: 모든 줄 24px(1.5), 항목 사이는 빈 줄 하나(24px) */}
      <dl className="mt-10 space-y-6 text-base leading-normal">
        {venue.transport.map(({ title, lines }) => (
          <Reveal key={title}>
            <dt className="font-semibold">{title}</dt>
            {lines.map((line) => (
              <dd key={line}>{line}</dd>
            ))}
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M8 14.5s4.5-4.2 4.5-7.7a4.5 4.5 0 0 0-9 0c0 3.5 4.5 7.7 4.5 7.7Z" strokeLinejoin="round" />
      <circle cx="8" cy="6.8" r="1.6" />
    </svg>
  );
}
