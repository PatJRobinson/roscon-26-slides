<script setup>
import { onMounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'
import RehearsalTimer from './components/RehearsalTimer.vue'

const nav = useNav()
const timerEnabled = ref(false)
const preferenceKey = 'roscon-rehearsal-timer-enabled'

onMounted(() => {
  try { timerEnabled.value = sessionStorage.getItem(preferenceKey) === 'true' } catch {}
})
watch(timerEnabled, value => {
  try { sessionStorage.setItem(preferenceKey, String(value)) } catch {}
})
</script>

<template>
  <div v-if="!nav.isPrintMode.value" class="rehearsal-toggle" @click.stop @pointerdown.stop @keydown.stop>
    <label>
      <input v-model="timerEnabled" type="checkbox" role="switch" aria-label="Rehearsal timer" @change="$event.target.blur()" />
      <span>Timer</span>
    </label>
  </div>
  <RehearsalTimer v-if="timerEnabled" />
</template>

<style scoped>
.rehearsal-toggle { position: absolute; right: 0.65rem; bottom: 0.35rem; z-index: 100; padding: 0.12rem 0.4rem; border-radius: 0.3rem; background: rgba(247, 244, 240, 0.94); color: #6b5a65; font: 0.65rem/1.4 ui-monospace, monospace; pointer-events: auto; }
.rehearsal-toggle label { display: flex; align-items: center; gap: 0.35rem; cursor: pointer; }
.rehearsal-toggle input { appearance: none; width: 1.6rem; height: 0.9rem; margin: 0; border: 1px solid #8c8288; border-radius: 1rem; background: #d2c3cd; cursor: pointer; }
.rehearsal-toggle input::before { content: ''; display: block; width: 0.6rem; height: 0.6rem; margin: 0.08rem; border-radius: 50%; background: #fff; }
.rehearsal-toggle input:checked { background: #b23e17; border-color: #b23e17; }
.rehearsal-toggle input:checked::before { transform: translateX(0.65rem); }
.rehearsal-toggle input:focus-visible { outline: 2px solid #47243e; outline-offset: 2px; }
@media print { .rehearsal-toggle { display: none; } }
</style>
