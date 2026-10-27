"use client";

import { Button } from "@/components/Button";
import Image from "next/image";
import mapImage from "../../../public/images/location-map.webp";
import { SectionTitle } from "@/components/SectionTitle";
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

      <Image
        src={mapImage}
        alt="약도: 건대입구역(2·7호선) 옆 스타시티 웨딩홀, 건국대학교 병원과 롯데백화점 인근"
        className="mt-10 h-auto w-full"
        sizes="335px"
      />

      <div className="mt-10 text-center text-base leading-normal">
        <p className="font-semibold">{venue.name}</p>
        <p>{venue.address}</p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <Button onClick={() => window.open(venue.kakaoMapUrl, "_blank")}>카카오맵</Button>
        <Button onClick={copyAddress}>주소 복사</Button>
      </div>

      <hr className="mt-10 border-line" />

      <dl className="mt-10 space-y-6 text-base leading-loose">
        {venue.transport.map(({ title, lines }) => (
          <div key={title}>
            <dt className="font-semibold">{title}</dt>
            {lines.map((line) => (
              <dd key={line}>{line}</dd>
            ))}
          </div>
        ))}
      </dl>
    </section>
  );
}
