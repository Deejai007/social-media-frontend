Frontend Chat Integration — Practical Guide (copy-ready)

Purpose
This file is a practical, study-oriented guide that shows the exact frontend code and explains why each piece exists. Read time: ~15–20 minutes. Copy-paste the snippets into your frontend/src/ to test.

Contents
- What we changed and why
- Copy-pasteable files (hook, reducer, page, component, axios config)
- How data flows end-to-end
- Tips, debugging, and extensions

What we changed (summary)
- Added a WebSocket hook (useWebSocket) that manages lifecycle, reconnects and dispatches incoming messages to Redux.
- Added a minimal chat Redux reducer (chatReducer.js) to hold conversations and messages.
- Added a Chat page and ChatWindow component to wire UI to the hook + Redux.
- Kept axios config using withCredentials for existing cookie-based APIs.
- Environment var VITE_WS_URL points to ws://localhost:5679/chat.

Copy these files into frontend/src/ (or adapt to your structure)

1) src/utils/useWebSocket.ts
- Purpose: centralize WS lifecycle and reconnection, provide sendMessage API
- Key behaviors: connect with ?userId, onmessage => dispatch receiveMessage, optimistic local echo on send

Code (TS/JS):

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
    };

    ws.onmessage = (ev) => {
      try { const data = JSON.parse(ev.data); dispatch(receiveMessage(data)); }
      catch (e) { console.error('WS parse', e); }
    };

    ws.onerror = (e) => { console.warn('WS error', e); };

    ws.onclose = (ev) => {
      dispatch(setConnected(false));
      const attempt = ++reconnectRef.current.attempts;
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      setTimeout(() => connect(), delay);
    };
  }, [userId, dispatch]);

  useEffect(() => { connect(); return () => { try { wsRef.current && wsRef.current.close(); } catch (e) {} }; }, [connect]);

  const sendMessage = useCallback((receiver, content, messageType = 'PRIVATE') => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    const payload = { receiver, content, messageType };
    try { ws.send(JSON.stringify(payload)); dispatch(sendMessageLocal({ sender: 'me', ...payload, timestamp: new Date().toISOString() })); return true; }
    catch (e) { console.error('WS send failed', e); return false; }
  }, [dispatch]);

  return { sendMessage, isConnected: () => !!(wsRef.current && wsRef.current.readyState === WebSocket.OPEN) };
}

Why this design
- The hook isolates reconnection logic and keeps components simple.
- Optimistic local echo improves UX while server delivery is happening.
- Using query param ?userId mirrors the server behavior in development; switch to ?token for JWT-based handshake in production.

2) src/redux/chatReducer.js
- Purpose: store messages so any UI can read/update them

Code:

const initialState = { meId: null, connected: false, conversations: {}, activeConversation: null };
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
  return { ...state, conversations: { ...state.conversations, [peerId]: { messages: [...conv.messages, message] } } };
}

export default function chatReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CONNECTED: return { ...state, connected: action.connected };
    case RECEIVE_MESSAGE: return addMessage(state, action.message);
    case SEND_MESSAGE_LOCAL: return addMessage(state, action.message);
    case SET_ACTIVE_CONVERSATION: return { ...state, activeConversation: action.id };
    default: return state;
  }
}

3) src/pages/Chat/Chat.tsx
- Purpose: connect hook + Redux + UI

Code (React):

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
  return (<div style={{height:'100%'}}><ChatWindow messages={messages} onSend={(text) => sendMessage(active || null, text)} meId={meId} /></div>);
}

4) src/components/chat/ChatWindow.tsx
- Purpose: presentational list + send box

Code:

import React, { useState } from 'react';
export default function ChatWindow({ messages = [], onSend, meId }) {
  const [text, setText] = useState('');
  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; onSend(text.trim()); setText(''); };
  return (
    <div className="chat-window">
      <div className="messages">{messages.map((m,i)=> (<div key={i} className={m.sender===meId? 'msg me':'msg them'}><div className="content">{m.content}</div><div className="meta">{new Date(m.timestamp).toLocaleTimeString()}</div></div>))}</div>
      <form onSubmit={submit} className="send-form"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message"/><button type="submit">Send</button></form>
    </div>
  );
}

5) src/utils/axiosconfig.js

import axios from 'axios';
const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/', withCredentials: true, });
export default axiosInstance;

Data flow summary
1. User opens Chat page -> useWebSocket connects with ?userId.
2. Incoming frames go to hook.onmessage -> dispatch receiveMessage -> reducer stores message -> UI updates.
3. Sending: ChatWindow -> onSend -> hook.sendMessage -> ws.send(JSON)
4. Server receives, routes, and delivers to peer; peer receives via its hook and UI updates.

Testing & debugging tips
- Use the temp-ws-test/ws-smoke.js script to simulate two clients (node + ws).
- Watch both browser console (Network WS tab) and server logs for CloseStatus codes.
- If WS won't connect, confirm VITE_WS_URL and that server is reachable on port 5679.

Extensions (next steps)
- Delivery receipts & ACKs: send ack frames from server, mark messages delivered/read in Redux.
- Typing indicator: send small "typing" frames with messageType: 'TYPING'.
- JWT handshake: change hook to pass token in query and validate on server during handshake.

Enjoy studying — if you want, I can convert these snippets into real files inside your repo or make the Redux slice use Redux Toolkit instead.
