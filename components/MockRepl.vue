<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  stage: { type: Number, default: 1 },
})

// `totalElapsedSeconds` from the pinned runs' runtime_timing.json evidence.
// Stage 1–2: selected-evidence/phase-a-stages-1-2/<run>/runtime_timing.json
// Stage 3: selected-evidence/phase-a-stage-3/<run>/runtime_timing.json
// Stage 4–5: selected-evidence/one-shot-captures/<run>/native/runtime_timing.json
// Timings include provider startup/readiness and experiment evaluation.
const runDurationsSeconds = {
  presence_check: 16.155,
  odometry_link: 16.074,
  scan_source: 24.4,
  scan_integration: 34.451,
  runtime_surface: 184.049,
  timing_follow_up: 23.13,
  goal_and_path: 48.57,
  local_corridor_check: 49.085,
  rpp_attempt: 21.572,
}

const stageData = {
  0: {
    name: 'Command help',
    commands: {
      'roti -h': 'Show the Rotifer command-line options; run `roti` to enter the investigation workspace.',
      'roti': 'Rotifer REPL ready. The next commands act on the selected investigation.',
      'source show -h': 'Show the authored experiment, its realisation, and the question it asks.',
      'explain -h': 'Show what the evidence supports so far and what remains open.',
      'run -h': 'Run the selected experiment and retain its observations.',
    },
    suggestions: ['roti -h', 'roti'],
  },
  1: {
    name: 'Presence',
    commands: {
      'select presence_check': 'selected: Presence check',
      'source show': `experiment:   Presence check
realisation@scenario: warehouse_teleop@gazebo_nav2_substrate
provider:     gazebo (Nav2 substrate)
required:     odom → base_link
question:     Is the required frame relationship available?
conditions:   ROS 2 Jazzy · headless provider-backed run`,
      'source show presence_check': `experiment:   Presence check
realisation@scenario: warehouse_teleop@gazebo_nav2_substrate
provider:     gazebo (Nav2 substrate)
required:     odom → base_link
question:     Is the required frame relationship available?
conditions:   ROS 2 Jazzy · headless provider-backed run`,
      'explain presence_check': [
        `source:       Presence check
requires:     odom → base_link
assumption:   required odometry-to-base relationship is available
account:      NOT ESTABLISHED
basis:        authored declaration; no retained edge evidence yet
next question: inspect transform/frame data`,
        `evidence:    /tf and /odom present
observed:     vehicle_blue/odom → vehicle_blue/chassis
required:     odom → base_link NOT OBSERVED
account:      topic presence established; required edge remains open`,
      ],
      'run presence_check': `evaluation:   17/17 declared checks passed
capture:      counted real-provider run
replay:       copied-bundle replay verified`,
      'evidence show presence': `ROS topic surface:
  /tf          PRESENT
  /odom        PRESENT

Inspected frame data:
  observed:    vehicle_blue/odom → vehicle_blue/chassis
  required:    odom → base_link
  result:      NOT OBSERVED`,
      'stage summary': `STAGE 1 · PRESENCE

ASSUMPTION   odom → base_link available
PROBE        ROS topics · transform/frame data
EVIDENCE     /tf and /odom present; observed odometry frames differ
             from required odom → base_link
WHAT THIS SHOWS  Required edge not observed in this run
STILL OPEN   Structure · runtime/timing · navigation`,
    },
    suggestions: ['select presence_check', 'source show', 'explain presence_check', 'run presence_check', 'evidence show presence', 'stage summary'],
  },
  2: {
    name: 'Structure',
    commands: {
      'source show': `selected experiments:
  Odometry link
  Scan source
  Scan integration
provider/model-owned: odometry, TF stream, LaserScan stream
realisation-owned: scan-frame integration transform`,
      'source show odometry_link': `experiment:   Odometry link
realisation@scenario: warehouse_teleop@gazebo_nav2_tf_substrate
provider:     provider/model supplies odometry and TF
question:     is odom → base_link present?`,
      'evidence show odometry_link': `counted capture · evaluation passed 20/20 checks
observed: odom → base_link present
scope: this structural relationship only`,
      'run odometry_link': `evaluation:   20/20 declared checks passed
capture:      counted real-provider run`,
      'source show scan_source': `experiment:   Scan source
realisation@scenario: warehouse_teleop@gazebo_nav2_scan_substrate
provider:     provider/model supplies the scan stream
topic:        /scan · sensor_msgs/msg/LaserScan
frame:        vehicle_blue/laser_frame/scan`,
      'evidence show scan_source': `counted capture
/scan source and frame observed
base_link → scan frame: NOT OBSERVED
the scan frame was disconnected in this configuration`,
      'run scan_source': `evaluation:   21/21 declared checks passed
capture:      counted real-provider run`,
      'source show scan_integration': `experiment:   Scan integration
realisation@scenario: warehouse_teleop@gazebo_nav2_scan_tf_substrate
provider:     realisation supplies the scan-frame transform
question:     is base_link → scan connected?`,
      'evidence show scan_integration': `counted capture · evaluation passed 19/19 checks
observed: base_link → vehicle_blue/laser_frame/scan
scan frame connected in this configuration`,
      'run scan_integration': `evaluation:   19/19 declared checks passed
capture:      counted real-provider run`,
      'explain structural_compatibility': `observed across three separate configurations:
  odom → base_link present
  /scan source and frame present
  base_link → scan absent in scan-source run; present in scan-integration run

open: scan-time availability · navigation behaviour`,
      'explain scan_integration': `observed across three separate configurations:
  odom → base_link present
  /scan source and frame present
  base_link → scan absent in scan-source run; present in scan-integration run

open: scan-time availability · navigation behaviour`,
      'stage summary': `STAGE 2 · STRUCTURE

ODOMETRY    odom → base_link present
SCAN        /scan source and frame present
INTEGRATION base_link → scan present in final scan-TF run

Three distinct configurations · not one continuous repair
Still open: scan-time availability · navigation behaviour`,
    },
    suggestions: ['source show', 'source show odometry_link', 'run odometry_link', 'evidence show odometry_link', 'source show scan_source', 'run scan_source', 'evidence show scan_source', 'source show scan_integration', 'run scan_integration', 'evidence show scan_integration', 'explain scan_integration', 'stage summary'],
  },
  3: {
    name: 'Runtime',
    commands: {
      'source show': `selected experiments:
  Runtime surface · warehouse_teleop@gazebo_nav2_map_surface
  Timing follow-up · warehouse_teleop@gazebo_nav2_costmap_timing
comparison: separate realisations and Gazebo world files`,
      'source show runtime_surface': `experiment:   Runtime surface
realisation@scenario: warehouse_teleop@gazebo_nav2_map_surface
question:     Are the map, lifecycle and navigation interfaces available?
probe:        runtime interfaces and scan-time transform lookup`,
      'explain runtime_surface': `map:          present · frame map
required nodes: active
NavigateToPose: available
latest TF:     available at 153.0 s
scan at 153.4 s: transform unavailable

account: runtime surface present; scan-time lookup failed`,
      'explain timing_follow_up': `scan at 12.7 s: transform available
scan drops:    none observed
evaluation:    21/21 declared checks passed

account: scan-time compatible under this run's conditions`,
      'run runtime_surface': `evaluation:   21/21 declared checks passed
capture:      counted real-provider run
observation:  2,358 scan drops recorded`,
      'run timing_follow_up': `evaluation:   21/21 declared checks passed
capture:      counted real-provider run
observation:  no scan drops observed`,
      'evidence show timing_follow_up': `experiment:   Timing follow-up
realisation@scenario: warehouse_teleop@gazebo_nav2_costmap_timing
scan rate:    10 Hz
at 12.7 s:    scan and transform both available
scan drops:   none observed
evaluation:   21/21 declared checks passed

Separate configuration; publication rate was not isolated as the cause.`,
      'stage summary': `STAGE 3 · RUNTIME

RUNTIME      map · nodes · NavigateToPose available
SURFACE      153.0 s: latest TF available
SCAN         153.4 s: transform unavailable · 2,358 drops
FOLLOW-UP    10 Hz · transform available · no drops observed
STILL OPEN   Separate configuration; cause not isolated`,
    },
    suggestions: ['source show', 'source show runtime_surface', 'explain runtime_surface', 'run runtime_surface', 'run timing_follow_up', 'evidence show timing_follow_up', 'explain timing_follow_up', 'stage summary'],
  },
  4: {
    name: 'Behaviour',
    commands: {
      'source show': `selected experiments: Goal and path · Local corridor check
realisation: warehouse_teleop@gazebo_nav2_goal_base_footprint
task: 0.5 m map-frame goal · MPPI-configured captures
scope: two separate one-shot attempts`,
      'source show goal_and_path': `experiment:   Goal and path
realisation@scenario: warehouse_teleop@gazebo_nav2_goal_base_footprint
task:         0.5 m map-frame navigation goal
controller:   MPPI`,
      'source show local_corridor_check': `experiment:   Local corridor check
realisation@scenario: warehouse_teleop@gazebo_nav2_goal_base_footprint
probe:        one-shot local-feasibility check
controller:   MPPI`,
      'run goal_and_path': `evaluation:   39/39 declared checks passed
capture:      one-shot real-provider attempt`,
      'run local_corridor_check': `evaluation:   33/33 declared checks passed
capture:      one-shot real-provider attempt`,
      'explain goal_and_path': `goal:         accepted
global path:  valid path observed
local check:  sampled corridor clear to 0.6 m
command:      no forward command observed
odometry:     no translational progress
goal record:  timed out

account: expected progress did not occur; cause remains open`,
      'evidence show goal_and_path': `Goal and path · one-shot attempt at 20:33:41Z
goal record: accepted, then timed out
replayed topics: valid path · zero forward command · no motion`,
      'evidence show local_corridor_check': `Local corridor check · one-shot attempt at 20:38:41Z
probe: corridor sampled clear to 0.6 m

The capture does not contain the submitted goal or final-result reply.`,
      'stage summary': `STAGE 4 · BEHAVIOUR

GOAL          accepted · timed out
PATH          valid
CORRIDOR      sampled clear to 0.6 m
COMMAND       no forward command
ODOMETRY      no translational progress
STILL OPEN    Cause of failure`,
    },
    suggestions: ['source show', 'source show goal_and_path', 'run goal_and_path', 'source show local_corridor_check', 'run local_corridor_check', 'explain goal_and_path', 'evidence show goal_and_path', 'evidence show local_corridor_check', 'stage summary'],
  },
  5: {
    name: 'Controlled contrast',
    commands: {
      'source show rpp_attempt': `experiment:   RPP attempt
realisation@scenario: warehouse_teleop@gazebo_nav2_goal_base_footprint
task:         0.5 m map-frame navigation goal
controller:   RPP`,
      'run rpp_attempt': `evaluation:   39/39 declared checks passed
capture:      one-shot real-provider attempt`,
      'explain controller_progress': `QUESTION
  Could this system support the task with a different controller?

CURRENT ACCOUNT
  MPPI: no forward progress under the inspected conditions
  RPP: forward command, motion, and goal success observed

WHAT CHANGED IN THE ACCOUNT?
  General inability of the prepared substrate to accomplish the
  task is no longer sufficient to explain the MPPI result.

STILL OPEN
  Why did MPPI stall here? How repeatable is the RPP result?`,
      'evidence show mppi': `earlier MPPI attempts
forward command:      none observed
translational motion: none observed
goal records:         timed out`,
      'evidence show rpp_attempt': `one RPP attempt · 2026-10-02 21:07:56Z
forward command:      19 positive linear-x samples
maximum speed:        0.208333 m/s
odometry displacement: 0.288761 m
goal record:           accepted · success within 30 s
XY tolerance:          0.25 m

The recorded result does not show exact arrival at the nominal 0.5 m goal.`,
      'stage summary': `STAGE 5 · CONTROLLED CONTRAST

QUESTION
  Could this system support forward progress with another controller?
HELD STEADY
  The named realisation and 0.5 m goal task
CHANGED
  MPPI → RPP
EVIDENCE
  Forward command · translational motion · goal success
WHAT CHANGED IN THE ACCOUNT?
  General substrate inability is no longer sufficient to explain the result.
STILL OPEN
  Why did MPPI stall here? How repeatable is the RPP result?

This does not establish general RPP superiority or a complete
diagnosis of the MPPI failure.`,
    },
    suggestions: ['source show rpp_attempt', 'run rpp_attempt', 'explain controller_progress', 'evidence show mppi', 'evidence show rpp_attempt', 'stage summary'],
  },
}

