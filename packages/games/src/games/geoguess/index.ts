/**
 * GeoGuess, a flagship: a photo of an everyday street somewhere in Europe appears on
 * the big screen, everyone drops a pin on the map on their phone, and the closest pins
 * score. A pure composition of `geo` rounds; each play draws a fresh set of places from
 * the pool (`buildConfig`, seeded by the room code).
 */
import { defineGame } from '@doot-games/sdk'
import type { RoundInstance } from '@doot-games/sdk'
import { geoBlock } from '../../blocks/geo/block'
import { seededShuffle } from '../../runtime/derive'
import { type GeoLocation, LOCATION_POOL } from './locations'

const ROUNDS_PER_GAME = 5

function roundsFrom(places: GeoLocation[]): RoundInstance[] {
  return places.map((p) => ({
    block: 'geo',
    content: {
      subject: '',
      prompt: 'Where in Europe is this?',
      image: p.image,
      credit: p.credit,
      lat: p.lat,
      lng: p.lng,
      place: p.place,
      timer: 60,
    },
  }))
}

export const geoguess = defineGame({
  manifest: {
    id: 'geoguess',
    name: 'GeoGuess',
    version: '0.1.0',
    description: 'A street somewhere in Europe. Drop your pin on the map; the closest guess wins.',
    author: 'Lorite',
    capabilities: ['timer'],
    minPlayers: 1,
    flagship: true,
  },
  blocks: [geoBlock],
  defaultConfig: { title: 'GeoGuess', rounds: roundsFrom(LOCATION_POOL.slice(0, ROUNDS_PER_GAME)) },
  buildConfig: (seed: string, opts?: { rounds?: number }) => {
    const n = Math.max(1, Math.min(opts?.rounds ?? ROUNDS_PER_GAME, LOCATION_POOL.length))
    return {
      title: 'GeoGuess',
      rounds: roundsFrom(seededShuffle(`geoguess:${seed}`)(LOCATION_POOL).slice(0, n)),
    }
  },
  roundOptions: { min: 3, max: 10, default: ROUNDS_PER_GAME, label: 'Places' },
})
