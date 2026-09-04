"use client";

import SystemPage from "@/components/SystemPage";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <SystemPage lang="en" retry={retry} />;
}
