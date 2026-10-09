# AGENTS.md

Canonical instructions for any coding agent working in this repository (Codex, Claude Code, Cursor, Gemini CLI, and others). If another agent instruction file disagrees with this one, this file wins.

## Project

An educational Socket.IO event lab: one Express server (`server.js`) and two static pages in `public/` that relay `entrar`, `mensagem`, and `disconnect` through a single in-memory room, `sala_principal`. See [README.md](README.md) for setup, [docs/EVENTS.md](docs/EVENTS.md) for the event contract, and [docs/PORTFOLIO-PLAN.md](docs/PORTFOLIO-PLAN.md) for the roadmap.

The primary chat showcase is a separate project, [Mini Discord](https://github.com/xfelipealves/mini-discord). Do not grow this repository into a second chat product, merge it with Mini Discord, or archive it unless the owner asks. Changes to Mini Discord need their own task in that repository.

## Language

- All README files, documentation, reports, commit messages, and agent instructions are written in English.
- The user interface, event names, room name, server messages, and source comments are in Portuguese. They are part of the documented contract; do not translate or rename them unless the task asks for it.

## Portfolio workflow

- Work directly on `master`. Do not create feature branches or worktrees unless the owner asks for one.
- Make small, coherent, atomic commits with descriptive English messages, then push normally to `origin/master`. The repository has no CI; say so instead of claiming CI passed.
- Never force push, rewrite published history, or overwrite uncommitted work you did not create.
- Delete a branch only after confirming its commits are reachable from `master` (`git branch -d`, never `-D`).
- Keep `server.js`, `public/`, and the committed `node_modules/` unless the task asks for a change. Do not upgrade dependencies as a side effect.
- Do not stop processes or servers you did not start. Pick a free port with `PORT=<port> node server.js`.
- Keep documentation truthful: describe only behavior that exists and was verified, state known limits, and keep planned work clearly marked as not implemented. Never present mockups or generated images as real screenshots.

## Verification before committing

```sh
node --check server.js
PORT=<free port> node server.js   # then load / and /chat.html, or drive the events with a raw WebSocket client
git diff --check
```

`npm test` is a placeholder that exits with status 1; do not report it as a passing test suite. When event behavior changes, update [docs/EVENTS.md](docs/EVENTS.md) and check the entry, message, and departure flows with two clients. When docs change, confirm that relative links point to tracked files.
