import type { ButtonHTMLAttributes } from "react";

// line: 배경 없이 테두리만 (엔딩 공유 버튼, 종이 배경이 비친다)
// size를 주지 않으면 variant 기본 크기: solid·outline 14px, line 16px
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline" | "solid" | "line"; size?: "sm" | "md" };

const VARIANTS = {
  solid: "bg-ink text-white disabled:bg-muted",
  outline: "border border-line bg-white text-ink",
  line: "border border-line text-ink [&_svg]:text-muted",
};

const DEFAULT_SIZE = { solid: "sm", outline: "sm", line: "md" } as const;

export function Button({ variant = "outline", size, className = "", ...props }: Props) {
  const styles = `${VARIANTS[variant]} ${(size ?? DEFAULT_SIZE[variant]) === "md" ? "text-base" : "text-sm"}`;

  return (
    <button
      type="button"
      className={`flex h-[45px] w-full items-center justify-center gap-1.5 leading-normal ${styles} ${className}`}
      {...props}
    />
  );
}
