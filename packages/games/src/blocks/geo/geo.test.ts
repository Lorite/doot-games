import type { BlockResultsContext, RevealContext, ScorePlayer } from '@doot-games/sdk'
import { describe, expect, it } from 'vitest'
import { LOCATION_POOL } from '../../games/geoguess/locations'
import {
  CLOSEST_BONUS,
  type GeoContent,
  type GeoInput,
  type GeoRevealSummary,
  distanceKm,
  geoBlock,
  geoPoints,
} from './block'

const players: ScorePlayer[] = [
  { id: 'A', name: 'Ada', joinedAtIndex: 0 },
  { id: 'B', name: 'Bea', joinedAtIndex: 0 },
  { id: 'C', name: 'Cy', joinedAtIndex: 0 },
]
// The answer is Copenhagen.
const content: GeoContent = {
  subject: '',
  prompt: 'Where in Europe is this?',
  image: 'https://example.com/photo.jpg',
  credit: 'Photo: someone',
  lat: 55.6761,
  lng: 12.5683,
  place: 'Copenhagen, Denmark',
  timer: 60,
}
const key = { lat: 55.6761, lng: 12.5683, place: 'Copenhagen, Denmark' }

describe('distanceKm', () => {
  it('is zero for the same point and symmetric', () => {
    expect(distanceKm(55.6761, 12.5683, 55.6761, 12.5683)).toBe(0)
    expect(distanceKm(40.4168, -3.7038, 48.8566, 2.3522)).toBeCloseTo(distanceKm(48.8566, 2.3522, 40.4168, -3.7038), 6)
  })

  it('matches known distances (Madrid to Paris is about 1053 km)', () => {
    expect(distanceKm(40.4168, -3.7038, 48.8566, 2.3522)).toBeGreaterThan(1040)
    expect(distanceKm(40.4168, -3.7038, 48.8566, 2.3522)).toBeLessThan(1065)
  })
})

describe('geoPoints', () => {
  it('gives full points on the spot and decays with distance', () => {
    expect(geoPoints(0)).toBe(1000)
    expect(geoPoints(100)).toBeGreaterThan(geoPoints(500))
    expect(geoPoints(500)).toBeGreaterThan(geoPoints(2000))
    expect(geoPoints(5000)).toBeLessThan(10)
  })
})

describe('geo aggregate', () => {
  it('scores by distance and gives the closest pin a bonus', () => {
    const inputs = new Map<string, GeoInput>([
      ['A', { lat: 55.68, lng: 12.57 }], // in Copenhagen
      ['B', { lat: 59.3293, lng: 18.0686 }], // Stockholm
      ['C', { lat: null, lng: null }], // no pin
    ])
    const ctx: BlockResultsContext<GeoContent, GeoInput> = {
      rounds: [{ index: 0, content }],
      inputsFor: () => inputs,
      answerFor: () => key,
      players,
    }
    const frag = geoBlock.aggregate!(ctx)
    const board = Object.fromEntries((frag.leaderboard ?? []).map((e) => [e.name, e.score]))
    expect(board.Ada).toBeGreaterThan(1000 + CLOSEST_BONUS - 5)
    expect(board.Bea).toBe(geoPoints(distanceKm(59.3293, 18.0686, key.lat, key.lng)))
    expect(board.Cy).toBe(0)
    expect(frag.headline).toBe('Ada knows Europe best')
  })
})

describe('geo revealSummary', () => {
  it('reports the answer, pins sorted by distance, and the closest pid', () => {
    const inputs = new Map<string, GeoInput>([
      ['A', { lat: 52.52, lng: 13.405 }], // Berlin
      ['B', { lat: 56.1629, lng: 10.2039 }], // Aarhus, closer
    ])
    const ctx: RevealContext<GeoContent, GeoInput> = { content, inputs, answer: key, players }
    const s = geoBlock.revealSummary!(ctx) as GeoRevealSummary
    expect(s.answer?.place).toBe('Copenhagen, Denmark')
    expect(s.closestPid).toBe('B')
    expect(s.marks.map((m) => m.name)).toEqual(['Bea', 'Ada'])
  })
})

describe('geo redaction', () => {
  it('strips the location from published content', () => {
    const redacted = geoBlock.redactContent!(content)
    expect(redacted.lat).toBeNull()
    expect(redacted.lng).toBeNull()
    expect(redacted.place).toBe('')
    expect(redacted.image).toBe(content.image)
  })
})

describe('GeoGuess location pool', () => {
  it('has valid coordinates, a photo, and a credit for every place', () => {
    expect(LOCATION_POOL.length).toBeGreaterThanOrEqual(10)
    for (const p of LOCATION_POOL) {
      expect(p.lat).toBeGreaterThan(30)
      expect(p.lat).toBeLessThan(72)
      expect(p.lng).toBeGreaterThan(-25)
      expect(p.lng).toBeLessThan(45)
      expect(p.image).toMatch(/^https:\/\//)
      expect(p.credit).toMatch(/^Photo: .+, .+, Wikimedia Commons$/)
      expect(geoBlock.contentSchema.safeParse({ ...content, ...p }).success).toBe(true)
    }
  })
})
