import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Compliance Assistant
        </h1>
        <p className="text-center mb-8 text-gray-600">
          Ask questions about supplier risks and compliance information
        </p>
        <Chat />
      </div>
    </main>
  );
}
