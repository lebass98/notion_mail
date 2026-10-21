import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

// DB 없이 동작하는 stateless 모드: 세션과 Google 토큰은 암호화된 쿠키에 저장된다.
// 백그라운드 동기화가 필요해지면 database 설정을 추가해 토큰을 서버에 보관한다.
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: [GMAIL_READONLY_SCOPE],
      // refresh token 을 받기 위해 offline + consent 필요
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
  plugins: [nextCookies()],
});
