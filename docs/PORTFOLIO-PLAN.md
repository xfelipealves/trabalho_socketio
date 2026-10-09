# Socket.IO Event Lab: Portfolio Plan

This document keeps the portfolio plan that was drafted on 2026-10-08 in an
Orca workspace sibling (`portfolio-realtime-chat`) as an untracked Portuguese
note. It was translated to English and moved into the default branch on
2026-10-09 so the plan is versioned with the code.

The original plan proposed growing this project into a full chat product. On
2026-10-09 the roadmap was narrowed: this repository stays an **educational
Socket.IO event lab**. The primary chat showcase is
[Mini Discord](https://github.com/xfelipealves/mini-discord), a separate
project. The two projects are not being merged, and this repository is not
being archived.

## Historical plan (2026-10-08, translated from Portuguese)

This section is kept for the record. It is **superseded** by the revised
roadmap below, and none of it is implemented.

Created on 2026-10-08 at Felipe's request. Workspace prepared; implementation
waiting to be resumed.

### Goal

Evolve the Socket.IO study into a chat demo with an integrated frontend and
backend.

### Existing base

Node.js, Express, Socket.IO, and an HTML client; a single room, in-memory
state, and messages without persistent history. Review the code and the
README before implementing.

### First delivery

- React interface with channels, connection status, and send feedback.
- Presence, typing indicator, and reconnection.
- Persisting and loading history, with duplicate handling.
- Document the event contracts and the entry rules.
- Evaluate reusing this work in Mini Discord before maintaining two similar
  products; changes in another repository require their own task.

### Presentation criteria

Local demo with two clients and fictitious data, a short GIF, and
architecture documentation. Record the limits and the validation performed.
Public deployment and profile changes will be decided later.

## Current state (verified 2026-10-09)

- One Express server (`server.js`) serves two pages and relays three
  application events, `entrar`, `mensagem`, and the built-in `disconnect`,
  through a single in-memory room, `sala_principal`.
- The event contract and the entry, message, and departure flows are now
  documented in [EVENTS.md](EVENTS.md). This was the only item of the
  historical delivery that is done.
- There are no automated tests. The npm `test` script is a placeholder that
  exits with status 1.

## Revised roadmap: educational event lab

The goal is to make the existing event flow easy to observe and test, not to
build a product. React, channels, persistence, presence, and typing
indicators are out of scope here; Mini Discord covers chat product features.

### Next slice (not started)

1. Add an automated smoke test that starts the server on a free port,
   connects two raw WebSocket clients, and asserts the documented flow: entry
   notice, message relay, sender echo, departure notice, and that `mensagem`
   before `entrar` is ignored. Use Node's built-in `WebSocket` so no new
   dependency is needed, and replace the placeholder `npm test` script with
   it.
2. Keep the current event names, payloads, room, and pages unchanged in that
   slice so the test documents today's behavior.

### Later candidates

- Guard against a repeated `entrar` registering duplicate handlers, with a
  test that shows the change.
- Show connection and disconnection state in the chat page as a teaching aid.
- Add a short annotated walkthrough of the events as seen in the browser
  developer tools.
