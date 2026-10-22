import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

// data/inbox.json 은 Claude 가 /fetch-mail 스킬로 Gmail 커넥터에서 불러와 저장한다.
export const INBOX_FILE = path.join(process.cwd(), "data", "inbox.json");

export type InboxMessage = {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  /** ISO 8601 */
  date: string;
  snippet: string;
  url?: string;
};

export type InboxEvent = {
  id: string;
  title: string;
  /** YYYY-MM-DD 또는 ISO 8601 */
  start: string;
  end?: string;
  allDay?: boolean;
  note?: string;
  sourceMessageId?: string;
};

export type Inbox = {
  fetchedAt: string;
  query?: string;
  messages: InboxMessage[];
  events: InboxEvent[];
};

export async function readInbox(): Promise<Inbox | null> {
  try {
    const inbox = JSON.parse(await readFile(INBOX_FILE, "utf8")) as Inbox;
    return { ...inbox, messages: inbox.messages ?? [], events: inbox.events ?? [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
