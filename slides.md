---
title: How a Robot Moves
info: |
  Tracing Assumptions in ROS 2 Integration
class: simple-slide title-slide
transition: none
duration: 45min
monaco: false
mdc: true
drawings:
  persist: false
---

# How a Robot Moves

<div class="slide-content">

<p>Tracing Assumptions in ROS 2 Integration</p><p>Patrick Robinson<br>ROSCon 2026</p>

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
Slide 2. Opening - 0:00. Working means a particular configuration, robot, environment and set of conditions.
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
<p class="provenance">Topifer · previously Rotifer in the programme</p>

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
<div class="terminal-card"><div class="terminal-title">ROS 2 inspection - staged example</div><div class="terminal-body"><div v-click="1" class="terminal-command">❯ ros2 node list</div><div v-click="2" class="terminal-output">robot_node</div><div v-click="3" class="terminal-command">❯ ros2 topic list</div><div v-click="4" class="terminal-output">/tf<br>/tf_static<br>/scan<br>/cmd_vel</div></div></div>
<div v-click="6" class="tf-inspection">
<div class="terminal-card"><div class="terminal-title">TF2 structure - generated with tf2_tools</div><div class="tf-command">❯ ros2 run tf2_tools view_frames</div></div>
<div class="system-view"><div class="system-view-header">frames.pdf - schematic frame graph</div><div class="tf-graph"><div class="tf-branch"><span>map</span><i>↓</i><span>odom</span></div><div class="tf-branch"><span>base_link</span><i>↓</i><span>scan</span></div></div></div>
</div>
</div>

</div>

<!--
Slide 5. First example - 2:00–5:00. ROS tools provide useful observations. The engineer supplies the question and interpretation.
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

# What these observations establish

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
<section class="system-diagram-block remaining-card"><h2>ROS 2 JAZZY</h2><p><span>/odom</span> - <span>/tf</span> - <span>/cmd_vel</span></p><p>Our inspection tools</p></section>
</div>
<p class="system-diagram-question">First question: what does this setup actually make available?</p>

</div>

<!--
Slide 10. 12:00–14:00. Introduce the Gazebo warehouse robot and ROS 2 Jazzy topics before defining Topifer's model.
Authoritative content: say-show-script.md.
-->

---
class: simple-slide
---

# The selected realisation declares its bindings

<div class="slide-content source-slide">

<div class="source-columns">
<section><h2>Concrete observation provision</h2>

<div class="terminal-card source-code">

~~~yaml
spec:
  providers:
    - ref: gazebo
      as: embodiment
  provides:
    observations:
      - contract: tf_tree
        binding:
          type: ros_topic
          defaultTopics:
            dynamic: /tf
            static: /tf_static
        required: false
        status: experimental
~~~

</div>

</section>
<section><h2>Selected model and adaptation</h2>

<div class="terminal-card source-code">

~~~yaml
spec:
  native:
    robot:
      name: vehicle_blue
    topicAdaptation:
      observations:
        /tf: /model/vehicle_blue/tf
~~~

</div>

<p>The declaration identifies the TF interface and its use in this configuration.</p>
</section>
</div>
<p class="provenance">Selected clauses from scenarios/warehouse_teleop/gazebo_nav2_substrate/realisation.yaml. Source identifier retained; audience alias: warehouse_navigation.</p>

</div>

<!--
Slide 11. 12:00–14:00. Actual selected source clauses; explain concrete provision, experimental status, and topic adaptation. Launch/world details are in the supporting source excerpt.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# The provider supplies the bridge recipe

<div class="slide-content source-slide">

<div class="source-columns">
<section><h2>Gazebo provider</h2>

<div class="terminal-card source-code">

~~~yaml
spec:
  runtime:
    bridgeRecipes:
      observations:
        tf_tree:
          direction: gz_to_ros
          rosType: tf2_msgs/msg/TFMessage
          gzType: gz.msgs.Pose_V
          defaultRosTopic: /tf
~~~

</div>

</section>
<section><h2>Shared observation contract</h2>

<div class="terminal-card source-code">

~~~yaml
metadata:
  name: tf_tree
spec:
  representation:
    class: ros_topic
    messageType: tf2_msgs/msg/TFMessage
