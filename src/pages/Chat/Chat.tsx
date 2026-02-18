import { useEffect, useRef, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "redux/store/store";

import ChatWindow from "components/chat/ChatWindow";

const conversations = [
  {
    id: 1,
    name: "Ava Johnson",
    last: "See you tomorrow!",
    time: "2:14 PM",
    unread: 2,
  },
  {
    id: 2,
    name: "Liam Smith",
    last: "Thanks — got it.",
    time: "Yesterday",
    unread: 0,
  },
  { id: 3, name: "Noah Lee", last: "Let's catch up.", time: "Mon", unread: 1 },
  {
    id: 4,
    name: "Sophia Gomez",
    last: "Love this! 😍",
    time: "Sun",
    unread: 0,
  },
];

const messages = [
  {
    id: 1,
    fromMe: false,
    text: "Hey! How's the project going?",
    time: "2:10 PM",
  },
  {
    id: 2,
    fromMe: true,
    text: "Pretty good — finishing up the UI today.",
    time: "2:11 PM",
  },
  {
    id: 3,
    fromMe: false,
    text: "Nice, can't wait to see it.",
    time: "2:12 PM",
  },
  { id: 4, fromMe: true, text: "I'll share a preview soon.", time: "2:13 PM" },
];

const Chat: React.FC = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const [search, setSearch] = useState("");
  const [idle, setIdle] = useState(true);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]); // Dummy users, replace with real data if needed

  function connectWS() {
    socketRef.current = new WebSocket(
      `http://localhost:7000/chat?userId=${user.user.id}`,
    );
    console.log("Connecting to WebSocket...");
    console.log("WebSocket instance:", socketRef.current);
    socketRef.current.onopen = () => {
      console.log("Connected");
    };
  }

  useEffect(() => {
    connectWS();
    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <main className=" absolute md:w-[75%] min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-fuchsia-600 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto rounded-3xl shadow-2xl overflow-hidden h-[85vh] flex backdrop-blur-md bg-white/10 border border-white/20">
        {/* Left: Conversations */}
        <aside className="w-80 border-r border-white/20 bg-gradient-to-b from-purple-600/80 to-pink-400/80 flex flex-col text-white">
          <div className="p-4 flex items-center gap-3">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button className="ml-auto bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
              <FiPlus />
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className="relative">
              <input
                className="w-full pl-10 pr-3 py-2 rounded-md bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-black"
                placeholder="Search people or messages"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
          </div>

          <nav className="px-2 overflow-y-auto hide-scrollbar">
            <ul className="space-y-2">
              {conversations.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 ml-auto">{c.time}</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{c.last}</p>
                  </div>
                  {c.unread > 0 && (
                    <div className="text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
                      {c.unread}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Center: Chat Window */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-400/80 via-pink-300/80 to-fuchsia-500/80">
          <ChatWindow messages={messages} />
        </div>

        {/* Right: Details */}
        {/* <aside className="w-80 border-l border-white/20 p-6 bg-gradient-to-b from-fuchsia-600/80 to-pink-400/80 hidden md:block text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center text-white font-semibold text-xl">
              AJ
            </div>
            <div>
              <h4 className="text-lg font-semibold">Ava Johnson</h4>
              <p className="text-sm text-gray-500">Photographer • New York</p>
            </div>
          </div>

          <div className="mt-6">
            <h5 className="text-sm font-semibold text-gray-600">About</h5>
            <p className="text-sm text-gray-500 mt-2">
              Loves photography, coffee, and design. Available for
              collaborations.
            </p>
          </div>

          <div className="mt-6">
            <h5 className="text-sm font-semibold text-gray-600">
              Shared Media
            </h5>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="w-full h-20 bg-gray-100 rounded-md" />
              <div className="w-full h-20 bg-gray-100 rounded-md" />
              <div className="w-full h-20 bg-gray-100 rounded-md" />
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full bg-red-50 text-red-600 border border-red-100 py-2 rounded-md">
              Block
            </button>
          </div>
        </aside> */}
      </div>
    </main>
  );
};

export default Chat;
