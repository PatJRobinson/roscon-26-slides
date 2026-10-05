<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  stage: { type: Number, default: 1 },
})

const stageData = {
  1: {
    name: 'Presence',
    commands: {
      'select nav2_corridor_gazebo_substrate/': 'selected: nav2_corridor_gazebo_substrate',
      'source show': `experiment:   nav2_corridor_gazebo_substrate
realisation:  <realisation ID>
provider:     <provider ID and role>

required:     odom → base_link
question:     Is the required frame relationship available
              in this realisation?
conditions:   <selected robot, environment, and runtime conditions>`,
      'roti explain <exact target from existing transcript>': `source:       nav2_corridor_gazebo_substrate
requires:     odom → base_link

assumption:   required odometry-to-base relationship is available
account:      NOT ESTABLISHED
basis:        <declaration or earlier retained evidence>

next question:
              inspect the transform data for this realisation`,
      'roti run presence_check': `PREPARED WORKFLOW · HARD-CODED MOCK OUTPUT

investigation: presence_check
run:           <retained presence-check run ID>
status:        observations retained

Disclosure: this screen represents the operational workflow.
The retained observation and provenance belong to the actual run.`,
      'evidence show presence': `CAPTURED REAL-PROVIDER OBSERVATION
run: <retained presence-check run ID>

ROS topic surface:
  /tf          PRESENT
  /tf_static   PRESENT

Inspected frame data:
  observed:    <exact observed frames and edges>
  required:    odom → base_link
  result:      NOT OBSERVED`,
      'stage summary': `STAGE 1 · PRESENCE

ASSUMPTION
  The required odom → base_link relationship is available
  to the navigation substrate.
PROBE
  Inspect ROS topic presence and transform/frame data.
EVIDENCE
  /tf and /tf_static are present.
  The required odom → base_link edge was not observed.
BOUNDED CLAIM
  Transform-related topics were visible in this run, but the
  required frame relationship was not observed.
REMAINING UNKNOWN
  Structural compatibility · Runtime/timing · Navigation behaviour`,
    },
    suggestions: ['roti explain <exact target from existing transcript>', 'roti run presence_check', 'evidence show presence', 'stage summary'],
  },
  2: {
    name: 'Structure',
    commands: {
      'source show': `selected realisation: nav2_corridor_gazebo_substrate / <ID>
declared providers: <provider rows>
requirements: odom → base_link; scan source; base_link → scan`,
      'roti explain <selected structural investigation>': `source:       <selected structural investigation>
current account: structural relationships not yet established
basis:        authored declarations and earlier retained evidence

remaining requirements:
  odom → base_link
  scan source and frame
  base_link → scan`,
      'source show odometry': `AUTHORED SOURCE · ODOMETRY RELATIONSHIP
provider: <declared odometry provider>
relationship: odom → base_link
realisation: <selected realisation ID>`,
      'evidence show odometry': `CAPTURED REAL-PROVIDER EVIDENCE
run: <structural investigation run ID>
observed: odom → base_link

This establishes the observed relationship only.
The scan requirements remain open.`,
      'source show scan': `AUTHORED SOURCE · SCAN
topic: <retained scan topic>
frame: <retained scan frame>
required relationship: base_link → scan`,
      'evidence show scan': `CAPTURED REAL-PROVIDER EVIDENCE
run: <same or separately identified run>
observed: scan source and frame

base_link → scan
observed: <retained relationship evidence>`,
      'stage summary': `STATE 4 · STRUCTURAL ACCOUNT

odom ─── base_link ─── scan
          ↑             ↑
       odometry     measurements

UPDATED ACCOUNT
  odom → base_link          Established
  scan source and frame     Established
  base_link → scan          Established

REMAINING UNKNOWN
  Timing · Lifecycle · Costmap behaviour · Navigation success

Structural compatibility is shown for this realisation;
availability at every timestamp is not established.`,
    },
    suggestions: ['roti explain <selected structural investigation>', 'source show odometry', 'evidence show odometry', 'source show scan', 'evidence show scan', 'stage summary'],
  },
  3: {
    name: 'Runtime',
    commands: {
      'source show': `experiment: <selected runtime investigation>
realisation: <selected realisation ID>
requires: odom → base_link; base_link → scan
runtime condition: scan-timestamp transform availability`,
      'roti explain runtime_compatibility': `RUNTIME REQUIREMENTS                 EXISTING ACCOUNT
Map / lifecycle / action surface  <retained status>
odom → base_link                  Structurally established
base_link → scan                  Structurally established
Scan timestamp compatibility      <retained status>

BASIS
  <declarations and earlier retained evidence>

REMAINING QUESTION
  Is transform data available when the scan needs to use it?`,
      'roti run runtime_compatibility': `PREPARED WORKFLOW · HARD-CODED MOCK OUTPUT

investigation: runtime_compatibility
run:           <runtime-surface run ID>
status:        observations retained

This is a prepared representation of the operational workflow.
Run identity and provenance refer to the retained real run.`,
      'evidence show surface': `CAPTURED REAL-PROVIDER EVIDENCE
run: <runtime-surface run ID>

Map interface            <observed status>
Lifecycle state          <observed status>
Navigation action        <observed status>
TF frame relationships   Available

Interface presence does not establish successful navigation.`,
      'evidence show timing-failure': `CAPTURED REAL-PROVIDER EVIDENCE
run: <timing-failure run ID>

Latest-time lookup                 SUCCESS
Lookup at scan timestamp           FAILED

Scan timestamp: <retained timestamp>
Failure:        <retained diagnostic>

The frame relationship exists, but its transform data was
not available at the time of this scan.`,
      'evidence show timing-compatible': `CAPTURED REAL-PROVIDER EVIDENCE
run: <timing-compatible run ID>

Latest-time lookup                 SUCCESS
Lookup at scan timestamp           SUCCESS

Changed conditions:
  <retained configuration / runtime difference>

Separate run under changed conditions; not a repeat of the
timing-failure run.`,
      'stage summary': `STAGE 3 · RUNTIME

ASSUMPTION
  Required interfaces and transform data are available
  when navigation needs them.
PROBE
  Inspect runtime interfaces and compare transform lookups.
EVIDENCE
  Relevant interfaces were observed.
  Latest-time lookup succeeded; scan-time lookup first failed.
  A separately identified timing-compatible result succeeded.
BOUNDED CLAIM
  The required lookup was compatible under the conditions tested.
REMAINING UNKNOWN
  Localisation accuracy · Costmap behaviour · Navigation success`,
    },
    suggestions: ['source show', 'roti run runtime_compatibility', 'evidence show timing-failure', 'evidence show timing-compatible', 'stage summary'],
  },
  4: {
    name: 'Behaviour',
    commands: {
      'source show': `experiment: <selected behavioural investigation>
realisation: <selected realisation ID>
task: <prepared navigation task>
expected behaviour: forward progress towards the goal
controller: <declared controller and conditions>`,
      'roti explain <selected behavioural investigation>': `BEHAVIOURAL REQUIREMENTS           EXISTING ACCOUNT
Navigation substrate              <retained status>
Goal / path interface              <retained status>
Local corridor                     <retained status>
Forward progress                   <retained status>

BASIS
  <declarations and earlier retained evidence>

REMAINING QUESTION
  Does the robot progress under the prepared task conditions?`,
      'evidence show behaviour': `FRESH ONE-SHOT REAL-PROVIDER EVIDENCE
revision: 19ee3b7d28c66015fbc5d0fcde1b5b9ed3d2ddf8
recorder starts: 20:33:41Z and 20:38:41Z
native run IDs: not emitted

Navigation goal       accepted [native result file]
Global path           valid path [bag topic]
Local corridor        sampled free to 0.6 m [bag/native probe]
Command output        zero forward command [bag topic]
Odometry / progress   no translational progress [bag topic]
Action result         timeout [native result file]

Boundary: two attempts, not one continuous run. Bags omit the
submitted goal and final-result reply.`,
      'stage summary': `STAGE 4 · BEHAVIOUR

ASSUMPTION
  The system can make forward progress to the accepted goal.
PROBE
  Inspect path, local corridor, command, odometry, and action state.
EVIDENCE
  Goal accepted and timed out (native result files).
  Valid path; free sampled corridor to 0.6 m.
  Zero forward command and no translational odometry (bags).
BOUNDED CLAIM
  Expected progress did not occur under these conditions.
REMAINING UNKNOWN
  Task geometry · Controller feasibility · Cause of failure`,
    },
    suggestions: ['source show', 'roti explain <selected behavioural investigation>', 'evidence show behaviour', 'stage summary'],
  },
  5: {
    name: 'Controlled contrast',
    commands: {
      'source show': `QUESTION
  Could this system support forward progress and complete the task?
HELD STEADY
  <conditions genuinely held sufficiently consistent>
CHANGED
  Controller: MPPI → RPP`,
      'roti explain controller_progress': `QUESTION
  Could this system support the task with a different controller?

CURRENT ACCOUNT
  MPPI: no forward progress under the inspected conditions
  RPP: forward command, motion, and goal success observed

WHAT CHANGED IN THE ACCOUNT?
  General inability of the prepared substrate to accomplish the
  task is no longer sufficient to explain the MPPI result.

STILL OPEN
  Why did MPPI stall here? How repeatable is the RPP result?`,
      'evidence show mppi': `EARLIER MPPI OBSERVATION
run: <MPPI run identity / source record>

Forward command:        none observed
Translational motion:   none observed
Goal result:            <native result record>

This is the earlier side of the controlled contrast.`,
      'evidence show rpp': `FRESH ONE-SHOT REAL-PROVIDER EVIDENCE
revision:       <RPP source revision>
recorder start: <RPP recorder start time>
native run ID:  <run ID if available / not emitted>

Controller             RPP
Command output         Forward command observed
Odometry / progress    Translational motion observed
Navigation action     Goal accepted; goal success reported
                       [native result file]

Bag topics: command output · odometry / motion · <others>
Native result file: goal acceptance and final goal result
Not present in bag: submitted goal or final-result reply`,
      'stage summary': `STAGE 5 · CONTROLLED CONTRAST

QUESTION
  Could this system support forward progress with another controller?
HELD STEADY
  <conditions genuinely held sufficiently consistent>
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
    suggestions: ['source show', 'roti explain controller_progress', 'evidence show mppi', 'evidence show rpp', 'stage summary'],
  },
}

const stage = computed(() => stageData[props.stage] || stageData[1])
const input = ref('')
const transcript = ref(null)
const inputId = `mock-repl-stage-${props.stage}`

function buildInitial(data) {
  return [{ kind: 'notice', text: `Stage ${props.stage} · ${data.name}\nType help to see the commands prepared for this stage.` }]
}

const entries = ref(buildInitial(stage.value))

watch(stage, (next) => {
  entries.value = buildInitial(next)
  input.value = ''
})

function helpOutput() {
  return `Prepared commands for Stage ${props.stage} · ${stage.value.name}\n\n${Object.keys(stage.value.commands).map((command) => `  ${command}`).join('\n')}\n  help\n  clear\n\nOnly these scripted responses are available. No ROS or shell command runs.`
}

async function submit(raw = input.value) {
  const command = raw.trim().replace(/\s+/g, ' ')
  if (!command) return

  const key = command.toLowerCase()

  if (key === 'clear') {
    entries.value = []
    input.value = ''
  } else {
    const output = key === 'help'
      ? helpOutput()
      : stage.value.commands[key] || 'No scripted response for that command. Type help to see the commands prepared for this stage.'
    entries.value.push({ kind: 'exchange', command, output })
    input.value = ''
  }

  await nextTick()
  if (transcript.value) transcript.value.scrollTop = transcript.value.scrollHeight
}

function reset() {
  entries.value = buildInitial(stage.value)
  input.value = ''
  nextTick(() => {
    if (transcript.value) transcript.value.scrollTop = transcript.value.scrollHeight
  })
}
</script>

<template>
  <section class="mock-repl" :aria-label="`Mock REPL, Stage ${props.stage} ${stage.name}`">
    <header class="mock-repl-header">
      <div class="mock-repl-title"><span class="mock-repl-dot"></span> ros_ws / prepared investigation</div>
      <div class="mock-repl-disclosure">MOCK · NO LIVE ROS OR SHELL</div>
    </header>

    <div ref="transcript" class="mock-repl-transcript" aria-live="polite">
      <div v-for="(entry, index) in entries" :key="`${index}-${entry.kind}`" class="mock-repl-entry">
        <div v-if="entry.kind === 'notice'" class="mock-repl-notice">{{ entry.text }}</div>
        <div v-else class="mock-repl-exchange">
          <div class="mock-repl-command"><span>❯</span>{{ entry.command }}</div>
          <div class="mock-repl-output">{{ entry.output }}</div>
        </div>
      </div>
    </div>

    <div class="mock-repl-form">
      <label class="mock-repl-prompt" :for="inputId">❯</label>
      <input
        :id="inputId"
        v-model="input"
        :list="`${inputId}-commands`"
        class="mock-repl-input"
        type="text"
        autocomplete="off"
        spellcheck="false"
        placeholder="Click here and type a command, then press Enter"
        @keydown.stop
        @keydown.enter.prevent.stop="submit()"
      />
      <datalist :id="`${inputId}-commands`">
        <option v-for="command in stage.suggestions" :key="command" :value="command" />
        <option value="help" />
        <option value="clear" />
      </datalist>
      <button class="mock-repl-run" type="button" @click="submit()">Run</button>
      <button class="mock-repl-reset" type="button" aria-label="Reset this mock REPL" @click="reset">Reset</button>
    </div>
    <footer class="mock-repl-footer">Stage {{ props.stage }} of 5 · outputs are scripted; evidence provenance remains attached to the cited runs.</footer>
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
