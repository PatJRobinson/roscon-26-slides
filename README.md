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

The current rehearsal revision has 34 slides. Stage 2 inspects configuration
without importing runtime observations. To check the script/REPL contract:

```sh
node scripts/check-presentation.mjs /path/to/say-show-script.md
```

The script is maintained in the PhD notes repository. The 40-minute target
requires a fresh timed rehearsal including typing, reveals and reading time.

## Rehearsal timer

The bottom-right **Timer** switch is off by default. Turn it on to enable the
rehearsal timer; it remembers your choice within the current tab, including
refreshes. While off, the timer does not run or record. Turning it off during
a run finishes and saves that run; turning it back on restores the completed
record, with **Start here** available for a new run. Existing recordings are kept.

Once enabled, the timer starts on the first arrival at slide 2, or you can choose
**Start here** in its **⋯** menu to begin a new run on any slide. It shows total
elapsed time and time on the current slide. Every slide change closes a split;
click reveals stay within the current slide. Revisits get their own splits and
are also added to per-slide totals. Time includes pauses and background tabs.

When running locally with `pnpm dev`, JSON and CSV reports save automatically
under `rehearsals/` on transitions, every five seconds, and when you finish.
This directory is ignored by Git. JSON includes individual visits and per-slide
totals; CSV has one row per visit with elapsed and cumulative seconds.

Use the timer's **⋯** menu to **Finish & save** after the last slide, download
JSON/CSV, or reset for another run. After reset, timing starts on the next
arrival at slide 2, or when you choose **Start here**. Once a run is finished,
**Start here** can start another without resetting; each run gets its own files.
Refreshing the same tab recovers the session; each tab has
its own run. In a published/static deck, use the download controls to save files.
The timer is omitted from printed/exported slides.

If Slidev was already running when the timer server configuration was added,
restart `pnpm dev` once to enable disk saving. Keep the presentation tab open;
refreshing it restores the browser session and uploads it to the restarted server.

Check timing and local file persistence with:

```sh
node scripts/check-rehearsal-timer.mjs
```
