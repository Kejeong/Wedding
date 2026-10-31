"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { CloseIcon, Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { useToast } from "@/components/Toast";
import { createEntrySchema, passwordSchema, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";

const PREVIEW_COUNT = 3;
const inputClass =
  "block w-full border border-line bg-transparent px-4 py-3 text-sm leading-normal text-ink placeholder:text-muted focus:border-ink focus:outline-none aria-invalid:border-danger";

type ModalState = { type: "write" } | { type: "all" } | { type: "delete"; entry: GuestbookEntry } | null;

async function fetchEntries(limit: number): Promise<GuestbookPage> {
  const res = await fetch(`/api/guestbook?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("load failed");
  return res.json();
}

function Note({ entry, clamp, onDelete }: { entry: GuestbookEntry; clamp: boolean; onDelete: () => void }) {
  return (
    <li className={`relative flex flex-col justify-between bg-white p-5 shadow-note ${clamp ? "h-[130px]" : "min-h-[130px]"}`}>
      <p className={`pr-5 text-sm leading-normal whitespace-pre-line break-all ${clamp ? "line-clamp-3" : ""}`}>
        {entry.message}
      </p>
      <p className="mt-2 text-xs leading-normal">
        <span className="font-display text-muted">From</span>
        <span className="ml-1.5 text-muted">{entry.name}</span>
      </p>
      <button type="button" onClick={onDelete} className="absolute top-2.5 right-2.5 p-0.5 text-muted" aria-label="메시지 삭제">
        <CloseIcon />
      </button>
    </li>
  );
}

// 피그마 스크롤바: 모달 오른쪽 끝에 붙은 4x100px 막대, 제목 아래(모달 위에서 101px)부터 모달 아래 끝까지 움직인다
const THUMB_TOP = 101;
const THUMB_HEIGHT = 100;

/** 기본 스크롤바는 숨기고 디자인대로 그린 막대를 스크롤 위치에 맞춰 움직인다. 부모(Modal 안쪽 div)가 relative여야 한다 */
function ScrollList({ children }: { children: React.ReactNode }) {
  const list = useRef<HTMLUListElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);

  const sync = useCallback(() => {
    const el = list.current;
    const bar = thumb.current;
    if (!el || !bar) return;
    const scrollable = el.scrollHeight > el.clientHeight + 1;
    bar.style.display = scrollable ? "block" : "none";
    if (!scrollable) return;
    const track = el.offsetTop + el.offsetHeight - THUMB_TOP - THUMB_HEIGHT;
    const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
    bar.style.transform = `translateY(${progress * track}px)`;
  }, []);

  // 목록 내용(불러온 메시지)이나 화면 높이가 바뀌면 다시 맞춘다
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    sync();
    return () => observer.disconnect();
  });

  return (
    <>
      <ul
        ref={list}
        onScroll={sync}
        className="no-scrollbar -mr-5 -mb-10 mt-10 h-[389px] max-h-[calc(100dvh-240px)] space-y-2.5 overflow-y-auto pr-5 pb-5"
      >
        {children}
      </ul>
      <span
        ref={thumb}
        aria-hidden
        className="pointer-events-none absolute right-0 hidden w-1 bg-line"
        style={{ top: THUMB_TOP, height: THUMB_HEIGHT }}
      />
    </>
  );
}

function WriteForm({ onDone }: { onDone: (entry: GuestbookEntry) => void }) {
  const [form, setForm] = useState({ name: "", message: "", password: "" });
  const [touched, setTouched] = useState({ name: false, message: false, password: false });
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 피그마 '기입오류': 입력을 마친(blur) 칸이 규칙에 안 맞으면 테두리를 빨갛게 하고 안내 문구를 띄운다
  const invalid = {
    name: touched.name && !form.name.trim(),
    message: touched.message && !form.message.trim(),
    password: touched.password && !passwordSchema.safeParse(form.password).success,
  };
  const hasInvalid = invalid.name || invalid.message || invalid.password;
  const error = serverError ?? (hasInvalid ? "정보를 올바르게 입력해주세요" : null);
  const valid = createEntrySchema.safeParse(form).success;

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      "aria-invalid": invalid[key] || !!serverError,
      onBlur: () => setTouched((t) => ({ ...t, [key]: true })),
    };
  }

  function update(key: keyof typeof form, value: string) {
    setServerError(null);
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;

    setSubmitting(true);
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => null);
    setSubmitting(false);

    if (!res?.ok) return setServerError((await res?.json().catch(() => null))?.error ?? "잠시 후 다시 시도해주세요");
    onDone(await res.json());
  }

  return (
    <form onSubmit={submit} className="mt-10" noValidate>
      <div className="space-y-2.5">
        <input
          className={inputClass}
          placeholder="이름을 입력해 주세요"
          aria-label="이름"
          maxLength={20}
          {...field("name")}
          onChange={(e) => update("name", e.target.value)}
        />
        <textarea
          className={`${inputClass} h-[150px] resize-none`}
          placeholder="축하의 말을 남겨 주세요"
          aria-label="축하 메시지"
          maxLength={500}
          {...field("message")}
          onChange={(e) => update("message", e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="비밀번호를 입력해 주세요 (숫자 4자리)"
          aria-label="비밀번호 (숫자 4자리)"
          type="password"
          inputMode="numeric"
          maxLength={4}
          {...field("password")}
          onChange={(e) => update("password", e.target.value.replace(/\D/g, ""))}
        />
      </div>
      <p role="alert" className="mt-1.5 h-[18px] text-xs leading-normal text-danger">
        {error}
      </p>
      <Button type="submit" variant="solid" className="mt-4" disabled={!valid || submitting}>
        작성 완료
      </Button>
    </form>
  );
}

function DeleteForm({ entry, onDone }: { entry: GuestbookEntry; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordSchema.safeParse(password).success) return setError("비밀번호를 올바르게 입력해주세요");

    setSubmitting(true);
    const res = await fetch(`/api/guestbook/${entry.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    setSubmitting(false);

    if (!res?.ok) return setError((await res?.json().catch(() => null))?.error ?? "잠시 후 다시 시도해주세요");
    onDone();
  }

  return (
    <form onSubmit={submit} noValidate>
      <header className="text-center">
        <h2 className="text-base leading-normal font-semibold">방명록 삭제</h2>
        <p className="mt-1.5 text-sm leading-normal text-body">비밀번호를 입력하세요</p>
      </header>
      <input
        className={`${inputClass} mt-5`}
        placeholder="비밀번호를 입력해 주세요 (숫자 4자리)"
        type="password"
        inputMode="numeric"
        maxLength={4}
        autoFocus
        value={password}
        aria-invalid={!!error}
        onChange={(e) => setPassword(e.target.value.replace(/\D/g, ""))}
      />
      <p className="mt-1.5 h-[18px] text-xs leading-normal text-danger">{error}</p>
      <Button type="submit" variant="solid" className="mt-1.5" disabled={password.length !== 4 || submitting}>
        삭제하기
      </Button>
    </form>
  );
}

export function Guestbook() {
  const toast = useToast();
  const [preview, setPreview] = useState<GuestbookPage | null>(null);
  const [all, setAll] = useState<GuestbookEntry[] | null>(null);
  const [allFailed, setAllFailed] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const close = useCallback(() => setModal(null), []);

  const reload = useCallback(() => {
    fetchEntries(PREVIEW_COUNT).then(setPreview, () => toast("방명록을 불러오지 못했습니다"));
  }, [toast]);

  useEffect(reload, [reload]);

  // TODO: 메시지가 많아지면 offset 기반 무한 스크롤로 전환
  function openAll() {
    setAll(null);
    setAllFailed(false);
    setModal({ type: "all" });
    fetchEntries(100).then((page) => setAll(page.entries), () => setAllFailed(true));
  }

  const subtitle = (
    <header className="text-center">
      {/* 글꼴이 섞이면 줄 높이가 늘어나서 높이를 피그마 값(30px)으로 고정 */}
      <h2 className="h-[30px] text-[30px] leading-none">
        <span className="font-script">M</span>
        <span className="font-display">ESSAGE</span>
      </h2>
      <p className="mt-2.5 text-sm leading-normal text-body">저희 둘의 결혼을 함께 축하해주세요</p>
    </header>
  );

  return (
    <section className="mt-30">
      <SectionTitle title="MESSAGE" subtitle="따뜻한 축하의 한마디를 남겨주세요" />

      <Reveal as="ul" className="mt-10 space-y-2.5 px-5">
        {preview?.entries.map((entry) => (
          <Note key={entry.id} entry={entry} clamp onDelete={() => setModal({ type: "delete", entry })} />
        ))}
        {preview && preview.entries.length === 0 && (
          <li className="py-10 text-center text-sm text-muted">첫 번째 축하 메시지를 남겨주세요</li>
        )}
      </Reveal>

      <Reveal className="mt-10 space-y-2.5 px-5">
        <Button variant="line" onClick={openAll}>
          전체 보기
        </Button>
        <Button variant="solid" size="md" onClick={() => setModal({ type: "write" })}>
          메시지 남기기
        </Button>
      </Reveal>

      <Modal open={modal?.type === "write"} onClose={close}>
        {subtitle}
        {modal?.type === "write" && (
          <WriteForm
            onDone={() => {
              close();
              reload();
              toast("메시지가 등록되었습니다");
            }}
          />
        )}
      </Modal>

      <Modal open={modal?.type === "all"} onClose={close}>
        {subtitle}
        {/* 피그마 전체보기: 모달 높이 524px 고정, 목록(389px)은 모달 아래 끝까지 이어지며 스크롤된다 */}
        <ScrollList>
          {all === null && (
            <li className="py-10 text-center text-sm text-muted">{allFailed ? "방명록을 불러오지 못했습니다" : "불러오는 중…"}</li>
          )}
          {all?.length === 0 && <li className="py-10 text-center text-sm text-muted">아직 남겨진 메시지가 없어요</li>}
          {all?.map((entry) => (
            <Note key={entry.id} entry={entry} clamp={false} onDelete={() => setModal({ type: "delete", entry })} />
          ))}
        </ScrollList>
      </Modal>

      <Modal open={modal?.type === "delete"} onClose={close}>
        {modal?.type === "delete" && (
          <DeleteForm
            key={modal.entry.id}
            entry={modal.entry}
            onDone={() => {
              close();
              setAll((prev) => prev?.filter((e) => e.id !== modal.entry.id) ?? null);
              reload();
              toast("메시지가 삭제되었습니다");
            }}
          />
        )}
      </Modal>
    </section>
  );
}
