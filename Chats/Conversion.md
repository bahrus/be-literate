# Conversion

## Bruce's Ask

Please follow the directions of [](../types/EnhancementConversionInstructions.md) to convert the legacy code in the legacy folder and the ts-refs/be-literate folder to the new approch.

Please provide your implementation notes below, including any gaps you encountered in attempting to convert the code.

## Implementation Notes (Claude)

### What was converted

| Step | Action | Result |
|------|--------|--------|
| 1 | Migrate types `ts-refs/be-literate` → `types/be-literate` | `types/be-literate/types.d.ts` created; `ts-refs/` folder deleted and its gitlink removed from the index (`git rm -r --cached ts-refs`). It had no `.gitmodules` entry. |
| 2 | Archive legacy | Already done before I started — `legacy/` holds `be-literate.js`, `FileManager.js`, `emc.js`, `📖.js`. |
| 3 | `package.json` deps + scripts | `build` script added (`node emc.mjs > emc.json && node 📖.mjs > 📖.json`); deps swapped to `be-hive@0.1.18`, `mount-observer@0.1.53`, `roundabout-lib@0.0.36`; `be-enhanced` dropped. See deviations for `trans-render` / `serve`. `npm install` run (network was available). |
| 4 | `imports.html` | Rewritten to the modern import map (`be-literate/` → `/`, deps → `/node_modules/…/`). |
| 5 | Coding standards | `.kiro/steering/coding-standards.md` created verbatim from the template. |
| 6 | Standalone types | `EndUserProps` no longer extends `IEnhancement`; `enhancedElement` added to `AllProps` (typed `HTMLInputElement` since the code calls `.files` / `.checkValidity()`); `BAP` removed, all `BAP` → `AP`; `USL` inlined as `type USL = string` (was imported from `trans-render/XV/types`). |
| 7 | `emc.mjs` | Created. `enhKey: 'beLiterate'` (legacy `enhPropKey` kept verbatim), `spawn: 'be-literate/be-literate.js'`, `withAttrs: { base: 'be-literate', _base: { instanceOf: 'Object', mapsTo: '.' } }` (the whole attribute value is one JSON blob, exactly like the legacy `map['0.0']`), top-level `matching: 'input[type="file"]'` (from legacy `enhancedElementMatches`). `customData`: `weakRef.properties: ['enhancedElement']`, `actions.storeFileContents.ifAllOf: ['fileContents','writeTo']`, `compacts: { when_readVerb_changes_call_hydrate: 0 }`, `defaultPropVals: { readVerb: 'readAsText' }`. |
| 7a | Custom parser | **Not needed** — single JSON-object attribute, no `nested-regex-groups`. |
| 8 | VS Code file nesting | `.vscode/settings.json` created. |
| 8a | Auto-build hook | Skipped (optional). |
| 9 | Modern class | `be-literate.js` rewritten: no base class, constructor + `init(self, enhancedElement, ctx, initVals)`, `customData` pulled from `ctx.emc`, `roundabout-lib/roundabout.js` called once. Action methods `hydrate` / `storeFileContents` / `parseContents` carried over unchanged except `BAP` → `AP`. `FileManager.js` rewritten standalone (see below). |
| 10 | Emoji variant | `📖.mjs` created from the template (`...myJSON` spread at top level so `customData` + `matching` carry over; `enhKey` and `withAttrs.base` overridden to `📖`). |
| 11 | Tests / demos | All 5 demo HTML files updated to the `<be-hive><script type=emc src="be-literate/📖.json">` pattern. No `tests/` folder or `playwright.config.ts` exists, so nothing there to convert. |

### FileManager.js changes

The legacy `FileManager` was handed the `EnhancementInfo` (`#ei`) and read the enhancement name from `this.#ei.mountCnfg?.enhPropKey` to stamp onto the `load` / `progress` events (`event.enh`). The modern spawn lifecycle has no `EnhancementInfo`. Instead `BeLiterate.init` captures `ctx.config.enhKey` into a private field and passes it straight to `new FileManager(self, enhKey)`. `LoadEvent` / `FMProgressEvent` `enh` fields are now typed `string | symbol`.

