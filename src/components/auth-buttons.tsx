"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  return (
    <button
      type="button"
      onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
      className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      Google 계정으로 로그인
    </button>
  );
}

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.refresh();
      }}
      className="text-sm text-neutral-500 underline-offset-4 hover:underline"
    >
      로그아웃
    </button>
  );
}
