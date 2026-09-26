# Add Support For Programmatic Attachment

## Bruce's Ask

Can you please follow the example of [be-persistent](https://github.com/bahrus/be-persistent) and [the addendum](../types/ImportantEnhancementAddendum.md) to add demos and adjust be-literate.js as needed and add def.js to support programmatic attachment of this enhancement?

Please add your implementation notes below.

## Implementation Notes

Followed `be-persistent` (`def.js`, `demo/Programmatic/`, `tests/Programmatic*`) and the addendum's checklist.

### Changes

- **`def.js`** (new) -- exports `defBeLiterate(ref)`, formulaic per the addendum: loads `emc.json`, sets `enhConfig.spawn = BeLiterate`, copies `customData` onto `enhConfig`, pushes to `(ref?.customElementRegistry ?? customElements).enhancementRegistry`, returns `enhConfig`. No `📖` variant -- the `enhKey` wouldn't be usable as a `.set` identifier anyway, and `be-persistent` doesn't ship one either.
- **`be-literate.js`** `init()`:
  - reads `ctx.emc || ctx.config` (step 2),
  - `await`s `roundabout(...)` and then sets `self.initialized = true` (step 1).
- **`types/be-literate/types.d.ts`** -- added `initialized?: boolean` to `AllProps`. (This is in the `types` submodule, so it needs committing there too.)
- **`emc.mjs`** (+ regenerated `emc.json` / `📖.json`) -- replaced the compact `when_readVerb_changes_call_hydrate` with a `hydrate` action gated on `initialized`, mirroring `be-persistent`:
  ```JS
  hydrate: {
      ifKeyIn: ['readVerb', 'initialized'],
      ifAllOf: ['enhancedElement', 'initialized']
  }
  ```
- **`package.json`** -- `exports` now includes `./def.js`, `./emc.json`, `./📖.json`, `./FileManager.js`.
- **`playwright.config.ts`** (new, copied from `be-persistent`) -- the repo had a `test` script but no config or `tests/` folder.
- **README** -- new "Programmatic Attachment" section.

### Bug found: hydrate never fired when `readVerb` was set before init finished

The first run of `ProgrammaticDeclarativeInSequence` failed: the instance spawned and `initialized` became `true`, but `hydrate` never ran, so no `change` listener was attached. The cause:

1. `enh.set.beLiterate.readVerb = 'readAsText'` spawns the instance synchronously and writes `readVerb` before `roundabout` has wired up accessors.
2. `roundabout` "rescues" that pre-existing value as the accessor's initial storage (`__roundaboutRescuedProps`) *without notifying*, and skips it when applying `initialPropVals`/`defaultPropVals`.
3. So `readVerb` never "changes", and the `readVerb`-only compact never calls `hydrate`.

This wasn't only a test artifact: any consumer who set `readVerb` (to any value) through `.set` or right after `enh.get()` would get an enhancement that silently did nothing. Imperative and out-of-sequence usage without an early `readVerb` write happened to work, since there the default is applied as a real change.

Gating `hydrate` on `initialized` fixes it without depending on how roundabout treats rescued props. It's arguably also worth having roundabout-lib notify (or re-evaluate actions/compacts) for rescued props -- any enhancement triggering off a single user-settable prop via a compact is exposed to the same issue.

No reserved-name collisions (step 4): be-literate's props are `readVerb`, `writeTo`, `fileContents`, `writtenTo`.

### Demos (`demo/Programmatic/`)

- `DeclarativeInSequence.html`
- `DeclarativeOutOfSequence.html`
- `Imperative.html`

Each attaches to an attribute-less `<input type=file>` and writes the selected file to `sessionStorage://{file.name}`, logging the `load` event.

### Tests (`tests/`)

- `ProgrammaticDeclarativeInSequence`, `ProgrammaticDeclarativeOutOfSequence`, `ProgrammaticImperative` -- the three patterns.
- `AttributeWriteTo` -- regression coverage for the original be-hive / `📖` attribute path, since the hydrate trigger changed.

Each fixture sets `ready` on `#target` once the enhancement reports `resolved` (hydrate has attached the `change` listener). The spec then calls `setInputFiles` with a `hello.txt` containing `hello`, and the fixture sets `mark=good` once fifteenth's `postMessage` confirms the write and `sessionStorage` holds `hello`. All 4 pass on chromium (`npx playwright test`).
