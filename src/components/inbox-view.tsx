import { connection } from "next/server";
import { readInbox, type InboxEvent } from "@/lib/inbox";

const TIME_ZONE = "Asia/Seoul";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR", {
    timeZone: TIME_ZONE,
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    timeZone: TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function eventRange(event: InboxEvent) {
  const start = event.allDay ? formatDate(event.start) : formatDateTime(event.start);
  if (!event.end) return start;
  const end = event.allDay ? formatDate(event.end) : formatDateTime(event.end);
  return `${start} ~ ${end}`;
}

export async function InboxView() {
  await connection();
  const inbox = await readInbox();

  if (!inbox) {
    return (
      <section className="flex flex-col gap-2 rounded-2xl border border-dashed border-neutral-200 p-6 dark:border-neutral-800">
        <h2 className="text-lg font-semibold">아직 불러온 메일이 없습니다</h2>
        <p className="text-sm text-neutral-500">
          Claude 에서 <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-900">/fetch-mail</code>{" "}
          을 실행하면 Gmail 받은편지함과 일정이 여기에 표시됩니다.
        </p>
      </section>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = inbox.events
    .filter((event) => (event.end ?? event.start).slice(0, 10) >= today)
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">다가오는 일정</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-neutral-500">메일에서 찾은 일정이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {upcoming.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-1 rounded-2xl border-l-4 border-red-500 bg-neutral-50 p-4 dark:bg-neutral-900"
              >
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{eventRange(event)}</p>
                <p className="font-semibold">{event.title}</p>
                {event.note && <p className="text-sm text-neutral-500">{event.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">최근 메일</h2>
          <p className="text-xs text-neutral-400">
            {formatDateTime(inbox.fetchedAt)} 불러옴
          </p>
        </div>
        <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {inbox.messages.map((mail) => (
            <li key={mail.id}>
              <a
                href={mail.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-1 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-medium">{mail.from}</p>
                  <time dateTime={mail.date} className="shrink-0 text-xs text-neutral-400">
                    {formatDate(mail.date)}
                  </time>
                </div>
                <p className="truncate font-semibold">{mail.subject}</p>
                {mail.snippet && (
                  <p className="line-clamp-2 text-sm text-neutral-500">{mail.snippet}</p>
                )}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
