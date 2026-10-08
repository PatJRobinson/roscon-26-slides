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

# Our warehouse robot

<div class="slide-content">

<div class="system-diagram">
<section class="system-diagram-block remaining-card"><h2>GAZEBO</h2><p>Warehouse world</p><p>Mobile robot</p></section>
<div class="system-diagram-arrow"><span>ROS bridge</span><strong>↓</strong></div>
<section class="system-diagram-block remaining-card"><h2>ROS 2 JAZZY</h2><p><span>/odom</span> · <span>/tf</span> · <span>/cmd_vel</span></p><p>Our inspection tools</p></section>
</div>
<p class="system-diagram-question">First question: what does this setup actually make available?</p>

</div>

<!--
Slide 10. 12:00–14:00. Introduce the Gazebo warehouse robot and ROS 2 Jazzy topics before defining Rotifer's model.
Authoritative content: say-show-script.md.
-->

---
class: simple-slide
---

# ROTIFER · REALISATION

<div class="slide-content">

<div class="realisation-id">warehouse_navigation@gazebo_nav2_substrate</div>
<div class="realisation-diagram">
<section class="realisation-diagram-block remaining-card"><h2>HOW TO RUN THIS SYSTEM</h2><ul><li>Robot and world</li><li>Processes and launch configuration</li><li>Parameters and ROS bridge mappings</li><li>Deployment</li></ul></section>
<div class="realisation-diagram-arrow"><span>uses</span><strong>▼</strong></div>
<section class="realisation-diagram-block remaining-card"><h2>EXISTING SOFTWARE</h2><p>Gazebo · ROS bridge · robot model</p></section>
</div>
<p class="realisation-caption">One particular arrangement we can reproduce, inspect and investigate.</p>

</div>

<!--
Slide 11. Define realisation as a reusable recipe and providers as descriptions of existing software, not replacements for it.
-->

---
class: simple-slide
---

# EXPERIMENT · Presence check

<div class="slide-content">

<div class="experiment-diagram">
<section class="experiment-diagram-part remaining-card"><h2>OUR SYSTEM</h2><p>warehouse_navigation@gazebo_nav2_substrate</p></section>
<div class="experiment-diagram-arrow"><strong>↓</strong></div>
<section class="experiment-diagram-part remaining-card"><h2>WHAT WE WANT TO KNOW</h2><p>Does this setup provide the frame relationship navigation needs?</p></section>
<div class="experiment-diagram-arrow"><strong>↓</strong></div>
<section class="experiment-diagram-part remaining-card"><h2>WHAT WE'LL LOOK AT</h2><ul><li>Does the provider start?</li><li>Are /odom and /tf available?</li><li>Which frames appear in odometry?</li><li>Can we find odom → base_link?</li></ul></section>
</div>

</div>

<!--
Slide 12. Introduce the authored experiment and its selected probes before opening the prepared workspace.
-->

---
class: simple-slide
---

# Presence check · Rotifer workspace

<div class="slide-content">

<MockRepl :stage="1" />

</div>

<!--
Slide 13. Keep this slide on screen for the entire Presence check REPL session: launch, select, source show, explain, run and explain again. The prepared terminal is not a live CLI or ROS session.
-->

---
class: simple-slide
---

# Presence check · What we observed

<div class="slide-content">

<table><thead><tr><th>Inspected</th><th>Observation</th><th>Source</th></tr></thead><tbody>
<tr><td><code>/odom</code> · <code>/tf</code></td><td>Present</td><td>Mocked REPL · recorded run</td></tr>
<tr><td>Odometry frames</td><td><code>vehicle_blue/odom → vehicle_blue/chassis</code></td><td>Mocked REPL · recorded run</td></tr>
<tr><td>Required edge</td><td><code>odom → base_link</code> not observed</td><td>Mocked REPL · recorded run</td></tr>
</tbody></table>
<p class="provenance">Gazebo · ROS 2 Jazzy · copied-bundle replay verified.</p>

</div>

<!--
Slide 14. Stage 1 recorded observations. Do not imply navigation failure from this presence result.
-->

---
class: simple-slide
---

# Same question · more evidence

<div class="slide-content">

<div class="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
<section class="remaining-card"><div class="card-kicker">BEFORE THE RUN</div><p>Descriptions establish:</p><ul><li><code>/odom</code> and <code>/tf</code> configured</li><li><code>odom → base_link</code> · unknown</li><li>No runtime evidence</li></ul></section>
<section class="remaining-card"><div class="card-kicker">AFTER THE RUN</div><p>Observed:</p><ul><li><code>/odom</code> and <code>/tf</code> present</li><li><code>odom → base_link</code> not observed</li></ul></section>
</div>
<p class="mt-8 text-center text-2xl">The descriptions and the run tell us different things. Keep both.</p>

