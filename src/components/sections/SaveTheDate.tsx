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
      <div className="mt-10 grid grid-cols-[1fr_174px_1fr] overflow-hidden border-y border-ink text-center font-display">
        {days.map((d, i) => {
          const isCurrent = i === 1;
          return (
            <div key={d.day} className={isCurrent ? "border-x border-ink text-ink" : "text-faint"}>
              <p className="border-b border-ink py-2.5 text-sm leading-none">{d.weekday}</p>
              <p className="py-5 text-[100px] leading-none">{d.day}</p>
              <p className={`pb-5 text-sm leading-none ${isCurrent ? "" : "invisible"}`}>{d.month}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-10 px-5 text-center text-base leading-normal font-medium">{ceremony.dateLabel}</p>
    </section>
  );
}
