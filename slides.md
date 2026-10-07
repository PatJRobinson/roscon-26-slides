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
<pre class="demo-terminal">❯ select nav2_corridor_gazebo_substrate
❯ source show

experiment:   nav2_corridor_gazebo_substrate
realisation:  warehouse_teleop@gazebo_nav2_substrate
provider:     gazebo (Nav2 substrate)
required:     odom → base_link
conditions:   ROS 2 Jazzy; headless provider-backed substrate run</pre>

</div>

<!--
Slide 13. Stage 1 source declaration and selected realisation.
Evidence source: say-show-script.md and slide-evidence-manifest.md (updated 2026-10-05).
-->

---
class: simple-slide
---

# The account before the run

<div class="slide-content">

<div class="prepared-label">Prepared interaction · no live ROS or shell execution</div>
<pre class="demo-terminal">❯ roti explain nav2_corridor_gazebo_substrate

requires:    odom → base_link
assumption:  required odometry-to-base relationship is available
account:     NOT ESTABLISHED
basis:       authored experiment declaration; no retained edge evidence yet

next question:
  Inspect transform/frame data for this realisation.</pre>

</div>

<!--
Slide 14. Stage 1 account before the retained run.
Evidence source: say-show-script.md and slide-evidence-manifest.md (updated 2026-10-05).
-->

---
class: simple-slide
---

# Run the presence investigation

<div class="slide-content">

<div class="prepared-label">Prepared interaction · no live ROS or shell execution</div>
<pre class="demo-terminal">❯ roti run presence_check

investigation: presence_check
experiment:   nav2_corridor_gazebo_substrate
run:          20261001T151956.546871Z-ba4189019e54
result:       evaluation passed 17/17
status:       counted real-provider capture
disclosure:   copied-bundle replay verified; logs retained</pre>

</div>

<!--
Slide 15. Prepared representation of the execution boundary; it does not execute ROS.
The capture is counted and integrity-checked; stable talk-bundle replay completed.
-->

---
class: simple-slide
---

# What was observed?

<div class="slide-content">

<table><thead><tr><th>Inspected</th><th>Observation</th><th>Source</th></tr></thead><tbody>
<tr><td>/tf; /odom</td><td>Present</td><td>Mocked REPL · recorded run</td></tr>
<tr><td>/tf_static</td><td>Absent; optional in this experiment</td><td>Run ledger</td></tr>
<tr><td>Observed odometry frames</td><td>vehicle_blue/odom → vehicle_blue/chassis</td><td>Mocked REPL · recorded run</td></tr>
<tr><td>Required edge</td><td>odom → base_link not observed</td><td>Mocked REPL · recorded run</td></tr>
</tbody></table>
<p class="provenance">Run 20261001T151956.546871Z-ba4189019e54 · Gazebo · ROS 2 Jazzy · copied-bundle replay verified.</p>

</div>

<!--
Slide 16. Stage 1 capture summary. Do not imply navigation failure from this presence result.
-->

---
class: simple-slide
---

# Stage 1 · What we have established

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>The required odom → base_link relationship is available.</dd>
<dt>Probe</dt><dd>Inspect ROS topic presence and transform/frame data.</dd>
<dt>Evidence</dt><dd>/tf and /odom were visible; vehicle_blue/odom → vehicle_blue/chassis was observed; odom → base_link was not.</dd>
<dt>Claim</dt><dd>Transform-related topics were present, but the required frame relationship was not observed in this run.</dd>
<dt>Still open</dt><dd>Structural compatibility, runtime timing and navigation behaviour.</dd>
</dl>

</div>

<!--
Slide 17. Stage 1 bounded claim.
-->

---
class: simple-slide
---

# Stage 2 · Required relationships

<div class="slide-content">

