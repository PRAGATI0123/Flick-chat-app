import { MessagesSquare } from "lucide-react";
import type { CSSProperties } from "react";

/**
 * The picture on the start page: people around the Flick icon, chatting.
 * Made only with code (no image files), so it's light and fits light and dark mode.
 * Only decoration (aria-hidden). All animations use motion-safe:, so they're off for
 * people who turned animations off.
 *
 * Positions are in % of the square, measured from its centre (50%, 50%).
 */

/** The people, sitting on the two rings. `hue` = their colour. */
const PEOPLE = [
  { x: 50, y: 8, hue: 250, size: "size-16", delay: 0 },
  { x: 86, y: 30, hue: 330, size: "size-14", delay: -1.5 },
  { x: 84, y: 74, hue: 190, size: "size-16", delay: -3 },
  { x: 47, y: 92, hue: 30, size: "size-14", delay: -4.5 },
  { x: 13, y: 70, hue: 150, size: "size-16", delay: -2 },
  { x: 15, y: 28, hue: 280, size: "size-14", delay: -5 },
  { x: 71, y: 46, hue: 210, size: "size-11", delay: -1 },
  { x: 30, y: 52, hue: 0, size: "size-11", delay: -3.5 },
];

/** Little speech bubbles next to some people. */
const BUBBLES = [
  { x: 66, y: 9, text: "hey everyone 👋", tail: "rounded-bl-md", delay: 0.6 },
  { x: 94, y: 52, text: "coffee chat? ☕", tail: "rounded-tl-md", delay: 1.4 },
  { x: 56, y: 99, text: "haha so true 😂", tail: "rounded-tl-md", delay: 2.2 },
  { x: 5, y: 48, text: "hi! 🙌", tail: "rounded-tl-md", delay: 3 },
];

/** Emoji that float up now and then. */
const REACTIONS = [
  { x: 60, y: 82, emoji: "❤️", delay: 0 },
  { x: 38, y: 78, emoji: "👍", delay: 1.7 },
  { x: 68, y: 66, emoji: "😂", delay: 3.4 },
];

/** A simple person shape (head + shoulders), cut off by the round frame. */
function Person({ hue }: { hue: number }) {
  return (
    <span
      className="block size-full overflow-hidden rounded-full shadow-lg ring-4 ring-surface"
      style={{ background: `linear-gradient(135deg, hsl(${hue} 85% 68%), hsl(${hue + 35} 80% 52%))` }}
    >
      <svg viewBox="0 0 40 40" className="size-full">
        <circle cx="20" cy="16" r="7" fill="white" fillOpacity="0.92" />
        <path d="M5 40c1-9 7.5-14 15-14s14 5 15 14z" fill="white" fillOpacity="0.92" />
      </svg>
    </span>
  );
}

/** Puts something at (x%, y%) of the square, centred on that point. */
const at = (x: number, y: number): CSSProperties => ({ left: `${x}%`, top: `${y}%` });

export function HeroArt() {
  return (
    <div aria-hidden className="relative aspect-square w-full max-w-[380px] select-none">
      {/* Two dashed rings, turning slowly in opposite directions */}
      <div className="absolute inset-[8%] rounded-full border-2 border-dashed border-accent/30 motion-safe:animate-orbit" />
      <div className="absolute inset-[27%] rounded-full border-2 border-dashed border-fuchsia-500/30 motion-safe:animate-orbit-reverse" />

      {/* The Flick icon in the middle, with a glow pulsing out of it */}
      <div className="absolute inset-[39%]">
        <span className="absolute inset-0 rounded-full bg-accent/40 motion-safe:animate-halo" />
        <span className="absolute inset-0 rounded-full bg-fuchsia-500/30 motion-safe:animate-halo motion-safe:[animation-delay:1.5s]" />
        <span className="relative grid size-full place-items-center rounded-full bg-gradient-to-br from-accent to-fuchsia-500 text-white shadow-2xl shadow-accent/40">
          <MessagesSquare className="size-1/2" />
        </span>
      </div>

      {/* The people, gently floating */}
      {PEOPLE.map((person, i) => (
        <div
          key={i}
          className={`absolute -translate-x-1/2 -translate-y-1/2 ${person.size} motion-safe:animate-float`}
          style={{ ...at(person.x, person.y), animationDelay: `${person.delay}s` }}
        >
          <Person hue={person.hue} />
        </div>
      ))}

      {/* Speech bubbles: pop in one after another */}
      {BUBBLES.map((bubble) => (
        <div key={bubble.text} className="absolute -translate-y-1/2" style={at(bubble.x, bubble.y)}>
          <span
            className={`block rounded-2xl ${bubble.tail} border border-border bg-surface px-3 py-1.5 text-xs font-medium whitespace-nowrap shadow-lg motion-safe:animate-bubble-in`}
            style={{ animationDelay: `${bubble.delay}s` }}
          >
            {bubble.text}
          </span>
        </div>
      ))}

      {/* Reactions floating up */}
      {REACTIONS.map((reaction) => (
        <span
          key={reaction.emoji}
          className="absolute text-2xl opacity-0 motion-safe:animate-rise motion-reduce:hidden"
          style={{ ...at(reaction.x, reaction.y), animationDelay: `${reaction.delay}s` }}
        >
          {reaction.emoji}
        </span>
      ))}
    </div>
  );
}
