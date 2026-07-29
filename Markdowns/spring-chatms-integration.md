Spring ChatMS Integration — Deep Study Guide

Purpose
This document explains the backend changes we made to the Spring chat microservice (chatms). It's study-oriented and slightly conversational to help you internalize what changed and why. Read time: ~15–20 minutes.

Contents
- High-level goals
- File-by-file walkthrough (what changed, why, key code snippets)
- Runtime behavior & data flow
- Common failure modes seen and the fixes applied
- Docker/build/deploy notes and why some compile errors happened
- How to extend and harden (next steps)

High-level goals
- Move code into a clear package layout (controller, service, repository, model/entity, config, websocket, dto, exception, util).
- Centralize WebSocket session management for reliability and concurrency safety.
- Make message delivery resilient: avoid closing the sender's connection when one delivery fails.
- Ensure Jackson serializes timestamps reliably.

File-by-file walkthrough
(Full paths are relative to src/main/java/com/example/demo/)

1) service/SessionManager.java
What it is: a singleton Spring component that holds active userId -> WebSocketSession mappings.
Why: previous code duplicated maps across classes; central manager reduces bugs and makes lookup consistent.
Key methods:
- register(String userId, WebSocketSession session)
- unregister(String userId)
- Optional<WebSocketSession> getSession(String userId)
- Collection<WebSocketSession> getActiveSessions()

Behavioral notes:
- register logs session id and user id when a new session appears.
- unregister removes mapping and logs; used by afterConnectionClosed.

2) websocket/ChatWebSocketHandler.java
What it is: a TextWebSocketHandler that accepts frames at /chat and turns text into ChatMessage objects.
Why: it's the entrypoint for all WS messages; it extracts userId and sets it on session attributes for reverse lookup.
Important changes made:
- afterConnectionEstablished(Session): extracts userId via WebSocketUtils and stores it in session attributes, then sessionManager.register(userId, session).
- Robustness: session.close(...) is called for rejected connections (missing userId), but close throws IOException. We removed the "throws" signature from lifecycle methods earlier — the build failed. Fix: wrap session.close in a try/catch and log the IOException. This fixed a compile error during Docker build.
- handleTextMessage: improved validation (empty payloads, 'undefined' payloads), better logging, and it constructs ChatMessage using sender from session attribute and fields from ChatMessageDto. Calls ChatService (sendPrivateMessage or broadcastMessage).
- Critical fix: handler no longer rethrows exceptions thrown by ChatService; it logs them and keeps the sender session alive.

3) service/ChatService.java
What it is: business logic that serializes ChatMessage and sends to target sessions.
Why: isolated delivery code so features like chat rooms, broadcasts, and private messages are simple to implement.
Key changes:
- ObjectMapper configuration: registered JavaTimeModule and disabled WRITE_DATES_AS_TIMESTAMPS to avoid JsonProcessingException for java.time types in ChatMessage.
  Example: new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
- sendPrivateMessage/broadcast: previously these methods declared "throws IOException" and sometimes let the call bubble up. New behavior:
  - Wrap individual send operations in try/catch and log errors per-session.
  - Do not rethrow exceptions to the WebSocket handler; this prevents framework-level closure of the socket with CloseStatus 1011.
- Logging: debug payloads before sending, info on successes, error logs on per-session failures.

4) dto/ChatMessageDto.java and model/ChatMessage.java
- DTO: represents client-to-server shape: { receiver?, content, messageType }
- Model: server-side message with sender, receiver, timestamp, content, messageType. Timestamps are java.time.Instant/LocalDateTime — hence JavaTimeModule is necessary.

5) util/WebSocketUtils.java
- Extracts userId from WebSocketSession (query string or handshake attributes), centralizing the extraction logic so both the handshake and handler behave consistently.

6) config/WebSocketConfig.java
- Registers handler at /chat endpoint, potentially with interceptors (JwtHandshakeInterceptor) if/when you enable JWT validation at handshake time.

7) exception/GlobalExceptionHandler.java
- Catches common exceptions and returns friendly JSON. We also use it to reduce log noise from missing static assets (favicon.ico) that reached dispatcher.