### Runtime verification

Ran the demos headless against **Edge 152** (Playwright 1.62, driven transiently — not saved to `package.json`; the pinned `@playwright/test@1.49` bundles Chromium 131 which is too old, see gap 6):

- `<be-hive>` + `emc.json` **and** `📖.json` both spawn the enhancement.
- `change` → `FileReader` → `load` event fires with `event.enh` = `"beLiterate"` / `"📖"` and `event.fileContents` = `[[File, "…contents…"]]`.
- `progress` event fires (`FMProgressEvent`).
- `readVerb` default `readAsText` applied; inline `onload` / `onprogress` attributes work.
- `WriteTo.html` (`📖='{"writeTo":"indexedDB://myDB/myFiles/{file.name}"}'`): `storeFileContents` runs with no errors and creates IndexedDB database `myDB` via `trans-render/XV/set.js`.

`npm run build` regenerates both JSON files and both retain `customData`.

---

## Gaps / deviations from the instructions

1. **`trans-render` kept as a runtime dependency.** `storeFileContents` writes file contents to a Uniform Storage Path (`indexedDB://…`, etc.) via `trans-render/XV/set.js`, and the `USL` type came from `trans-render/XV/types`. The modern architecture (the `types` submodule) has **no equivalent** of the XV / Uniform Storage Path protocol — nothing matched `USL`, `XV/set`, "Uniform Storage" anywhere under `types/`. So Step 9's "remove imports from trans-render" could not be fully honored: `be-literate.js` still does `await import('trans-render/XV/set.js')` and `types.d.ts` inlines `export type USL = string`. If there is a modern replacement for XV/set, `storeFileContents` should be repointed at it.

2. **The `.w(cssQuery).a({…})` convenience API is gone.** Legacy `emc.js` / `📖.js` were browser modules that exported a `w` helper (via `be-hive/w.js`) so you could do `(await import('be-literate/📖.js')).w('#id').a({load, progress})`. The modern `emc.mjs` is a build-time script producing static JSON and exports nothing for the browser. `SeparateEventHandlers.html` and the README were rewritten to use plain `addEventListener`. If this helper is still wanted it needs a separate small runtime module.

3. ~~**`event.enh` value changed for the canonical name.**~~ **Resolved (Response I).** The instructions originally transformed `enhPropKey: 'beLiterate'` → `enhKey: 'BeLiterate'`. Per Bruce's feedback the legacy camelCase `beLiterate` is kept verbatim (reads better for property access). `emc.mjs`, both JSON configs, and the README now use `beLiterate`. `EnhancementConversionInstructions.md` Step 7 / Step 9 updated so future conversions keep the legacy `enhPropKey`. The exported JS class stays `BeLiterate`; only the registration key is camelCase.

4. **`inputEl.beEnhanced.beLiterate.fileContents` access path.** In the running conversion, `input.beEnhanced` had no enumerable enhancement keys — roundabout/assign-gingerly stores the instance differently than legacy be-enhanced. The `load` event (`event.fileContents`) and the `writeTo` storage path both work; the README no longer documents the `beEnhanced.…` reach-in. If a stable public accessor is required, it needs to be designed for the new architecture.

5. **`resolved` / `rejected` positractions removed.** Legacy declared `positractions: [resolved, rejected]` and `de = de` (a `dispatchEvent` positraction from trans-render) to fire lifecycle events. Per Step 7 ("remove any positractions") these are gone. `hydrate` still returns `{ resolved: true }` and `resolved?` / `rejected?` remain on `AllProps`, but nothing dispatches a `resolved`/`rejected` DOM event anymore. The enhancement's real outputs — the `load` and `progress` events from `FileManager` — are unaffected.

