import { InstallHint } from "@/components/pwa";

const sources = [
  { name: "Gmail", desc: "메일에서 일정 추출", color: "bg-red-500" },
  {
    name: "Notion",
    desc: "데이터베이스와 일정 동기화",
    color: "bg-neutral-900 dark:bg-neutral-100",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Mail Notion</h1>
        <p className="text-neutral-500">Gmail · Notion 연동 스케줄러</p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {sources.map((source) => (
          <li
            key={source.name}
            className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <span className={`h-10 w-10 shrink-0 rounded-xl ${source.color}`} />
            <div className="flex-1">
              <p className="font-semibold">{source.name}</p>
              <p className="text-sm text-neutral-500">{source.desc}</p>
            </div>
            <span className="text-xs font-medium text-neutral-400">연결 예정</span>
          </li>
        ))}
      </ul>

      <InstallHint />
    </main>
  );
}
