<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  stage: { type: Number, default: 1 },
  startInside: { type: Boolean, default: false },
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
// `checked` totals from each pinned run's results.yaml summary.
const runCheckCounts = {
  presence_check: 17,
  odometry_link: 20,
  scan_source: 21,
  scan_integration: 19,
  runtime_surface: 21,
  timing_follow_up: 21,
  goal_and_path: 39,
  local_corridor_check: 33,
  rpp_attempt: 39,
}
// Keep the on-screen interaction brief while reporting the pinned run's measured duration.
const mockRunDurationSeconds = 5

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
      'roti': 'Rotifer REPL ready. Select an experiment to inspect its source, account and evidence.',
      'select presence_check': 'selected: Presence check',
      'source show': `EXPERIMENT · Presence check
system
  warehouse_navigation@gazebo_nav2_substrate
assumption
  A navigation claim needs evidence about the system it's running on.
what we're investigating
  odom → base_link
checks
  Provider startup · ROS topics · odometry · TF lookup
evidence to keep
  Observations · rosbag · run results
scope
  Checking the foundations, not navigation success.`,
      'source show presence_check': `EXPERIMENT · Presence check
system
  warehouse_navigation@gazebo_nav2_substrate
assumption
  A navigation claim needs evidence about the system it's running on.
what we're investigating
  odom → base_link
checks
  Provider startup · ROS topics · odometry · TF lookup
evidence to keep
  Observations · rosbag · run results
scope
  Checking the foundations, not navigation success.`,
      'run presence_check': `evaluation:      17/17 declared checks passed
capture:         counted real-provider run
replay:          copied-bundle replay verified`,
    },
    accounts: {
      presence_check: {
        before: `BEFORE RUNNING

What the descriptions tell us:
  Gazebo provides odometry and a TF stream.
  This setup configures /odom and /tf.

What we're looking for:
  odom → base_link

What the descriptions establish:
  ? UNKNOWN
  Nothing declares that this particular frame relationship is provided.

Runtime evidence: None yet.`,
        after: `AFTER RUNNING

What the descriptions establish:
  /odom and /tf configured
  odom → base_link  ? UNKNOWN

RUN OBSERVATIONS
  /tf and /odom present
  vehicle_blue/odom → vehicle_blue/chassis observed
  odom → base_link not observed

CURRENT ACCOUNT
  The required relationship was not found during this inspection.`,
      },
    },
    suggestions: ['select presence_check', 'source show', 'explain presence_check', 'run presence_check'],
  },
  2: {
    name: 'Structure',
    accounts: {
      odometry_link: { run: 'odometry_link', before: 'SUBSTRATE / DERIVED\nrequires: odom → base_link\n\nRUN OBSERVATIONS\nnone yet\n\nCURRENT ACCOUNT\nnot established', after: 'SUBSTRATE / DERIVED\nrequires: odom → base_link\n\nRUN OBSERVATIONS\nodom → base_link observed\n\nCURRENT ACCOUNT\nrequired odometry relationship observed in this configuration' },
      scan_source: { run: 'scan_source', before: 'SUBSTRATE / DERIVED\nrequires: /scan with a usable frame connected to base_link\n\nRUN OBSERVATIONS\nnone yet\n\nCURRENT ACCOUNT\nnot established', after: 'SUBSTRATE / DERIVED\nrequires: /scan with a usable frame connected to base_link\n\nRUN OBSERVATIONS\n/scan source and frame observed\nbase_link → scan frame not observed\n\nCURRENT ACCOUNT\nscan is present, but its frame is disconnected in this configuration' },
      scan_integration: { run: 'scan_integration', before: 'SUBSTRATE / DERIVED\nrequires: odometry, scan source and connected scan frame\n\nRUN OBSERVATIONS\nnone yet\n\nCURRENT ACCOUNT\nnot established', after: 'SUBSTRATE / DERIVED\nrequires: odometry, scan source and connected scan frame\n\nRUN OBSERVATIONS\nodom → base_link observed\n/scan source and frame observed\nbase_link → vehicle_blue/laser_frame/scan observed\n\nCURRENT ACCOUNT\nthese relationships were observed across three separate configurations; they are not one continuous repair' },
      structural_compatibility: { run: 'scan_integration', before: 'SUBSTRATE / DERIVED\nexpected: odom, scan source and connected scan frame\n\nRUN OBSERVATIONS\nnone yet\n\nCURRENT ACCOUNT\nstructural compatibility not established', after: 'RUN OBSERVATIONS\nodom → base_link present in odometry-link run\n/scan source and frame present in scan-source run\nbase_link → scan absent there; present in scan-integration run\n\nCURRENT ACCOUNT\nstructural pieces are demonstrated across separate configurations\n\nSTILL OPEN\nscan-time availability · navigation behaviour' },
    },
    commands: {
      'source show': `selected experiments:
  Odometry link
  Scan source
  Scan integration
provider/model-owned: odometry, TF stream, LaserScan stream
realisation-owned: scan-frame integration transform`,
      'source show odometry_link': `experiment:   Odometry link
realisation@scenario: warehouse_navigation@gazebo_nav2_tf_substrate
provider:     provider/model supplies odometry and TF
question:     is odom → base_link present?`,
      'run odometry_link': `evaluation:   20/20 declared checks passed
capture:      counted real-provider run`,
      'source show scan_source': `experiment:   Scan source
realisation@scenario: warehouse_navigation@gazebo_nav2_scan_substrate
provider:     provider/model supplies the scan stream
topic:        /scan · sensor_msgs/msg/LaserScan
frame:        vehicle_blue/laser_frame/scan`,
      'run scan_source': `evaluation:   21/21 declared checks passed
capture:      counted real-provider run`,
      'source show scan_integration': `experiment:   Scan integration
realisation@scenario: warehouse_navigation@gazebo_nav2_scan_tf_substrate
provider:     realisation supplies the scan-frame transform
question:     is base_link → scan connected?`,
      'run scan_integration': `evaluation:   19/19 declared checks passed
capture:      counted real-provider run`,
    },
    suggestions: ['source show', 'source show odometry_link', 'explain odometry_link', 'run odometry_link', 'source show scan_source', 'explain scan_source', 'run scan_source', 'source show scan_integration', 'explain scan_integration', 'run scan_integration', 'explain structural_compatibility'],
  },
  3: {
    name: 'Runtime',
    accounts: {
      runtime_surface: { run: 'runtime_surface', before: 'SUBSTRATE / DERIVED\nmap, active navigation nodes, action server and scan-time transform required\n\nRUN OBSERVATIONS\nnone yet\n\nCURRENT ACCOUNT\nnot established', after: 'RUN OBSERVATIONS\nmap present · required nodes active · NavigateToPose available\nlatest TF available at 153.0 s\nscan at 153.4 s: transform unavailable\n2,358 scan drops recorded\n\nCURRENT ACCOUNT\nruntime surface present; scan-time lookup failed', },
      timing_follow_up: { run: 'timing_follow_up', before: 'SUBSTRATE / DERIVED\nscan-time transform availability is required\nscan rate configured at 10 Hz\n\nRUN OBSERVATIONS\nnone yet\n\nCURRENT ACCOUNT\nnot established', after: 'RUN OBSERVATIONS\nat 12.7 s: scan and transform both available\nno scan drops observed · 21/21 checks passed\n\nCURRENT ACCOUNT\nscan-time compatible under this run’s conditions\nseparate configuration; publication rate was not isolated as the cause', },
    },
    commands: {
      'source show': `selected experiments:
  Runtime surface · warehouse_navigation@gazebo_nav2_map_surface
  Timing follow-up · warehouse_navigation@gazebo_nav2_costmap_timing
comparison: separate realisations and Gazebo world files`,
      'source show timing_follow_up': `experiment:   Timing follow-up
realisation@scenario: warehouse_navigation@gazebo_nav2_costmap_timing
scan rate:    10 Hz
question:     is scan-time transform availability reliable under this configuration?`,
      'source show runtime_surface': `experiment:   Runtime surface
realisation@scenario: warehouse_navigation@gazebo_nav2_map_surface
question:     Are the map, lifecycle and navigation interfaces available?
probe:        runtime interfaces and scan-time transform lookup`,
      'run runtime_surface': `evaluation:   21/21 declared checks passed
capture:      counted real-provider run
observation:  2,358 scan drops recorded`,
      'run timing_follow_up': `evaluation:   21/21 declared checks passed
capture:      counted real-provider run
observation:  no scan drops observed`,
    },
    suggestions: ['source show', 'source show runtime_surface', 'explain runtime_surface', 'run runtime_surface', 'source show timing_follow_up', 'explain timing_follow_up', 'run timing_follow_up'],
  },
  4: {
    name: 'Behaviour',
    accounts: {
      goal_and_path: { run: 'goal_and_path', before: 'SUBSTRATE / DERIVED\ntask: accepted 0.5 m map-frame goal; expected forward progress\n\nRUN OBSERVATIONS\nnone yet\n\nCURRENT ACCOUNT\nbehaviour not established', after: 'SUBSTRATE / DERIVED\ntask: accepted 0.5 m map-frame goal; expected forward progress\n\nRUN OBSERVATIONS\ngoal accepted, then timed out\nvalid path observed · zero forward command · no translational motion\n\nCURRENT ACCOUNT\nexpected progress was not observed; the goal outcome conflicts with the expected behaviour, and the cause remains open', },
      local_corridor_check: { run: 'local_corridor_check', before: 'SUBSTRATE / DERIVED\nprobe: one-shot local-feasibility check\n\nRUN OBSERVATIONS\nnone yet\n\nCURRENT ACCOUNT\nlocal corridor not assessed', after: 'RUN OBSERVATIONS\ncorridor sampled clear to 0.6 m\n\nCURRENT ACCOUNT\nthis separate one-shot probe found a clear local corridor; it does not change the recorded goal timeout', },
    },
    commands: {
      'source show': `selected experiments: Goal and path · Local corridor check
realisation: warehouse_navigation@gazebo_nav2_goal_base_footprint
task: 0.5 m map-frame goal · MPPI-configured captures
scope: two separate one-shot attempts`,
      'source show goal_and_path': `experiment:   Goal and path
realisation@scenario: warehouse_navigation@gazebo_nav2_goal_base_footprint
task:         0.5 m map-frame navigation goal
controller:   MPPI`,
      'source show local_corridor_check': `experiment:   Local corridor check
realisation@scenario: warehouse_navigation@gazebo_nav2_goal_base_footprint
probe:        one-shot local-feasibility check
controller:   MPPI`,
      'run goal_and_path': `evaluation:   39/39 declared checks passed
capture:      one-shot real-provider attempt`,
      'run local_corridor_check': `evaluation:   33/33 declared checks passed
capture:      one-shot real-provider attempt`,
    },
    suggestions: ['source show', 'source show goal_and_path', 'explain goal_and_path', 'run goal_and_path', 'source show local_corridor_check', 'explain local_corridor_check', 'run local_corridor_check'],
  },
  5: {
    name: 'Controlled contrast',
    accounts: {
      controller_progress: { run: 'rpp_attempt', before: 'SUBSTRATE / DERIVED\nquestion: could the prepared system support the task with another controller?\n\nRUN OBSERVATIONS\nMPPI: no forward progress under inspected conditions\nRPP: not yet run\n\nCURRENT ACCOUNT\ngeneral substrate inability remains one possible explanation\n\nSTILL OPEN\nwhy MPPI stalled', after: 'RUN OBSERVATIONS\nMPPI: no forward progress under inspected conditions\nRPP: 19 positive command samples · 0.288761 m displacement\ngoal accepted and succeeded within 30 s at 0.25 m tolerance\n\nCURRENT ACCOUNT\nthe prepared substrate can support progress under the RPP setup; general substrate inability is not enough to explain the MPPI result\n\nSTILL OPEN\nwhy MPPI stalled · how repeatable the RPP result is', },
    },
    commands: {
      'source show rpp_attempt': `experiment:   RPP attempt
realisation@scenario: warehouse_navigation@gazebo_nav2_goal_base_footprint
task:         0.5 m map-frame navigation goal
controller:   RPP`,
      'run rpp_attempt': `evaluation:   39/39 declared checks passed
capture:      one-shot real-provider attempt`,
    },
    suggestions: ['source show rpp_attempt', 'explain controller_progress', 'run rpp_attempt', 'explain controller_progress'],
  },
}