</div>

<!--
Slide 15. Contrast the authored account with the new runtime observations.
-->

---
class: simple-slide
---

# The current account

<div class="slide-content">

<dl class="account-rows">
<dt>System</dt><dd>warehouse_navigation@gazebo_nav2_substrate</dd>
<dt>Question</dt><dd>Is <code>odom → base_link</code> available?</dd>
<dt>Before running</dt><dd>Not established by the software descriptions</dd>
<dt>Observed</dt><dd><code>/odom</code> and <code>/tf</code> present; required relationship not observed</dd>
<dt>What we can say</dt><dd>The required relationship was not found during this inspection</dd>
<dt>Still open</dt><dd>Why it was unavailable · whether navigation would work</dd>
</dl>
<p class="provenance">Prepared account view assembled from the experiment, resolved description and recorded evidence.</p>

</div>

<!--
Slide 16. The current CLI does not produce this combined account automatically; it is a prepared view over retained material.
-->

---
class: simple-slide
---

# Stage 1 · Presence

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd><code>odom → base_link</code> available</dd>
<dt>Probe</dt><dd>ROS topics · odometry · TF lookup</dd>
<dt>Evidence</dt><dd><code>/odom</code> and <code>/tf</code> present<br><code>odom → base_link</code> not observed</dd>
<dt>What this shows</dt><dd>Required relationship not found in this run</dd>
<dt>Still open</dt><dd>Frame structure · timing · navigation behaviour</dd>
</dl>

</div>

<!--
Slide 17. Stage 1 bounded claim; transition to the next question about how the frames are constructed.
-->

---
class: simple-slide
---

# Stage 2 · Required relationships

<div class="slide-content">

<table><thead><tr><th>Experiment → realisation</th><th>Structural observation</th></tr></thead><tbody>
<tr><td>Odometry link → warehouse_teleop@gazebo_nav2_tf_substrate</td><td>odom → base_link present</td></tr>
<tr><td>Scan source → warehouse_teleop@gazebo_nav2_scan_substrate</td><td>/scan present; its frame disconnected</td></tr>
<tr><td>Scan integration → warehouse_teleop@gazebo_nav2_scan_tf_substrate</td><td>base_link → vehicle_blue/laser_frame/scan present</td></tr>
</tbody></table>
<p class="provenance">Three separate Gazebo / ROS 2 Jazzy configurations.</p>

</div>

<!--
Slide 18. Stage 2 progression. These are distinct runs, not one continuous repair.
-->

---
class: simple-slide
---

# Establishing odometry

<div class="slide-content">

<div v-click="1"><dl class="account-rows"><dt>Experiment</dt><dd>Odometry link</dd><dt>Realisation</dt><dd>warehouse_teleop@gazebo_nav2_tf_substrate</dd><dt>Ownership</dt><dd>Provider/model supplies odometry and TF; the app observes the edge.</dd></dl></div>
<div v-click="2"><dl class="account-rows"><dt>Retained evidence</dt><dd>odom → base_link present · 20/20 checks passed</dd></dl></div>
<div v-click="3"><dl class="account-rows"><dt>Bounded update</dt><dd>The selected odometry/TF relationship was observed for this configuration.</dd></dl></div>
<p class="provenance">Counted real-provider capture; stable talk-bundle replay verified.</p>

</div>

<!--
Slide 19. Stage 2, first structural relationship. Later requirements remain open.
-->

---
class: simple-slide
---

# Establishing the scan relationships

<div class="slide-content">

<MockRepl :stage="2" />

</div>

<!--
Slide 20. Stage 2 source and retained observations; do not imply runtime timing.
-->

---
class: simple-slide structure-slide
---

# The structural account

<div class="slide-content">

<div class="structure-chain"><span>odom</span><span>→</span><span>base_link</span><span>→</span><span>scan frame</span></div>
<div class="structure-facts"><p><strong>Observed:</strong> odom → base_link; the /scan source and frame.</p><p><strong>Scan link:</strong> missing in the scan-only run; present in the final scan-TF run.</p></div>
<p class="structure-boundary">Structural links established for this setup. Scan timing and navigation remain open.</p>
<p class="provenance">Three separate configurations · counted captures · copied-bundle replay verified.</p>

</div>

<!--
Slide 21. Stage 2 structural claim and boundary.
-->

---
class: simple-slide
---

# Stage 3 · Is the transform available in time?

<div class="slide-content">

