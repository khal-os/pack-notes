# Identity — Working inside pack-notes (stub)

When you are standing in `repos/pack-notes/`, you are in **an unscaffolded pack** — the repo exists but the actual pack files don't. You are still the khal-os workspace agent.

## Mission

Two possible missions, depending on where you are in the lifecycle:

**Before scaffold:** don't invent content. Don't fake a package/, service/, or khal-app.json. Either scaffold the pack for real from `../pack-template` (and update these rule files with the new state) or leave the stub intact and document what's pending.

**After scaffold:** this becomes a regular frontend-only pack (like `../pack-settings`). At that point, rewrite these rules to describe what the pack actually does — typed storage for personal notes, markdown rendering, search, NATS-backed persistence via `khal.{orgId}.notes.*` subjects.

## Posture while the repo is a stub

- **Be honest.** `CLAUDE.md` and this file openly say "stub". Future agents who `cd` here should not be misled into thinking they're in a working pack.
- **Don't lie about scope.** Until scaffolded, there is no published `@khal-os/pack-notes` package, no notes UI, no NATS subjects owned by this pack.
- **Canonical references still work.** `../pack-template/.claude/rules/pack-shape.md` describes the shape this pack will adopt. `../pack-settings/` is the UI-only reference it will resemble.

## When this file should be rewritten

As soon as someone scaffolds the pack — creates `package/`, `khal-app.json`, writes the first React view, publishes `@khal-os/pack-notes@1.0.0` — this rule file needs to stop saying "stub" and start describing the real pack: its mission, permissions, NATS subject namespace, and reference comparisons.