const stage = computed(() => stageData[props.stage] || stageData[1])
const stageLabel = computed(() => props.stage === 0 ? 'REPL introduction' : `Stage ${props.stage}`)
const insideRepl = ref(props.startInside || (props.stage !== 0 && props.stage !== 1))
const promptPrefix = computed(() => insideRepl.value ? 'roti>' : '❯')
const suggestions = computed(() => {
  if (props.stage === 0 && insideRepl.value) return ['source show -h', 'explain -h', 'run -h']
  if (props.stage === 1 && !insideRepl.value) return ['roti']
  return stage.value.suggestions
})
const input = ref('')
const isRunning = ref(false)
const transcript = ref(null)
const inputId = `mock-repl-stage-${props.stage}${props.startInside ? '-continued' : ''}`

function buildInitial(data) {
  if (props.stage === 0) {
    return [{ kind: 'notice', text: 'Shell prompt · use roti -h for options, then roti to enter the REPL.' }]
  }
  if (props.stage === 1) {
    if (props.startInside) {
      return [
        { kind: 'exchange', prompt: '❯', command: 'roti', output: 'Rotifer REPL ready. Select an experiment to inspect its source, account and evidence.' },
        { kind: 'exchange', prompt: 'roti>', command: 'select presence_check', output: 'selected: Presence check' },
      ]
    }
    return [{ kind: 'notice', text: 'Presentation mock · prepared interactions over a recorded Rotifer experiment.' }]
  }
  return [{ kind: 'notice', text: `${stageLabel.value} · ${data.name}\nType help to see the commands prepared for this panel.` }]
}

