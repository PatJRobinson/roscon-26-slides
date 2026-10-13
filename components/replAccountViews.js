import accountData from '../data/experiment-accounts.json'

export const experimentAccounts = accountData.accounts

function requestedEdges(account) {
  const configured = account.roles.nav2_observer?.NAV2_REQUIRED_TF_EDGES
  return configured ? JSON.parse(configured).map(edge => `${edge.parent} -> ${edge.child}`).join(', ') : 'not configured'
}

function observationBindings(account) {
  return account.bridges.filter(bridge => bridge.kind === 'observation')
    .map(bridge => `  ${bridge.contract}: ${bridge.rosTopic}`)
}

export function sourceView(item) {
  const account = experimentAccounts[item]
  if (!account) return null
  const lines = [
    `experiment: ${item}`,
    `source: experiments/${account.experiment}/experiment.yaml`,
    `system: ${account.displayRealisation}`,
  ]
  const observer = account.roles.nav2_observer || {}
  const lifecycle = account.roles.nav2_lifecycle_surface || {}
  const goal = account.roles.nav2_goal_probe || {}
  if (['presence_check', 'odometry_link', 'scan_source', 'scan_integration'].includes(item)) {
    lines.push('observer config [experiment]:', `  required TF: ${requestedEdges(account)}`)
    if (observer.NAV2_SCAN_TOPIC) lines.push(`  scan topic: ${observer.NAV2_SCAN_TOPIC}`)
    if (account.checkExamples.length) {
      lines.push('authored checks [recorded expectations]:')
      for (const check of account.checkExamples) lines.push(`  ${check.field}: expect ${check.expected}`)
    }
    lines.push('scope: substrate; navigation remains open')
  } else if (item === 'runtime_surface' || item === 'timing_follow_up') {
    lines.push('observer config [experiment]:', `  required TF: ${requestedEdges(account)}`, `  scan: ${observer.NAV2_SCAN_TOPIC}`, `  lifecycle: ${observer.NAV2_REQUIRED_LIFECYCLE_NODES}`)
    if (lifecycle.NAV2_CLASSIFY_COSTMAP_TIMING !== undefined) lines.push(`  classify costmap timing: ${lifecycle.NAV2_CLASSIFY_COSTMAP_TIMING}`)
    lines.push('scope: scan-time compatibility; no goal attempted')
  } else if (item === 'local_corridor_check') {
    const local = account.roles.nav2_local_feasibility_probe || {}
    lines.push('probe config [experiment]:', `  costmap: ${local.NAV2_LOCAL_COSTMAP_TOPIC}`, `  footprint: ${local.NAV2_FOOTPRINT_TOPIC}`, `  forward sample distance: ${local.NAV2_FORWARD_SAMPLE_DISTANCE} m`, 'scope: local corridor; separate attempt')
  } else {
    lines.push('goal config [experiment]:', `  action: ${goal.NAV2_GOAL_ACTION}`, `  goal: ${goal.NAV2_GOAL_FRAME} frame, x=${goal.NAV2_GOAL_X} m`, `  timeout: ${goal.NAV2_GOAL_TIMEOUT_SECONDS} s`, `  params: ${lifecycle.NAV2_PARAMS_FILE}`, 'records: goal result, path, command, odometry')
  }
  return lines.join('\n')
}

export function preRunView(item) {
  const account = experimentAccounts[item]
  if (!account) return null
  if (item === 'presence_check') {
    const bridge = account.bridges.find(entry => entry.contract === 'tf_tree')
    const preflight = account.preflight.checks.find(entry => entry.contract === 'tf_tree')
    const model = account.preflight.sdf.model.plugins.find(plugin => plugin.inferredFrameId || plugin.frameId)
    return [
      'declared [realisation]:',
      '  tf_tree: /tf, /tf_static (experimental)',
      'resolved [provider bridge recipe + binding]:',
      `  ${bridge.gzTopic} -> ${bridge.rosTopic}`,
      `  ${bridge.gzType} -> ${bridge.rosType}`,
      'preflight [selected SDF + experiment request]:',
      `  requested: ${requestedEdges(account)}`,
      `  model inference: ${model.frameId || model.inferredFrameId} -> ${model.childFrameId || model.inferredChildFrameId}`,
      `  required edge: ${preflight.requiredEdges[0].status}`,
      'runtime [this presentation run]:',
      '  TF lookup: not_run',
    ].join('\n')
  }
  const observer = account.roles.nav2_observer || {}
  if (['odometry_link', 'scan_source', 'scan_integration'].includes(item)) {
    return ['declared [selected realisation]:', ...observationBindings(account), 'configured [experiment]:', `  TF lookup: ${requestedEdges(account)}`, 'to establish: frame relationships in this configuration', 'runtime: not_run'].join('\n')
  }
  if (item === 'runtime_surface' || item === 'timing_follow_up') {
    return [
      'declared [selected model]:',
      `  odometry/TF publication: ${account.declaredModel.odomTfHz} Hz`,
      'configured [experiment]:',
      `  map: ${observer.NAV2_MAP_TOPIC}; scan: ${observer.NAV2_SCAN_TOPIC}`,
      `  TF lookup: ${requestedEdges(account)}`,
      'to establish [this configuration]:',
      ...(item === 'runtime_surface' ? ['  map, lifecycle, NavigateToPose availability'] : []),
      '  transform available at scan stamp; costmap drops',
      'runtime: not_run',
    ].join('\n')
  }
  if (item === 'local_corridor_check') {
    const local = account.roles.nav2_local_feasibility_probe || {}
    return ['configured [experiment]:', `  costmap: ${local.NAV2_LOCAL_COSTMAP_TOPIC}`, `  footprint: ${local.NAV2_FOOTPRINT_TOPIC}`, `  forward sample distance: ${local.NAV2_FORWARD_SAMPLE_DISTANCE} m`, 'to establish: sampled corridor feasibility', 'runtime: not_run'].join('\n')
  }
  const goal = account.roles.nav2_goal_probe || {}
  const lifecycle = account.roles.nav2_lifecycle_surface || {}
  return [
    'configured [experiment]:',
    `  goal: ${goal.NAV2_GOAL_FRAME} frame, x=${goal.NAV2_GOAL_X} m`,
    `  timeout: ${goal.NAV2_GOAL_TIMEOUT_SECONDS} s`,
    `  params: ${lifecycle.NAV2_PARAMS_FILE?.split('/').pop()}`,
    'authored question: does this attempt make forward progress?',
    'to establish: goal result, path, command, odometry',
    ...(item === 'rpp_attempt' ? ['prior evidence [goal_and_path]: no forward progress', 'comparison: controller_progress; outcome still open'] : []),
    'runtime: not_run',
  ].join('\n')
}

export function accountBasis(item, afterRun = false) {
  if (item === 'structural_summary') return 'Retained summary: odometry_link, scan_source, scan_integration - three separate configurations.'
  const account = experimentAccounts[item]
  if (!account) return ''
  const priorEvidence = item === 'rpp_attempt' ? `; prior MPPI evidence: goal_and_path - ${experimentAccounts.goal_and_path.run}` : ''
  if (afterRun) return `Prepared observation summary: ${account.evidencePath} - ${account.run}${priorEvidence}`
  return `Source / resolved-plan projection: ${account.experiment} + ${account.realisation}${item === 'presence_check' ? '; Gazebo bridge plan and SDF preflight' : ''}${priorEvidence}`
}