const stage = computed(() => stageData[props.stage] || stageData[1])
const stageLabel = computed(() => props.stage === 0 ? 'REPL introduction' : `Stage ${props.stage}`)
const insideRepl = ref(props.stage !== 0)
const promptPrefix = computed(() => insideRepl.value ? 'roti>' : '❯')
const suggestions = computed(() => props.stage === 0 && insideRepl.value
  ? ['source show -h', 'explain -h', 'run -h']
  : stage.value.suggestions)
const input = ref('')
const isRunning = ref(false)
const transcript = ref(null)
const inputId = `mock-repl-stage-${props.stage}`

function buildInitial(data) {
  if (props.stage === 0) {
    return [{ kind: 'notice', text: 'Shell prompt · use roti -h for options, then roti to enter the REPL.' }]
  }
  return [{ kind: 'notice', text: `${stageLabel.value} · ${data.name}\nType help to see the commands prepared for this panel.` }]
}

const entries = ref(buildInitial(stage.value))
const responseCursors = ref({})

watch(stage, (next) => {
  entries.value = buildInitial(next)
  insideRepl.value = props.stage !== 0
  responseCursors.value = {}
  input.value = ''
})

function helpOutput() {
  return `Prepared commands for ${stageLabel.value} · ${stage.value.name}\n\n${suggestions.value.map((command) => `  ${command}`).join('\n')}\n  help\n  clear\n\nOnly these scripted responses are available. No ROS or shell command runs.`
}

