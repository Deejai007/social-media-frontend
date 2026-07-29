Chat Integration — Deep Dive

Purpose and scope

This document teaches, step-by-step, how the WebSocket chat integration was implemented across frontend and backend. It explains the design decisions, the concrete files changed, how data flows end-to-end, the testing performed, and how to debug and extend the system. This is written to be a ~15–20 minute read and assumes comfort reading TypeScript and Java/Spring at a moderate level.

Table of contents
- Overview & goals
- High-level architecture
- Backend: packages & key classes
  - SessionManager
  - ChatWebSocketHandler
  - ChatService
  - DTOs and util
  - Exception handling
- Backend fixes & rationale (why some changes were necessary)
- Frontend: structure & key files
  - useWebSocket hook
  - Redux chat slice & actions
  - Chat UI components (Chat.tsx, ChatWindow)
  - Axios/auth considerations
- Automated WS smoke test
- Docker build & deploy notes
- Common failure modes & how to debug
- Next steps & optional hardening

Overview & goals

Goal: Provide real-time private and broadcast chat using Spring WebSocket on the server and a React frontend, preserving existing app behavior but organizing code into a clean architecture (controller/service/repository/model/config/websocket/dto/exception/util). The integration should be robust to serialization errors, not kill connections when one send fails, and be straightforward to use from the frontend.

High-level architecture

- Frontend (React + Vite)
  - useWebSocket hook manages the raw WebSocket lifecycle
  - Redux stores chat conversation lists and messages
  - Chat components render UI and call the hook/send through it
- Backend (Spring Boot)
  - WebSocketConfig registers a handler at /chat
  - ChatWebSocketHandler receives raw text frames and converts to DTOs
  - SessionManager holds current userId -> WebSocketSession mappings
  - ChatService performs sending logic (private, broadcast, room)
  - DTOs (ChatMessageDto) provide payload contract

Backend — packages & key classes

(See src/main/java/com/example/demo/...)

1) SessionManager (service/SessionManager.java)
Purpose: single source-of-truth for active WebSocket sessions. Responsibilities:
- register(userId, session)
- unregister(userId)
- getSession(userId) -> Optional<WebSocketSession>
- getActiveSessions() -> Collection<WebSocketSession>

Why: Previously the code used maps in multiple places. A central manager prevents concurrency mistakes and makes it easy to debug active sessions.

Key behavior:
- When register() is called, it logs sessionId and userId.
- unregister() removes mapping and logs.

2) ChatWebSocketHandler (websocket/ChatWebSocketHandler.java)
Purpose: Spring TextWebSocketHandler subclass that handles connection lifecycle and incoming messages.
Responsibilities:
- afterConnectionEstablished: extract userId and register session
- handleTextMessage: parse payload into ChatMessageDto and call ChatService
- afterConnectionClosed: unregister session

Important details and changes made:
- The handler extracts userId from WebSocketUtils.extractUserId(session). This utility reads query params or attributes that were set during handshake.
- session.getAttributes().put("userId", userId) is used so we can reference the userId during message handling and close events.
- Robustness: We wrapped session.close(...) in a try/catch when rejecting a connection (missing userId) because session.close throws IOException and earlier code removed the method's throws declaration; compiling inside Docker failed until we handled the checked exception.
- Message handling no longer rethrows send/serialization exceptions. Instead it logs failures and continues. This avoids closing the sender’s connection on a single delivery error (which previously produced CloseStatus 1011).

3) ChatService (service/ChatService.java)
Purpose: business logic for delivering messages.
Responsibilities:
- sendPrivateMessage(ChatMessage)
- broadcastMessage(ChatMessage)
- broadcastMessage excluding a user
- broadcastToChatRoom(chatRoomId, ChatMessage)

Notable changes and reasoning:
- ObjectMapper configuration: The ObjectMapper was configured with JavaTimeModule and WRITE_DATES_AS_TIMESTAMPS disabled. This prevents Jackson failures when ChatMessage contains java.time types.
- Every session.sendMessage(...) call is wrapped in try/catch. If a send fails (IOException, client suddenly disconnected, or serialization problem), the exception is logged but not thrown. This prevents the handler from failing the whole WebSocket request and closing the sender socket.
- Logging: we log payloads at DEBUG and deliveries at INFO to make tracing easy in logs.

