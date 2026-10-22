---
title: How a Robot Moves
info: |
  Tracing Assumptions in ROS 2 Integration
class: simple-slide title-slide
transition: none
duration: 40min
monaco: false
mdc: true
drawings:
  persist: false
---

# How a Robot Moves

<div class="slide-content">

<p>Tracing Assumptions in ROS 2 Integration</p><p>Patrick Robinson<br>ROSCon 2026</p>

</div>

<img class="title-affiliation-logo" src="/uwe-logo.svg" alt="UWE Bristol" />

<!--
Slide 1. old1. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide quiet-question
---

<div class="slide-content">

<p>What does it mean for a system to work?</p>

</div>

<!--
Slide 2. old2. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Someone gives you a ROS 2 system

<div class="slide-content">

<p>It worked on their machine.</p><ul><li>The packages are there.</li><li>The launch files run.</li><li>The graph appears.</li><li>The README tells you what to type.</li></ul><p>The robot still does not behave as expected.</p>

</div>

<!--
Slide 3. old3. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide quiet-question
---

<div class="slide-content">

<p>The software may travel.<br>The understanding may not.</p>
<p class="provenance">Topifer · previously Rotifer in the programme</p>

</div>

<!--
Slide 4. old4. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Inspecting the ROS system

<div class="slide-content">

<div class="inspection-pair">
<div class="terminal-card"><div class="terminal-title">ROS 2 inspection - staged example</div><div class="terminal-body"><div v-click="1" class="terminal-command">❯ ros2 node list</div><div v-click="2" class="terminal-output">robot_node</div><div v-click="3" class="terminal-command">❯ ros2 topic list</div><div v-click="4" class="terminal-output">/tf<br>/tf_static<br>/scan<br>/cmd_vel</div></div></div>
<div v-click="5" class="tf-inspection">
<div class="terminal-card"><div class="terminal-title">TF2 structure - generated with tf2_tools</div><div class="tf-command">❯ ros2 run tf2_tools view_frames</div></div>
<div class="system-view"><div class="system-view-header">frames.pdf - schematic frame graph</div><div class="tf-graph"><div class="tf-branch"><span>map</span><i>↓</i><span>odom</span></div><div class="tf-branch"><span>base_link</span><i>↓</i><span>scan</span></div></div></div>
</div>
</div>

</div>

<!--
Slide 5. old5. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Is the required relationship available?

<div class="slide-content">

<dl class="account-rows"><dt>Observation</dt><dd>/tf and /tf_static are present</dd><dt>Question</dt><dd>Is odom → base_link available?</dd><dt>Observation</dt><dd>odom → base_link not observed</dd></dl>

</div>

<!--
Slide 6. old6. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide reasoning-slide
---

# We assembled the understanding

<div class="slide-content">

<dl class="account-rows">
<dt>Partial observation</dt><dd>Topics visible; navigation still unexplained.</dd>
<dt>Engineering question</dt><dd>Which relationship does navigation need?</dd>
<dt>Chosen inspection</dt><dd>Look up <code>odom → base_link</code>.</dd>
<dt>Bounded understanding</dt><dd>Relationship missing; cause and task outcome still open.</dd>
</dl>
<p class="next-question">We supplied the reasoning. Did we record it?</p>

</div>

<!--
Slide 7. old7. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide plain-account
---

# The system account is specific to this realisation

<div class="slide-content">

<section><h2>The parts are reusable</h2><p>Packages, nodes, sensors, controllers, libraries.<br>Their documentation travels with them.</p></section><section><h2>The system account is specific</h2><p>How those parts relate, how they are configured,<br>and the conditions in which they work together.</p></section>

</div>

<!--
Slide 8. old8. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Each answer changes the next question

<div class="slide-content">

<dl class="account-rows"><dt>Presence</dt><dd>What is there?</dd><dt>Structure</dt><dd>Is the relationship there?</dd><dt>Runtime</dt><dd>Is it available when it is needed?</dd><dt>Behaviour</dt><dd>Can the system accomplish the task?</dd></dl>

</div>

<!--
Slide 9. old9. Delivery and action cues: say-show-script.md.
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
Slide 10. old10. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Topifer: keep the investigation together

<div class="slide-content">

