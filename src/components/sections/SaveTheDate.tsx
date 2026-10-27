import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { ceremony } from "@/data/wedding";

const DAY = 24 * 60 * 60 * 1000;

function dayInfo(date: Date) {
  const opts = { timeZone: "Asia/Seoul" } as const;
  return {
    day: date.toLocaleDateString("en-US", { ...opts, day: "numeric" }),
    weekday: date.toLocaleDateString("en-US", { ...opts, weekday: "long" }),
    month: date.toLocaleDateString("en-US", { ...opts, month: "long" }),
  };
}

export function SaveTheDate() {
  const days = [-1, 0, 1].map((offset) => dayInfo(new Date(ceremony.date.getTime() + offset * DAY)));

  return (
    <section className="mt-30">
      <SectionTitle title="SAVE THE DATE" />
      {/* 피그마: 173px 칸 세 개를 가운데 정렬하고 양옆 칸은 화면 밖으로 잘리게 둔다 (19·21이 반쯤 보임) */}
      <Reveal delay={0.32} className="mt-10 overflow-hidden border-y border-line">
        <div className="relative left-1/2 grid w-[520px] -translate-x-1/2 grid-cols-[173px_174px_173px] text-center font-display lining-nums">
          {days.map((d, i) => {
            const isCurrent = i === 1;
            return (
              <div key={d.day} className={isCurrent ? "border-x border-line text-ink" : "text-faint"}>
                <p className="border-b border-line py-2.5 text-sm leading-none">{d.weekday}</p>
                <p className="pt-5 pb-2.5 text-[100px] leading-none">{d.day}</p>
                <p className={`pb-5 text-sm leading-none ${isCurrent ? "" : "invisible"}`}>{d.month}</p>
              </div>
            );
          })}
        </div>
      </Reveal>
      <Reveal as="p" delay={0.64} className="mt-10 px-5 text-center text-base leading-normal">
        <span className="font-medium">{ceremony.dateLabel}</span>
        <br />
        {ceremony.hall}
      </Reveal>
    </section>
  );
}
