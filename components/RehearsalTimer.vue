<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'
import { STORAGE_KEY, startSession, enterSlide, finishSession, formatDuration, timingCsv, timingSnapshot, validSession } from './rehearsalTiming'

const nav = useNav()
const session = ref(null)
const now = ref(Date.now())
const saveStatus = ref(import.meta.env.DEV ? 'Ready to save locally' : 'Downloads available')
const saving = ref(false)
const enabled = computed(() => !nav.isPrintMode.value)
const snapshot = computed(() => session.value ? timingSnapshot(session.value, now.value) : null)
const currentSplit = computed(() => snapshot.value?.splits.at(-1))
const latestSplit = computed(() => snapshot.value?.splits.filter(s => s.complete).at(-1))
const running = computed(() => session.value && session.value.endedAt === null)
let heartbeat, stopWatch, lastDiskSave = 0, lastBackup = 0
let writeQueue = Promise.resolve()

function backup() {
  if (!session.value) return
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session.value)) }
  catch { saveStatus.value = 'Browser recovery unavailable; download timings' }
}

function persist() {
  backup()
  if (!session.value || !import.meta.env.DEV) return writeQueue
  const data = timingSnapshot(session.value, Date.now())
  lastDiskSave = Date.now()
  saving.value = true
  writeQueue = writeQueue.catch(() => {}).then(async () => {
    const response = await fetch('/__rehearsal/timing', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    })
    if (response.status === 404) throw new Error('Restart Slidev to enable file saving')
    if (!response.ok) throw new Error('Save failed')
    const result = await response.json().catch(() => null)
    if (result?.saved !== true) throw new Error('Restart Slidev to enable file saving')
    saveStatus.value = 'Saved in rehearsals/'
  }).catch(error => {
    saveStatus.value = error.message === 'Restart Slidev to enable file saving'
      ? error.message : 'Local save failed; use Download'
  })
    .finally(() => { saving.value = false })
  return writeQueue
}

function slideChanged(slide) {
  if (!enabled.value) return
  now.value = Date.now()
  const title = String(nav.currentSlideRoute.value.meta.slide.title || `Slide ${slide}`).slice(0, 500)
  const id = 'rehearsal-' + new Date(now.value).toISOString().replace(/[^0-9TZ]/g, '') + '-' + crypto.randomUUID().slice(0, 8)
  const next = enterSlide(session.value, slide, title, now.value, id)
  if (next !== session.value) { session.value = next; persist() }
}

function startHere(event) {
  if (running.value || !enabled.value) return
  now.value = Date.now()
  const slide = nav.currentSlideNo.value
  const title = String(nav.currentSlideRoute.value.meta.slide.title || `Slide ${slide}`).slice(0, 500)
  const id = 'rehearsal-' + new Date(now.value).toISOString().replace(/[^0-9TZ]/g, '') + '-' + crypto.randomUUID().slice(0, 8)
  session.value = startSession(slide, title, now.value, id)
  persist()
  event?.currentTarget?.closest('details')?.removeAttribute('open')
  event?.currentTarget?.blur()
}

async function finish() {
  now.value = Date.now()
  session.value = finishSession(session.value, now.value)
  await persist()
}

async function reset() {
  await finish()
  session.value = null
  try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
  saveStatus.value = import.meta.env.DEV ? 'Ready to save locally' : 'Downloads available'
}

