import Image from "next/image";
import invitationImage from "../../../public/images/invitation.webp";
import { Reveal } from "@/components/Reveal";
import { couple, greeting } from "@/data/wedding";

export function Invitation() {
  const { groom, bride } = couple;

  return (
    <section className="mt-30 px-5 text-center">
      {/* 봉투·사진·초대장이 합쳐진 이미지. 종이 배경이 화면 끝까지 이어지도록 섹션 여백을 상쇄해 전체 폭으로 */}
      <Reveal className="-mx-5">
        <Image
          src={invitationImage}
          alt="봉투에서 꺼낸 YOU ARE INVITED! 초대장과 두 사람의 사진"
          className="h-auto w-full"
          sizes="(max-width: 430px) 100vw, 430px"
        />
      </Reveal>
      <div className="mt-10 space-y-3 text-base leading-normal">
        {greeting.map((paragraph) => (
          <Reveal as="p" key={paragraph} className="whitespace-pre-line">
            {paragraph}
          </Reveal>
        ))}
      </div>
      <dl className="mt-14 text-base leading-normal">
        {[groom, bride].map((person) => (
          <Reveal key={person.name}>
            <dt className="inline">
              {person.father} · {person.mother}
            </dt>
            <span className="text-sm text-muted"> 의 {person.relation} </span>
            <dd className="inline">{person.name}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
