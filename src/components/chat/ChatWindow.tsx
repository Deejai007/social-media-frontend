import { useEffect, useRef, useState } from "react";
import { FiPaperclip, FiSend, FiSmile } from "react-icons/fi";
import { ChatMessage } from "redux/types/chat";

interface ChatWindowProps {
  messages: ChatMessage[];
  activeUserId: string | null;
  onSendMessage: (content: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  activeUserId,
  onSendMessage,
}) => {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !activeUserId) return;
    onSendMessage(trimmed);
    setInput("");
  };

  if (!activeUserId) {
    return (
      <section className="flex-1 flex flex-col items-center pt-20 bg-gradient-to-b from-pink-200/80 to-fuchsia-100/80">
        <p className="text-gray-500 text-lg">
          Select a conversation or search for someone to chat with.
        </p>
      </section>
    );
  }

  return (
    <section className="flex-1 flex flex-col bg-gradient-to-br from-pink-100/80 via-pink-200/80 to-fuchsia-100/80">
      <header className="px-6 py-4 border-b border-pink-200 flex items-center gap-4 bg-pink-100/80">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center text-white font-semibold">
          {activeUserId.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{activeUserId}</h3>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/80 to-pink-100/60">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {messages.length === 0 && (
            <p className="text-center text-xs text-gray-400">
              No messages yet. Say hello!
            </p>
          )}
          {messages.map((m, i) => {
            const fromMe = m.sender !== activeUserId;
            const time = m.timestamp
              ? new Date(m.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";
            return (
              <div
                key={i}
                className={`flex ${fromMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg p-3 text-sm leading-snug max-w-[70%] ${
                    fromMe
                      ? "bg-blue-400 text-white"
                      : "bg-white border border-pink-100"
                  }`}
                >
                  <div>{m.content}</div>
                  <div
                    className={`text-[11px] mt-1 ${
                      fromMe ? "text-white/80" : "text-gray-400"
                    }`}
                  >
                    {time}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-6 py-4 border-t border-pink-100 flex items-center gap-3 bg-pink-50/80"
      >
        <button
          type="button"
          className="p-2 rounded-md text-gray-600 hover:bg-pink-100"
        >
          <FiSmile />
        </button>
        <button
          type="button"
          className="p-2 rounded-md text-gray-600 hover:bg-pink-100"
        >
          <FiPaperclip />
        </button>
        <input
          className="flex-1 px-4 py-2 rounded-full border border-pink-100 bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-900"
          placeholder="Write a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full"
        >
          <FiSend />
        </button>
      </form>
    </section>
  );
};

export default ChatWindow;
