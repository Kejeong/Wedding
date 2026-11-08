import { Reveal } from "@/components/Reveal";

type Props = {
  title: string;
  subtitle?: string;
  /** 첫 글자 뒤 띄어쓰기. 스크립트체 G처럼 꼬리가 짧은 글자는 간격이 벌어져 보여서 뺀다 */
  spaced?: boolean;
};

/** 'MESSAGE' → 첫 글자는 스크립트체 + 띄어쓰기, 나머지는 디스플레이체 (피그마 'M ESSAGE' 패턴) */
export function SectionTitle({ title, subtitle, spaced = true }: Props) {
  const [first, rest] = [title.slice(0, 1), title.slice(1)];

  return (
    <header className="px-5 text-center">
      {/* 글꼴이 섞이면 줄 높이가 늘어나서 높이를 피그마 값(40px)으로 고정 */}
      <Reveal as="h2" className="h-10 text-[40px] leading-none" aria-label={title}>
        {/* 피그마처럼 첫 글자 뒤에 띄어쓰기 한 칸 (예: "S AVE THE DATE") */}
        <span className="font-script">
          {first}
          {spaced && "\u00a0"}
        </span>
        <span className="font-display">{rest}</span>
      </Reveal>
      {subtitle && (
        <Reveal as="p" className="mt-2.5 text-base leading-normal whitespace-pre-line text-body">
          {subtitle}
        </Reveal>
      )}
    </header>
  );
}