<table><thead><tr><th>Runtime experiment</th><th>Realisation</th></tr></thead><tbody>
<tr><td>Runtime surface</td><td>warehouse_teleop@gazebo_nav2_map_surface</td></tr>
<tr><td>Timing follow-up</td><td>warehouse_teleop@gazebo_nav2_costmap_timing</td></tr>
</tbody></table>
<p class="provenance">Both counted captures. The timing run used 10 Hz odometry/TF publication.</p>

</div>

<!--
Slide 22. Stage 3 selected experiments and realisations.
-->

---
class: simple-slide
---

# Runtime observations

<div class="slide-content">

<MockRepl :stage="3" />
<p class="provenance">The interface evidence does not establish successful navigation.</p>

</div>

<!--
Slide 23. Order 5 map-surface capture; stable Stage 3 bundle replay verified.
-->

---
class: simple-slide
---

# The scan arrived before its transform

<div class="slide-content">

<dl class="account-rows">
<dt>What happened</dt><dd>The scan arrived at 153.4 s, but the latest odom → base_link transform was from 153.0 s.</dd>
<dt>Effect</dt><dd>The costmap recorded 2,358 scan drops.</dd>
</dl>
<p class="provenance">warehouse_teleop@gazebo_nav2_map_surface.</p>

</div>

<!--
Slide 24. Stage 3 blocker evidence with recorded latest and scan stamps.
-->

---
class: simple-slide compact-body-slide
---

# The transform is available when the scan arrives

<div class="slide-content">

<div class="plain-columns"><section><h2>Follow-up run</h2><ul><li>Odometry/TF publication: 1 Hz → 10 Hz</li></ul></section><section><h2>What changed</h2><ul><li>Transform available at scan stamp 12.7 s</li><li>No costmap scan drops observed</li><li>21/21 declared checks passed</li></ul></section></div>

</div>

<!--
Slide 25. Stage 3 timing-compatible result. No goal was attempted.
-->

---
class: simple-slide
---

# Stage 3 · The updated account

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>Critical transforms available at scan time</dd>
<dt>Probe</dt><dd>Runtime surface · scan-time TF · costmap drops</dd>
<dt>Evidence</dt><dd>First run: scan 153.4 s · latest TF 153.0 s · 2,358 drops<br>Follow-up: 10 Hz · scan/TF at 12.7 s · zero drops</dd>
<dt>What this shows</dt><dd>Follow-up transform available at scan time; no drops observed</dd>
<dt>Still open</dt><dd>Localisation · downstream costmap · navigation success</dd>
</dl>
<p class="provenance">Selected runs replayed from the stable Stage 3 bundle.</p>

</div>

<!--
Slide 26. Stage 3 claim uses the order 6 evidence only.
-->


---
class: simple-slide compact-body-slide
---

# Stage 4 · No forward progress

<div class="slide-content">

<div class="plain-columns">
<section><h2>Goal and path</h2><ul><li>0.5 m goal accepted · timed out</li><li>Valid path</li><li>No forward command or translational progress</li></ul></section>
<section><h2>Local corridor check</h2><ul><li>Sampled corridor and robot cell clear</li><li>Footprint present · local motion classified feasible</li></ul></section>
</div>
<p class="provenance">Gazebo · ROS 2 Jazzy · two separate attempts.</p>
<p class="provenance">The mocked REPL shows recorded topics, not the submitted goal or final-result reply. The saved run goal record reports acceptance and timeout. No GUI video.</p>

</div>

<!--
Slide 27. Stage 4 mocked REPL and saved run goal records.
-->

---
class: simple-slide
---

# The behavioural account

<div class="slide-content">

<MockRepl :stage="4" />
<p class="provenance">Prepared presentation projection; it does not independently diagnose the controller.</p>

</div>

<!--
Slide 28. Stage 4 existing account and selected realisation.
-->

---
class: simple-slide
---

# What the mocked REPL shows

<div class="slide-content">

<table><thead><tr><th>Observation</th><th>Result</th><th>Source</th></tr></thead><tbody>
<tr><td>Goal accepted / timeout</td><td>Recorded</td><td>Saved run goal records</td></tr>
<tr><td>Global path</td><td>Valid path</td><td>Mocked REPL · recorded path</td></tr>
<tr><td>Local feasibility</td><td>Free robot cell; sampled corridor 0–0.6 m; footprint present</td><td>Mocked REPL · separate probe</td></tr>
<tr><td>Forward command</td><td>Zero linear.x</td><td>Mocked REPL · recorded command</td></tr>
<tr><td>Translation</td><td>None observed</td><td>Mocked REPL · recorded odometry</td></tr>
</tbody></table>
<p class="provenance">Recorder starts 20:33:41Z / 20:38:41Z · the two evidence sources are separate attempts.</p>
<p class="provenance">The mocked REPL does not show the submitted goal or final-result reply; the saved run goal record reports acceptance and timeout.</p>

