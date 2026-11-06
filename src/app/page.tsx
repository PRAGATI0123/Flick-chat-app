import { Suspense } from "react";
import { Logo } from "@/components/Logo";
import { SessionEndedNote } from "@/components/SessionEndedNote";
import { StartForm } from "@/components/StartForm";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
      <Logo />

      {/* Reads the URL, so it sits in Suspense (the rest of the page can still be prerendered). */}
      <Suspense fallback={null}>
        <SessionEndedNote />
      </Suspense>

      <section className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6">
        <h1 className="text-xl font-semibold">Pick a username</h1>
        <p className="mt-1 text-sm text-muted">No password needed. Just choose a name to start chatting.</p>
        <StartForm />
      </section>

      <p className="max-w-sm text-center text-xs text-muted">
        Guest accounts and rooms are removed after 24 hours without activity.
      </p>
    </main>
  );
}
