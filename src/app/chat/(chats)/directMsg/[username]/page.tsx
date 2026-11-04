import { Suspense } from "react";
import { Button } from "@/components/Button";
import { ChatView } from "@/components/ChatView";
import { PageHeader } from "@/components/PageHeader";
import { DM_MESSAGES, ME } from "@/lib/sample-data";

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

  return (
    <>
      <PageHeader
        title={`@${username}`}
        description="Direct message"
        action={<Button variant="secondary">Block</Button>}
      />
      {/* key: a different person means a fresh chat with their messages */}
      <ChatView key={username} initialMessages={DM_MESSAGES[username] ?? []} me={ME} placeholder={`Message @${username}…`} />
    </>
  );
}