async function submit(raw = input.value) {
  if (isRunning.value) return

  const command = raw.trim().replace(/\s+/g, ' ')
  if (!command) return

  const key = command.toLowerCase()

  if (key === 'clear') {
    entries.value = []
    input.value = ''
  } else {
    const scripted = stage.value.commands[key]
    let output
    if (key === 'help') output = helpOutput()
    else if (Array.isArray(scripted)) {
      const index = responseCursors.value[key] || 0
      output = scripted[Math.min(index, scripted.length - 1)]
      responseCursors.value[key] = index + 1
    } else output = scripted || 'No scripted response for that command. Type help to see the commands prepared for this stage.'
    const wireName = key.startsWith('run ') ? key.slice('run '.length) : null
    const runDuration = wireName ? runDurationsSeconds[wireName] : 0
    const entry = { kind: 'exchange', command, prompt: promptPrefix.value, output: runDuration ? 'experiment running...' : output }
    entries.value.push(entry)
    input.value = ''
    if (props.stage === 0 && key === 'roti') insideRepl.value = true
    if (runDuration) {
      isRunning.value = true
      await nextTick()
      if (transcript.value) transcript.value.scrollTop = transcript.value.scrollHeight
      await new Promise((resolve) => window.setTimeout(resolve, runDuration * 1000))
      entry.output = output
      isRunning.value = false
    }
  }

  await nextTick()
  if (transcript.value) transcript.value.scrollTop = transcript.value.scrollHeight
}

