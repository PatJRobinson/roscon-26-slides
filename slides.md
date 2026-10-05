---
title: How can a robot move?
info: |
  Working understandings, evidence, and a ROS 2 navigation failure
class: simple-slide title-slide
transition: none
duration: 45min
monaco: false
mdc: true
drawings:
  persist: false
---

# How can a robot move?

<div class="slide-content">

<p>Working understandings, evidence, and a ROS 2 navigation failure</p><p>Patrick Robinson<br>ROSCon 2026</p>

</div>

<!--
Slide 1. Title slide. Begin the opening on the next slide.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide quiet-question
---

<div class="slide-content">

<p>What does it mean for a system to work?</p>

</div>

<!--
Slide 2. Opening · 0:00. Working means a particular configuration, robot, environment and set of conditions.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Someone gives you a ROS 2 system

<div class="slide-content">

<p>It worked on their machine.</p><ul><li>The packages are there.</li><li>The launch files run.</li><li>The graph appears.</li><li>The README tells you what to type.</li></ul><p>The robot still does not behave as expected.</p>

</div>

<!--
Slide 3. Opening. This is a staged handover scenario.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide quiet-question
---

<div class="slide-content">

<p>The software may travel.<br>The understanding may not.</p>

</div>

<!--
Slide 4. Opening. Reused components can lose the understanding established around them.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Inspecting the ROS system

<div class="slide-content">

<div class="inspection-pair">
<div class="terminal-card"><div class="terminal-title">ROS 2 inspection · staged example</div><div class="terminal-body"><div v-click="1" class="terminal-command">❯ ros2 node list</div><div v-click="2" class="terminal-output">robot_node</div><div v-click="3" class="terminal-command">❯ ros2 topic list</div><div v-click="4" class="terminal-output">/tf<br>/tf_static<br>/scan<br>/cmd_vel</div><div v-click="5" class="topic-annotation">What relationships between these?</div></div></div>
<div v-click="6" class="tf-inspection">
<div class="terminal-card"><div class="terminal-title">TF2 structure · generated with tf2_tools</div><div class="tf-command">❯ ros2 run tf2_tools view_frames</div></div>
<div class="system-view"><div class="system-view-header">frames.pdf · schematic frame graph</div><div class="tf-graph"><div class="tf-branch"><span>map</span><i>↓</i><span>odom</span></div><div class="tf-branch"><span>base_link</span><i>↓</i><span>scan</span></div></div></div>
</div>
</div>

</div>

<!--
Slide 5. First example · 2:00–5:00. ROS tools provide useful observations. The engineer supplies the question and interpretation.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Is the required relationship available?

<div class="slide-content">

<dl class="account-rows"><dt>Observation</dt><dd>/tf and /tf_static are present</dd><dt>Question</dt><dd>Is odom → base_link available?</dd><dt>Observation</dt><dd>odom → base_link not observed</dd></dl>

</div>

<!--
Slide 6. First example. Topic presence alone does not establish transform traffic or this particular relationship. Inspect the frame data.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide compact-slide warrant-slide
---

# Presence is not the relationship

<div class="slide-content">

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



</div>

<!--
Slide 7. First example. We supplied the reasoning around these observations. Did we record it? Pause before discussing where that account belongs.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide plain-account
---

# The system account is specific to this realisation

<div class="slide-content">

<section><h2>The parts are reusable</h2><p>Packages, nodes, sensors, controllers, libraries.<br>Their documentation travels with them.</p></section><section><h2>The system account is specific</h2><p>How those parts relate, how they are configured,<br>and the conditions in which they work together.</p></section>

</div>

<!--
Slide 8. First example. Supports the modularity passage following the presence comparison.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Each answer changes the next question

<div class="slide-content">

<dl class="account-rows"><dt>Presence</dt><dd>What is there?</dd><dt>Structure</dt><dd>Is the relationship there?</dd><dt>Runtime</dt><dd>Is it available when it is needed?</dd><dt>Behaviour</dt><dd>Can the system accomplish the task?</dd></dl>

</div>

<!--
Slide 9. 5:00–8:00. Integration is an evolving inquiry. Each answer makes a more specific next question possible.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Six months later

<div class="slide-content">

<div class="spaced-lines"><p>Where did we get to?</p><p>What had we ruled out?</p><p>What was the next question?</p></div>

</div>

<!--
Slide 10. 5:00–8:00. The artefacts may remain while the connections between them are lost.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Where does the understanding live?

<div class="slide-content">