function download(kind) {
  if (!session.value) return
  now.value = Date.now()
  const data = timingSnapshot(session.value, now.value)
  const content = kind === 'csv' ? timingCsv(data) : JSON.stringify(data, null, 2) + '\n'
  const url = URL.createObjectURL(new Blob([content], { type: kind === 'csv' ? 'text/csv' : 'application/json' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${session.value.id}.${kind}`
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  persist()
}

function leaving() {
  if (!session.value || !enabled.value) return
  backup()
  if (import.meta.env.DEV)
    navigator.sendBeacon('/__rehearsal/timing', new Blob([JSON.stringify(timingSnapshot(session.value, Date.now()))], { type: 'application/json' }))
}

onMounted(() => {
  if (!enabled.value) return
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
    if (validSession(saved)) { session.value = saved; persist() }
  } catch {}
  stopWatch = watch(nav.currentSlideNo, slideChanged, { immediate: true, flush: 'post' })
  heartbeat = setInterval(() => {
    now.value = Date.now()
    if (!running.value) return
    if (now.value - lastBackup >= 1000) { backup(); lastBackup = now.value }
    if (import.meta.env.DEV && now.value - lastDiskSave >= 5000) persist()
  }, 250)
  window.addEventListener('pagehide', leaving)
})
onUnmounted(() => {
  clearInterval(heartbeat)
  stopWatch?.()
  window.removeEventListener('pagehide', leaving)
})
</script>

<template>
  <div v-if="enabled" class="rehearsal-timer" @click.stop @pointerdown.stop @keydown.stop>
    <span v-if="snapshot" class="rehearsal-clock" :data-running="Boolean(running)">
      <span class="rehearsal-dot" :class="{ running }" />
      {{ formatDuration(snapshot.totalMs) }}
      <span class="rehearsal-current">· S{{ currentSplit.slide }} {{ formatDuration(currentSplit.durationMs) }}</span>
    </span>
    <span v-else class="rehearsal-ready">Timer ready · starts on slide 2</span>
    <details class="rehearsal-menu">
      <summary aria-label="Rehearsal timer controls">⋯</summary>
      <div class="rehearsal-controls">
        <span v-if="latestSplit">Last split · S{{ latestSplit.slide }} {{ formatDuration(latestSplit.durationMs) }}</span>
        <span>{{ saving ? 'Saving…' : saveStatus }}</span>
        <button :disabled="Boolean(running)" title="Start a new run on this slide; completed runs keep their files" @click="startHere">Start here</button>
        <button :disabled="!running" @click="finish">Finish &amp; save</button>
        <button :disabled="!session" @click="download('json')">Download JSON</button>
        <button :disabled="!session" @click="download('csv')">Download CSV</button>
        <button :disabled="!session" title="Finish this run; use Start here or return to slide 2 to start again" @click="reset">Reset for a new run</button>
      </div>
    </details>
  </div>
</template>

<style scoped>
.rehearsal-timer { position: absolute; right: 0.65rem; bottom: 0.35rem; z-index: 100; display: flex; align-items: center; gap: 0.4rem; padding: 0.12rem 0.4rem; border-radius: 0.3rem; background: rgba(247, 244, 240, 0.94); color: #47243e; font: 0.65rem/1.4 ui-monospace, monospace; pointer-events: auto; }
.rehearsal-clock { display: flex; align-items: center; gap: 0.3rem; font-variant-numeric: tabular-nums; }
.rehearsal-current, .rehearsal-ready { color: #6b5a65; }
.rehearsal-dot { width: 0.35rem; height: 0.35rem; border-radius: 50%; background: #8c8288; }
.rehearsal-dot.running { background: #b23e17; }
.rehearsal-menu { position: relative; }
.rehearsal-menu summary { cursor: pointer; list-style: none; padding: 0 0.2rem; font-weight: bold; }
.rehearsal-menu summary::-webkit-details-marker { display: none; }
.rehearsal-controls { position: absolute; bottom: 1.4rem; right: 0; min-width: 14rem; display: grid; gap: 0.35rem; padding: 0.65rem; border: 1px solid #d2c3cd; border-radius: 0.4rem; background: #f7f4f0; box-shadow: 0 3px 16px #24101c30; }
.rehearsal-controls button { text-align: left; padding: 0.3rem; cursor: pointer; border-radius: 0.2rem; }
.rehearsal-controls button:hover { background: #e8dfe5; }
.rehearsal-controls button:disabled { opacity: 0.45; cursor: default; }
@media print { .rehearsal-timer { display: none; } }
</style>