<dl class="account-rows">
<dt>The system</dt><dd>Which arrangement and conditions are we working with?</dd>
<dt>The question</dt><dd>What are we trying to establish?</dd>
<dt>The investigation</dt><dd>What will we run and inspect?</dd>
<dt>The account</dt><dd>What did we learn, on what basis, and what remains open?</dd>
</dl><p>Start → wait → observe → retain → clean up</p><p class="provenance">Connected descriptions coordinate the execution and keep its evidence with the investigation.</p>

</div>

<!--
Slide 11. intro. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# A realisation describes our arrangement

<div class="slide-content source-slide">

<div class="source-columns">
<section><h2>TF topics used by this arrangement</h2>

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
<section><h2>Selected robot and Gazebo topic</h2>

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

<p>These clauses name the robot and the simulator topic to bring into ROS.</p>
</section>
</div>
<p class="provenance">Selected clauses from scenarios/warehouse_teleop/gazebo_nav2_substrate/realisation.yaml. Source identifier retained; audience alias: warehouse_navigation.</p>

</div>

<!--
Slide 12. realisation. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# A provider describes software we can use

<div class="slide-content source-slide">

<div class="source-columns"><section><h2>Gazebo → ROS message conversion</h2>

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

</section><section><h2>Mark up selected capabilities</h2><p>What can this software supply?</p><p>How can we connect to it?</p><p>What does it need?</p><p>A partial description of existing software.</p></section></div><p class="provenance">Selected provider.yaml clauses. A TF message interface describes transform publication; individual frame relationships need further support.</p>

</div>

<!--
Slide 13. provider. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# An experiment gives the investigation a home

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
Slide 14. experiment. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Inspect our first experiment

<div class="slide-content">

<MockRepl :stage="1" />
<p class="provenance">MOCK · recorded experiments; prepared source and account views.</p>

</div>

<!--
Slide 15. presenceSource. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# What can the descriptions tell us?

<div class="slide-content">

<div class="grid grid-cols-3 gap-5"><section class="remaining-card"><h2>They agree</h2><p>I need a LaserScan.</p><p>The driver describes that interface.</p></section><section class="remaining-card"><h2>They disagree</h2><p>I expect an Image.</p><p>The driver describes PointCloud2.</p></section><section class="remaining-card"><h2>We don't know</h2><p>I need a frame relationship.</p><p>The description doesn't say.</p></section></div><p>Missing information is not evidence of absence.</p><p class="provenance">Illustrative description comparisons, not outputs from the selected experiment. Agreement here is not runtime proof.</p>

</div>

<!--
Slide 16. uncertainty. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# What can we work out before running?

<div class="slide-content source-slide">

<dl class="trace-rows">
<dt>Realisation binding</dt><dd><code>tf_tree</code> on <code>/tf</code>; Gazebo source <code>/model/vehicle_blue/tf</code></dd>
<dt>Provider recipe</dt><dd><code>gz.msgs.Pose_V</code> → <code>tf2_msgs/msg/TFMessage</code></dd>
<dt>Resolved bridge</dt><dd><code>/model/vehicle_blue/tf</code> → <code>/tf</code></dd>
<dt>Model preflight</dt><dd>Requested: <code>odom → base_link</code><br>Inferred from selected model: <code>vehicle_blue/odom → vehicle_blue/chassis</code><br>Result: <code>mismatched</code></dd>
</dl>
<p>The bridge is configured. Next, test the requested edge with a runtime lookup.</p>
<p class="provenance">Bridge-plan and preflight fields from the selected presence-check capture. Model inference is static inspection.</p>

</div>

<!--
Slide 17. derivation. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Explain the setup, then run the investigation

<div class="slide-content ">

<MockRepl :stage="1" :start-inside="true" />
<p class="provenance">explain before running: selected declarations, resolved bridge and model preflight. run: prepared execution. explain afterwards: prepared summary of retained observations.</p>

</div>

<!--
Slide 18. presenceRun. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide summary-slide
---