<div class="understanding-map"><div>Code <span>Configuration</span> Tests</div><div class="map-connectors" aria-hidden="true">╲　　　　 │　　　　 ╱</div><p>What has been established?</p><div class="map-connectors" aria-hidden="true">╱　　　　 │　　　　 ╲</div><div>Tools <span>Records</span> People</div></div>

</div>

<!--
Slide 11. 8:00–11:00. Connect what we were trying to establish, evidence, conclusion and unresolved questions.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# The Rotifer workflow

<div class="slide-content">

<dl class="account-rows"><dt>source show</dt><dd>Authored investigation</dd><dt>roti explain</dt><dd>Current account</dd><dt>roti run</dt><dd>New observations</dd><dt>roti explain</dt><dd>Updated account</dd></dl><p class="provenance">The demonstration uses prepared interactions over retained evidence.</p>

</div>

<!--
Slide 12. 11:00–18:00. Define realisation as these providers, configuration, conditions and task. The engineer chooses the question and interprets the result. Distinguish authored, observed and concluded.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Stage 1 · The authored investigation

<div class="slide-content">

<div class="prepared-label">Prepared interaction · no live ROS or shell execution</div>
<pre class="demo-terminal">❯ select nav2_corridor_gazebo_substrate/&#10;❯ source show&#10;&#10;experiment:  nav2_corridor_gazebo_substrate&#10;realisation: &lt;realisation ID&gt;&#10;provider:    &lt;provider ID and role&gt;&#10;required:    odom → base_link&#10;question:    Is this relationship available here?&#10;conditions:  &lt;robot, environment and runtime conditions&gt;</pre>

</div>

<!--
Slide 13. 18:00–21:00. Authored by an engineer. Exact identities and conditions require evidence verification.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# The account before the run

<div class="slide-content">

<div class="prepared-label">Prepared interaction · no live ROS or shell execution</div>
<pre class="demo-terminal">❯ roti explain &lt;target to verify&gt;&#10;&#10;requires:    odom → base_link&#10;assumption:  required relationship is available&#10;account:     NOT ESTABLISHED&#10;basis:       &lt;declaration or earlier retained evidence&gt;&#10;&#10;next question:&#10;  Inspect the transform data for this realisation.</pre>

</div>

<!--
Slide 14. Stage 1. Show the existing account before collecting observations.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Run the presence investigation

<div class="slide-content">

<div class="prepared-label">Prepared interaction · no live ROS or shell execution</div>
<pre class="demo-terminal">❯ roti run presence_check&#10;&#10;investigation: presence_check&#10;run:           &lt;retained run ID&gt;&#10;status:        observations retained</pre>

</div>

<!--
Slide 15. Stage 1. Prepared representation of the execution boundary; this command does not execute ROS.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# What was observed?

<div class="slide-content">

<table><thead><tr><th>Inspected</th><th>Observation</th></tr></thead><tbody><tr><td>/tf and /tf_static</td><td>Present</td></tr><tr><td>odom → base_link</td><td>Not observed</td></tr></tbody></table><p class="provenance">Captured observation described in the script · run identity to verify</p><p class="production-pending">To complete: Exact observed frames, edges and retained run reference.</p>

</div>

<!--
Slide 16. Stage 1. This is a presentation summary of the script, not a newly verified observation.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Stage 1 · What we have established

<div class="slide-content">

<dl class="account-rows"><dt>Assumption</dt><dd>The odometry-to-base relationship is available.</dd><dt>Probe</dt><dd>Inspect topics and transform/frame data.</dd><dt>Evidence</dt><dd>TF topics present; required edge not observed.</dd><dt>Claim</dt><dd>The required relationship was not observed in this run.</dd><dt>Still open</dt><dd>Structure, timing and navigation behaviour.</dd></dl>

</div>

<!--
Slide 17. Stage 1. What must change to establish the relationship?
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Stage 2 · Required relationships

<div class="slide-content">

<table><thead><tr><th>Requirement</th><th>Declared provider / current account</th></tr></thead><tbody><tr><td>odom → base_link</td><td>Odometry provider · to verify</td></tr><tr><td>Scan source and frame</td><td>Scan provider · to verify</td></tr><tr><td>base_link → scan</td><td>Frame provider · to verify</td></tr></tbody></table><p class="provenance">Prepared source / explain view · exact provider rows and basis pending</p>

</div>

<!--
Slide 18. 21:00–24:00. Establish one relationship at a time. Do not imply all requirements were repaired at once.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Establishing odometry

<div class="slide-content">

