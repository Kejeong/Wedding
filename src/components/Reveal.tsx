"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

type Props = Omit<React.HTMLAttributes<HTMLElement>, "style"> & {
  children: React.ReactNode;
  /** 초 단위. 같은 섹션 안에서 0.32초씩 늘리면 순서대로 떠오른다 */
  delay?: number;
  /** 떠오르는 방향: up = 아래에서 위로, left = 왼쪽에서, right = 오른쪽에서 */
  from?: "up" | "left" | "right";
  as?: ElementType;
  className?: string;
};

/** 화면에 들어올 때 한 번만 14px 이동 + 페이드인 (스타일은 globals.css의 .reveal) */
export function Reveal({ children, delay = 0, from = "up", as: Tag = "div", className = "", ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      // 요소가 화면 아래쪽 10% 안으로 들어왔을 때 시작
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      {...rest}
      ref={ref}
      data-from={from}
      data-visible={visible || undefined}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
