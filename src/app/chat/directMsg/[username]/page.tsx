import { Suspense } from "react";
import { Button } from "@/components/Button";
import { Composer } from "@/components/Composer";
import { MessageList } from "@/components/MessageList";
import { PageHeader } from "@/components/PageHeader";
import { DM_MESSAGES, ME } from "@/lib/sample-data";

export default function DirectMessagePage({ params }: PageProps<"/chat/directMsg/[username]">) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* params are only known at request time, so they're read inside Suspense. */}
      <Suspense fallback={<PageHeader title="Loading…" />}>
        <DmHeader params={params} />
      </Suspense>
      <MessageList messages={DM_MESSAGES} me={ME} />
      <Composer />
    </div>
  );
}

async function DmHeader({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  return (
    <PageHeader
      title={`@${decodeURIComponent(username)}`}
      description="Direct message"
      action={<Button variant="secondary">Block</Button>}
    />
  );
}
