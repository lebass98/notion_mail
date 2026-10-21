"use client";

import { useEffect, useState } from "react";
import type { MailSummary } from "@/lib/gmail";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; messages: MailSummary[] };

export function GmailInbox() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let ignore = false;
    fetch("/api/gmail/messages")
      .then(async (res) => {
        const body = await res.json();
        if (ignore) return;
        setState(
          res.ok
            ? { status: "ready", messages: body.messages }
            : { status: "error", message: body.error ?? "메일을 불러오지 못했습니다." },
        );
      })
      .catch(() => !ignore && setState({ status: "error", message: "네트워크 오류가 발생했습니다." }));
    return () => {
      ignore = true;
    };
  }, []);

  if (state.status === "loading") {
    return <p className="text-sm text-neutral-500">메일 불러오는 중…</p>;
  }
  if (state.status === "error") {
    return <p className="text-sm text-red-500">{state.message}</p>;
  }
  if (state.messages.length === 0) {
    return <p className="text-sm text-neutral-500">받은편지함이 비어 있습니다.</p>;
  }

  return (
    <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
      {state.messages.map((mail) => (
        <li key={mail.id} className="flex flex-col gap-1 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-sm font-medium">{mail.from.replace(/<.*>/, "").trim()}</p>
            <time className="shrink-0 text-xs text-neutral-400">
              {mail.date && new Date(mail.date).toLocaleDateString("ko-KR")}
            </time>
          </div>
          <p className="truncate font-semibold">{mail.subject}</p>
          <p className="line-clamp-2 text-sm text-neutral-500">{mail.snippet}</p>
        </li>
      ))}
    </ul>
  );
}