~~~

</div>

<p>The contract describes transform publication. A particular frame edge needs its own support.</p>
</section>
</div>
<p class="provenance">Selected clauses: providers/gazebo/provider.yaml and contracts/observation/tf_tree.yaml. The provider catalogue describes known capabilities; the realisation declares the concrete provision.</p>

</div>

<!--
Slide 12. 12:00–14:00. Replace illustrative YAML with actual provider recipe and contract representation. Provider catalogue membership alone does not establish a concrete edge.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# The experiment specifies the question and checks

<div class="slide-content source-slide">

<div class="source-columns">
<section><h2>Selected source</h2>

<div class="terminal-card source-code">

~~~yaml
spec:
  appRef: nav2_corridor_probe
  realisationRef:
    warehouse_teleop@gazebo_nav2_substrate
~~~

</div>

<p>Observer configuration:</p>
<p><code>NAV2_REQUIRED_TF_EDGES</code></p>

<div class="terminal-card source-code">

~~~json
[{"parent":"odom","child":"base_link"}]
~~~

</div>

</section>
<section><h2>Authored expectations</h2>
<dl class="source-facts"><dt>TF publisher</dt><dd>Expect <code>true</code></dd><dt>Lookup odom → base_link</dt><dd>Expect <code>missing</code></dd><dt>Scope</dt><dd>Navigation substrate</dd></dl>
<p>The engineer selects the question, observer and expected check outcomes.</p>
</section>
</div>
<p class="provenance">Presence check: nav2_corridor_gazebo_substrate. Experiment selection and observer request from source/recorded metadata; expected check values from the selected run's results.yaml.</p>

</div>

<!--
Slide 13. 14:00–15:00. TF edge is an optional observer request configured by the experiment, not a mandatory app contract. A passed check can report an expected missing edge.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# Inspect the selected experiment

<div class="slide-content ">

<MockRepl :stage="1" />
<p class="provenance">Select presence_check, then source show. This projection keeps the selected experiment, realisation, observer request and authored check expectations together.</p>

</div>

<!--
Slide 14. 15:00–17:00. Enter the mock REPL, select presence_check and show source. Pause before explain; use the next slide to follow the real derivation.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# How the selected sources resolve

<div class="slide-content source-slide">

<dl class="trace-rows">
<dt>Realisation binding</dt><dd><code>tf_tree</code> on <code>/tf</code>; Gazebo source <code>/model/vehicle_blue/tf</code></dd>
<dt>Provider recipe</dt><dd><code>gz.msgs.Pose_V</code> → <code>tf2_msgs/msg/TFMessage</code></dd>
<dt>Resolved bridge</dt><dd><code>/model/vehicle_blue/tf</code> → <code>/tf</code></dd>
<dt>Model preflight</dt><dd>Requested: <code>odom → base_link</code><br>Inferred from selected model: <code>vehicle_blue/odom → vehicle_blue/chassis</code><br>Result: <code>mismatched</code></dd>
</dl>
<p>The bridge is configured. Next, test the requested edge with a runtime lookup.</p>
<p class="provenance">Bridge-plan and preflight fields from the selected presence-check capture. Model inference is static inspection. The app's optional TF request produces no mandatory contract satisfaction trace in this run.</p>

</div>

<!--
Slide 15. 15:00–17:00. One complete source-backed derivation. Read realisation binding + provider recipe into the resolved bridge; distinguish model preflight inference from runtime evidence. The generic UNKNOWN account is an interpretation, not literal resolver output.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# Explain the setup, then collect observations

<div class="slide-content ">

<MockRepl :stage="1" :start-inside="true" />
<p class="provenance">explain before running: selected declarations, resolved bridge and model preflight. run: prepared execution. explain afterwards: prepared summary of retained observations.</p>

</div>

<!--
Slide 16. 15:00–19:00. Repeated explain keeps declaration/preflight and runtime evidence separate. The current CLI explains resolved structure; the combined observation account is a presentation projection.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# Compare each observation with its authored check

<div class="slide-content ">