<div v-click="1"><dl class="account-rows"><dt>Authored change</dt><dd><span class="pending-inline">Odometry provider/change to verify</span></dd></dl></div><div v-click="2"><dl class="account-rows"><dt>Observation</dt><dd>odom → base_link observed</dd></dl></div><div v-click="3"><dl class="account-rows"><dt>Account</dt><dd>Relationship established for the inspected realisation</dd></dl></div><p class="provenance">Prepared sequence · retained structural run and actual change to verify</p>

</div>

<!--
Slide 19. Stage 2. Declaration → retained observation → updated account. The scan requirements remain open.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Establishing the scan relationships

<div class="slide-content">

<div v-click="1"><dl class="account-rows"><dt>Authored source</dt><dd>Scan topic and frame · exact declaration to verify</dd></dl></div><div v-click="2"><dl class="account-rows"><dt>Observation</dt><dd>Scan source/frame and base_link → scan</dd></dl></div><div v-click="3"><dl class="account-rows"><dt>Account</dt><dd>Scan relationships established for this realisation</dd></dl></div><p class="provenance">Prepared sequence · retained observations and run identities to verify</p>

</div>

<!--
Slide 20. Stage 2. Show the actual provider and frame changes once verified.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# The structural account

<div class="slide-content">

<p><span class="frame-line">odom ─── base_link ─── scan</span></p><dl class="account-rows"><dt>Established</dt><dd>Odometry relationship, scan source/frame, base-to-scan relationship</dd><dt>Still open</dt><dd>Timing, lifecycle, costmap behaviour, navigation success</dd></dl><p class="provenance">Prepared summary of the script’s retained structural observations</p>

</div>

<!--
Slide 21. Stage 2. Availability at each required timestamp remains untested here.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Stage 3 · Is the transform available in time?

<div class="slide-content">

<table><thead><tr><th>Requirement</th><th>Current account</th></tr></thead><tbody><tr><td>odom → base_link</td><td>Structurally established</td></tr><tr><td>base_link → scan</td><td>Structurally established</td></tr><tr><td>Map / lifecycle / action</td><td>Retained status to verify</td></tr><tr><td>Scan-timestamp lookup</td><td>To investigate</td></tr></tbody></table><p class="provenance">Prepared source / explain view · selected investigation and basis to verify</p>

</div>

<!--
Slide 22. 24:00–27:00. Establish what is already supported before runtime observations.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Runtime observations

<div class="slide-content">

<div class="prepared-label">Prepared interaction · no live ROS or shell execution</div>
<pre class="demo-terminal">❯ roti run runtime_compatibility&#10;run: &lt;runtime-surface run ID&gt;&#10;status: observations retained<div v-click><table><thead><tr><th>Interface</th><th>Observed state</th></tr></thead><tbody><tr><td>Map / lifecycle / action</td><td>Exact retained states to verify</td></tr><tr><td>TF relationships</td><td>Available</td></tr></tbody></table></div></pre>

</div>

<!--
Slide 23. Stage 3. Keep the retained runtime surface distinct from successful task behaviour.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Lookup at the scan timestamp fails

<div class="slide-content">

<table><thead><tr><th>Lookup</th><th>Result</th></tr></thead><tbody><tr><td>Latest available transform</td><td>Succeeded</td></tr><tr><td>Transform at scan timestamp</td><td>Failed</td></tr></tbody></table><p class="production-pending">To complete: Scan timestamp, transform-buffer bounds, diagnostic and run identity.</p><p class="provenance">Timing-failure observation described in the script</p>

</div>

<!--
Slide 24. Stage 3. The script does not supply buffer bounds or the scan timestamp. Add the minimal evidence-based timeline when verified; do not invent whether the scan fell before or after the buffer.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Lookup succeeds under changed conditions

<div class="slide-content">

<div class="timing-diagram"><span>Available transform data</span><div class="buffer-line"></div><span>↑<br>Scan timestamp</span></div><table><thead><tr><th>Lookup</th><th>Result</th></tr></thead><tbody><tr><td>Latest available transform</td><td>Succeeded</td></tr><tr><td>Transform at scan timestamp</td><td>Succeeded</td></tr></tbody></table><p class="provenance">Schematic · separate timing-compatible run; not a replay of the failure</p><p class="production-pending">To complete: Run identity and exact changed runtime conditions.</p>

</div>

<!--
Slide 25. Stage 3. Diagram shows the qualitative relationship in the script, not measured timestamps. Preserve the separate-run boundary.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Stage 3 · The updated account

<div class="slide-content">