6. **Could not run the project's own test/CI setup.**
   - There is **no test suite** in the repo (only `test-results/.last-run.json`), so Step 11's `playwright.config.ts` edit and `npm test` verification are N/A.
   - ~~`@playwright/test` is pinned to `1.49.0`~~ **Resolved (Response I).** Bruce ran `npm run update`, which bumped `@playwright/test` to `1.62.1` (and every other dep to latest). Chromium 131 was the source of the `customElementRegistry.enhancementRegistry not available` error; the modern stack needs Chrome/Edge **146+**. `EnhancementConversionInstructions.md` Step 3 now states plainly that **all** dependencies including `devDependencies` / playwright must be upgraded to latest via `npm run update`, and that the version numbers in the doc are illustrative only.

7. **`serve` script / `devDependencies`.** Step 3's scripts block uses `node ./node_modules/spa-ssi/serve.js`; the legacy `serve` used `ssi-server`. I swapped `ssi-server` → `spa-ssi` in `devDependencies` and updated the script; `npm run serve` was confirmed working. (The "don't modify devDependencies" constraint has since been dropped from Step 3 — see gap 6.)

8. **`@this` on the constructor.** The instructions' own class template puts `@this {AllProps & Actions}` on the `constructor`, and the be-clonable reference does too. A standalone `tsc --strict` CLI run flags this (`TS2681: A constructor cannot have a 'this' parameter`) plus the expected "cannot find module 'be-literate/…'" for import-map specifiers. Kept as-is to match the documented house style; editor `@ts-check` (bundler resolution + the import map) is the intended checker and was not reproducible here as a standalone command.

9. **`package.json` metadata.** `main` / `module` / `exports` still point at `./be-literate.js` (unchanged). `files` now lists `*.json` and `types/be-literate/types.d.ts`; `types` field repointed to `types/be-literate/types.d.ts`. Version left at `0.0.12`.

10. **`emc.js` / `📖.js` deleted from repo root** (they live in `legacy/`). Those two deletions are still unstaged in git — intentional, left for you to stage/commit alongside the rest.

## Bruce's Response I

It seems to work, which is great, and thanks for the thorough explanation of changes.

Can you update the conversion instructions so that:

1.  You don't feel compelled to do this:

**`event.enh` value changed for the canonical name.** Legacy `enhPropKey: 'beLiterate'` (camelCase); modern `enhKey: 'BeLiterate'`

I think it actually reads better when access the enhancement to stick with traditional JS typing, so beLiterate is better.

2.  You no longer seem bound to not update playwright for some reason.  The documentation specifies versions, but we should be clear that all dependencies, including playwright, should be upgraded to the latest version.

I ran npm run update, which auto-corrected 2. above.  Can you switch back to beLiterate?

## Claude's Response to Response I

Both done.

**1. This project → `beLiterate`:**
- `emc.mjs`: `enhKey: 'beLiterate'` (was `'BeLiterate'`); `emc.json` regenerated via `npm run build`. `📖.mjs` / `📖.json` still override to `📖`. The exported class stays `class BeLiterate`; `be-literate.js` / `FileManager.js` read the key from `ctx.config.enhKey`, so no code changes were needed there.
- `README.md`: `event.enh` reference updated to `'beLiterate'`.
- Re-smoke-tested against Edge: `load` / `progress` fire with `event.enh === 'beLiterate'` (and `'📖'` via the shorthand); `writeTo` → IndexedDB still works.
- Gaps 3 and 6 above struck through.

**2. `EnhancementConversionInstructions.md` updated:**
- **Step 3** rewritten: drop the hard-coded version list; state that `npm run update` (`ncu -u`) must bump **every** dependency *and* `devDependency` (playwright, the SSI dev server, everything) to the latest published point version, and that the version numbers in the doc are illustrative only. Removed the "DO NOT modify `devDependencies`" instruction.
- **Step 7**: `enhKey` now `'[enhPropKey]'` — "keep the SAME key the legacy project used for `enhPropKey`" (camelCase, e.g. `beLiterate`). The be-committed worked example changed from `enhKey: 'BeCommitted'` to `enhKey: 'beCommitted'`; the do-invoke examples from `'DoInvoke'` to `'doInvoke'`.
- **Step 9**: added Key Change #9 — the exported JS class keeps its `Be…` / `Do…` PascalCase name; only the registration key (`enhKey`) is the legacy camelCase.