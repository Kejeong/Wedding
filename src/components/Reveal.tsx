"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

type Props = Omit<React.HTMLAttributes<HTMLElement>, "style"> & {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
};

// 화면에 들어온 요소들을 페이지 위→아래 순서로 줄 세워 STAGGER_MS 간격으로 하나씩 나타나게 한다.
// 요소마다 따로 지연을 주면 스크롤 속도에 따라 순서가 뒤섞이므로 페이지 전체가 하나의 줄을 공유한다.
const STAGGER_MS = 140;

type Item = { el: Element; show: () => void };
let queue: Item[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let lastShownAt = 0;

function flush() {
  if (timer || queue.length === 0) return;
  const wait = Math.max(0, lastShownAt + STAGGER_MS - performance.now());
  timer = setTimeout(() => {
    timer = null;
    queue.shift()?.show();
    lastShownAt = performance.now();
    flush();
  }, wait);
}

function enqueue(item: Item) {
  queue.push(item);
  queue.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  flush();
}

function dequeue(el: Element) {
  queue = queue.filter((item) => item.el !== el);
}

/** 화면에 들어오면 차례가 됐을 때 한 번만 살짝 떠오르며 나타난다 (스타일은 globals.css의 .reveal) */
export function Reveal({ children, as: Tag = "div", className = "", ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        enqueue({ el, show: () => setVisible(true) });
      },
      // 요소가 화면 아래쪽 10% 안으로 들어왔을 때 줄을 선다
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      dequeue(el);
    };
  }, []);

  return (
    <Tag {...rest} ref={ref} data-visible={visible || undefined} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
