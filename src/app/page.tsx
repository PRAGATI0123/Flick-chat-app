import Link from "next/link";
import { Input } from "@/components/Input";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
      <Logo />

      <section className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6">
        <h1 className="text-xl font-semibold">Pick a username</h1>
        <p className="mt-1 text-sm text-muted">No password needed. Just choose a name to start chatting.</p>

        <form className="mt-5 flex flex-col gap-3">
          <Input prefix="@" name="username" placeholder="cool_panda_42" autoComplete="off" />
          <Link
            href="/chat/rooms"
            className="flex h-10 items-center justify-center rounded-lg bg-accent text-sm font-medium text-white hover:opacity-90"
          >
            Start chatting
          </Link>
        </form>
      </section>
    </main>
  );
}
