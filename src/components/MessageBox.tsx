type MessageBoxProps = {
  sender: string;
  body: string;
  time: string;
  mine?: boolean;
};

export function MessageBox({ sender, body, time, mine = false }: MessageBoxProps) {
  return (
    <div className={`flex flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>
      <span className="text-xs text-muted">
        {mine ? "You" : `@${sender}`} · {time}
      </span>
      <p
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
          mine ? "bg-accent text-white" : "border border-border bg-surface"
        }`}
      >
        {body}
      </p>
    </div>
  );
}