<table><thead><tr><th>Recorded field</th><th>Expected</th><th>Observed</th></tr></thead><tbody>
<tr><td><code>observations.tfPublisherPresent</code></td><td>true</td><td>true</td></tr>
<tr><td><code>tf.edges.odom__base_link.status</code></td><td>missing</td><td>missing</td></tr>
<tr><td>Odometry frame IDs</td><td>vehicle_blue/odom → vehicle_blue/chassis</td><td>vehicle_blue/odom → vehicle_blue/chassis</td></tr>
</tbody></table>
<p>The checks passed because these observations matched their expected values.</p>
<p class="provenance">Presence check / gazebo_nav2_substrate. results.yaml + nav2_observer_evidence.json. Run 20261001T151956.546871Z-ba4189019e54; Gazebo / ROS 2 Jazzy.</p>

</div>

<!--
Slide 17. 17:00–19:00. Explain why 17 passed checks and a missing required edge coexist. Selected expectations/observations come from recorded check results; topic evidence and lookup evidence remain separate.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# The run adds evidence to the declared setup

<div class="slide-content ">

<div class="grid grid-cols-2 gap-6">
<section class="remaining-card"><div class="card-kicker">BEFORE THE RUN</div><ul><li>TF binding and bridge recipe resolved</li><li>Model preflight infers a different frame edge</li><li>Requested runtime lookup remains open</li></ul></section>
<section class="remaining-card"><div class="card-kicker">AFTER THE RUN</div><ul><li>TF publisher and odometry observed</li><li>Measured frames match the model preflight</li><li><code>odom → base_link</code> lookup reports <code>missing</code></li></ul></section>
</div>
<p>The declaration, static inspection and runtime observation each retain their basis.</p>
<p class="provenance">Same selected presence-check configuration. Observation does not replace the experimental TF declaration.</p>

</div>

<!--
Slide 18. 19:00–21:00. Compare the same authored setup with new evidence. Do not present UNKNOWN as a native automated edge-entailment result.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# The current account has an inspectable basis

<div class="slide-content ">

<dl class="account-rows">
<dt>Selected system</dt><dd>warehouse_navigation@gazebo_nav2_substrate</dd>
<dt>Question</dt><dd><code>odom → base_link</code>, configured in the experiment</dd>
<dt>Declared / resolved</dt><dd>Realisation TF binding + Gazebo bridge recipe</dd>
<dt>Static inspection</dt><dd>Selected model implies a different frame edge</dd>
<dt>Runtime basis</dt><dd>Recorded observer lookup reports <code>missing</code></dd>
<dt>What we can say</dt><dd>The requested edge was not found during this run</dd>
<dt>Still open</dt><dd>Frame ownership, timing and navigation behaviour</dd>
</dl>
<p class="provenance">Prepared account assembled from source, resolved-plan artifacts and presence-check run 20261001T151956.546871Z-ba4189019e54.</p>

</div>

<!--
Slide 19. 19:00–21:00. Combined account is a prepared interpretation; sources and run remain identifiable.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# Stage 1 - A more specific question

<div class="slide-content ">

<dl class="account-rows">
<dt>Authored question</dt><dd>Is <code>odom → base_link</code> available?</dd>
<dt>Selected inspection</dt><dd>TF publisher, odometry frames and TF lookup</dd>
<dt>Recorded result</dt><dd>Publisher present; requested edge missing</dd>
<dt>Bounded conclusion</dt><dd>Required edge not found in this run</dd>
<dt>Next question</dt><dd>Which part of the selected configuration establishes the frames?</dd>
</dl>
<p class="provenance">Presence-check source and run kept together. The engineer chooses the next investigation.</p>

</div>

<!--
Slide 20. 19:00–21:00. Transition from recorded check results to the human choice of a structural investigation.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# Stage 2 - Attribute each structural finding

<div class="slide-content ">

<table><thead><tr><th>Experiment / selected realisation</th><th>Question and observation</th></tr></thead><tbody>
<tr><td>Odometry link<br><code>gazebo_nav2_tf_substrate</code></td><td>Required <code>odom → base_link</code>: observed</td></tr>
<tr><td>Scan source<br><code>gazebo_nav2_scan_substrate</code></td><td><code>/scan</code> observed; base-to-scan connection missing</td></tr>
<tr><td>Scan integration<br><code>gazebo_nav2_scan_tf_substrate</code></td><td>Realisation-owned static base-to-scan edge: observed</td></tr>
</tbody></table>
<p class="provenance">warehouse_navigation scenario; three separate Gazebo / Jazzy configurations and recorded experiments. Source names and run identities are retained in the evidence summary.</p>

