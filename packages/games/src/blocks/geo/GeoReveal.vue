<script setup lang="ts">
/** Phone reveal for GeoGuess: the real place, how far your pin was, and whether it was closest. */
import { computed } from 'vue'
import type { GeoContent, GeoInput, GeoRevealSummary } from './block'
import { formatKm } from './map'

const props = defineProps<{
  content: GeoContent
  myInput?: GeoInput | null
  reveal?: GeoRevealSummary | null
}>()

const place = computed(() => props.reveal?.answer?.place ?? '')
const placed = computed(() => props.myInput?.lat != null && props.myInput?.lng != null)
const mine = computed(() => {
  const r = props.reveal
  const i = props.myInput
  if (!r || !i || i.lat == null || i.lng == null) return null
  return r.marks.find((m) => m.lat === i.lat && m.lng === i.lng) ?? null
})
const wasClosest = computed(() => !!mine.value && mine.value.pid === props.reveal?.closestPid)
</script>

<template>
  <div class="geo-rev">
    <p class="place">{{ place || 'The answer is on the big screen.' }}</p>
    <p v-if="!placed" class="line">You did not drop a pin.</p>
    <p v-else-if="mine" class="line">
      Your pin was <b class="mono">{{ formatKm(mine.km) }}</b> away.
      <span v-if="wasClosest" class="badge">Closest!</span>
    </p>
  </div>
</template>

<style scoped>
.geo-rev {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.place {
  font-size: 22px;
  font-weight: 900;
  color: var(--ink);
}
.line {
  color: var(--ink-soft);
  font-weight: 700;
}
.badge {
  margin-left: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--primary);
  color: var(--on-primary, #fff);
  font-weight: 800;
}
</style>