Runtime behavior & data flow
1. Frontend client opens ws://host:5679/chat?userId=123
2. WebSocketConfig routes the upgrade to ChatWebSocketHandler
3. afterConnectionEstablished extracts userId and registers session with SessionManager
4. Client sends JSON text frames: { receiver, content, messageType }
5. ChatWebSocketHandler parses the DTO, constructs ChatMessage (sender from session attr), and calls ChatService
6. ChatService finds the receiver session (sessionManager.getSession(receiver)) and calls sendMessage on it
   - sendMessage is wrapped in try/catch; failure logs but doesn't close the sender
7. If delivery succeeds, the receiving client receives the frame and its frontend hook updates UI

Observed failure modes & applied fixes
- CloseStatus 1011 / sudden connection closures: caused by exceptions (Jackson serialization or IO) escaping handler and letting the container close the connection. Fixes: catch exceptions in ChatService and ChatWebSocketHandler; configure ObjectMapper for java.time.
- Build compile error during Docker build: removed "throws IOException" from lifecycle methods but left session.close call. Java compiler complains because session.close throws a checked exception. Fix: wrap session.close in try/catch and log.
- MongoClient connection refused: logs show Mongo trying to connect to localhost:27017. It's OK for production to require a DB; for local dev, use an in-memory mock or adjust application.properties to avoid noisy stack traces.

Docker/build notes (why earlier build failed)
- Error: unreported exception IOException; must be caught or declared to be thrown — occurred because afterConnectionEstablished no longer declared throws IOException but called session.close which throws that checked exception. Dockerized gradle build fails on that compile error.
- Fix: wrap close in try/catch and log; re-run gradle build inside Docker (gradle build -x test) — then image builds successfully.

How we tested
- Automated smoke test (temp-ws-test/ws-smoke.js): node script opened two WS clients (userId=100 and 200), sent a unique payload from 100 -> 200, and validated reception. The test prints SUCCESS on delivery.
- Manual browser test: two browser sessions, logged in as two users, open chat page, send messages — observed messages delivered and UI updated.
- Logs: monitored SessionManager register/unregister logs and ChatService logs for send attempts/deliveries.

Deployment checklist
- Build jar: gradle build -x test (or mvn -DskipTests package)
- Build Docker image: docker build -t chatms:latest .
- Run: docker run -d --name chatms -p 5679:5679 chatms:latest
- Tail logs: docker logs -f chatms

Why not rethrow exceptions on send
- Rethrowing leads to the container treating the handler as failed and closing the WebSocket session with CloseStatus[1011] or similar. This kills the sender's connection and aborts message flow. Logging and continuing allows other deliveries to proceed and keeps the sender connected.

Security notes & next steps (hardening)
- JwtHandshakeInterceptor: validate JWT during handshake and map userId from token instead of accepting query param. This prevents userId spoofing.
- Switch WS clients to send token in query param (or subprotocol or header if using a different upgrade approach). Browsers can't set custom headers during WebSocket handshake easily — query param or cookie are common.
- ACKs and delivery guarantees: implement per-message ACK frames and retries if required by business rules.
- Mongo config: set spring.data.mongodb.uri appropriately for your environment and/or include a development embedded/memory option to reduce noise.

Developer tips (debugging quickly)
- When messages don't appear:
  1. Check browser console Network -> WS to see frames and Close status.
  2. Check server logs for CloseStatus codes or stack traces.
  3. Enable DEBUG logs for com.example.demo to see payloads.
- When Docker build fails at compile:
  - Read compiler error: it usually points to an unhandled checked exception. Fix by adding try/catch or declaring throws.

Appendix — useful snippets
1) ObjectMapper config:

ObjectMapper mapper = new ObjectMapper()
  .registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule())
  .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

2) Safe close in handler:

try { session.close(CloseStatus.POLICY_VIOLATION); } catch (IOException e) { logger.error("Failed to close session {}: {}", session.getId(), e.getMessage(), e); }

3) send with logging:

try {
  session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
} catch (Exception e) {
  logger.error("Failed to send to session {}: {}", session.getId(), e.getMessage(), e);
}

Concluding notes
This guide is written to make the implemented changes feel intuitive. The core idea: centralize session state, make sending robust (log and continue), and ensure serialization doesn't blow up for typical Java types. If you'd like, I can also produce a short sequence diagram (SVG) showing the websocket message flow, or a small checklist to migrate to JWT handshake.

---
Generated by Copilot CLI assistant — spring-chatms-integration.md