<table><thead><tr><th>Experiment → realisation</th><th>Run</th><th>Structural observation</th></tr></thead><tbody>
<tr><td>nav2_corridor_gazebo_tf_substrate → warehouse_teleop@gazebo_nav2_tf_substrate</td><td>20261001T152557.040227Z-712ae09c7a39</td><td>odom → base_link present</td></tr>
<tr><td>nav2_corridor_gazebo_scan_substrate → warehouse_teleop@gazebo_nav2_scan_substrate</td><td>20261001T152817.021494Z-02495cda9391</td><td>/scan present; its frame disconnected</td></tr>
<tr><td>nav2_corridor_gazebo_scan_tf_substrate → warehouse_teleop@gazebo_nav2_scan_tf_substrate</td><td>20261001T153019.321569Z-f6c639a7d491</td><td>base_link → vehicle_blue/laser_frame/scan present</td></tr>
</tbody></table>
<p class="provenance">Three separate Gazebo / ROS 2 Jazzy configurations; Rotifer revision 1d964a6578abdaf89776b7078c80e219008108dd.</p>

</div>

<!--
Slide 18. Stage 2 progression. These are distinct runs, not one continuous repair.
-->

---
class: simple-slide
---

# Establishing odometry

<div class="slide-content">

<div v-click="1"><dl class="account-rows"><dt>Experiment</dt><dd>nav2_corridor_gazebo_tf_substrate</dd><dt>Realisation</dt><dd>warehouse_teleop@gazebo_nav2_tf_substrate</dd><dt>Ownership</dt><dd>Provider/model supplies odometry and TF; the app observes the edge.</dd></dl></div>
<div v-click="2"><dl class="account-rows"><dt>Retained evidence</dt><dd>Run 20261001T152557.040227Z-712ae09c7a39 · odom → base_link present · 20/20 checks passed</dd></dl></div>
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

<table><thead><tr><th>Experiment / run</th><th>What changed or appeared</th><th>What the evidence says</th></tr></thead><tbody>
<tr><td>nav2_corridor_gazebo_scan_substrate<br>20261001T152817.021494Z-02495cda9391</td><td>/scan, sensor_msgs/msg/LaserScan; frame vehicle_blue/laser_frame/scan</td><td>Scan present; base_link → scan frame missing</td></tr>
<tr><td>nav2_corridor_gazebo_scan_tf_substrate<br>20261001T153019.321569Z-f6c639a7d491</td><td>Realisation-owned static scan-frame transform</td><td>base_link → vehicle_blue/laser_frame/scan present; scan frame connected</td></tr>
</tbody></table>
<p class="provenance">Separate configurations · Gazebo / ROS 2 Jazzy · final run passed 19/19 checks. Provider/model owns the scan stream; the realisation owns the integration transform.</p>

</div>

<!--
Slide 20. Stage 2 source and retained observations; do not imply runtime timing.
-->

---
class: simple-slide
---

# The structural account

<div class="slide-content">

<p><span class="frame-line">odom ─── base_link ─── vehicle_blue/laser_frame/scan</span></p>
<dl class="account-rows">
<dt>Established</dt><dd>odom → base_link; /scan source and frame; base_link → scan integration edge in the selected configurations.</dd>
<dt>Bounded claim</dt><dd>The selected relationships were structurally interpretable in these tested realisations.</dd>
<dt>Still open</dt><dd>Scan-time TF availability, lifecycle/map conditions, costmap semantics and navigation success.</dd>
</dl>
<p class="provenance">Progression spans orders 2–4; not one run. Counted captures; copied-bundle replay verified.</p>

</div>

<!--
Slide 21. Stage 2 structural claim and boundary.
-->

---
class: simple-slide
---

# Stage 3 · Is the transform available in time?

<div class="slide-content">

<table><thead><tr><th>Runtime experiment</th><th>Run</th><th>Realisation</th></tr></thead><tbody>
<tr><td>nav2_corridor_gazebo_nav2_map_surface</td><td>20261001T153245.099238Z-107ca497021c</td><td>warehouse_teleop@gazebo_nav2_map_surface</td></tr>
<tr><td>nav2_corridor_gazebo_nav2_costmap_timing</td><td>20261001T153845.573476Z-8e9c452738e4</td><td>warehouse_teleop@gazebo_nav2_costmap_timing</td></tr>
</tbody></table>
<p class="provenance">Both counted at Rotifer revision 1d964a6578abdaf89776b7078c80e219008108dd. The timing run used 10 Hz odometry/TF publication.</p>

</div>

<!--
Slide 22. Stage 3 selected source and run identities.
-->

