import { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "redux/store/store";
import {
  setConnected,
  receiveMessage,
  sendMessageLocal,
  addOrUpdateConversation,
} from "redux/reducers/chatReducer";
import { ChatMessage } from "redux/types/chat";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:5679";

export function useWebSocket(userId: string | number | null | undefined) {
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = new WebSocket(`${WS_URL}/chat?userId=${userId}`);
    socketRef.current = socket;

    socket.onopen = () => {
      dispatch(setConnected(true));
    };

    socket.onclose = () => {
      dispatch(setConnected(false));
    };

    socket.onerror = () => {
      dispatch(setConnected(false));
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const msg: ChatMessage = JSON.parse(event.data);
        dispatch(receiveMessage(msg));
      } catch {
        console.warn("Failed to parse WebSocket message:", event.data);
      }
    };

    return () => {
      socket.close();
      dispatch(setConnected(false));
    };
  }, [userId, dispatch]);

  const sendMessage = useCallback(
    (
      receiver: string,
      content: string,
      messageType: ChatMessage["messageType"] = "CHAT",
    ) => {
      const socket = socketRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket is not open. Cannot send message.");
        return;
      }

      const payload = { receiver, content, messageType };
      socket.send(JSON.stringify(payload));

      // Optimistic local update
      dispatch(
        sendMessageLocal({
          sender: String(userId),
          receiver,
          content,
          messageType,
          timestamp: new Date().toISOString(),
        }),
      );

      // Ensure conversation exists in the sidebar
      dispatch(
        addOrUpdateConversation({ userId: receiver, displayName: receiver }),
      );
    },
    [userId, dispatch],
  );

  return { sendMessage };
}
