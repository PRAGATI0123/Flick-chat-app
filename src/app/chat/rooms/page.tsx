import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { ROOMS } from "@/lib/sample-data";

export default function RoomsPage() {
  return (
    <>
      <PageHeader title="Rooms" description="Join a room or create your own." />

      <div className="flex w-full max-w-2xl flex-col gap-6 p-6">
        <form className="flex gap-2">
          <Input prefix="#" name="name" placeholder="New room name" className="flex-1" />
          <Button type="submit">Create</Button>
        </form>

        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {ROOMS.map((room) => (
            <ListRow
              key={room.id}
              href={`/chat/rooms/${room.id}`}
              title={room.name}
              subtitle={`Created by @${room.created_by}`}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
