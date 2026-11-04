import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";
import { DM_CONVERSATIONS } from "@/lib/sample-data";

export default function DirectMessagesPage() {
  return (
    <>
      <PageHeader title="Direct messages" description="Your one-on-one conversations." />

      <div className="w-full max-w-2xl p-6">
        {DM_CONVERSATIONS.length === 0 ? (
          <StateView title="No conversations yet" description="Messages you send or receive will show up here." />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {DM_CONVERSATIONS.map((dm) => (
              <ListRow
                key={dm.username}
                href={`/chat/directMsg/${dm.username}`}
                icon={dm.username.charAt(0)}
                title={`@${dm.username}`}
                subtitle={`${dm.last_message} · ${dm.time}`}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