<dl class="account-rows"><dt>Assumption</dt><dd>Transform data is available when the scan needs it.</dd><dt>Probe</dt><dd>Compare latest-time and scan-time lookups.</dd><dt>Evidence</dt><dd>Scan-time lookup failed, then succeeded in a separate run.</dd><dt>Claim</dt><dd>The required lookup succeeded under the tested conditions.</dd><dt>Still open</dt><dd>Localisation, downstream costmaps and task success.</dd></dl><p class="provenance">Prepared explain update · basis: timing-compatible run, reference pending</p>

</div>

<!--
Slide 26. Stage 3. Only claim compatibility under the recorded conditions.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Stage 4 · No forward progress

<div class="slide-content">

<div class="plain-columns"><section><h2>Recorded topics</h2><p>Valid path<br>Free sampled corridor<br>Zero forward command<br>No translation</p><p class="production-pending">To complete: Attach the packaged topic replay.</p></section><section><h2>Native result records</h2><p>Goal accepted<br>Result timed out</p><p class="production-pending">To complete: Attach the native result excerpts.</p></section></div><p class="provenance">Script summary · two separate attempts, 2026-10-02 20:33:41Z and 20:38:41Z · revision 19ee3b7d…</p>

</div>

<!--
Slide 27. 27:00–30:00. No Gazebo GUI video exists. Assets are not present in this deck. These are text summaries from the authoritative script, not replayed or independently verified evidence. Bags omit submitted goal and final-result reply.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# The behavioural account

<div class="slide-content">

<div class="prepared-label">Prepared interaction · no live ROS or shell execution</div>
<pre class="demo-terminal">❯ source show&#10;  &lt;selected realisation, task and controller&gt;&#10;&#10;❯ roti explain &lt;behavioural investigation&gt;&#10;  substrate / goal / path / corridor: &lt;retained basis&gt;&#10;  forward progress: not established&#10;&#10;question:&#10;  Does the robot progress towards the goal?</pre>

</div>

<!--
Slide 28. Stage 4. Existing account does not independently diagnose the controller.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# What the captures show

<div class="slide-content">

<table><thead><tr><th>Observation</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>Goal</td><td>Accepted</td><td>Native result</td></tr><tr><td>Path</td><td>Valid path</td><td>Bag topic</td></tr><tr><td>Local corridor</td><td>Sampled free to 0.6 m</td><td>Bag / native probe</td></tr><tr><td>Forward command</td><td>Zero</td><td>Bag topic</td></tr><tr><td>Translation</td><td>None</td><td>Bag topic</td></tr><tr><td>Action result</td><td>Timeout</td><td>Native result</td></tr></tbody></table><p class="provenance">Two attempts · 20:33:41Z / 20:38:41Z · native run IDs not emitted<br>Bags omit the submitted goal and final-result reply.</p>

</div>

<!--
Slide 29. Stage 4. Source revision 19ee3b7d28c66015fbc5d0fcde1b5b9ed3d2ddf8. Fresh task 0.5 m; do not conflate with older 3.5 m trial. Observations transcribed from script pending source verification.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# An unresolved behavioural failure

<div class="slide-content">

<dl class="account-rows"><dt>Assumption</dt><dd>The robot can progress towards the accepted goal.</dd><dt>Probe</dt><dd>Inspect path, corridor, commands, odometry and action result.</dd><dt>Evidence</dt><dd>Goal accepted; timeout; no forward command or translation.</dd><dt>Claim</dt><dd>Expected forward progress did not occur in these conditions.</dd><dt>Still open</dt><dd>The cause of the failure.</dd></dl><p v-click class="next-question">What do we investigate next?</p>

</div>

<!--
Slide 30. Stage 4. Let the failure register. Reserve candidate explanations for probe selection, following the script checklist.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Choosing the controller contrast

<div class="slide-content">

<div class="plain-columns"><section><h2>MPPI</h2><p>Earlier observation:<br>no forward progress</p></section><section><h2>RPP</h2><p>Result not yet shown<br><span class="unknown-result">?</span></p></section></div><p>Keep the setup comparable. Change the controller.</p>

</div>

<!--
Slide 31. 30:00–33:00. Human choice: geometry, feasible commands and MPPI behaviour are possible investigations. Explain what either outcome could distinguish. Do not reveal success here. Comparability must be verified.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Stage 5 · What happened with RPP?

<div class="slide-content">

<table><thead><tr><th>Observation</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>Forward command</td><td>Observed</td><td>Recorded topic</td></tr><tr><td>Translational motion</td><td>Observed</td><td>Odometry</td></tr><tr><td>Goal completion</td><td>Success reported</td><td>Native result</td></tr></tbody></table><p class="provenance">Fresh RPP observation described in the script · source records still to attach</p><p class="production-pending">To complete: RPP revision, recorder start, task identity and run reference.</p>

