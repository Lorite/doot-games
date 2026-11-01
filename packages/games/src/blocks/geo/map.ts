/**
 * Shared Leaflet setup for the geo block. Leaflet touches `window` when imported, so
 * it is loaded on demand in the browser only (never during SSR). Markers are vector
 * circles, so no marker image assets are needed.
 */
import type * as Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type L = typeof Leaflet

/** A view that shows the whole of Europe on a phone or a TV. */
export const EUROPE_CENTER: [number, number] = [52, 12]
export const EUROPE_ZOOM = 3

export async function loadLeaflet(): Promise<L> {
  const mod = await import('leaflet')
  return ((mod as unknown as { default?: L }).default ?? mod) as L
}

/** Create a map with OpenStreetMap tiles (attribution required by the tile policy). */
export function createMap(leaflet: L, el: HTMLElement, opts: Leaflet.MapOptions = {}): Leaflet.Map {
  const map = leaflet.map(el, {
    center: EUROPE_CENTER,
    zoom: EUROPE_ZOOM,
    worldCopyJump: true,
    ...opts,
  })
  leaflet
    .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })
    .addTo(map)
  return map
}

/** Read a theme color token from the page, with a fallback for maps drawn before theming. */
export function themeColor(el: HTMLElement, token: string, fallback: string): string {
  const v = getComputedStyle(el).getPropertyValue(token).trim()
  return v || fallback
}

export function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km).toLocaleString('en')} km`
}