const entries = ref(buildInitial(stage.value))
const responseCursors = ref({})
const completedRuns = ref({})

watch(stage, (next) => {
  entries.value = buildInitial(next)
  insideRepl.value = props.startInside || (props.stage !== 0 && props.stage !== 1)
  responseCursors.value = {}
  completedRuns.value = {}
  input.value = ''
})

function helpOutput() {
  return `Prepared commands for ${stageLabel.value} · ${stage.value.name}\n\n${suggestions.value.map((command) => `  ${command}`).join('\n')}\n  help\n  clear\n\nOnly these scripted responses are available. No ROS or shell command runs.`
}

function sampleStandardNormal() {
  let first = 0
  while (first === 0) first = Math.random()
  const second = Math.random()
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second)
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
    const explainTarget = key.startsWith('explain ') ? key.slice('explain '.length) : null
    const account = explainTarget ? stage.value.accounts?.[explainTarget] : null
    let output
    if (key === 'help') output = helpOutput()
    else if (account) output = completedRuns.value[account.run || explainTarget] ? account.after : account.before
    else if (Array.isArray(scripted)) {
      const index = responseCursors.value[key] || 0
      output = scripted[Math.min(index, scripted.length - 1)]
      responseCursors.value[key] = index + 1
    } else output = scripted || 'No scripted response for that command. Type help to see the commands prepared for this stage.'
    const wireName = key.startsWith('run ') ? key.slice('run '.length) : null
    const runDuration = wireName ? runDurationsSeconds[wireName] : 0
    const entry = {
      kind: 'exchange',
      command,
      prompt: promptPrefix.value,
      output: runDuration ? 'experiment running...' : output,
      running: Boolean(runDuration),
      progress: 0,
      elapsed: 0,
      completedChecks: 0,
      totalChecks: wireName ? (runCheckCounts[wireName] || 1) : 0,
    }
    entries.value.push(entry)
    input.value = ''
    if ((props.stage === 0 || props.stage === 1) && key === 'roti') insideRepl.value = true
    if (runDuration) {
      isRunning.value = true
      await nextTick()
      if (transcript.value) transcript.value.scrollTop = transcript.value.scrollHeight
      // Mutate the proxy from the reactive entries array so Vue rerenders progress updates.
      const runEntry = entries.value[entries.value.length - 1]
      const jitterWeights = Array.from({ length: runEntry.totalChecks }, () => {
        const sample = Math.max(-1, Math.min(1, sampleStandardNormal()))
        return 1 + sample * 0.65
      })
      const totalJitterWeight = jitterWeights.reduce((total, weight) => total + weight, 0)
      const startedAt = performance.now()
      for (let completedChecks = 1; completedChecks <= runEntry.totalChecks; completedChecks += 1) {
        const checkDurationMs = (mockRunDurationSeconds * 1000 * jitterWeights[completedChecks - 1]) / totalJitterWeight
        await new Promise((resolve) => window.setTimeout(resolve, checkDurationMs))
        runEntry.completedChecks = completedChecks
        runEntry.elapsed = Math.min((performance.now() - startedAt) / 1000, mockRunDurationSeconds)
        runEntry.progress = (completedChecks / runEntry.totalChecks) * 100
      }
      runEntry.elapsed = mockRunDurationSeconds
      runEntry.running = false
      runEntry.output = `${output}\nexperiment time: ${runDuration.toFixed(1)} s`
      if (props.stage === 1 && wireName === 'presence_check') {
        runEntry.output += '\nrun:             20261001T151956.546871Z-ba4189019e54'
      }
      completedRuns.value[wireName] = true
      isRunning.value = false
    }
  }

  await nextTick()
  if (transcript.value) transcript.value.scrollTop = transcript.value.scrollHeight
}

function reset() {
  insideRepl.value = props.startInside || (props.stage !== 0 && props.stage !== 1)
  entries.value = buildInitial(stage.value)
  responseCursors.value = {}
  completedRuns.value = {}
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
          <div v-if="entry.running" class="mock-repl-progress" aria-live="polite">
            <div class="mock-repl-progress-track" role="progressbar" :aria-valuenow="Math.round(entry.progress)" aria-valuemin="0" aria-valuemax="100">
              <div class="mock-repl-progress-fill" :style="{ width: `${entry.progress}%` }"></div>
            </div>
            <span>{{ entry.completedChecks }}/{{ entry.totalChecks }} checks · {{ entry.elapsed.toFixed(1) }} s elapsed · sped up</span>
          </div>
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

.mock-repl-progress {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 0.5rem 0 0 1.38rem;
  color: #d6c7cf;
  font-size: 0.67rem;
}

.mock-repl-progress-track {
  width: 8rem;
  height: 0.35rem;
  overflow: hidden;
  border-radius: 999px;
  background: #59424f;
}

.mock-repl-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: #ff8b61;
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
