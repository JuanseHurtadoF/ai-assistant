import { Chat } from "@/components/sections/chat";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-24 gap-4 bg-slate-100">
      <Chat />
    </main>
  );
}