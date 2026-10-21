import { connection } from "next/server";
import { listRecentMessages } from "@/lib/gmail";

export async function MailList() {
  await connection();

  let messages;
  try {
    messages = await listRecentMessages();
  } catch (error) {
    console.error("Gmail IMAP 조회 실패", error);
    return (
      <p className="text-sm text-red-500">
        메일을 불러오지 못했습니다. .env.local 의 GMAIL_USER / GMAIL_APP_PASSWORD 를 확인해 주세요.
      </p>
    );
  }

  if (messages.length === 0) {
    return <p className="text-sm text-neutral-500">받은편지함이 비어 있습니다.</p>;
  }

  return (
    <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
      {messages.map((mail) => (
        <li key={mail.uid} className="flex flex-col gap-1 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-sm font-medium">{mail.from}</p>
            {mail.date && (
              <time dateTime={mail.date} className="shrink-0 text-xs text-neutral-400">
                {new Date(mail.date).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })}
              </time>
            )}
          </div>
          <p className="truncate font-semibold">{mail.subject}</p>
          {mail.snippet && <p className="line-clamp-2 text-sm text-neutral-500">{mail.snippet}</p>}
        </li>
      ))}
    </ul>
  );
}
