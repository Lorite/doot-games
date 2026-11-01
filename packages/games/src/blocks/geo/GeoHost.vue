<script setup lang="ts">
/**
 * Big-screen GeoGuess view. While players pin, it shows only how many pins are in
 * (showing pins would let people copy) and the photo credit. At reveal it draws a map
 * with the real spot, every pin with its owner's name, and a line from each pin to the
 * answer, zoomed to fit them all.
 */
import type { RoundState } from '@doot-games/engine'
import { injectDootRoom } from '@doot-games/engine/vue'
import type * as Leaflet from 'leaflet'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { GeoContent, GeoInput, GeoRevealSummary } from './block'
import { createMap, formatKm, loadLeaflet, themeColor } from './map'

const props = defineProps<{
  content: GeoContent
  inputs: Map<string, GeoInput>
  state: RoundState
  answer?: unknown
}>()

const room = injectDootRoom()
const revealed = computed(() => props.state === 'reveal')
const pinsIn = computed(() => {
  let n = 0
  for (const v of props.inputs.values()) if (v?.lat != null && v?.lng != null) n++
  return n
})
const summary = computed(() => room.roundRevealFor(room.round.value.index) as GeoRevealSummary | undefined)
const closest = computed(() => summary.value?.marks.find((m) => m.pid === summary.value?.closestPid))

const el = ref<HTMLElement | null>(null)
let map: Leaflet.Map | null = null

async function drawReveal() {
  const s = summary.value
  if (!revealed.value || !s?.answer || s.answer.lat == null || s.answer.lng == null) return
  await nextTick()
  if (!el.value || map) return
  const leaflet = await loadLeaflet()
  if (!el.value || map) return
  map = createMap(leaflet, el.value, { zoomControl: false, attributionControl: true })
  const primary = themeColor(el.value, '--primary', '#ff5a36')
  const ink = themeColor(el.value, '--ink', '#222')
  const target: [number, number] = [s.answer.lat, s.answer.lng]
  const points: Array<[number, number]> = [target]
  for (const m of s.marks) {
    const at: [number, number] = [m.lat, m.lng]
    points.push(at)
    leaflet.polyline([at, target], { color: ink, weight: 2, opacity: 0.6, dashArray: '6 6' }).addTo(map)
    leaflet
      .circleMarker(at, {
        radius: m.pid === s.closestPid ? 10 : 8,
        color: '#fff',
        weight: 2,
        fillColor: m.pid === s.closestPid ? primary : ink,
        fillOpacity: 1,
      })
      .bindTooltip(`${m.name} · ${formatKm(m.km)}`, {
        permanent: true,
        direction: 'top',
        offset: [0, -8],
      })
      .addTo(map)
  }
  leaflet
    .circleMarker(target, {
      radius: 14,
      color: '#fff',
      weight: 4,
      fillColor: primary,
      fillOpacity: 1,
    })
    .bindTooltip(s.answer.place || 'Here', {
      permanent: true,
      direction: 'bottom',
      offset: [0, 10],
      className: 'geo-answer-tip',
    })
    .addTo(map)
  const fit = () => {
    if (!map) return
    map.invalidateSize()
    if (points.length > 1) map.fitBounds(leaflet.latLngBounds(points), { padding: [60, 60], maxZoom: 12 })
    else map.setView(target, 6)
  }
  fit()
  // The reveal layout settles after the map is created, so measure and fit again.
  setTimeout(fit, 400)
}

watch([revealed, summary], drawReveal, { immediate: true })

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div class="geo-host">
    <template v-if="!revealed">
      <div class="big-count">
        <span class="num mono">{{ pinsIn }}</span>
        <span class="lbl">{{ state === 'locked' ? 'pins locked in' : 'pins dropped' }}</span>
      </div>
      <p class="hint">{{ state === 'locked' ? 'Where was it?' : 'Drop your pin on your phone.' }}</p>
    </template>
    <template v-else-if="summary && summary.answer">
      <div class="answer">
        <span class="place">{{ summary.answer.place }}</span>
        <span v-if="closest" class="best">Closest: {{ closest.name }}, {{ formatKm(closest.km) }} away</span>
        <span v-else class="best">No pins this round.</span>
      </div>
      <div ref="el" class="geo-map" role="img" :aria-label="`The photo was taken in ${summary.answer.place}`" />
    </template>
    <p v-if="content.credit" class="credit">{{ content.credit }}</p>
  </div>
</template>

<style scoped>
.geo-host {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
}
.big-count {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.num {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 900;
  color: var(--ink);
  line-height: 1;
}
.lbl,
.hint {
  color: var(--ink-soft);
  font-weight: 700;
}
.answer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.place {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 900;
  color: var(--ink);
}
.best {
  font-weight: 700;
  color: var(--ink-soft);
}
.geo-map {
  width: 100%;
  height: min(62vh, 640px);
  border-radius: var(--radius);
  border: var(--bd) solid var(--line-soft);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  z-index: 0;
}
.credit {
  font-size: 13px;
  color: var(--ink-soft);
  opacity: 0.85;
}
:global(.geo-answer-tip) {
  font-weight: 800;
  font-size: 15px;
}
</style>