function reset() {
  insideRepl.value = props.stage !== 0
  entries.value = buildInitial(stage.value)
  responseCursors.value = {}
  input.value = ''
  nextTick(() => {
    if (transcript.value) transcript.value.scrollTop = transcript.value.scrollHeight
  })
}
</script>

<template>
  <section class="mock-repl" :aria-label="`${stageLabel} · ${stage.name}`">
    <header class="mock-repl-header">
      <div class="mock-repl-title"><span class="mock-repl-dot"></span> {{ insideRepl ? 'ros_ws / Rotifer REPL' : 'shell / ros_ws' }}</div>
      <div class="mock-repl-disclosure">MOCK · NO LIVE ROS OR SHELL</div>
    </header>

    <div ref="transcript" class="mock-repl-transcript" aria-live="polite">
      <div v-for="(entry, index) in entries" :key="`${index}-${entry.kind}`" class="mock-repl-entry">
        <div v-if="entry.kind === 'notice'" class="mock-repl-notice">{{ entry.text }}</div>
        <div v-else class="mock-repl-exchange">
          <div class="mock-repl-command"><span>{{ entry.prompt || promptPrefix }}</span>{{ entry.command }}</div>
          <div class="mock-repl-output">{{ entry.output }}</div>
        </div>
      </div>
    </div>

    <div class="mock-repl-form">
      <label class="mock-repl-prompt" :for="inputId">{{ promptPrefix }}</label>
      <input
        :id="inputId"
        v-model="input"
        :list="`${inputId}-commands`"
        class="mock-repl-input"
        type="text"
        :disabled="isRunning"
        autocomplete="off"
        spellcheck="false"
        placeholder="Click here and type a command, then press Enter"
        @keydown.stop
        @keydown.enter.prevent.stop="submit()"
      />
      <datalist :id="`${inputId}-commands`">
        <option v-for="command in suggestions" :key="command" :value="command" />
        <option value="help" />
        <option value="clear" />
      </datalist>
      <button class="mock-repl-run" type="button" :disabled="isRunning" @click="submit()">Run</button>
      <button class="mock-repl-reset" type="button" :disabled="isRunning" aria-label="Reset this mock REPL" @click="reset">Reset</button>
    </div>
    <footer class="mock-repl-footer">
      <template v-if="props.stage === 0">Command help · short descriptions for this talk</template>
      <template v-else>Stage {{ props.stage }} of 5 · outputs are scripted; evidence provenance remains attached to the cited runs.</template>
    </footer>
  </section>
