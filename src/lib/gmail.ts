import { gmail as createGmail } from "@googleapis/gmail";

export type MailSummary = {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
};

export async function listRecentMessages(accessToken: string, maxResults = 10) {
  const gmail = createGmail({
    version: "v1",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { data } = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    labelIds: ["INBOX"],
  });

  const messages = await Promise.all(
    (data.messages ?? []).map(async ({ id }) => {
      const { data: message } = await gmail.users.messages.get({
        userId: "me",
        id: id!,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      });
      const header = (name: string) =>
        message.payload?.headers?.find((h) => h.name === name)?.value ?? "";

      return {
        id: message.id!,
        threadId: message.threadId!,
        from: header("From"),
        subject: header("Subject") || "(제목 없음)",
        date: header("Date"),
        snippet: message.snippet ?? "",
      } satisfies MailSummary;
    }),
  );

  return messages;
}
