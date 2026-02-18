import { useState } from "react";
import { FiPaperclip, FiSend, FiSmile, FiSearch } from "react-icons/fi";

interface Message {
  id: number;
  fromMe: boolean;
  text: string;
  time: string;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const [idle, setIdle] = useState(true);
  const [search, setSearch] = useState("");
  // Dummy user search results
  const users = [
    { id: 1, name: "Ava Johnson" },
    { id: 2, name: "Liam Smith" },
    { id: 3, name: "Noah Lee" },
    { id: 4, name: "Sophia Gomez" },
  ];

  if (idle) {
    return (
      <section className="flex-1 flex flex-col items-center pt-20  bg-gradient-to-b from-fuchsia-800/80 to-pink-600/80 ">
        <button
          className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-blue-600 transition mb-8 "
          onClick={() => setIdle(false)}
        >
          Start a new chat
        </button>
        {/* <div className="w-full max-w-xs">
          <div className="relative">
            <input
              className="w-full pl-10 pr-3 py-2 rounded-md bg-pink-300 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-black"
              placeholder="Search users to chat"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearch(search)}
            />
            <span className="absolute left-3 top-2 text-gray-400">
              <FiSearch />
            </span>
          </div>
          {search && (
            <ul className="mt-2 bg-white border border-gray-200 rounded-md shadow divide-y divide-gray-100">
              {users.filter((u) =>
                u.name.toLowerCase().includes(search.toLowerCase()),
              ).length === 0 ? (
                <li className="p-3 text-gray-500 text-sm">No users found</li>
              ) : (
                users
                  .filter((u) =>
                    u.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((u) => (
                    <li
                      key={u.id}
                      className="p-3 hover:bg-blue-50 cursor-pointer"
                      onClick={() => setIdle(false)}
                    >
                      {u.name}
                    </li>
                  ))
              )}
            </ul>
          )}
        </div> */}
      </section>
    );
  }

  return (
    <section className="flex-1 flex flex-col">
      <header className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white font-semibold">
          AJ
        </div>
        <div>
          <h3 className="font-semibold">Ava Johnson</h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>
        <div className="ml-auto text-sm text-gray-400">Last seen 2h ago</div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          <div className="text-center text-xs text-gray-400">
            Today • 2:00 PM
          </div>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg p-3 text-sm leading-snug max-w-[70%] ${
                  m.fromMe
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div>{m.text}</div>
                <div
                  className={`text-[11px] mt-1 ${
                    m.fromMe ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}
          <div className="text-center text-xs text-gray-400">
            — End of conversation —
          </div>
        </div>
      </div>

      <form className="px-6 py-4 border-t border-gray-200 flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <FiSmile />
        </button>
        <button
          type="button"
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <FiPaperclip />
        </button>
        <input
          className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Write a message..."
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
        >
          <FiSend />
        </button>
      </form>
    </section>
  );
};

export default ChatWindow;