</div>

<!--
Slide 32. 33:00–37:00. Reveal evidence before interpretation. Native record supports acceptance and success; bags omit submitted goal and final-result reply.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# What did the comparison establish?

<div class="slide-content">

<table><thead><tr><th>MPPI</th><th>RPP</th></tr></thead><tbody><tr><td>No forward progress</td><td>Forward command and translation</td></tr><tr><td>Earlier failure</td><td>Goal success reported</td></tr></tbody></table><dl class="account-rows"><dt>Comparison</dt><dd>Controller changed; common conditions and other differences to verify</dd><dt>Supported</dt><dd>This setup completed the task with RPP under the tested conditions.</dd><dt>Still open</dt><dd>Why did MPPI stall here? How repeatable is the RPP result?</dd></dl>

</div>

<!--
Slide 33. Stage 5. General substrate inability is insufficient as the full explanation, subject to verified comparability. No claim of general RPP superiority, isolated defect or complete diagnosis.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Replace the laser provider

<div class="slide-content">

<p>Earlier realisation → changed laser provider</p><table><thead><tr><th>Part of the account</th><th>After the change</th></tr></thead><tbody><tr><td>Odometry independent of the laser</td><td>May retain its basis</td></tr><tr><td>Scan source and frame relationship</td><td>Needs checking again</td></tr><tr><td>Scan timing</td><td>Needs checking again</td></tr><tr><td>Navigation behaviour</td><td>Needs checking for this realisation</td></tr></tbody></table><p class="provenance">Staged dependency example · implemented reopening behaviour to verify</p>

</div>

<!--
Slide 34. 37:00–39:00. The earlier evidence remains about the earlier system. Support only survives where the relevant dependencies and conditions remain unchanged.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# What Rotifer tries to retain

<div class="slide-content">

<dl class="account-rows"><dt>Context</dt><dd>Particular system and conditions</dd><dt>Question</dt><dd>What are we trying to establish?</dd><dt>Investigation</dt><dd>What did we choose to do?</dd><dt>Evidence</dt><dd>What did we retain?</dd><dt>Account</dt><dd>What can we say now? What is still open?</dd></dl><p class="provenance">source show → roti run → roti explain</p>

</div>

<!--
Slide 35. 39:00–43:00. Step back to the research proposition. Avoid repeating the RPP result and the full handover argument.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# The current account after change

<div class="slide-content">

<div class="plain-columns"><section><h2>Still supported</h2><p>Conclusions whose basis remains applicable.</p></section><section><h2>Reopened or unresolved</h2><p>Dependencies affected by the change.<br>Questions the earlier work left open.</p></section></div><div class="frontier-line">Where the investigation has reached</div><p>Evidence and investigations remain available underneath.</p><p class="provenance">Staged account view</p>

</div>

<!--
Slide 36. Reflection. Brief reprise of the frontier visual. The transferred account gives someone a basis to inspect and continue the work.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# What this demonstration establishes

<div class="slide-content">

<dl class="account-rows"><dt>Proposition</dt><dd>Preserve the question, evidence, conclusion and open work around a particular system.</dd><dt>Demonstration</dt><dd>Prepared interactions over retained observations. Rotifer is still in development.</dd><dt>Research questions</dt><dd>What is useful to practitioners? What does this account miss?</dd></dl>

</div>

<!--
Slide 37. Reflection. Practitioner fit and completeness remain research questions. Interface is a prepared representation, not a finished end-to-end CLI.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# What does this look like in your work?

<div class="slide-content">

<div class="spaced-lines"><p>Where does the understanding live?</p><p>What would this account miss?</p><p>What do you already do well?</p></div>

</div>

<!--
Slide 38. 43:00–44:00. Ask about systems, teams, tools and existing practices. Invite recognition, qualification and disagreement without a slogan.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide
---

# Interview study

<div class="slide-content">

<p>Do you work on robotic systems?</p><p>I’m interested in experiences of integration, testing,<br>debugging, deployment and handover.</p><div class="plain-columns"><section><div class="signup-placeholder">Interview sign-up QR<br><small>Link required</small></div></section><section><p>Find out more or express interest.<br>Participation is optional.</p><p class="production-pending">Email: Patrick2.Robinson@live.uwe.ac.uk</p></section></div>

</div>

<!--
Slide 39. 44:00–45:00. Separate invitation from the talk. Add the approved study information/sign-up URL and speaker email before presenting. No invented QR destination. Thank the audience.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->
