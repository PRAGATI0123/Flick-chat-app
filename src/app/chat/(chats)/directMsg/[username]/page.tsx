import { Suspense } from "react";
import { DmChat } from "@/components/DmChat";
import { PageHeader } from "@/components/PageHeader";

export default function DirectMessagePage({ params }: PageProps<"/chat/directMsg/[username]">) {
  // params are only known at request time, so they're read inside Suspense.
  return (
    <Suspense fallback={<PageHeader title="Loading…" />}>
      <Conversation params={params} />
    </Suspense>
  );
}

async function Conversation({ params }: { params: Promise<{ username: string }> }) {
  const username = decodeURIComponent((await params).username);
  return <DmChat username={username} />;
}