4) DTOs and util
- ChatMessageDto: slim DTO representing the payload the frontend sends: { receiver?, content, messageType }
- ChatMessage: server-side model: { sender, receiver, content, timestamp, messageType }
- WebSocketUtils: helper to consistently extract userId from either query param or session handshake attributes; centralizing extraction reduces mismatch bugs.

5) Exception handling
- GlobalExceptionHandler exists to convert uncaught exceptions to clean JSON responses and to catch common NoResourceFound (e.g., favicon) noise.

Backend fixes & rationale (why changes were necessary)

- Checked exception compile error: afterConnectionEstablished had the throws removed but still called session.close(...) which throws IOException. Fix: wrap in try/catch and log; do not rethrow.
- Client-side behavior: previously a thrown exception (e.g., Jackson serialization problem) bubbled up and the framework closed the connection with CloseStatus 1011. Fix: catch at the service/handler boundary.
- Jackson failure on java.time types: fix by registering JavaTimeModule and disabling timestamps, so messages with timestamps now serialize properly.

Frontend — structure & key files

(Assumes React + Vite in JS/TS. The code snippets below are full, copy-pasteable examples — put them under src/ as indicated.)

Key files (concrete)
- src/utils/useWebSocket.ts             — WebSocket hook
- src/redux/chatReducer.js             — Redux reducer + action creators
- src/pages/Chat/Chat.tsx              — page wiring hook + Redux
- src/components/chat/ChatWindow.tsx   — presentational chat UI
- src/utils/axiosconfig.js             — axios instance (cookies)
- .env                                 — VITE_WS_URL

Below are the exact files and code to place in the frontend (they are intentionally self-contained and match the Redux action names used by the backend integration):

1) src/utils/useWebSocket.ts (JS/TS)

```ts
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setConnected, receiveMessage, sendMessageLocal } from '../redux/chatReducer';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5679/chat';

export default function useWebSocket(userId) {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const reconnectRef = useRef({ attempts: 0 });

  const connect = useCallback(() => {
    if (!userId) return;
    const url = `${WS_URL}?userId=${encodeURIComponent(userId)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectRef.current.attempts = 0;
      dispatch(setConnected(true));
      console.debug('WS open', url);
    };

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        dispatch(receiveMessage(data));
      } catch (e) {
        console.error('Failed parsing ws message', e, ev.data);
      }
    };

    ws.onerror = (e) => {
      console.warn('WS error', e);
    };

    ws.onclose = (ev) => {
      dispatch(setConnected(false));
      // simple reconnect with backoff
      const attempt = ++reconnectRef.current.attempts;
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      console.info('WS closed — reconnect attempt', attempt, 'in', delay);
      setTimeout(() => connect(), delay);
    };
  }, [userId, dispatch]);

  useEffect(() => {
    connect();
    return () => {
      try { wsRef.current && wsRef.current.close(); } catch (e) {}
    };
  }, [connect]);

  const sendMessage = useCallback((receiver, content, messageType = 'PRIVATE') => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('WS not open, cannot send');
      return false;
    }
    const payload = { receiver, content, messageType };
    try {
      ws.send(JSON.stringify(payload));
      // optimistic local echo, timestamp added locally
      dispatch(sendMessageLocal({ sender: 'me', ...payload, timestamp: new Date().toISOString() }));
      return true;
    } catch (e) {
      console.error('WS send failed', e);
      return false;
    }
  }, [dispatch]);

  return { sendMessage, isConnected: () => !!(wsRef.current && wsRef.current.readyState === WebSocket.OPEN) };
}
```

Explanation: connect() opens ws with ?userId, sets handlers, and auto-reconnects on close with exponential backoff. onmessage dispatches receiveMessage into Redux.

---
2) src/redux/chatReducer.js

```js
// Minimal Redux reducer + action creators for chat
const initialState = {
  meId: null,
  connected: false,
  conversations: {}, // { peerId: { messages: [] } }
  activeConversation: null,
};

