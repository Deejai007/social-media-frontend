export interface ChatMessage {
  sender: string;
  receiver: string;
  content: string;
  messageType: "CHAT" | "JOIN" | "LEAVE";
  timestamp?: string;
}

export interface Conversation {
  userId: string;
  displayName: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export interface ChatState {
  connected: boolean;
  activeConversation: string | null;
  messages: Record<string, ChatMessage[]>; // keyed by partner userId
  conversations: Conversation[];
}