---
class: simple-slide
---

# Runtime observations

<div class="slide-content">

<div class="prepared-label">Prepared interaction · no live ROS or shell execution</div>
<pre class="demo-terminal">❯ roti run nav2_corridor_gazebo_nav2_map_surface
run:        20261001T153245.099238Z-107ca497021c
realisation: warehouse_teleop@gazebo_nav2_map_surface
evaluation: 21/21 declared checks passed

Map:                  present, frame map
Required nodes:       active
NavigateToPose:       available
Latest odom → base_link TF: available (153.0 s)
At scan stamp 153.4 s:       unavailable
Costmap scan drops:         2,358
Timing compatibility:       null</pre>
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
<dt>What happened</dt><dd>The scan arrived at 153.4 s, but the latest <code>odom → base_link</code> transform was from 153.0 s.</dd>
<dt>Effect</dt><dd>The costmap recorded 2,358 scan drops.</dd>
</dl>
<p class="provenance">Run 20261001T153245.099238Z-107ca497021c · warehouse_teleop@gazebo_nav2_map_surface.</p>

</div>

<!--
Slide 24. Stage 3 blocker evidence with recorded latest and scan stamps.
-->

---
class: simple-slide
---

# Increasing the transform update rate fixed the timing issue

<div class="slide-content">

<div class="plain-columns"><section><h2>Follow-up run</h2><p>Odometry/TF publication increased from 1 Hz to 10 Hz.</p><p>Run 20261001T153845.573476Z-8e9c452738e4</p></section><section><h2>What changed</h2><p>At scan stamp 12.7 s, <code>odom → base_link</code> was available.</p><p>Zero costmap scan drops observed.</p><p>21/21 declared checks passed.</p></section></div>

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
<dt>Assumption</dt><dd>Critical transforms are available at sampled scan timestamps.</dd>
<dt>Probe</dt><dd>Inspect runtime surfaces, scan-time TF evidence and costmap scan-drop results.</dd>
<dt>Problem</dt><dd>The scan arrived before its transform, causing 2,358 costmap scan drops.</dd>
<dt>Change</dt><dd>Odometry/TF publication increased from 1 Hz to 10 Hz.</dd>
<dt>Result</dt><dd>In the follow-up run, the transform was available at the scan timestamp and no scan drops were observed.</dd>
<dt>Still open</dt><dd>Localisation accuracy, downstream costmap behaviour and navigation task success.</dd>
</dl>
<p class="provenance">Selected runs replayed from the stable Stage 3 bundle.</p>

</div>

<!--
Slide 26. Stage 3 claim uses the order 6 evidence only.
-->


---
class: simple-slide
---

# Stage 4 · No forward progress

<div class="slide-content">

<div class="plain-columns">
<section><h2>nav2_corridor_gazebo_nav2_pose_path_trace</h2><p>Recorder 2026-10-02 20:33:41Z</p><p>Accepted 0.5 m goal; valid path; zero forward command; no translational progress; goal record reports timeout.</p></section>
<section><h2>nav2_corridor_gazebo_nav2_local_feasibility_trace</h2><p>Recorder 2026-10-02 20:38:41Z</p><p>Free sampled corridor and robot cell; footprint present; local motion classified feasible; goal record reports timeout.</p></section>
</div>
<p class="provenance">Gazebo / ROS 2 Jazzy · warehouse_teleop@gazebo_nav2_goal_base_footprint · Rotifer 19ee3b7d28c66015fbc5d0fcde1b5b9ed3d2ddf8 · no run IDs were generated. Two separate attempts.</p>
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

<div class="prepared-label">Prepared interaction · no live ROS or shell execution</div>
<pre class="demo-terminal">❯ source show
experiments: nav2_corridor_gazebo_nav2_pose_path_trace;
            nav2_corridor_gazebo_nav2_local_feasibility_trace
