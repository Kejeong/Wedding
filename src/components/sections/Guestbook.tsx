"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { CloseIcon, Modal } from "@/components/Modal";
import { SectionTitle } from "@/components/SectionTitle";
import { useToast } from "@/components/Toast";
import { createEntrySchema, passwordSchema, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";

const PREVIEW_COUNT = 3;
const inputClass =
  "w-full border border-line bg-white px-[17px] py-[13px] text-sm leading-normal placeholder:text-faint aria-invalid:border-red-400 focus:border-ink focus:outline-none";

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

function WriteForm({ onDone }: { onDone: (entry: GuestbookEntry) => void }) {
  const [form, setForm] = useState({ name: "", message: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const filled = form.name.trim() && form.message.trim() && form.password.length > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!createEntrySchema.safeParse(form).success) return setError("정보를 올바르게 입력해주세요");

    setSubmitting(true);
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => null);
    setSubmitting(false);

    if (!res?.ok) return setError((await res?.json().catch(() => null))?.error ?? "잠시 후 다시 시도해주세요");
    onDone(await res.json());
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-2.5 px-5" noValidate>
      <input
        className={inputClass}
        placeholder="이름을 입력해 주세요"
        maxLength={20}
        value={form.name}
        aria-invalid={!!error}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <textarea
        className={`${inputClass} h-[150px] resize-none`}
        placeholder="축하의 말을 남겨 주세요"
        maxLength={500}
        value={form.message}
        aria-invalid={!!error}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <input
        className={inputClass}
        placeholder="비밀번호를 입력해 주세요 (숫자 4자리)"
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={form.password}
        aria-invalid={!!error}
        onChange={(e) => setForm({ ...form, password: e.target.value.replace(/\D/g, "") })}
      />
      <p className="h-[18px] text-xs leading-normal text-red-500">{error}</p>
      <Button type="submit" variant="solid" disabled={!filled || submitting}>
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
    <form onSubmit={submit} className="px-5 pb-5" noValidate>
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
      <p className="mt-1.5 h-[18px] text-xs leading-normal text-red-500">{error}</p>
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
  const [modal, setModal] = useState<ModalState>(null);
  const close = useCallback(() => setModal(null), []);

  const reload = useCallback(() => {
    fetchEntries(PREVIEW_COUNT).then(setPreview, () => toast("방명록을 불러오지 못했습니다"));
  }, [toast]);

  useEffect(reload, [reload]);

  // TODO: 메시지가 많아지면 offset 기반 무한 스크롤로 전환
  function openAll() {
    setModal({ type: "all" });
    fetchEntries(100).then((page) => setAll(page.entries), () => toast("방명록을 불러오지 못했습니다"));
  }

  const subtitle = (
    <header className="text-center">
      <h2 className="text-[30px] leading-none">
        <span className="font-script">M</span>
        <span className="font-display">ESSAGE</span>
      </h2>
      <p className="mt-2.5 text-sm leading-normal text-body">저희 둘의 결혼을 함께 축하해주세요</p>
    </header>
  );

  return (
    <section className="mt-30">
      <SectionTitle title="MESSAGE" subtitle="따뜻한 축하의 한마디를 남겨주세요" />

      <ul className="mt-10 space-y-2.5 px-5">
        {preview?.entries.map((entry) => (
          <Note key={entry.id} entry={entry} clamp onDelete={() => setModal({ type: "delete", entry })} />
        ))}
        {preview && preview.entries.length === 0 && (
          <li className="py-10 text-center text-sm text-muted">첫 번째 축하 메시지를 남겨주세요</li>
        )}
      </ul>

      <div className="mt-10 space-y-2.5 px-5">
        {preview && preview.total > PREVIEW_COUNT && <Button onClick={openAll}>전체 보기</Button>}
        <Button variant="solid" onClick={() => setModal({ type: "write" })}>
          메시지 남기기
        </Button>
      </div>

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
        <ul className="mt-10 max-h-[60dvh] space-y-2.5 overflow-y-auto px-5 pb-5">
          {all?.map((entry) => (
            <Note key={entry.id} entry={entry} clamp={false} onDelete={() => setModal({ type: "delete", entry })} />
          ))}
        </ul>
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
