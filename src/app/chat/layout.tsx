import { Sidebar } from "@/components/Sidebar";

export default function ChatLayout({ children }: LayoutProps<"/chat">) {
  return (
    <div className="flex h-dvh flex-col md:flex-row">
      <Sidebar />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
