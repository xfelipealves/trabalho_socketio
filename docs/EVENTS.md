# Socket.IO Events and Room Flow

This document describes the event contract that `server.js`,
`public/index.html`, and `public/chat.html` implement today. It is a
description of current behavior, including its quirks, not a design for a
future protocol.

Event names, the room name, and server messages are in Portuguese because
they are part of the implementation. English meanings are given in
parentheses.

## Summary

| Event | Direction | Payload | When it has an effect |
| --- | --- | --- | --- |
| `entrar` (enter) | client to server | display name, string | Always. Joins the socket to `sala_principal` and registers the `mensagem` and `disconnect` handlers. |
| `mensagem` (message) | client to server | message text, string | Only after the same socket has sent `entrar`. |
| `mensagem` (message) | server to clients in `sala_principal` | one preformatted string | Entry notice, chat line, or departure notice. |
| `disconnect` | built-in | none | Announces the departure only if the socket had sent `entrar`. |

`sala_principal` (main room) is the only room. It exists only in server
memory.

## Entry flow

1. The browser opens `/`, which serves `public/index.html`. This page loads the
   Socket.IO client and opens a connection, but it never emits an event. The
   server logs `Novo usuário conectado` (new user connected).
2. The user types a non-empty name and selects **Entrar** or presses Enter.
   The page redirects to `/chat.html?nomeUsuario=<encoded name>`. The redirect
   closes the first connection; since that socket never sent `entrar`, no
   departure notice is broadcast.
3. `public/chat.html` opens a new connection, reads `nomeUsuario` from the
   query string, and immediately emits `entrar` with that value.
4. The server joins the socket to `sala_principal` and emits
   `mensagem` with `"<name> entrou na sala"` (`<name>` entered the room) to
   everyone in the room, **including the new user**.

Users who join later do not receive earlier messages. There is no history.

## Message flow

1. The user sends a non-empty, trimmed message with **Enviar** (send) or
   Enter.
2. The client emits `mensagem` with the text and immediately appends
   `"<name>: <text>"` to its own message list.
3. The server emits `mensagem` with `"<name>: <text>"` to everyone in
   `sala_principal`, **including the sender**. `<name>` is the value captured
   when that socket sent `entrar`.
4. Each client ignores an incoming message when it contains the substring
   `"<its own name>:"` anywhere. This hides the server echo of the sender's own
   message, so the sender sees each of its messages once.

## Departure flow

When a socket that sent `entrar` disconnects (tab closed, page reloaded, or
navigation away), the server emits `mensagem` with `"<name> saiu da sala"`
(`<name>` left the room) to the remaining members of `sala_principal`.

## Edge cases observed

These behaviors were reproduced on 2026-10-09 with a Node.js WebSocket client
speaking the Engine.IO v4 / Socket.IO v4 protocol against the unmodified
server:

- A `mensagem` sent before `entrar` is silently ignored: the handler does not
  exist yet.
- Sending `entrar` twice from the same socket registers the `mensagem` and
  `disconnect` handlers twice. After that, each message from that socket is
  broadcast twice, and its departure notice is also sent twice.
- The server does not validate names. Opening `/chat.html` directly without
  `nomeUsuario` sends `null`, so the room sees `null entrou na sala`.
- Two users with the same name hide each other's messages, because the
  client filter is name-based. A user also misses any message that contains
  `"<their name>:"` in its text, for example `Bia: Ana: hi` hides the message
  from Ana.
- Message text and names are inserted with `textContent`, so HTML is shown as
  text instead of being rendered.

## Protocol details for testing

The server uses Socket.IO 4 on the default path `/socket.io/`. A raw client
can connect over WebSocket at
`ws://localhost:3000/socket.io/?EIO=4&transport=websocket`, reply `40` to the
open packet, answer ping `2` with pong `3`, and send events as
`42["entrar","Ana"]` or `42["mensagem","oi"]`. Incoming events arrive as
`42["mensagem","..."]`.
