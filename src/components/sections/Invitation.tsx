import { couple, greeting } from "@/data/wedding";

// TODO: 봉투 일러스트 (피그마 node 349:3)
export function Invitation() {
  const { groom, bride } = couple;

  return (
    <section className="mt-30 px-5 text-center">
      <div className="mx-auto flex aspect-[315/315] w-[315px] max-w-full items-center justify-center bg-line font-display text-3xl">
        YOU ARE
        <br />
        INVITED!
      </div>
      <div className="mt-10 space-y-3 text-base leading-normal">
        {greeting.map((paragraph) => (
          <p key={paragraph} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
      <dl className="mt-14 text-base leading-normal">
        {[groom, bride].map((person) => (
          <div key={person.name}>
            <dt className="inline">
              {person.father} · {person.mother}
            </dt>
            <span className="text-sm text-muted"> 의 {person.relation} </span>
            <dd className="inline">{person.name}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
