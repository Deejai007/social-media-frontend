import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "redux/store/store";
import { debounceSearchUsers } from "redux/actions/userActions";
import {
  setActiveConversation,
  addOrUpdateConversation,
} from "redux/reducers/chatReducer";
import { useWebSocket } from "utils/useWebSocket";

import ChatWindow from "components/chat/ChatWindow";

const Chat: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const { connected, conversations, messages, activeConversation } =
    useSelector((state: RootState) => state.chat);

  const { sendMessage } = useWebSocket(user.user?.id);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchResults = useSelector((state: RootState) => state.user.followList);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(debounceSearchUsers(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

  const handleSelectUser = (userId: string, displayName: string) => {
    dispatch(addOrUpdateConversation({ userId, displayName }));
    dispatch(setActiveConversation(userId));
    setQuery("");
  };

  const activeMessages = activeConversation ? (messages[activeConversation] ?? []) : [];

  return (
    <main className="absolute md:w-[75%] min-h-screen bg-gradient-to-br from-purple-300 via-pink-400 to-fuchsia-100 p-6 transition-colors duration-300">
      {/* Connection status marker */}
      <div className="absolute top-6 left-8 z-50 flex items-center gap-2">
        <span
          className={`inline-block w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-gray-400"}`}
        ></span>
        <span className={`text-xs font-semibold ${connected ? "text-green-700" : "text-gray-500"}`}>
          {connected ? "Online" : "Offline"}
        </span>
      </div>

      <div className="max-w-7xl mx-auto rounded-3xl shadow-2xl overflow-hidden h-[85vh] flex backdrop-blur-md bg-white/10 border border-white/20">
        {/* Left: Conversations */}
        <aside className="w-80 border-r border-white/20 bg-gradient-to-b from-pink-600/20 to-blue-400/40 flex flex-col text-white">
          <div className="p-4 flex items-center gap-3">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button className="ml-auto bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
              <FiPlus />
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className="relative">
              <input
                className="w-full pl-10 pr-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-black"
                placeholder="Search people to start a chat..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="absolute left-3 top-2 text-gray-400">
                <FiSearch />
              </span>
            </div>

            {query.length > 0 && (
              <ul className="ml-4 mt-2 rounded-md divide-y divide-gray-100">
                {searchResults.length === 0 ? (
                  <li className="p-3 text-sm">No users found</li>
                ) : (
                  searchResults.map((u: any) => (
                    <li
                      key={u.id}
                      className="p-3 hover:bg-blue-500 cursor-pointer"
                      onClick={() => handleSelectUser(String(u.id), u.username ?? u.firstName ?? String(u.id))}
                    >
                      {u.username ?? u.firstName}
                    </li>
                  ))
                )}
              </ul>
            )}

            <nav className="px-2 overflow-y-auto hide-scrollbar mt-2">
              <ul className="space-y-2">
                {conversations.map((c) => (
                  <li
                    key={c.userId}
                    className={`flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:shadow-sm cursor-pointer transition-colors ${
                      activeConversation === c.userId ? "bg-white/20" : ""
                    }`}
                    onClick={() => dispatch(setActiveConversation(c.userId))}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                      {c.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{c.displayName}</p>
                        <p className="text-xs text-gray-400 ml-auto">{c.lastTime}</p>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{c.lastMessage}</p>
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
          </div>
        </aside>

        {/* Center: Chat Window */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-400/80 via-pink-300/80 to-fuchsia-500/80">
          <ChatWindow
            messages={activeMessages}
            activeUserId={activeConversation}
            onSendMessage={(content) => {
              if (activeConversation) sendMessage(activeConversation, content);
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default Chat;