# Stage 1 summary

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>Navigation needs <code>odom → base_link</code>.</dd>
<dt>Question</dt><dd>Does this arrangement supply that relationship?</dd>
<dt>Static inspection</dt><dd>Selected model suggests different frame names.</dd>
<dt>Runtime evidence</dt><dd>TF publisher present; requested lookup missing.</dd>
<dt>Claim</dt><dd>The requested relationship was not found in this run.</dd>
<dt>Still open</dt><dd>How to establish the intended frames; timing and navigation.</dd>
</dl>
<p class="provenance">Presence check · gazebo_nav2_substrate · run 20261001T151956.546871Z-ba4189019e54.</p>

</div>

<!--
Slide 19. summary1. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Stage 2: complete the described structure

<div class="slide-content">

<dl class="account-rows">
<dt>Odometry link</dt><dd>Configure <code>odom → base_link</code>.</dd>
<dt>Scan source</dt><dd>Bring the LiDAR measurements into ROS on <code>/scan</code>.</dd>
<dt>Scan connection</dt><dd>Connect the sensor frame to <code>base_link</code>.</dd>
</dl><p>What does the selected arrangement describe before we run it?</p>

</div>

<!--
Slide 20. setup2. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Inspect the structural arrangement

<div class="slide-content">

<MockRepl :stage="2" />
<p class="provenance">Prepared reading of the scan-integration configuration: model + scan bridge + static-transform process. No new observations.</p>

</div>

<!--
Slide 21. structure. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide summary-slide
---

# Stage 2 summary

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>Navigation needs odometry, scans and connected frames.</dd>
<dt>Question</dt><dd>Have we configured the intended structural pieces?</dd>
<dt>Static inspection</dt><dd>Model frame names, scan bridge and base-to-scan process.</dd>
<dt>Runtime evidence</dt><dd>Not collected in this structural view.</dd>
<dt>Claim</dt><dd>The descriptions account for the intended connections.</dd>
<dt>Still open</dt><dd>Published sensor frame, scan-time availability and navigation.</dd>
</dl>
<p class="provenance">Selected: gazebo_nav2_scan_tf_substrate. Source reading, not a new run or an aggregate runtime claim.</p>

</div>

<!--
Slide 22. summary2. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Stage 3: can navigation use the data?

<div class="slide-content">

<dl class="account-rows">
<dt>What we have</dt><dd>Descriptions of the intended topics and frame connections.</dd>
<dt>What we need</dt><dd>Transforms available at the timestamps of the LiDAR scans.</dd>
<dt>What we will do</dt><dd>Run an experiment; inspect TF lookups and costmap logs.</dd>
</dl><p>The right connections on paper are a starting point. Now observe the running system.</p>

</div>

<!--
Slide 23. setup3. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Run and inspect the timing experiments

<div class="slide-content">

<MockRepl :stage="3" />
<p class="provenance">Runtime surface and timing follow-up are separate configurations and runs. No navigation goal attempted.</p>

</div>

<!--
Slide 24. runtime. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide summary-slide
---

# Stage 3 summary

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>Navigation can use a scan when its required TF is available.</dd>
<dt>Question</dt><dd>Is that transform available at the scan timestamp?</dd>
<dt>Static inspection</dt><dd>Configured TF/scan inputs; declared odom/TF rates.</dd>
<dt>Runtime evidence</dt><dd>First: unavailable, 2,358 drops. Follow-up: available, zero drops.</dd>
<dt>Claim</dt><dd>Scan-time availability in the follow-up observation window.</dd>
<dt>Still open</dt><dd>Localisation quality, costmap correctness and task success.</dd>
</dl>
<p class="provenance">Runtime surface / timing follow-up · recorded TF lookups and costmap logs.</p>

</div>

<!--
Slide 25. summary3. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Stage 4: can the robot make progress?

<div class="slide-content">

<dl class="account-rows">
<dt>Task</dt><dd>Navigate towards a goal 0.5 m away in the map frame.</dd>
<dt>First investigation</dt><dd>Inspect the goal result, path, commands and odometry.</dd>
<dt>Follow-up question</dt><dd>What does the local costmap say about the space ahead?</dd>
</dl><p>Having the interfaces and timing evidence does not establish task performance.</p>

</div>

<!--
Slide 26. setup4. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Run and inspect the navigation attempt

<div class="slide-content">

