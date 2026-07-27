# Socket.IO Chat

A small browser chat example built with Node.js, Express, and Socket.IO. The
server serves two HTML pages and relays messages between connected clients in a
single shared room.

## How the Socket.IO flow works

1. `server.js` creates an Express application, wraps it in an HTTP server, and
   attaches Socket.IO to that server.
2. `GET /` serves `public/index.html`. The page asks for a non-empty display
   name and redirects to `/chat.html?nomeUsuario=<encoded-name>` when the user
   clicks **Entrar** or presses Enter.
3. `GET /chat.html` serves `public/chat.html`. The page loads the Socket.IO
   browser client from `/socket.io/socket.io.js`, connects to the server, reads
   `nomeUsuario` from the query string, and emits `entrar`.
4. On `entrar`, the server joins that socket to `sala_principal` and broadcasts
   a `mensagem` event announcing that the user entered.
5. When a client emits `mensagem`, the server broadcasts the text to
   `sala_principal` with the submitted name prefixed.
6. The sender displays its own message immediately. Other clients display the
   broadcast message. When a connected user disconnects after joining, the
   server broadcasts a departure message.

The event names and room name are part of the current implementation:
`entrar`, `mensagem`, `disconnect`, and `sala_principal`.

## Project structure

```text
.
├── server.js              # Express and Socket.IO server
├── package.json           # Project metadata, scripts, and dependencies
├── package-lock.json      # Locked dependency versions
└── public/
    ├── index.html         # Name entry page
    ├── chat.html          # Chat page and browser-side Socket.IO logic
    ├── style_index.css    # Entry page styles
    └── style_chat.css     # Chat page styles
```

`server.js` also exposes the files in `public/` as static assets. The
dependency manifests are `package.json` and `package-lock.json`; run
`npm install` to install the dependencies needed locally.

## Prerequisites

- Node.js installed on the machine
- npm available with Node.js
- A web browser with JavaScript enabled

The repository does not declare a Node.js version requirement. The runtime
dependencies are Express `^4.18.2` and Socket.IO `^4.7.2`.

## Run locally

Clone the repository using its current public HTTPS URL:

```bash
git clone https://github.com/xfelipealves/trabalho_socketio.git
cd trabalho_socketio
npm install
node server.js
```

The server listens on port `3000` by default. If the `PORT` environment
variable is set, that value is used instead:

```bash
PORT=4000 node server.js
```

Open the application at <http://localhost:3000/> (or the configured port).

## Browser usage

1. Open the root URL and enter a name.
2. Select **Entrar**, or press Enter in the name field.
3. Type a message on the chat page and select **Enviar**, or press Enter in the
   message field.
4. Open the application in a second browser tab or window with another name to
   see messages exchanged through the shared room.

Start at `/` rather than navigating directly to `/chat.html`; the chat page
expects the `nomeUsuario` query parameter created by the entry page.

## Testing and status

There are currently no automated test files. The npm `test` script is the
default placeholder from `package.json` and intentionally exits with status 1:

```text
Error: no test specified
```

For a basic local smoke check, start the server, open the root page in a
browser, join with a name, and exchange messages from two tabs or windows.

## Current limitations

- All users join the same in-memory room, `sala_principal`; there are no
  separate rooms or room-selection controls.
- Messages and connected-user state are not persisted. Restarting the server
  removes the current in-memory state, and new clients do not receive message
  history.
- Names are supplied by the browser and are not authenticated or validated by
  the server.
- The server has no visible application-level authorization, rate limiting,
  moderation, or database integration.
- The interface does not show connection or reconnection status and does not
  provide an application-level error state.
- The current client filters some server broadcasts by checking whether the
  submitted name appears before a colon. This is a simple duplicate-display
  workaround, not a message identity protocol.
- No favicon asset is included, so browsers may request `/favicon.ico` and
  receive a 404 response.
- `npm test` is not a real test suite yet.

## Contributing

Contributions are welcome through normal GitHub fork and pull request
workflow. Please keep changes focused, describe how the behavior was checked,
and update this README when the public behavior or setup changes.

## License status

There is no standalone `LICENSE` file in this repository. `package.json` and
`package-lock.json` declare the package metadata license as `ISC`, but that
metadata is not a substitute for a repository license notice. Confirm the
intended license with the project owner before redistributing the project.
