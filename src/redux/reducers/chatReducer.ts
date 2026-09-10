import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, ChatState, Conversation } from "redux/types/chat";

const initialState: ChatState = {
  connected: false,
  activeConversation: null,
  messages: {},
  conversations: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },

    setActiveConversation(state, action: PayloadAction<string>) {
      state.activeConversation = action.payload;
      // Reset unread count when conversation is opened
      const conv = state.conversations.find((c) => c.userId === action.payload);
      if (conv) conv.unread = 0;
    },

    receiveMessage(state, action: PayloadAction<ChatMessage>) {
      const msg = action.payload;
      // Partner is the sender (incoming message)
      const partner = msg.sender;
      if (!state.messages[partner]) state.messages[partner] = [];
      state.messages[partner].push(msg);

      // Update conversation entry
      const existing = state.conversations.find((c) => c.userId === partner);
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (existing) {
        existing.lastMessage = msg.content;
        existing.lastTime = time;
        if (state.activeConversation !== partner) existing.unread += 1;
      } else {
        state.conversations.unshift({
          userId: partner,
          displayName: partner,
          lastMessage: msg.content,
          lastTime: time,
          unread: state.activeConversation === partner ? 0 : 1,
        });
      }
    },

    sendMessageLocal(state, action: PayloadAction<ChatMessage>) {
      const msg = action.payload;
      const partner = msg.receiver;
      if (!state.messages[partner]) state.messages[partner] = [];
      state.messages[partner].push(msg);

      // Update conversation entry for the sent message
      const existing = state.conversations.find((c) => c.userId === partner);
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (existing) {
        existing.lastMessage = msg.content;
        existing.lastTime = time;
      }
    },

    addOrUpdateConversation(
      state,
      action: PayloadAction<{ userId: string; displayName: string }>,
    ) {
      const { userId, displayName } = action.payload;
      const exists = state.conversations.some((c) => c.userId === userId);
      if (!exists) {
        state.conversations.unshift({
          userId,
          displayName,
          lastMessage: "",
          lastTime: "",
          unread: 0,
        });
      }
    },
  },
});

export const {
  setConnected,
  setActiveConversation,
  receiveMessage,
  sendMessageLocal,
  addOrUpdateConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
