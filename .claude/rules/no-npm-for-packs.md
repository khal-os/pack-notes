# Rule: no npm for packs

**pack-* repos must NEVER be npm-published. The marketplace install path is `git clone` + read `khal-app.json` + build-on-install. No npm registry consultation for pack identity or content.**

## Rule

The khal-os org publishes exactly four packages to npmjs.org. Every other repository — every `pack-*` repo — is distributed via git only. There is no npm package per pack, there is no `@khal-os/pack-<name>` URL on the registry that anyone is allowed to depend on, and no agent or maintainer should add publishing scaffolding to a pack repo.

Discovery uses the `khal-app.json` manifest at the root of each pack repo. Installation uses `git clone` + manifest read + build-on-install. The npm registry is consulted only to resolve the legitimate `@khal-os/*` peerDeps listed below during a pack's build.

## Allowlist (the only legitimate `@khal-os/*` npm packages)

These four packages live in `repos/app-kit/packages/` and are the **only** `@khal-os/*` artifacts that may be published to npmjs.org:

| Package | Source |
|---------|--------|
| `@khal-os/sdk` | `repos/app-kit/packages/sdk/` |
| `@khal-os/ui` | `repos/app-kit/packages/ui/` |
| `@khal-os/types` | `repos/app-kit/packages/types/` |
| `@khal-os/app-kit` | `repos/app-kit/packages/app-kit/` |

Anything else under the `@khal-os/*` scope on npmjs.org is either legacy/leaked (see history below) or an unauthorized publication that must be removed.

## Forbidden patterns

If you see any of these in a `pack-*` repo, the pack is misconfigured. Propose removal — never add one.

- `.npmrc` at any path in a pack-* repo (root, `package/`, anywhere). The default npm registry already resolves public `@scope` packages from npmjs.org; an in-repo `.npmrc` only exists to either re-route or authenticate publishes, which packs must never do.
- `publishConfig` block in any `package.json` inside a pack-* repo (root `package.json`, `package/package.json`, sub-pack `package.json` for monorepos). A pack must not declare a publish target.
- `publish:next` or `publish:latest` scripts in any `package.json` inside a pack-* repo. These were inherited from legacy scaffolding and have no business in a git-only-distributed pack.
- Any `npm publish` or `pnpm publish` step in a pack-* repo's CI workflow files (`.github/workflows/*.yml`).
- A `frontend.package` field in a pack's `khal-app.json` — the install path is git, not npm, so the manifest has no need to declare an npm package name.

The corollary: a properly configured pack has `"private": true` on the package.json that contains the live frontend code, no `publishConfig` anywhere, no `publish:*` scripts, and no `.npmrc`.

## Why

Investigation on 2026-05-11 found that five pack repos — `pack-files`, `pack-genie`, `pack-nats-viewer`, `pack-settings`, `pack-terminal` — had accidentally been published as `@khal-os/pack-<name>@1.0.0` on npmjs.org against policy. The publishes were side effects of legacy scaffolding (inherited `publishConfig` + `publish:*` scripts from an early pack template). Nothing at runtime consumed those npm packages: the actual install path is and always was git-based.

The risk was that future agents, seeing the registry entries or seeing committed `.npmrc` files left over from a misguided "fix" attempt, would treat npm publication as the canonical distribution mechanism for packs and double down on it. This rule exists to close that loop: packs are git-installed, and every artifact of npm-publishing must be absent from every pack repo.

## How to apply

- If you see a `.npmrc` in a `pack-*` repo, propose its removal in the same PR you are already working on (or open a small cleanup PR). Never add a new `.npmrc` to a pack-* repo.
- If you see a `publishConfig` in a pack's `package.json`, propose its removal and set `"private": true` on the same package.
- If you see a `publish:next` / `publish:latest` script in a pack's root or `package/package.json`, propose its removal.
- If you see a `frontend.package` field in a pack's `khal-app.json`, propose its removal — the field is optional in the Zod schema and reading code treats its absence as the modern shape.
- If you see a CI workflow step running `npm publish` / `pnpm publish` / `publish:next` / `publish:latest` in a pack repo, propose removing the step.
- If you are tempted to add any of the above to a pack repo — don't. Re-read this rule and the wish below before continuing.

## Cross-references

- Wish: `.genie/wishes/pack-git-native-architecture/WISH.md` — the cleanup program that codifies and enforces this rule across all 8 pack repos + app-kit + desktop + core.
- AGENTS.md: workspace `AGENTS.md` → section "What is on npm and what is not" names the four legitimate packages and points back here.
- Related rule: `.claude/rules/wish-placement.md` — explains why cross-cutting cleanup like this lives at the workspace level.