<div class="grid grid-cols-[minmax(0,1fr)_14rem] gap-4 items-start">
<MockRepl :stage="4" />
<aside v-click="1" class="remaining-card"><div class="card-kicker">Saved run goal record</div><p>Goal and path attempt</p><pre class="text-sm saved-goal-record">status: ACCEPTED
result: TIMEOUT</pre><p class="provenance">Separate from the REPL topic observations.</p>
<div v-click="2" class="mt-4"><div class="card-kicker">Separate costmap experiment</div><p>Robot cell: free<br>Sampled corridor: clear to 0.6 m ahead</p></div></aside>
</div>
<p class="provenance">Two separate attempts · Jazzy / Gazebo · saved goal record supplies acceptance and timeout.</p>

</div>

<!--
Slide 27. behaviour. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide summary-slide
---

# Stage 4 summary

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>The configured robot can make progress towards the goal.</dd>
<dt>Question</dt><dd>Does it move, and what do the path and corridor probes show?</dd>
<dt>Static inspection</dt><dd>0.5 m goal and MPPI parameter file selected.</dd>
<dt>Runtime evidence</dt><dd>Accepted, timed out; valid path, clear sampled corridor; no progress.</dd>
<dt>Claim</dt><dd>Expected forward progress was not observed in these attempts.</dd>
<dt>Still open</dt><dd>Why the system made no forward progress.</dd>
</dl>
<p v-click class="next-question">What do we investigate next?</p>
<p class="provenance">Goal/path and local corridor are separate attempts (20:33:41Z / 20:38:41Z). Evidence establishes failure, not its cause.</p>

</div>

<!--
Slide 28. summary4. Delivery and action cues: say-show-script.md.
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
Slide 29. contrast. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Inspect and run the RPP contrast

<div class="slide-content">

<div class="grid grid-cols-[minmax(0,1fr)_14rem] gap-4 items-start">
<MockRepl :stage="5" />
<aside v-click="1" class="remaining-card"><div class="card-kicker">Saved run goal record</div><p>RPP attempt</p><pre class="text-sm saved-goal-record">result: SUCCEEDED
XY goal tolerance: 0.25 m</pre><p class="provenance">Separate from the REPL topic observations.</p></aside>
</div>
<p class="provenance">RPP selects another parameter file for the same named realisation and 0.5 m task. Prior MPPI evidence stays separate.</p>

</div>

<!--
Slide 30. rpp. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide summary-slide
---

# Stage 5 summary

<div class="slide-content">

<dl class="account-rows">
<dt>Assumption</dt><dd>This setup can make progress with a different controller.</dd>
<dt>Question</dt><dd>What changes when we try RPP for the same named task?</dd>
<dt>Static inspection</dt><dd>RPP parameter file; 0.5 m goal; 30 s timeout.</dd>
<dt>Runtime evidence</dt><dd>19 positive commands; 0.289 m displacement; goal succeeded.</dd>
<dt>Claim</dt><dd>The setup moved and completed the task in this RPP run.</dd>
<dt>Still open</dt><dd>Why MPPI stalled; causal attribution and repeatability.</dd>
</dl>
<p class="provenance">One RPP attempt · goal success within 0.25 m XY tolerance · native goal record + recorded topics. Not an isolated causal comparison.</p>

</div>

<!--
Slide 31. summary5. Delivery and action cues: say-show-script.md.
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
Slide 32. reflection. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# What does this look like in your work?

<div class="slide-content">

<div class="spaced-lines"><p>Where does the understanding live?</p><p>What would this account miss?</p><p>What do you already do well?</p></div>

</div>

<!--
Slide 33. community. Delivery and action cues: say-show-script.md.
-->

---
class: simple-slide
---

# Interview study

<div class="slide-content">

<p>Do you work on robotic systems?</p><p>I’m interested in experiences of integration, testing,<br>debugging, deployment and handover.</p><div class="plain-columns"><section><img src="/interview-mailing-list.svg" alt="Scan to register interest in a research interview" style="width: 14rem; height: 14rem; object-fit: contain;" /></section><section><p>Find out more or express interest.</p><p style="font-size: 1.5rem; line-height: 1.4;">Email:<br>Patrick2.Robinson@live.uwe.ac.uk</p></section></div>

</div>

<!--
Slide 34. interview. Delivery and action cues: say-show-script.md.
-->
