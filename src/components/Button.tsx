import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline" | "solid" };

export function Button({ variant = "outline", className = "", ...props }: Props) {
  const styles =
    variant === "solid"
      ? "bg-ink text-white disabled:bg-faint"
      : "border border-line bg-white text-ink";

  return (
    <button
      type="button"
      className={`flex h-[45px] w-full items-center justify-center gap-1.5 text-sm leading-normal ${styles} ${className}`}
      {...props}
    />
  );
}
