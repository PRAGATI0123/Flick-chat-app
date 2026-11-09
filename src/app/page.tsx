import { MessagesSquare, Timer, Zap } from "lucide-react";
import { Suspense } from "react";
import { HeroArt } from "@/components/HeroArt";
import { Logo } from "@/components/Logo";
import { SessionEndedNote } from "@/components/SessionEndedNote";
import { StartForm } from "@/components/StartForm";

const FEATURES = [
  { icon: Zap, text: "Start in seconds" },
  { icon: MessagesSquare, text: "Rooms & DMs" },
  { icon: Timer, text: "Gone after 24h" },
];

export default function Home() {
  return (
    <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 py-10 md:px-8">
      {/* Soft colour blobs drifting in the background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 size-96 rounded-full bg-accent/25 blur-3xl motion-safe:animate-drift" />
        <div className="absolute -right-24 -bottom-40 size-[28rem] rounded-full bg-fuchsia-500/15 blur-3xl motion-safe:animate-drift motion-safe:[animation-delay:-7s]" />
        <div className="absolute top-1/3 left-1/2 size-72 rounded-full bg-sky-400/15 blur-3xl motion-safe:animate-drift motion-safe:[animation-delay:-14s]" />
      </div>

      <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* Left (on phones: top): what Flick is, and a picture of it */}
        <section className="flex flex-col items-center gap-6 text-center motion-safe:animate-fade-up lg:items-start lg:text-left">
          <Logo />
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Talk to anyone,{" "}
              <span className="bg-gradient-to-r from-accent via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
                right now.
              </span>
            </h1>
            <p className="max-w-md text-muted md:text-lg">
              No sign-up, no password. Pick a name, jump into a room or a DM, and start chatting.
            </p>
          </div>

          <ul className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-sm backdrop-blur"
              >
                <Icon className="size-4 text-accent" aria-hidden />
                {text}
              </li>
            ))}
          </ul>

          {/* The animated picture: only on wide screens, next to the form
              (phones and tablets go straight to the form) */}
          <div className="hidden w-full lg:flex">
            <HeroArt />
          </div>
        </section>

        {/* Right (on phones: below): the form */}
        <div className="flex w-full flex-col items-center gap-4 motion-safe:animate-fade-up motion-safe:[animation-delay:150ms] lg:items-end">
          {/* Reads the URL, so it sits in Suspense (the rest of the page can still be prerendered). */}
          <Suspense fallback={null}>
            <SessionEndedNote />
          </Suspense>

          <section className="w-full max-w-sm rounded-2xl border border-border bg-surface/90 p-6 shadow-xl shadow-accent/10 backdrop-blur md:p-8">
            <h2 className="text-xl font-semibold">Pick a username</h2>
            <p className="mt-1 text-sm text-muted">No password needed. Just choose a name to start chatting.</p>
            <StartForm />
          </section>

          <p className="max-w-sm text-center text-xs text-muted">
            Guest accounts and rooms are removed after 24 hours without activity.
          </p>
        </div>
      </div>
    </main>
  );
}
