import { redirect } from "next/navigation";

// "/chat" on its own has nothing to show, so send people to the rooms list.
export default function ChatIndex() {
  redirect("/chat/rooms");
}
