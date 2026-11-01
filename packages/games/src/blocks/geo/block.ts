/**
 * Geo block: GeoGuessr-style "where is this?". The big screen shows a photo (the
 * generic host renders `image` and `prompt`); each phone drops one pin on a map; the
 * closer the pin to the real spot, the more points, with a bonus for the closest. The
 * true location is withheld until the reveal, when the big screen draws a map with the
 * answer, every pin, and a line from each pin to the answer.
 *
 * Scoring decays with distance (`geoPoints`), not relative to the room like Ballpark,
 * so a pin in the right town always scores near the maximum and a pin on the wrong side
 * of Europe scores little, however the others did.
 */
import { isEligible } from '@doot-games/engine'
import {
  type BlockResultsContext,
  type ResultsFragment,
  type RevealContext,
  defineBlock,
  promptText,
  z,
} from '@doot-games/sdk'
import { BASE_POINTS, roundMultiplier } from '../scoring'
import GeoHost from './GeoHost.vue'
import GeoPlayer from './GeoPlayer.vue'
import GeoReveal from './GeoReveal.vue'

/** A flat reward for the single closest pin, on top of the distance curve. */
export const CLOSEST_BONUS = 250
/** Distance (km) at which a pin keeps 1/e (about 37%) of the base points. */
export const DECAY_KM = 800

export const geoContentSchema = z.object({
  subject: z.string().default('').describe('Optional category shown on the big screen.'),
  prompt: promptText('Where in Europe is this?'),
  image: z.string().default('').describe('The photo players have to place on the map.'),
  credit: z.string().default('').describe('Photo attribution shown under the picture.'),
  lat: z.number().nullable().default(null).describe('Latitude of the real spot. Hidden until the reveal.'),
  lng: z.number().nullable().default(null).describe('Longitude of the real spot. Hidden until the reveal.'),
  place: z.string().default('').describe('Name of the real spot, shown at the reveal.'),
  timer: z
    .number()
    .int()
    .nonnegative()
    .nullable()
    .default(60)
    .describe('Seconds to drop a pin. Turn off for an untimed round.'),
})
export type GeoContent = z.infer<typeof geoContentSchema>
export interface GeoInput {
  lat: number | null
  lng: number | null
}
export interface GeoAnswer {
  lat: number | null
  lng: number | null
  place: string
}

export interface GeoMark {
  pid: string
  name: string
  lat: number
  lng: number
  km: number
}
export interface GeoRevealSummary {
  answer: GeoAnswer | null
  marks: GeoMark[]
  closestPid: string | null
}

/** Great-circle distance in km between two points (haversine). Pure. */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = Math.PI / 180
  const dLat = (lat2 - lat1) * rad
  const dLng = (lng2 - lng1) * rad
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)))
}

/** Points for a pin `km` away from the answer, before the closest bonus. Pure. */
export function geoPoints(km: number): number {
  return Math.round(BASE_POINTS * Math.exp(-Math.max(0, km) / DECAY_KM))
}

function validPin(input: GeoInput | undefined): input is { lat: number; lng: number } {
  return !!input && input.lat != null && input.lng != null && Number.isFinite(input.lat) && Number.isFinite(input.lng)
}

function hasAnswer(a: GeoAnswer | undefined): a is { lat: number; lng: number; place: string } {
  return !!a && a.lat != null && a.lng != null && Number.isFinite(a.lat) && Number.isFinite(a.lng)
}

/** Placed pins for a round, paired with their distance to the answer. */
function pinsOf(
  inputs: Map<string, GeoInput>,
  answer: { lat: number; lng: number },
): Array<{ pid: string; lat: number; lng: number; km: number }> {
  const out: Array<{ pid: string; lat: number; lng: number; km: number }> = []
  for (const [pid, input] of inputs) {
    if (!validPin(input)) continue
    out.push({
      pid,
      lat: input.lat,
      lng: input.lng,
      km: distanceKm(input.lat, input.lng, answer.lat, answer.lng),
    })
  }
  return out
}

export const geoBlock = defineBlock<GeoContent, GeoInput>({
  kind: 'geo',
  name: 'GeoGuess',
  scoring: 'The closer your pin to the real spot, the more points, with a bonus for the closest pin.',
  contentSchema: geoContentSchema,
  defaultContent: () => ({
    subject: '',
    prompt: 'Where in Europe is this?',
    image: '',
    credit: '',
    lat: null,
    lng: null,
    place: '',
    timer: 60,
  }),
  defaultTimer: 60,
  timerOf: (c) => c.timer,
  emptyInput: () => ({ lat: null, lng: null }),
  isComplete: (_c, input) => validPin(input),
  PlayerInput: GeoPlayer,
  HostDisplay: GeoHost,
  PlayerReveal: GeoReveal,
  redactContent: (c) => ({ ...c, lat: null, lng: null, place: '' }),
  answerOf: (c): GeoAnswer => ({ lat: c.lat, lng: c.lng, place: c.place }),

  revealSummary: (ctx: RevealContext<GeoContent, GeoInput>): GeoRevealSummary => {
    const answer = ctx.answer as GeoAnswer | undefined
    if (!hasAnswer(answer)) return { answer: null, marks: [], closestPid: null }
    const nameOf = (pid: string) => ctx.players.find((p) => p.id === pid)?.name ?? 'Someone'
    const pins = pinsOf(ctx.inputs, answer).sort((a, b) => a.km - b.km)
    return {
      answer: { lat: answer.lat, lng: answer.lng, place: answer.place },
      marks: pins.map((p) => ({
        pid: p.pid,
        name: nameOf(p.pid),
        lat: p.lat,
        lng: p.lng,
        km: p.km,
      })),
      closestPid: pins[0]?.pid ?? null,
    }
  },

  aggregate: (ctx: BlockResultsContext<GeoContent, GeoInput>): ResultsFragment => {
    const totals = ctx.players.map((p) => ({
      id: p.id,
      name: p.name,
      joinedAtIndex: p.joinedAtIndex,
      score: 0,
      closest: 0,
    }))
    const byId = new Map(totals.map((t) => [t.id, t]))
    ctx.rounds.forEach(({ index }, ri) => {
      const answer = ctx.answerFor(index) as GeoAnswer | undefined
      if (!hasAnswer(answer)) return
      const inputs = ctx.inputsFor(index) as Map<string, GeoInput>
      const pins = pinsOf(inputs, answer).filter((p) => {
        const t = byId.get(p.pid)
        return t && isEligible(t.joinedAtIndex, index)
      })
      if (!pins.length) return
      const minKm = Math.min(...pins.map((p) => p.km))
      const mult = roundMultiplier(ri, ctx.rounds.length)
      for (const p of pins) {
        const t = byId.get(p.pid)
        if (!t) continue
        let pts = geoPoints(p.km)
        if (p.km === minKm) {
          pts += CLOSEST_BONUS
          t.closest++
        }
        t.score += pts * mult
      }
    })
    totals.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    return {
      headline: totals[0]?.score ? `${totals[0].name} knows Europe best` : undefined,
      leaderboard: totals.map((t) => ({
        id: t.id,
        name: t.name,
        score: t.score,
        detail: `${t.closest} closest`,
      })),
      stats: [{ label: 'Places', value: ctx.rounds.length }],
    }
  },
})