</div>

<!--
Slide 21. 21:00–24:00. Requirement/observer request, owner and observation remain tied to each configuration. No continuous repair or cross-configuration satisfaction claim.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# Structural evidence across three configurations

<div class="slide-content ">

<MockRepl :stage="2" />
<p class="provenance">structural_summary reads retained evidence from three experiments. Each OBSERVED line keeps its source; this summary performs no new run.</p>

</div>

<!--
Slide 22. 21:00–24:00. Retained aggregate, not pre-run derivation or a new combined experiment.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide structure-slide
---

# The structural evidence has a scope

<div class="slide-content ">

<div class="structure-chain"><span>odom</span><span>→</span><span>base_link</span><span>→</span><span>scan frame</span></div>
<div class="structure-facts"><p><strong>Odometry link:</strong> required odometry edge observed.</p><p><strong>Scan source:</strong> scan observed; base-to-scan edge missing.</p><p><strong>Scan integration:</strong> realisation-owned static edge observed.</p></div>
<p class="structure-boundary">These findings belong to three selected configurations. The next configuration needs its own runtime checks.</p>
<p class="provenance">Retained structural observations. Scan-time availability and navigation remain open.</p>

</div>

<!--
Slide 23. 21:00–24:00. Remove the implication that all structural evidence automatically establishes the later realisation.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# Stage 3 - The timing question belongs to a configuration

<div class="slide-content ">

<table><thead><tr><th>Experiment</th><th>Selected realisation</th><th>Declared odom/TF rate</th></tr></thead><tbody>
<tr><td>Runtime surface</td><td><code>gazebo_nav2_map_surface</code></td><td>1 Hz</td></tr>
<tr><td>Timing follow-up</td><td><code>gazebo_nav2_costmap_timing</code></td><td>10 Hz</td></tr>
</tbody></table>
<p>Both configure scan and TF observations. Each must establish transform availability at the scan timestamp.</p>
<p class="provenance">warehouse_navigation scenario. Separate realisations and Gazebo world files; publication rate is not isolated as the cause of the different outcomes.</p>

</div>

<!--
Slide 24. 24:00–27:00. Distinguish declared source settings from runtime compatibility; preserve the two realisations and world-file difference.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# Inspect the runtime experiment before running

<div class="slide-content ">

<MockRepl :stage="3" />
<p class="provenance">Select an experiment, inspect its source and pre-run explanation, then run and explain again. Selecting timing_follow_up starts with its own unanswered runtime question.</p>

</div>

<!--
Slide 25. 24:00–27:00. Each pre-run view uses the selected experiment metadata/model setting. Do not carry observations from runtime_surface into timing_follow_up as established facts.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# The requested scan-time lookup was unavailable

<div class="slide-content">

<dl class="account-rows">
<dt>Configured query</dt><dd><code>odom → base_link</code> at the scan timestamp</dd>
<dt>Recorded stamps</dt><dd>Scan: 153.4 s; latest odometry transform: 153.0 s</dd>
<dt>Lookup result</dt><dd>Transform unavailable at the sampled scan timestamp</dd>
<dt>Costmap logs</dt><dd>2,358 scan drops</dd>
</dl>
<p class="provenance">runtime_surface / warehouse_navigation@gazebo_nav2_map_surface. Observer evidence and lifecycle logs; run 20261001T153245.099238Z-107ca497021c.</p>

</div>

<!--
Slide 26. Stage 3. Connect the configured scan-stamp query to its measured stamps, lookup result and recorded drops. These observations establish the failed lookup, not its full cause.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide compact-body-slide
---

# The follow-up recorded scan-time availability

<div class="slide-content ">

