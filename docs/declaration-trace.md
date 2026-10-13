# Declaration, resolution and evidence in the revised talk

The first example now follows a concrete source-to-plan derivation. Later
pre-run views expose selected configuration and authored questions; after-run
views are prepared summaries of retained observations. The REPL remains a
presentation mock.

## Slide and script revision map

| Slides | Revision |
|---|---|
| 11–13 | Selected realisation clauses, provider recipe/contract, experiment request and expected check values |
| 14–16 | Source inspection, one worked derivation, then the execution boundary |
| 17–20 | Expected versus observed values, separate static/runtime bases, bounded account |
| 21–23 | Structural findings attributed to three configurations |
| 24–28 | Selected timing configuration, unanswered runtime question, separate follow-up run and observations |
| 30, 34 | Task/parameter selection, observation inputs and prior evidence before behaviour/contrast runs |
| 36–37 | Revisit the sources, bindings and investigations when handing over or changing the system |

Corresponding sections of the maintained `say-show-script.md` were revised.
Slide order and the 39-slide count are preserved. Revised spoken passages need
a fresh timing rehearsal.

## Available sources and capture provenance

The requested `/home/paddy/dev/phd/rotifer` checkout is absent in this workspace.
The available Rotifer implementation is
`/home/paddy/dev/phd/robotics-testbench-framework`, at revision
`1279e9217931a53285ac32f7b0b1d791beb2aed7` (29 July 2026).
It is older than the selected October captures. It is used to inspect the
implemented derivation and relevant source clauses, not to claim that the
October experiment was reproduced here.

The talk notes and retained records are at
`/home/paddy/Documents/knowledge/phd-notes-2/02_my_notes/talks/roscon-2026`.
The selected presence capture is
`20261001T151956.546871Z-ba4189019e54`, produced at Rotifer revision
`1d964a6578abdaf89776b7078c80e219008108dd`. The Stage 4–5 captures use
`19ee3b7d28c66015fbc5d0fcde1b5b9ed3d2ddf8`.

[Experiment accounts](../data/experiment-accounts.json) retain each record's
canonical experiment, realisation, configuration, metadata hash and evidence
path. `warehouse_navigation` is the audience alias for the source scenario
`warehouse_teleop`; the source identifiers are preserved.

## Worked example: selected TF provision

1. [Experiment source](source-excerpts/experiment.yaml) selects
   `nav2_corridor_probe` and `warehouse_teleop@gazebo_nav2_substrate`.
   Its observer environment sets `NAV2_REQUIRED_TF_EDGES` to
   `[{"parent":"odom","child":"base_link"}]`.
2. [App source](source-excerpts/app.yaml) places the TF request under
   `spec.roles[].optional.observations`, with contract `tf_tree` and
   `bindingConfig.requiredEdges`. It is not a mandatory contract requirement.
3. [Realisation source](source-excerpts/realisation.yaml) declares the
   concrete `tf_tree` provision, `/tf` and `/tf_static` default topics,
   `status: experimental`, and `/tf`'s Gazebo topic adaptation.
4. [Provider source](source-excerpts/provider.yaml) supplies the
   `spec.runtime.bridgeRecipes.observations.tf_tree` recipe: direction
   `gz_to_ros`, ROS type `tf2_msgs/msg/TFMessage`, Gazebo type
   `gz.msgs.Pose_V`. Its capability catalogue alone is not concrete provision.
5. In `tools/rotifer/providers.py`, `_bridge_entries` combines active
   realisation provisions, topic adaptations and provider recipes.
   [Captured bridge plan](source-excerpts/presence-bridge-plan.json) records
   `/model/vehicle_blue/tf` → `/tf` with those message types.
6. `gazebo_provider_preflight` inspects the selected SDF and the experiment's
   requested edges. [Captured preflight](source-excerpts/presence-preflight.json)
   reports the requested edge as `mismatched`, with model-scoped frame IDs
   inferred as `vehicle_blue/odom` → `vehicle_blue/chassis`. These are inferred
   defaults, not explicit SDF frame tags or runtime measurements.
7. The retained observer output and `results.yaml` record the runtime lookup
   as `missing`. Its expected check value was also `missing`; the passed
   check does not assert that the relationship was available.

Selected source excerpts in the slides omit unrelated clauses and reflow
long values. Full available documents are retained above. The available
experiment source has 15 checks; the October capture records 17, including
two recorder-integrity checks added later. Check counts and expected values
on slides come from the captured result, not the older source copy.

## Implemented resolution and presentation interpretation

`tools/rotifer/contracts.py` computes mandatory contract satisfaction and
resolved bindings from app `requires` and active realisation provisions.
For this selected experiment, captured metadata reports empty required
contract sets, an empty `satisfactionTrace` and empty `resolvedBindings`.
An empty trace is not an automatically inferred `UNKNOWN` edge status.

`tools/rotifer/rotifer.py::resolve_experiment` does construct the Gazebo bridge
plan and model preflight before provider execution.
`tools/rotifer/output.py::explain_experiment` resolves and prints selected
declared structure. It does not implement the combined runtime account shown
in the presentation's repeated `explain` interactions.

The revised pre-run display is a focused projection of selected declaration,
plan and preflight fields. It is not a verbatim CLI transcript. After-run
displays combine those fields with retained observations and are labeled
prepared summaries. The broader conclusion and selection of the next probe
remain the engineer's interpretation.

## Later stages

- Stage 2's summary is explicitly a retained aggregate from three separate
  configurations. It is ready without a new summary run.
- Stage 3 starts each selected experiment with its own configuration and an
  unanswered scan-time question. Declared model rates are source settings,
  not runtime compatibility. The map-surface and timing worlds differ; the
  rate change is not isolated as the cause. `timing_follow_up` remains unrun
  in the presentation until its own run completes.
- Stage 4 pre-run views show goal, timeout, parameter-file selection and
  observation inputs from the captured experiment configuration. Forward
  progress is an authored question, not a statically guaranteed behaviour.
- Stage 5 keeps the prior MPPI evidence separate from the RPP configuration
  and newly revealed RPP observations. Goal acceptance/success is supplied
  by the native goal record rather than the bag.

No Rotifer implementation or captured evidence was changed or rerun. The
remaining provenance limitation is the absence of the exact October source
checkout: the selected captures and their hashes remain the authority for
recorded outcomes, and the July source is identified separately.

## Validation

- Production deck build passed with all 39 slides.
- Vue component compilation and actual command-handler checks passed for
  source targeting, independent before/after run state, the timing alias,
  reset, retained structural summary and controller contrast.
- Browser checks covered 17 revised slides, including the source excerpts and
  the visible runtime-surface → timing-follow-up sequence. No checked content
  extended beyond the slide frames; the follow-up revealed results only after
  its own run. Source-code contrast was corrected during screenshot review.
- All nine selected metadata hashes and all nine audited implementation-source
  hashes match their source files. Git whitespace and export-script syntax
  checks passed.
