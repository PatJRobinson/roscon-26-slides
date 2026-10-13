# ROSCon 2026 deep dive

Slidev source for the ROSCon 2026 presentation. The initial deck is being
built from the maintained talk brief, storyboard, say/show script, mock-REPL
working note, and fallback assessment in the PhD notes repository.

## Development

```sh
pnpm install
pnpm dev
```

Build the static deck with:

```sh
pnpm build
```

The current deck is an authoring and rehearsal scaffold. Prepared command
screens, retained evidence, captured/replayed visual context, and staged
material must remain visibly distinguished in the presentation.

The [declaration and evidence trace](docs/declaration-trace.md) records the
source clauses, resolver behaviour and captured artifacts behind the worked
example and REPL projections. [Experiment accounts](data/experiment-accounts.json)
retain the selected metadata, source hashes and configuration for each stage.
