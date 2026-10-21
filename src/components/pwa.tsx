"use client";

import { useEffect, useSyncExternalStore } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(
      new URL("../lib/service-worker.js", import.meta.url),
      { scope: "/", updateViaCache: "none" },
    );
  }, []);

  return null;
}

function subscribe() {
  return () => {};
}

function getShowInstallHint() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  return isIOS && !isStandalone;
}

export function InstallHint() {
  const show = useSyncExternalStore(subscribe, getShowInstallHint, () => false);

  if (!show) return null;

  return (
    <p className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
      공유 버튼 → &quot;홈 화면에 추가&quot;로 앱처럼 설치할 수 있어요.
    </p>
  );
}
