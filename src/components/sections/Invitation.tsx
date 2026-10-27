import { couple } from "@/data/wedding";

// TODO: 봉투 일러스트 (피그마 node 349:3), 인사말 확정 문구
export function Invitation() {
  const { groom, bride } = couple;

  return (
    <section className="mt-30 px-5 text-center">
      <div className="mx-auto flex aspect-[315/315] w-[315px] max-w-full items-center justify-center bg-line font-display text-3xl">
        YOU ARE
        <br />
        INVITED!
      </div>
      <p className="mt-10 text-base leading-normal whitespace-pre-line">
        {"인사말이 들어갈 자리입니다.\n피그마 텍스트 확정 후 교체해 주세요."}
      </p>
      <dl className="mt-10 space-y-1 text-base leading-normal">
        <div>
          <dt className="inline">
            {groom.father} · {groom.mother}
          </dt>
          <span className="text-muted"> 의 {groom.relation} </span>
          <dd className="inline font-semibold">{groom.name}</dd>
        </div>
        <div>
          <dt className="inline">
            {bride.father} · {bride.mother}
          </dt>
          <span className="text-muted"> 의 {bride.relation} </span>
          <dd className="inline font-semibold">{bride.name}</dd>
        </div>
      </dl>
    </section>
  );
}
