# pack-notes

> **Under construction** — this repo is a stub. The actual app has not been scaffolded yet.

KhalOS Notes app — create, edit, and manage personal notes from the KhalOS desktop.

## Planned scope

- Frontend-only pack (UI + NATS-backed persistence, no backend service)
- Markdown editing and rendering
- Full-text search across notes
- NATS subject namespace: `khal.{orgId}.notes.*`

## Current state

Only `README.md`, `CLAUDE.md`, and `.claude/rules/` exist. There is no `package/`, `khal-app.json`, or source code. When it's time to build, this pack will be scaffolded from [`pack-template`](https://github.com/khal-os/pack-template) following the UI-only pattern established by `pack-settings`.
