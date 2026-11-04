import { MessageBox } from "./MessageBox";

type Message = { id: number; sender: string; body: string; time: string };

export function MessageList({ messages, me }: { messages: Message[]; me: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
      {messages.map((m) => (
        <MessageBox key={m.id} sender={m.sender} body={m.body} time={m.time} mine={m.sender === me} />
      ))}
    </div>
  );
}