export const SET_CONNECTED = 'chat/SET_CONNECTED';
export const RECEIVE_MESSAGE = 'chat/RECEIVE_MESSAGE';
export const SEND_MESSAGE_LOCAL = 'chat/SEND_MESSAGE_LOCAL';
export const SET_ACTIVE_CONVERSATION = 'chat/SET_ACTIVE_CONVERSATION';

export function setConnected(connected) { return { type: SET_CONNECTED, connected }; }
export function receiveMessage(message) { return { type: RECEIVE_MESSAGE, message }; }
export function sendMessageLocal(message) { return { type: SEND_MESSAGE_LOCAL, message }; }
export function setActiveConversation(id) { return { type: SET_ACTIVE_CONVERSATION, id }; }

function addMessage(state, message) {
  const peerId = message.sender === state.meId ? message.receiver : message.sender || 'broadcast';
  const conv = state.conversations[peerId] || { messages: [] };
  return {
    ...state,
    conversations: {
      ...state.conversations,
      [peerId]: { messages: [...conv.messages, message] }
    }
  };
}

export default function chatReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CONNECTED:
      return { ...state, connected: action.connected };
    case RECEIVE_MESSAGE:
      return addMessage(state, action.message);
    case SEND_MESSAGE_LOCAL:
      return addMessage(state, action.message);
    case SET_ACTIVE_CONVERSATION:
      return { ...state, activeConversation: action.id };
    default:
      return state;
  }
}
```

Explanation: simple normalized store keyed by peerId. You can extend to support conversations metadata, unread counts, etc.

---
3) src/pages/Chat/Chat.tsx

```tsx
import React from 'react';
import { useSelector } from 'react-redux';
import useWebSocket from '../../utils/useWebSocket';
import ChatWindow from '../../components/chat/ChatWindow';

export default function ChatPage() {
  const meId = useSelector(s => s.user && s.user.id);
  const { sendMessage } = useWebSocket(meId);
  const conversations = useSelector(s => s.chat.conversations);
  const active = useSelector(s => s.chat.activeConversation);

  const messages = conversations[active] ? conversations[active].messages : [];

  return (
    <div style={{ height: '100%' }}>
      <ChatWindow
        messages={messages}
        onSend={(text) => sendMessage(active || null, text)}
        meId={meId}
      />
    </div>
  );
}
```

Note: active conversation id could be peerId; UI should let user pick a conversation from a list.

---
4) src/components/chat/ChatWindow.tsx (presentational)

```jsx
import React, { useState } from 'react';

export default function ChatWindow({ messages = [], onSend, meId }) {
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === meId ? 'msg me' : 'msg them'}>
            <div className="content">{m.content}</div>
            <div className="meta">{new Date(m.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="send-form">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

---
5) src/utils/axiosconfig.js

```js
import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  withCredentials: true,
});
export default axiosInstance;
```

---
6) .env (already created example)

```
VITE_WS_URL=ws://localhost:5679/chat
VITE_API_URL=http://localhost:8967
```

Why put code in markdown only?
- You asked for a teachable single-file reference. These snippets are complete and ready to copy into your real frontend. They intentionally avoid heavy framework coupling so you can adapt them to your current store shape (Redux Toolkit or plain Redux) and router.

Integration notes
- The hook sends { receiver, content, messageType } — that is the contract the backend ChatWebSocketHandler expects.
- If you switch to JWT-handshake, modify the hook connect() to use `?token=${jwt}` and update JwtHandshakeInterceptor on server.
- For production, secure cookies + JWT handshake are safer than userId query param.

Testing & verification
- Manual: open two browsers, login as two different users, open Chat page, send private messages — messages should appear instantly.
- Automated: run the temp-ws-test/ws-smoke.js script (node + ws) to simulate two clients.