realisation: warehouse_teleop@gazebo_nav2_goal_base_footprint
task: 0.5 m map-frame goal; MPPI-configured experiment
captures: two separate Jazzy attempts; no run IDs generated</pre>
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
<p class="provenance">Revision 19ee3b7d28c66015fbc5d0fcde1b5b9ed3d2ddf8 · recorder starts 20:33:41Z / 20:38:41Z · no run IDs were generated. The two evidence sources are separate attempts.</p>
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
<dt>Assumption</dt><dd>The prepared system produces forward progress towards the accepted goal.</dd>
<dt>Probe</dt><dd>Inspect path, local corridor, command output, odometry and the run goal record.</dd>
<dt>Evidence</dt><dd>Accepted goal and timeout; valid path; free sampled corridor; zero forward command and no translation.</dd>
<dt>Bounded claim</dt><dd>Expected forward progress did not occur under the inspected conditions.</dd>
<dt>Still open</dt><dd>Why the selected controller did not produce forward motion.</dd>
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

<div class="plain-columns"><section><h2>MPPI observation</h2><p>No forward progress in the Stage 4 one-shot captures</p></section><section><h2>Human-selected probe</h2><p>Try the RPP controller and ask whether bounded progress is possible.</p><p>Result not shown yet · ?</p></section></div>
<p>Intended comparison: same named realisation and 0.5 m task; select RPP as the changed controller. The outcome may narrow the question, not diagnose MPPI.</p>
<p class="provenance">Human chooses the next probe. Do not imply Rotifer diagnosed the failure or selected RPP automatically.</p>

</div>

<!--
Slide 31. Stage 4 to 5 transition. Preserve the result reveal for the next slide.
-->

---
class: simple-slide
---

# Stage 5 · What happened with RPP?

<div class="slide-content">

<table><thead><tr><th>Observation</th><th>Result</th><th>Evidence source</th></tr></thead><tbody>
<tr><td>Controller</td><td>Regulated Pure Pursuit</td><td>Lifecycle log</td></tr>
<tr><td>Forward command</td><td>19 positive linear-x samples; maximum 0.208333 m/s</td><td>Mocked REPL · recorded command</td></tr>
<tr><td>Odometry</td><td>0.288761 m forward displacement</td><td>Mocked REPL · recorded odometry</td></tr>
<tr><td>Navigation goal</td><td>Accepted; success within 30 s</td><td>Run goal record</td></tr>
<tr><td>Goal tolerance</td><td>0.25 m XY; not exact arrival at 0.5 m nominal goal</td><td>Run goal record</td></tr>
</tbody></table>
<p class="provenance">Experiment nav2_corridor_gazebo_nav2_rpp_controller · realisation warehouse_teleop@gazebo_nav2_goal_base_footprint · recorder 2026-10-02 21:07:56Z · Rotifer 19ee3b7d28c66015fbc5d0fcde1b5b9ed3d2ddf8 · no run ID was generated.</p>
<p class="provenance">The mocked REPL shows movement; the run goal record reports acceptance and success. Runtime-parameter mismatch remains unresolved.</p>

</div>

<!--
Slide 32. Stage 5 evidence first. A single bounded RPP success; no superiority or repeatability claim.
-->

---
class: simple-slide
---

# What did the comparison establish?

<div class="slide-content">

<table><thead><tr><th>MPPI observation</th><th>RPP attempt</th></tr></thead><tbody><tr><td>No forward progress; goal timed out in the inspected Jazzy captures.</td><td>Forward command, 0.288761 m odometry displacement, goal reported successful within configured tolerance.</td></tr></tbody></table>
<dl class="account-rows">
<dt>Shared context</dt><dd>Jazzy Gazebo; same named goal_base_footprint realisation; 0.5 m map-frame task; same Rotifer source revision.</dd>
<dt>Comparability limit</dt><dd>RPP runtime-parameter query returned neither the expected FollowPath plugin nor desired_linear_vel. Other runtime differences have not been ruled out.</dd>
<dt>Supported</dt><dd>This RPP attempt shows bounded progress was possible in the prepared substrate; it does not explain the MPPI result.</dd>
<dt>Still open</dt><dd>Why MPPI stalled; whether the result repeats; whether the parameter mismatch affected interpretation.</dd>
</dl>
<p class="provenance">No claim of general RPP superiority, isolated controller defect, exact arrival, safety or production readiness.</p>

</div>

<!--
Slide 33. Stage 5 bounded comparison and remaining uncertainties.
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
