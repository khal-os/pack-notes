# pack-notes — Notes app (stub)

> You are working inside **`repos/pack-notes/`**, the Notes pack. **This repo is currently a stub** — only a README exists. The actual pack scaffold has not been cloned from `../pack-template` yet.

## Intended identity

- **id:** `notes`
- **name:** Notes
- **purpose:** create, edit, and manage personal notes from the KhalOS desktop
- **expected shape:** frontend-only pack (UI + NATS persistence); no backend service

## Current state

```
pack-notes/
├── CLAUDE.md    # this file
├── README.md    # 3-line stub
└── .claude/     # rules (you are reading these)
```

There is **no** `package/`, `service/`, `helm/`, `khal-app.json`, or source code yet. Before this pack does anything, it needs to be scaffolded from `../pack-template`.

## First-time setup

When it's time to actually build this pack:

```bash
# Option 1: clone from template (preferred)
cd /tmp && git clone https://github.com/khal-os/pack-template.git pack-notes-scaffold
# Then manually merge the scaffold files into the existing repo (preserving .git history)

# Option 2: use gh + template mode
gh repo create khal-os/pack-notes --template khal-os/pack-template --private
# (only works if the repo didn't already exist — this one does)
```

After scaffolding, rename:
- `package/package.json` → `"name": "@khal-os/pack-notes"`
- `khal-app.json` → `id: "notes"`, `name: "Notes"`, `frontend.package: "@khal-os/pack-notes"`
- Root `package.json` → `"name": "@khal-os/pack-notes"`

Delete `service/` and `helm/` (Notes is frontend-only — see `../app-kit/.claude/rules/building-apps.md` for the UI-only pattern, with `pack-settings` as the reference implementation).

## Canonical references

- **Pack scaffold + shape contract** → `../pack-template/` (`.claude/rules/pack-shape.md`)
- **UI-only reference** → `../pack-settings/`
- **Workspace manifest** → `../../.genie/MANIFEST.md`