<div class="plain-columns"><section><h2>Selected configuration</h2><p>Timing follow-up</p><p>Declared odometry/TF publication: 10 Hz</p><p>Separate Gazebo world and realisation</p></section><section><h2>Recorded observations</h2><ul><li>Transform available at scan stamp 12.7 s</li><li>Zero costmap scan drops in the observation window</li><li>21/21 authored checks matched their expected values</li></ul></section></div>
<p class="provenance">timing_follow_up / gazebo_nav2_costmap_timing. Run 20261001T153845.573476Z-8e9c452738e4. No goal attempted.</p>

</div>

<!--
Slide 27. 24:00–27:00. Rate is a declaration; scan-time availability is an observation. This separate run does not isolate the cause of the difference.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# Stage 3 - Update the account with the selected run

<div class="slide-content ">

<dl class="account-rows">
<dt>Authored question</dt><dd>Is the transform available when the scan needs it?</dd>
<dt>Configured probe</dt><dd>Scan-stamp TF lookup and costmap message-filter logs</dd>
<dt>Runtime surface</dt><dd>Scan 153.4 s; latest TF 153.0 s; 2,358 drops</dd>
<dt>Timing follow-up</dt><dd>Scan-stamp TF available at 12.7 s; zero drops</dd>
<dt>What this supports</dt><dd>Scan-time compatibility in the recorded follow-up window</dd>
<dt>Still open</dt><dd>Localisation quality, costmap correctness and task success</dd>
</dl>
<p class="provenance">Prepared account over two separately identified configurations and counted captures.</p>

</div>

<!--
Slide 28. 24:00–27:00. Preserve source setting, probe, recorded outcome and bounded conclusion.
Source audit and projection boundaries: docs/declaration-trace.md.
-->


---
class: simple-slide compact-body-slide
---

# Stage 4 - No forward progress

<div class="slide-content">

<div class="plain-columns">
<section><h2>Goal and path</h2><ul><li>0.5 m goal accepted - timed out</li><li>Valid path</li><li>No forward command or translational progress</li></ul></section>
<section><h2>Local corridor check</h2><ul><li>Sampled corridor and robot cell clear</li><li>Footprint present - local motion classified feasible</li></ul></section>
</div>
<p class="provenance">Gazebo - ROS 2 Jazzy - two separate attempts.</p>
<p class="provenance">The mocked REPL shows recorded topics, not the submitted goal or final-result reply. The saved run goal record reports acceptance and timeout. No GUI video.</p>

</div>

<!--
Slide 29. Stage 4 mocked REPL and saved run goal records.
-->

---
class: simple-slide
---

# The behavioural experiment specifies the task

<div class="slide-content ">

<MockRepl :stage="4" />
<p class="provenance">source show identifies goal, timeout, parameter file and probes. Pre-run explain separates that authored task from evidence still to be collected. Local-corridor evidence comes from a separate attempt.</p>

</div>

<!--
Slide 30. 27:00–30:00. Expected progress is an authored investigative question, not a static guarantee or a diagnosis derived by the resolver.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# What the mocked REPL shows

<div class="slide-content">

<table><thead><tr><th>Observation</th><th>Result</th><th>Source</th></tr></thead><tbody>
<tr><td>Goal accepted / timeout</td><td>Recorded</td><td>Saved run goal records</td></tr>
<tr><td>Global path</td><td>Valid path</td><td>Mocked REPL - recorded path</td></tr>
<tr><td>Local feasibility</td><td>Free robot cell; sampled corridor 0–0.6 m; footprint present</td><td>Mocked REPL - separate probe</td></tr>
<tr><td>Forward command</td><td>Zero linear.x</td><td>Mocked REPL - recorded command</td></tr>
<tr><td>Translation</td><td>None observed</td><td>Mocked REPL - recorded odometry</td></tr>
</tbody></table>
<p class="provenance">Recorder starts 20:33:41Z / 20:38:41Z - the two evidence sources are separate attempts.</p>
<p class="provenance">The mocked REPL does not show the submitted goal or final-result reply; the saved run goal record reports acceptance and timeout.</p>

</div>

<!--
Slide 31. Stage 4 observation summary. Do not conflate with the older 3.5 m local-feasibility record.
-->

---
class: simple-slide
---

