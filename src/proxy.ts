import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// 본인 메일이 노출되는 앱이므로 배포 환경에서는 HTTP Basic 인증으로 막는다.
// APP_PASSWORD 가 없으면 개발 환경에서만 통과시킨다.
function isAuthorized(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  if (!password) return process.env.NODE_ENV !== "production";

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  const [, given = ""] = atob(header.slice(6)).split(":");
  const a = Buffer.from(given);
  const b = Buffer.from(password);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function proxy(request: NextRequest) {
  if (isAuthorized(request)) return NextResponse.next();

  return new NextResponse("인증이 필요합니다.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Mail Notion", charset="UTF-8"' },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icon-|apple-touch-icon).*)",
  ],
};
