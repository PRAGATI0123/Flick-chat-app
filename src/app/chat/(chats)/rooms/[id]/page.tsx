import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RoomChat } from "@/components/RoomChat";

export default function RoomPage({ params }: PageProps<"/chat/rooms/[id]">) {
  // params are only known at request time, so they're read inside Suspense.
  return (
    <Suspense fallback={<PageHeader title="Loading…" />}>
      <Room params={params} />
    </Suspense>
  );
}

async function Room({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RoomChat id={id} />;
}