# An unresolved behavioural failure

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>Forward progress towards the accepted goal</dd>
<dt>Probe</dt><dd>Path - local corridor - command - odometry - goal record</dd>
<dt>Evidence</dt><dd>Goal accepted - timeout<br>Valid path - free sampled corridor/cell<br>Forward command 0 - translation 0</dd>
<dt>What this shows</dt><dd>No expected forward progress in these runs</dd>
<dt>Still open</dt><dd>Task geometry - command feasibility - controller/configuration</dd>
</dl>
<p v-click class="next-question">What do we investigate next?</p>
<p class="provenance">Evidence establishes the failure, not its cause. No controller defect or general substrate infeasibility is established.</p>

</div>

<!--
Slide 32. Stage 4 unresolved question; candidate explanations remain for the probe-selection beat.
-->

---
class: simple-slide
---

# Choosing the controller contrast

<div class="slide-content">

<div class="plain-columns"><section><h2>MPPI</h2><p>No forward progress in Stage 4</p></section><section><h2>Human-selected probe</h2><p>RPP - same named realisation - 0.5 m task</p><p>Result follows</p></section></div>
<p class="provenance">A controlled contrast to narrow the question, not diagnose MPPI. The human chooses the probe.</p>

</div>

<!--
Slide 33. Stage 4 to 5 transition. Preserve the result reveal for the next slide.
-->

---
class: simple-slide
---

# Inspect the RPP contrast, then run it

<div class="slide-content ">

<MockRepl :stage="5" />
<p class="provenance">The experiment selects the RPP parameter file and the same named task realisation. MPPI evidence retains its earlier source; RPP progress requires this run. Native goal evidence supplies the final result.</p>

</div>

<!--
Slide 34. 33:00–37:00. Keep parameter selection, prior MPPI observations and new RPP evidence distinct. The human chooses the contrast.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide
---

# What did the comparison establish?

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>This setup can move and complete the 0.5 m task</dd>
<dt>Probe</dt><dd>Controlled contrast - MPPI → RPP<br>Same named realisation - 0.5 m map-frame task</dd>
<dt>Evidence</dt><dd>MPPI: no progress - goal timeout<br>RPP: forward command - 0.289 m - goal success within 0.25 m XY tolerance</dd>
<dt>What this shows</dt><dd>Setup moved and completed the task in the RPP run</dd>
<dt>Still open</dt><dd>Why MPPI stalled</dd>
</dl>

</div>

<!--
Slide 35. Stage 5 bounded comparison and remaining uncertainties.
-->



---
class: simple-slide
---

# Replace the laser provider

<div class="slide-content ">

<table><thead><tr><th>Retained basis on Laser A</th><th>Review on Laser B</th></tr></thead><tbody>
<tr><td>Selected odometry source and lookup evidence</td><td>Review whether that source and its relevant conditions are preserved.</td></tr>
<tr><td>Laser A contract, binding and observed frame</td><td>Resolve the new binding; inspect the new scan source and frame.</td></tr>
<tr><td>Scan-time lookup and recorded drops</td><td>Run the timing investigation for the new configuration.</td></tr>
<tr><td>Task and recorded navigation result</td><td>Review downstream assumptions; collect new task evidence where needed.</td></tr>
</tbody></table>
<p class="provenance">Illustrative handover review. Previous evidence remains attached to its source/configuration; the engineer judges what can carry forward.</p>

</div>

<!--
Slide 36. 37:00–39:00. Refer back to the worked source-to-binding-to-probe chain. No automatic claim reopening or evidence transfer is implied.
Source audit and projection boundaries: docs/declaration-trace.md.
-->

---
class: simple-slide retention-slide
---

# What Topifer tries to retain

<div class="slide-content ">

<pre class="retention-card">Selected system and conditions
             ↓
Declared sources and resolved bindings
             ↓
Question and authored investigation
             ↓
Run and retained observations
             ↓
Conclusion, its basis and what remains open</pre>
<div class="retention-notes"><p class="provenance">The worked example connects real declarations and resolved-plan artifacts to retained run evidence. The combined account is a prepared presentation view.</p><p class="provenance">Topifer remains in development. Research questions: practitioner value and what this account misses.</p></div>

</div>

<!--
Slide 37. 39:00–43:00. Close by referring back to specific requirement/source/probe/observation provenance. Preserve the implementation boundary.
Source audit and projection boundaries: docs/declaration-trace.md.
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