</div>

<!--
Slide 29. Stage 4 observation summary. Do not conflate with the older 3.5 m local-feasibility record.
-->

---
class: simple-slide
---

# An unresolved behavioural failure

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>Forward progress towards the accepted goal</dd>
<dt>Probe</dt><dd>Path · local corridor · command · odometry · goal record</dd>
<dt>Evidence</dt><dd>Goal accepted · timeout<br>Valid path · free sampled corridor/cell<br>Forward command 0 · translation 0</dd>
<dt>What this shows</dt><dd>No expected forward progress in these runs</dd>
<dt>Still open</dt><dd>Task geometry · command feasibility · controller/configuration</dd>
</dl>
<p v-click class="next-question">What do we investigate next?</p>
<p class="provenance">Evidence establishes the failure, not its cause. No controller defect or general substrate infeasibility is established.</p>

</div>

<!--
Slide 30. Stage 4 unresolved question; candidate explanations remain for the probe-selection beat.
-->

---
class: simple-slide
---

# Choosing the controller contrast

<div class="slide-content">

<div class="plain-columns"><section><h2>MPPI</h2><p>No forward progress in Stage 4</p></section><section><h2>Human-selected probe</h2><p>RPP · same named realisation · 0.5 m task</p><p>Result follows</p></section></div>
<p class="provenance">A controlled contrast to narrow the question, not diagnose MPPI. The human chooses the probe.</p>

</div>

<!--
Slide 31. Stage 4 to 5 transition. Preserve the result reveal for the next slide.
-->

---
class: simple-slide
---

# Stage 5 · What happened with RPP?

<div class="slide-content">

<MockRepl :stage="5" />
<p class="provenance">The mocked REPL shows movement; the run goal record reports acceptance and success.</p>

</div>

<!--
Slide 32. Stage 5 evidence first. A single bounded RPP success; no superiority or repeatability claim.
-->

---
class: simple-slide
---

# What did the comparison establish?

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>This setup can move and complete the 0.5 m task</dd>
<dt>Probe</dt><dd>Controlled contrast · MPPI → RPP<br>Same named realisation · 0.5 m map-frame task</dd>
<dt>Evidence</dt><dd>MPPI: no progress · goal timeout<br>RPP: forward command · 0.289 m · goal success within 0.25 m XY tolerance</dd>
<dt>What this shows</dt><dd>Setup moved and completed the task in the RPP run</dd>
<dt>Still open</dt><dd>Why MPPI stalled</dd>
</dl>

</div>

<!--
Slide 33. Stage 5 bounded comparison and remaining uncertainties.
-->



---
class: simple-slide
---

# Replace the laser provider

<div class="slide-content">

<table><thead><tr><th>OLD REALISATION · LASER A</th><th>NEW REALISATION · LASER B</th></tr></thead><tbody><tr><td>Evidence: odom → base_link</td><td>Carry it forward if the odometry source and conditions are unchanged.</td></tr><tr><td>Evidence: scan A source and frame</td><td>Check scan B source and frame.</td></tr><tr><td>Evidence: scan-time transform</td><td>Recheck transform availability when the scan arrives.</td></tr><tr><td>Evidence: navigation result</td><td>Revisit costmap and navigation behaviour.</td></tr></tbody></table><p class="provenance">Earlier evidence remains evidence about Laser A. Illustrative handover view; it does not imply automatic claim reopening.</p>

</div>

<!--
Slide 34. 37:00–39:00. The earlier evidence remains about the earlier system. Support only survives where the relevant dependencies and conditions remain unchanged.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->

---
class: simple-slide retention-slide
---

# What Rotifer tries to retain

<div class="slide-content">

<pre class="retention-card">Particular system / conditions
             ↓
What are we trying to establish?
             ↓
Selected investigation
             ↓
Retained evidence
             ↓
What can we reasonably say?
             ↓
What remains open?</pre>
<div class="retention-notes">
<p class="provenance">Prepared interaction over retained run evidence · Rotifer remains in development.</p>
<p class="provenance">Open research questions: practitioner value and what this account misses.</p>
</div>

</div>

<!--
Slide 35. 39:00–43:00. Step back to the research proposition. Avoid repeating the RPP result and the full handover argument.
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
Slide 36. 43:00–44:00. Ask about systems, teams, tools and existing practices. Invite recognition, qualification and disagreement without a slogan.
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
Slide 37. 44:00–45:00. Separate invitation from the talk. Add the approved study information/sign-up URL and speaker email before presenting. No invented QR destination. Thank the audience.
Authoritative content: say-show-script.md (updated 2026-10-03).
-->