Troubleshooting quick wins
- If messages don't appear: check browser console WS connection and server logs for CloseStatus codes.
- If messages arrive but timestamps look weird: ensure server serializes java.time properly (we registered JavaTimeModule server-side).

End of frontend concrete code section — copy these files verbatim into frontend/src/ and they should integrate with the backend already running at ws://localhost:5679.



(Assumes React + TypeScript in your project structure — replace paths as needed)

Key files changed/added:
- src/utils/useWebSocket.ts — the hook that manages the WebSocket connection
- src/redux/reducers/chatReducer.ts — reducer and actions to store messages & connection state
- src/redux/reducers/index.ts — register chat reducer
- src/pages/Chat/Chat.tsx — page that wires hook and Redux into UI
- src/components/chat/ChatWindow.tsx — presentational component for chat UI
- .env — VITE_WS_URL (ws://localhost:5679) — runtime URL for the hook
- axios config / auth thunks — ensure tokens or cookies are properly sent for HTTP APIs

useWebSocket hook — responsibilities and internals

Purpose: create, maintain, and expose sendMessage function plus connection state to the React app.

Key functionality:
- open WebSocket to VITE_WS_URL + `?userId=${userId}` (or token if you enforce JWT handshake)
- onopen: dispatch Redux action setConnected(true)
- onmessage: parse JSON, dispatch receiveMessage(chatMessage)
- onerror/onclose: setConnected(false); attempt reconnection with backoff (optional)
- sendMessage(receiver, content): build payload { receiver, content, messageType } and ws.send(JSON.stringify(...))
- keep reference to ws in a ref so it persists across renders

Notes/Why a hook:
- Encapsulates lifecycle and side-effects (connect/reconnect) cleanly in one place
- Keeps components small — they only call sendMessage and read state from Redux

Redux chat slice — responsibilities

State shape (example):
{
  connected: boolean,
  conversations: { [conversationId]: { messages: ChatMessage[], lastSeen: Date, ... } },
  activeConversationId: string | null
}

Actions:
- setConnected(bool)
- receiveMessage(ChatMessage)
- sendMessageLocal(ChatMessage) — add local optimistic UI copy
- setActiveConversation(conversationId)
- addOrUpdateConversation(...) — create conversation entries

Why Redux?
- Keeps messages persistent across components and routes
- Enables other UIs (notification badges, conversation list) to react to incoming messages

Chat.tsx and ChatWindow responsibilities

- Chat.tsx uses useWebSocket(userId) and selects state from Redux to pass conversations/messages to ChatWindow.
- ChatWindow is presentational: shows messages, input box, calls onSendMessage to send.
- Sending flow: ChatWindow calls onSendMessage -> Chat.tsx calls hook.sendMessage -> hook.ws.send JSON -> server routes to ChatService -> ChatService delivers to receiver -> receiver's hook onmessage parsed and dispatches receiveMessage -> UI updates.

Axios & auth considerations

- The auth backend used cookies and returned tokens in JSON. The frontend stores token in memory (or localStorage if you prefer) and sets Authorization: Bearer <token> on HTTP calls when cookie not present.
- WebSocket handshake currently uses userId query param (`?userId=...`). This is convenient but insecure for production. Options:
  - Keep as-is for dev (simple)
  - Switch to JWT-handshake: pass token as `?token=<jwt>`, and enforce JwtHandshakeInterceptor on server to validate during handshake. If enforced, frontend must send token instead of raw userId.
- axiosconfig was restored to original (withCredentials enabled) to keep other API calls working as before. Avoid broad changes to axios interceptors unless you update all call sites.

Automated WS smoke test

What it does:
- Opens two Node WebSocket clients (userId=100 and 200)
- Waits for both to open
- Sends JSON private message from 100 to 200
- B listens and verifies payload contains a unique token

Where it is (temp-ws-test/ws-smoke.js) and how to run:
- mkdir temp-ws-test; cd temp-ws-test
- npm init -y
- npm i ws
- create ws-smoke.js (script attached in repo under temp-ws-test)
- node ws-smoke.js

Expected logs (server side):
- Session registered logs for userId 100 and 200
- Handler logs showing payload parsed and routed
- ChatService logs showing send attempts and deliveries
- Script prints SUCCESS if message is delivered

Docker build & deploy notes

To rebuild backend image locally after changes:
- mvn -DskipTests package  (or gradle build -x test depending on your project)
- docker build -t chatms:latest .
- docker-compose up -d --build  (or docker run -p 5679:5679 chatms:latest)

Common failure modes & how to debug

1) Compile errors while building in Docker
   - Symptom: gradle/maven fails with an unreported exception checked-error (e.g., IOException)
   - Fix: ensure methods either declare throws or caught the checked exception. Example: session.close throws IOException — wrap it.

