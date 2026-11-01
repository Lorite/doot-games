<script setup lang="ts">
/** Phone input for GeoGuess: tap the map to drop (or move) your pin. */
import type * as Leaflet from 'leaflet'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { GeoContent, GeoInput } from './block'
import { createMap, loadLeaflet, themeColor } from './map'

const props = defineProps<{ content: GeoContent; modelValue: GeoInput; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: GeoInput] }>()

const el = ref<HTMLElement | null>(null)
let map: Leaflet.Map | null = null
let pin: Leaflet.CircleMarker | null = null
let leaflet: Awaited<ReturnType<typeof loadLeaflet>> | null = null

function drawPin(lat: number | null, lng: number | null) {
  if (!map || !leaflet || !el.value) return
  if (lat == null || lng == null) {
    pin?.remove()
    pin = null
    return
  }
  if (!pin) {
    const color = themeColor(el.value, '--primary', '#ff5a36')
    pin = leaflet
      .circleMarker([lat, lng], {
        radius: 11,
        color: '#fff',
        weight: 3,
        fillColor: color,
        fillOpacity: 1,
      })
      .addTo(map)
  } else {
    pin.setLatLng([lat, lng])
  }
}

onMounted(async () => {
  const lf = await loadLeaflet()
  leaflet = lf
  if (!el.value) return
  map = createMap(lf, el.value)
  map.on('click', (e: Leaflet.LeafletMouseEvent) => {
    if (props.disabled) return
    const lat = Math.round(e.latlng.lat * 1e5) / 1e5
    const lng = Math.round(lf.Util.wrapNum(e.latlng.lng, [-180, 180], true) * 1e5) / 1e5
    emit('update:modelValue', { lat, lng })
  })
  drawPin(props.modelValue.lat, props.modelValue.lng)
})

watch(
  () => [props.modelValue.lat, props.modelValue.lng] as const,
  ([lat, lng]) => drawPin(lat, lng),
)

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div class="geo">
    <div ref="el" class="geo-map" :class="{ off: disabled }" role="application" aria-label="Map: tap to drop your pin" />
    <p class="hint">
      {{ modelValue.lat == null ? 'Tap the map where you think the photo was taken.' : 'Pin dropped. Tap again to move it.' }}
    </p>
  </div>
</template>

<style scoped>
.geo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.geo-map {
  height: min(58vh, 520px);
  width: 100%;
  border-radius: var(--radius);
  border: var(--bd) solid var(--line-soft);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  z-index: 0;
}
.geo-map.off {
  opacity: 0.7;
}
.hint {
  color: var(--ink-soft);
  font-size: 14px;
  font-weight: 600;
}
</style>
