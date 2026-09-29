---
title: Making integration visible
info: |
  ## Making integration visible
  Working understandings, evidence, and a ROS 2 navigation failure
class: text-center compact-slide
drawings:
  persist: false
transition: slide-left
duration: 45min
monaco: false
mdc: true
---

<div class="ubuntu-window text-left max-w-5xl mx-auto">

<div class="text-center">

# Making integration visible

## Working understandings, evidence, and a ROS 2 navigation failure

Patrick Robinson<br />
ROSCon 2026 · working presentation draft

</div>

<div class="mt-12 grid grid-cols-3 gap-5 text-left">
<div class="evidence-chip"><strong>inspect</strong><br /><span>what is actually represented?</span></div>
<div class="evidence-chip"><strong>challenge</strong><br /><span>which assumption should we test?</span></div>
<div class="evidence-chip"><strong>revisit</strong><br /><span>what still holds when the system changes?</span></div>
</div>

</div>

<!--
Presenter note: Open with the handover question. The deck is an authoring
scaffold, not evidence that the complete demo or talk package exists.
-->

---
transition: slide-left
class: question-slide
---

<!-- # A question -->

<div class="ubuntu-window question-window max-w-5xl mx-auto text-center">
<div class="text-3xl">What does it mean for a system to work?</div>
</div>

---
transition: slide-left
class: question-slide
---

# A system can travel without its understanding

<div class="ubuntu-window text-xl leading-snug max-w-5xl mx-auto">

<div class="grid grid-cols-2 gap-10 items-center">
<div>

<p class="text-2xl">Someone gives you a ROS 2 system that worked on their machine.</p>

<ul class="mt-8 space-y-3">
<li>The packages are there.</li>
<li>The launch files run.</li>
<li>The graph appears.</li>
<li>The README tells you what to type.</li>
</ul>
</div>

<div class="question-card p-6 text-center">
<!-- <div class="text-5xl mb-5">✓ ✓ ✓</div> -->
<div class="text-2xl font-semibold text-orange-200">…but the robot still does not behave as expected.</div>
</div>
</div>


<div class="mt-10 text-center text-2xl font-semibold">What knowledge failed to travel with the software?</div>
</div>

<!-- Staged opening scenario; not a claim about a particular handover study. -->

---
transition: slide-left
class: question-slide statement-slide
---

<!-- # What travels? -->

<div class="ubuntu-window question-window statement-window max-w-5xl mx-auto text-center">
<div class="text-3xl">The software may travel.<br />The understanding might not.</div>
</div>

---
transition: slide-left
class: compact-slide code-sequence-slide
---

# What ordinary visibility can tell us

<div class="ubuntu-window code-sequence-window max-w-5xl mx-auto">
<div class="terminal-card code-terminal">
<div class="terminal-title">> ~/ros_ws/slides</div>
<div class="terminal-body">
<div v-click="1" class="terminal-command"><span class="terminal-prompt">&gt;</span> ros2 node list</div>
<div v-click="2" class="terminal-output">robot_node</div>
<div v-click="3" class="terminal-command"><span class="terminal-prompt">&gt;</span> ros2 topic list</div>
<div v-click="4" v-mark="{ at: 5, color: 'orange', type: 'box' }" class="terminal-output topic-output">/tf<br />/tf_static<br />/scan<br />/cmd_vel</div>
<div v-click="5" class="topic-annotation">↳ what relationships between these?</div>
</div>
</div>
</div>

---
transition: slide-left
class: compact-slide graph-slide
---

# Let's take a fairly simple example