2) WebSocket connection closing with code 1011
   - Symptom: CloseStatus[code=1011] in logs; recipient never receives the message.
   - Cause: an exception (often from Jackson serialization or IO) bubbled up causing server to close the connection.
   - Fixes we applied: configure ObjectMapper for java.time, and catch exceptions around sendMessage, logging instead of rethrowing.

3) Jackson serialization failures
   - Symptom: stacktrace showing JsonProcessingException for java.time types
   - Fix: register JavaTimeModule and disable WRITE_DATES_AS_TIMESTAMPS on ObjectMapper.

4) HTTP 404 for frontend API (e.g., /user/search)
   - Symptom: 404 on GET /user/search
   - Fix: verify route exists and middleware (auth) isn't blocking; if token/cookie mismatch, either fix frontend to send token or adjust backend to accept Authorization header or cookie.

5) MongoClient Connection refused
   - Symptom: logs show mongodb connection refused
   - Fix: run local Mongo or change application.properties to use an in-memory or test DB for development.

Next steps & optional hardening

Short-term (start frontend work):
- Freeze the current backend state (it's passing smoke tests and manual browser test)
- Implement frontend UX features: reconnection/backoff, typing indicators, delivery receipts, local persistence, message ordering

Long-term backend hardening:
- Enable JwtHandshakeInterceptor for secure WS handshake and update frontend to send JWT instead of userId query param
- Add per-message ACK with retry/backpressure logic if delivery reliability is required
- Fix Mongo config for local dev (or mock it) to remove noisy logs in dev environment
- Add metrics & tracing for WebSocket events (connects, drops, messages/sec)

Appendix — quick reference snippets

1) WebSocket send try/catch pattern (server-side):
try {
  session.sendMessage(new TextMessage(payloadString));
} catch (Exception e) {
  logger.error("Failed to send to session {}: {}", session.getId(), e.getMessage());
}

2) Frontend hook: simplified pseudocode
const wsRef = useRef(null);
useEffect(() => {
  const ws = new WebSocket(`${VITE_WS_URL}?userId=${userId}`);
  ws.onopen = () => dispatch(setConnected(true));
  ws.onmessage = (e) => dispatch(receiveMessage(JSON.parse(e.data)));
  ws.onclose = () => dispatch(setConnected(false));
  wsRef.current = ws;
  return () => ws.close();
}, [userId]);

3) Smoke test command summary
cd temp-ws-test
npm i ws
node ws-smoke.js

FAQ — quick answers
Q: Why not rethrow exceptions on send? A: Because rethrowing caused the WebSocket handler to fail and the server closed the connection (CloseStatus 1011). We prefer to log and keep the sender alive.

Q: Should frontend store tokens in localStorage? A: For convenience yes, but be mindful of XSS. HttpOnly cookies plus jwt handshake are more secure.

Q: Why use Redux for chat? A: Centralized state management simplifies updating multiple UIs (conversation list, badges, message counts) when a message arrives.

Closing notes

This file documents the end-to-end integration for the current implementation. If you want, I can also:
- Create a short video-style step-by-step (text) of reproducing the smoke-test and viewing logs
- Prepare a secure handshake migration plan with code changes for both client and server
- Expand the chatIntegration.md with UML diagrams or sequence diagrams (SVG) — tell me which.

---
Generated by Copilot CLI assistant — chatIntegration.md
