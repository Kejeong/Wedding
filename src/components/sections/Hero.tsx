import { ceremony, couple } from "@/data/wedding";

// TODO: 편지 봉투 + 메인 사진 레이어 (피그마 node 353:247)
export function Hero() {
  return (
    <section className="pt-20 text-center">
      <p className="font-display text-xs leading-none text-muted">THE WEDDING OF</p>
      <h1 className="mt-8 flex flex-col items-center gap-2">
        <span className="font-display text-6xl leading-none">{couple.groom.en}</span>
        <span className="font-script text-3xl leading-none text-muted">And</span>
        <span className="font-display text-6xl leading-none">{couple.bride.en}</span>
      </h1>
      <div className="mx-7 mt-10 flex aspect-[336/391] items-center justify-center bg-line text-sm text-muted">
        메인 사진
      </div>
      <div className="mx-7 mt-2 flex justify-between font-display text-xs text-muted">
        <span>OUR WEDDING DAY</span>
        <span>{ceremony.dateDot}</span>
      </div>
    </section>
  );
}
