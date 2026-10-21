import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { listRecentMessages } from "@/lib/gmail";

export async function GET() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  // 만료된 토큰은 자동 갱신되고, 갱신된 계정 쿠키는 nextCookies 플러그인이 응답에 실어준다.
  let accessToken: string;
  try {
    ({ accessToken } = await auth.api.getAccessToken({
      body: { useAccountCookie: true },
      headers: requestHeaders,
    }));
  } catch (error) {
    console.error("Google 토큰 조회 실패", error);
    return Response.json({ error: "Google 계정을 다시 연결해 주세요." }, { status: 401 });
  }

  try {
    const messages = await listRecentMessages(accessToken);
    return Response.json({ messages });
  } catch (error) {
    console.error("Gmail API 호출 실패", error);
    return Response.json({ error: "메일을 불러오지 못했습니다." }, { status: 502 });
  }
}