<div class="ubuntu-window graph-window max-w-5xl mx-auto">
<svg class="ros-graph" viewBox="0 0 1000 430" role="img" aria-label="ROS graph showing nodes, topics, and an unresolved odom to base_link frame relationship">
  <defs>
    <marker id="ros-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
  </defs>

  <text class="graph-heading" x="80" y="34">nodes</text>
  <text class="graph-heading" x="375" y="34">topics</text>
  <text class="graph-heading" x="690" y="34">frame relationships</text>

  <rect class="graph-node" x="55" y="55" width="220" height="58" rx="10" />
  <text class="graph-label" x="165" y="90" text-anchor="middle">robot_state_publisher</text>

  <rect class="graph-node" x="55" y="185" width="220" height="58" rx="10" />
  <text class="graph-label" x="165" y="220" text-anchor="middle">controller_server</text>

  <rect class="graph-node" x="55" y="315" width="220" height="58" rx="10" />
  <text class="graph-label" x="165" y="350" text-anchor="middle">scan_source</text>

  <rect class="graph-topic" x="350" y="72" width="150" height="52" rx="26" />
  <text class="graph-label" x="425" y="104" text-anchor="middle">/tf · /tf_static</text>

  <rect class="graph-topic" x="350" y="198" width="150" height="52" rx="26" />
  <text class="graph-label" x="425" y="230" text-anchor="middle">/cmd_vel</text>

  <rect class="graph-topic" x="350" y="328" width="150" height="52" rx="26" />
  <text class="graph-label" x="425" y="360" text-anchor="middle">/scan</text>

  <line class="graph-edge" x1="275" y1="84" x2="350" y2="92" marker-end="url(#ros-arrow)" />
  <line class="graph-edge" x1="275" y1="214" x2="350" y2="224" marker-end="url(#ros-arrow)" />
  <line class="graph-edge" x1="275" y1="344" x2="350" y2="354" marker-end="url(#ros-arrow)" />

  <rect class="graph-frame" x="665" y="58" width="145" height="52" rx="10" />
  <text class="graph-label" x="737" y="90" text-anchor="middle">odom</text>

  <rect class="graph-frame" x="665" y="188" width="145" height="52" rx="10" />
  <text class="graph-label" x="737" y="220" text-anchor="middle">base_link</text>

  <rect class="graph-frame" x="845" y="188" width="110" height="52" rx="10" />
  <text class="graph-label" x="900" y="220" text-anchor="middle">laser</text>

  <line class="graph-edge" x1="500" y1="98" x2="665" y2="84" marker-end="url(#ros-arrow)" />
  <line class="graph-missing" x1="737" y1="110" x2="737" y2="188" marker-end="url(#ros-arrow)" />
  <line class="graph-edge" x1="810" y1="214" x2="845" y2="214" marker-end="url(#ros-arrow)" />
  <line class="graph-edge" x1="500" y1="354" x2="900" y2="242" marker-end="url(#ros-arrow)" />

  <text class="graph-missing-label" x="760" y="153">required edge not observed</text>
  <text class="graph-note" x="737" y="292" text-anchor="middle">topics are present</text>
  <text class="graph-note" x="737" y="318" text-anchor="middle">the needed relationship is not yet established</text>
</svg>
</div>

---
transition: slide-left
class: compact-slide warrant-slide
---

# Presence is not the relationship

<div class="ubuntu-window warrant-window max-w-5xl mx-auto">

<div class="grid grid-cols-[1fr_auto_1fr] gap-6 items-center text-center">
<div class="warrant-column">
<div class="card-kicker">observed</div>
<div class="terminal-card mt-4">
<div class="terminal-title">topics present</div>
<pre class="!m-0 !border-0 !shadow-none">/tf
/tf_static</pre>
</div>
</div>

<div class="warrant-symbol">≠</div>

<div class="warrant-column">
<div class="card-kicker">required relationship</div>
<div class="frame-pair mt-4"><span>odom</span><span class="frame-arrow">→</span><span>base_link</span></div>
<div class="missing-tag mt-4">not observed</div>
</div>
</div>

<div class="mt-10 grid grid-cols-2 gap-6">
<div class="remaining-card"><div class="card-kicker">what we know</div><p class="text-xl">One required navigation relationship is missing.</p></div>
<div class="warn-card rounded-xl p-5"><div class="card-kicker">what we do not know</div><p class="text-xl">Whether navigation works.</p></div>
</div>
</div>

<!--
Land the distinction between observation and warrant before widening the
argument beyond this particular missing relationship.
-->

---
transition: slide-left
class: compact-slide
---

# Four things to keep together

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-4 gap-4">
<div class="evidence-card"><div class="card-kicker">01</div><h3>Assumption</h3><p>What must be true?</p></div>
<div class="evidence-card"><div class="card-kicker">02</div><h3>Probe</h3><p>What did we inspect or change?</p></div>
<div class="evidence-card"><div class="card-kicker">03</div><h3>Evidence</h3><p>What did the probe produce?</p></div>
<div class="evidence-card"><div class="card-kicker">04</div><h3>Claim</h3><p>What does that warrant?</p></div>
</div>

<div class="mt-12 grid grid-cols-2 gap-8 items-center">
<div class="text-xl">
<p class="font-semibold">A claim is not a feeling of progress.</p>
<p>It is a bounded statement tied to a named realisation, a selected probe, and inspectable evidence.</p>
</div>
<div class="remaining-card">
<div class="card-kicker">always retain</div>
<div class="text-2xl font-semibold mt-3">remaining unknown</div>
<p>What have we not established yet?</p>
</div>
</div>
</div>

---
transition: slide-left
---

# Rotifer: a representation for revisiting the reasoning

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-3 gap-5 text-center items-center">
<div class="terminal-card">
<div class="terminal-title">authored source</div>
<pre class="!m-0 !border-0 !shadow-none">source show
experiment:
  goal: corridor_follow</pre>
