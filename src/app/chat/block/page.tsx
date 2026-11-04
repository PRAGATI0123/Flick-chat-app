import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";
import { BLOCKED_USERS } from "@/lib/sample-data";

export default function BlockedUsersPage() {
  return (
    <>
      <PageHeader title="Blocked users" description="You won't see messages from these users." />

      <div className="w-full max-w-2xl p-6">
        {BLOCKED_USERS.length === 0 ? (
          <StateView title="No blocked users" description="People you block will appear here." />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {BLOCKED_USERS.map((user) => (
              <li key={user.username} className="flex items-center gap-3 px-4 py-3">
                <span className="grid size-9 place-items-center rounded-lg bg-surface-muted font-medium uppercase text-muted">
                  {user.username.charAt(0)}
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-medium">@{user.username}</span>
                  <span className="text-sm text-muted">Blocked {user.blocked_at}</span>
                </span>
                <Button variant="secondary">Unblock</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
