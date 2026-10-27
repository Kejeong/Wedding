"use client";

import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { useToast } from "@/components/Toast";
import { accounts, type Account } from "@/data/wedding";
import { copyText } from "@/lib/clipboard";

function AccountGroup({ title, items }: { title: string; items: Account[] }) {
  const toast = useToast();

  async function copy(account: Account) {
    // 은행 앱 붙여넣기 호환을 위해 하이픈 없이 복사
    if (await copyText(`${account.bank} ${account.number.replaceAll("-", "")}`)) toast("계좌번호가 복사되었습니다");
  }

  return (
    <Reveal>
      <h3 className="text-base leading-normal font-semibold">{title}</h3>
      <ul className="bg-card mt-5 divide-y divide-line-light px-5 shadow-card">
        {items.map((account) => (
          <li key={account.number} className="flex items-end justify-between py-5">
            <div>
              <p className="text-sm leading-normal text-muted">{account.label}</p>
              <p className="mt-1.5 text-base leading-normal">
                {account.bank} {account.number}
              </p>
            </div>
            <button type="button" onClick={() => copy(account)} className="p-1 text-muted" aria-label={`${account.label} 계좌번호 복사`}>
              <CopyIcon />
            </button>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function Accounts() {
  return (
    <section className="mt-30">
      <SectionTitle title="WITH HEART" subtitle="전해주신 소중한 마음 감사히 간직하겠습니다" />
      <div className="mt-10 space-y-10 px-5">
        <AccountGroup title="신랑측 계좌번호" items={accounts.groom} />
        <AccountGroup title="신부측 계좌번호" items={accounts.bride} />
      </div>
    </section>
  );
}

export function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
    </svg>
  );
}