</div>
<div class="text-5xl text-orange-300">→</div>
<div class="terminal-card">
<div class="terminal-title">resolved run</div>
<pre class="!m-0 !border-0 !shadow-none">roti explain
assumptions
providers
evidence</pre>
</div>
</div>

<div class="mt-10 grid grid-cols-2 gap-8">
<div><h3>What the representation can do</h3><ul><li>make selected reasoning inspectable;</li><li>keep evidence and claims connected;</li><li>make a changed realisation visible.</li></ul></div>
<div><h3>What it does not do</h3><ul><li>choose the next experiment automatically;</li><li>make a mock interaction a live CLI;</li><li>carry warrant into another system.</li></ul></div>
</div>
</div>

---
transition: slide-left
---

# The demonstration: five changes in what we can warrant

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-5 gap-3 text-center">
<div class="stage-box"><span>1</span><strong>Presence</strong><small>what exists?</small></div>
<div class="stage-box"><span>2</span><strong>Structure</strong><small>what connects?</small></div>
<div class="stage-box"><span>3</span><strong>Runtime</strong><small>can it exchange?</small></div>
<div class="stage-box"><span>4</span><strong>Behaviour</strong><small>what happened?</small></div>
<div class="stage-box"><span>5</span><strong>Contrast</strong><small>what changes?</small></div>
</div>

<div class="mt-12 text-center text-2xl">The point is not to display more telemetry.</div>
<div class="mt-4 text-center text-3xl font-semibold text-orange-200">The point is to change the question as the evidence changes.</div>
</div>

---
transition: slide-left
---

# Stage 1 — Presence

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-2 gap-8 items-center">
<div class="terminal-card">
<div class="terminal-title">~~/ros_ws/slides</div>
<pre class="!m-0 !border-0 !shadow-none">roti explain --stage presence
topics: /tf /tf_static /scan
required edge: odom -> base_link
observed: edge absent</pre>
</div>
<div>
<div class="card-kicker">bounded claim</div>
<p class="text-2xl font-semibold">Topic presence does not establish the required frame relationship.</p>
<p class="mt-6">We have narrowed the problem. We have not explained the behaviour.</p>
</div>
</div>

</div>

---
transition: slide-left
---

# Stage 2 — Structural compatibility

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-3 gap-4 text-center">
<div class="evidence-card"><div class="card-kicker">probe</div><h3>odometry</h3><p>which provider publishes it?</p></div>
<div class="evidence-card"><div class="card-kicker">probe</div><h3>scan</h3><p>which frame does it use?</p></div>
<div class="evidence-card"><div class="card-kicker">probe</div><h3>TF</h3><p>who owns the relationship?</p></div>
</div>

<div class="mt-10 grid grid-cols-2 gap-8 items-center">
<div class="text-2xl font-semibold">A connected graph is not yet an interpretable system.</div>
<div class="terminal-card"><pre class="!m-0 !border-0 !shadow-none">assumption → probe → evidence
structural relationship established
calibration and authority: unknown</pre></div>
</div>
</div>

---
transition: slide-left
class: compact-slide
---

# Stage 3 — Runtime compatibility

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-3 gap-5">
<div class="evidence-card"><div class="card-kicker">timing</div><h3>scan timestamps</h3><p>are messages current enough?</p></div>
<div class="evidence-card"><div class="card-kicker">availability</div><h3>TF buffer</h3><p>can the transform be resolved?</p></div>
<div class="evidence-card"><div class="card-kicker">state</div><h3>lifecycle / action</h3><p>is the runtime ready?</p></div>
</div>

<blockquote class="mt-10 text-xl readable-callout">Latest-time connectivity was not enough. The runtime had to exchange interpretable information under the tested conditions.</blockquote>

<div class="mt-8 evidence-strip"><strong>bounded claim:</strong> runtime compatibility is established for the selected conditions—not behavioural success, localisation quality, or correct costmap semantics.</div>
</div>

---
transition: slide-left
class: compact-slide
---

# Stage 4 — Behavioural evidence

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-2 gap-8 items-center">
<div class="video-placeholder">
<div class="text-6xl">▶</div>
<div class="mt-4 text-xl font-semibold">Gazebo GUI failure clip</div>
</div>
<div>
<div class="card-kicker">what we see</div>
<p class="text-2xl font-semibold">The goal is accepted. The corridor looks plausible. The robot does not translate.</p>
<div class="evidence-strip mt-6"><strong>paired evidence:</strong> footprint · local feasibility · commands/odometry · MPPI progress</div>
</div>
</div>

<div class="mt-8 grid grid-cols-2 gap-6">
<div class="remaining-card"><div class="card-kicker">weakened</div><p>several simple substrate and geometry explanations</p></div>
<div class="warn-card rounded-xl p-5"><div class="card-kicker">remaining</div><p>controller behaviour remains unresolved</p></div>
</div>
</div>