</template>

<style scoped>
.mock-repl {
  width: 100%;
  max-width: 1000px;
  height: 25rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow: hidden;
  pointer-events: auto;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  background: #2c001e;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.24);
  color: #f4e9ef;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}

.mock-repl-header {
  display: flex;
  min-height: 2.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: #39343a;
}

.mock-repl-title {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: #d6c7cf;
  font-size: 0.78rem;
}

.mock-repl-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: #e95420;
  box-shadow: 0.85rem 0 0 #6e6870, 1.7rem 0 0 #6e6870;
  margin-right: 1.7rem;
}

.mock-repl-disclosure {
  color: #ffb092;
  font-family: 'Ubuntu', sans-serif;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.07em;
}

.mock-repl-transcript {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0.85rem 1.15rem;
  scrollbar-color: #6f5667 #2c001e;
}

.mock-repl-exchange { margin-bottom: 0.9rem; }

.mock-repl-notice {
  color: #bcaeb6;
  font-size: 0.78rem;
  line-height: 1.45;
}

.mock-repl-command {
  display: flex;
  gap: 0.65rem;
  color: #ffcfbd;
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.4;
}

.mock-repl-command span,
.mock-repl-prompt { color: #ff8b61; }

.mock-repl-output {
  margin: 0.18rem 0 0 1.38rem;
  color: #f4e9ef;
  background: transparent;
  border: 0;
  box-shadow: none;
  font-family: inherit;
  font-size: 0.78rem;
  line-height: 1.38;
  white-space: pre-wrap;
}

.mock-repl-form {
  display: flex;
  min-height: 3.25rem;
  flex-shrink: 0;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  background: #241018;
}

.mock-repl-prompt { font-size: 0.95rem; font-weight: 700; }

.mock-repl-input {
  min-width: 0;
  flex: 1;
  padding: 0.55rem 0.7rem;
  border: 1px solid #806a79;
  border-radius: 6px;
  outline: 0;
  background: #3b2a36;
  color: #fffaf6;
  font: inherit;
  font-size: 0.8rem;
}

.mock-repl-input::placeholder { color: #c3b7bf; }
.mock-repl-input:focus-visible { border-color: #ff8b61; box-shadow: 0 0 0 2px rgba(255, 139, 97, 0.18); }

.mock-repl-run,
.mock-repl-reset {
  padding: 0.4rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: #493744;
  color: #fffaf6;
  font-family: 'Ubuntu', sans-serif;
  font-size: 0.75rem;
  cursor: pointer;
}

.mock-repl-run { border-color: #e95420; background: #a33d1c; }
.mock-repl-run:hover { background: #c7461a; }
.mock-repl-reset:hover { background: #5b4654; }

.mock-repl-footer {
  flex-shrink: 0;
  padding: 0.45rem 1rem 0.55rem;
  color: #bcaeb6;
  font-family: 'Ubuntu', sans-serif;
  font-size: 0.66rem;
}

@media (max-width: 700px) {
  .mock-repl { height: 24rem; }
  .mock-repl-header { align-items: flex-start; flex-direction: column; gap: 0.3rem; }
  .mock-repl-transcript { padding-inline: 0.75rem; }
  .mock-repl-output { font-size: 0.7rem; margin-left: 0.85rem; }
  .mock-repl-form { gap: 0.4rem; padding-inline: 0.65rem; }
  .mock-repl-reset { display: none; }
}
</style>
