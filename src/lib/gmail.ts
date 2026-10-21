import "server-only";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

export type MailSummary = {
  uid: number;
  threadId?: string;
  from: string;
  subject: string;
  date?: string;
  snippet: string;
};

function createClient() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD 환경 변수가 필요합니다.");
  }

  return new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    // 앱 비밀번호는 공백 포함으로 발급되지만 IMAP 로그인에는 공백 없이 사용
    auth: { user, pass: pass.replace(/\s+/g, "") },
    logger: false,
  });
}

async function toSnippet(source?: Buffer) {
  if (!source) return "";
  try {
    const parsed = await simpleParser(source);
    return (parsed.text ?? "").replace(/\s+/g, " ").trim().slice(0, 200);
  } catch {
    return "";
  }
}

/** 받은편지함의 최신 메일을 최신순으로 가져온다. */
export async function listRecentMessages(limit = 10): Promise<MailSummary[]> {
  const client = createClient();
  await client.connect();

  try {
    const lock = await client.getMailboxLock("INBOX", { readOnly: true });
    try {
      const total = client.mailbox ? client.mailbox.exists : 0;
      if (total === 0) return [];

      const messages = await client.fetchAll(`${Math.max(1, total - limit + 1)}:*`, {
        uid: true,
        envelope: true,
        threadId: true,
        // 미리보기용으로 본문 앞부분만 받는다
        source: { maxLength: 16 * 1024 },
      });

      const summaries = await Promise.all(
        messages.map(async (message) => {
          const sender = message.envelope?.from?.[0];
          const date = message.envelope?.date;
          return {
            uid: message.uid,
            threadId: message.threadId,
            from: sender?.name || sender?.address || "(알 수 없음)",
            subject: message.envelope?.subject || "(제목 없음)",
            date: date ? new Date(date).toISOString() : undefined,
            snippet: await toSnippet(message.source),
          } satisfies MailSummary;
        }),
      );

      return summaries.reverse();
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
}