<!-- The GUI is supporting context for retained evidence, not a replacement. -->

---
transition: slide-left
class: compact-slide
---

# The next question is a human choice

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="text-center text-xl mb-8">After the accepted goal does not progress, several explanations remain plausible.</div>

<div class="grid grid-cols-3 gap-5 text-center">
<div class="probe-option"><div class="text-4xl">⌖</div><h3>pose/path consistency</h3><p>Is the reported motion coherent?</p></div>
<div class="probe-option selected"><div class="text-4xl">▦</div><h3>local feasibility</h3><p>Is the corridor actually free?</p><div class="selected-label">selected next probe</div></div>
<div class="probe-option"><div class="text-4xl">→</div><h3>controller progress</h3><p>What commands and progress are visible?</p></div>
</div>

<div class="mt-10 text-center text-2xl font-semibold text-orange-200">Rotifer can preserve the reasoning. It does not choose the probe.</div>
</div>

---
transition: slide-left
class: compact-slide
---

# Stage 5 — Controlled contrast

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-2 gap-8 items-stretch">
<div class="controller-card fail-card"><div class="card-kicker">preserved substrate</div><h2>MPPI</h2><div class="result-line">no forward translation</div><p>failure remains controller-specific and incompletely explained.</p></div>
<div class="controller-card pass-card"><div class="card-kicker">changed controller</div><h2>Regulated Pure Pursuit</h2><div class="result-line">bounded goal success</div><p>positive command and forward odometry are observed.</p></div>
</div>

<div class="mt-10 grid grid-cols-2 gap-8">
<div><h3>What changes</h3><p>The controlled contrast weakens “the substrate cannot work” as the full explanation.</p></div>
<div><h3>What remains unknown</h3><p>This is not general RPP superiority, a complete MPPI diagnosis, repeatability, or production readiness.</p></div>
</div>
</div>

---
transition: slide-left
---

# What the representation made visible

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-5 gap-2 text-center">
<div class="summary-cell"><strong>assumption</strong><span>what must be true</span></div>
<div class="summary-cell"><strong>probe</strong><span>what we chose to inspect</span></div>
<div class="summary-cell"><strong>evidence</strong><span>what the named run produced</span></div>
<div class="summary-cell"><strong>claim</strong><span>what it warrants</span></div>
<div class="summary-cell"><strong>unknown</strong><span>what still needs work</span></div>
</div>

<div class="mt-12 grid grid-cols-2 gap-8 items-center">
<div class="text-2xl font-semibold">A procedure or claim structure may travel.</div>
<div class="remaining-card text-xl">Claim truth and evidential warrant must be re-established in another realisation.</div>
</div>
</div>

---
transition: slide-left
---

# What this talk is—and is not—claiming

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-2 gap-10">
<div>
<h2>This is</h2>
<ul class="space-y-3"><li>a bounded representational proposition;</li><li>a worked Nav2 evidence sequence;</li><li>an invitation to recognise, qualify, or disagree.</li></ul>
</div>
<div>
<h2>This is not</h2>
<ul class="space-y-3"><li>a product launch or complete account of integration;</li><li>automatic reasoning or intelligent experiment selection;</li><li>portable warrant, a flight check, or practitioner validation.</li></ul>
</div>
</div>

<blockquote class="mt-10 text-xl readable-callout">The caveats are not an apology. They are part of making the claim inspectable.</blockquote>
</div>

---
transition: slide-left
---

# Where does this fit—or break?

<div class="ubuntu-window max-w-5xl mx-auto">

<div class="grid grid-cols-3 gap-5">
<div class="question-card"><div class="text-4xl">?</div><p>Where does important integration understanding live in your projects?</p></div>
<div class="question-card"><div class="text-4xl">↔</div><p>Which boundaries or responsibilities does this representation hide?</p></div>
<div class="question-card"><div class="text-4xl">!</div><p>What existing practice handles this better?</p></div>
</div>

<div class="mt-12 text-center text-xl">Recognition, qualification, disagreement.</div>
</div>

---
transition: slide-left
class: compact-slide
---

# A functioning robot depends on working understandings

<div class="ubuntu-window max-w-5xl mx-auto text-center">

<p class="text-3xl leading-snug">Those understandings are distributed across people, tools, configuration, infrastructure, and deployment context.</p>

<p class="mt-10 text-2xl font-semibold text-orange-200">Rotifer is one attempt to make selected parts explicit enough to inspect, challenge, and revisit as the system changes.</p>

<div class="mt-12 text-lg">If your work involves integration, debugging, testing, deployment, handover, or assurance, I’d like to hear about it.</div>

</div>

<!-- Close on the accepted audience takeaway, then move to questions/invitation. -->
