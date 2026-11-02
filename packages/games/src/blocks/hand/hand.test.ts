import type { AssignContext } from '@doot-games/sdk'
import { describe, expect, it } from 'vitest'
import { cardClash } from '../../games/card-clash'
import { cardFromRow } from '../../runtime/decks'
import { type HandContent, blanksIn, dealHands, fillCall, handBlock } from './block'

const content: HandContent = {
  prompt: 'My flatmate collects ___.',
  pick: 1,
  responses: ['spoons', 'regrets', 'cats', 'receipts', 'plants', 'socks', 'maps', 'keys', 'mugs', 'stamps'],
  handSize: 3,
  timer: 60,
  safetyAnswers: [],
}

describe('fillCall and blanksIn', () => {
  it('fills blanks in order and keeps unfilled ones', () => {
    expect(fillCall('Step one: ___. Step two: ___.', ['a', 'b'])).toBe('Step one: a. Step two: b.')
    expect(fillCall('Step one: ___. Step two: ___.', ['a'])).toBe('Step one: a. Step two: ___.')
    expect(fillCall('No blank here.', ['x'])).toBe('No blank here. x')
    expect(blanksIn('Step one: ___. Step two: ___.')).toBe(2)
    expect(blanksIn('No blank here.')).toBe(1)
  })
})

describe('dealHands', () => {
  it('deals distinct cards while the pool lasts and wraps after', () => {
    const hands = dealHands(['a', 'b', 'c', 'd', 'e', 'f'], ['P1', 'P2'], 3)
    expect(hands.P1).toEqual(['a', 'b', 'c'])
    expect(hands.P2).toEqual(['d', 'e', 'f'])
    expect(dealHands(['a', 'b'], ['P1', 'P2'], 3).P2).toEqual(['a', 'b'])
  })
})

describe('hand block', () => {
  it('gives each player only their own hand and hides the pool', () => {
    const ctx: AssignContext<HandContent> = {
      content,
      players: [
        { id: 'A', name: 'Ada', joinedAtIndex: 0 },
        { id: 'B', name: 'Bea', joinedAtIndex: 0 },
      ],
      shuffle: (xs) => [...xs],
      sources: [],
    }
    const { perPlayer } = handBlock.assignContent!(ctx)
    expect(perPlayer.A!.responses).toHaveLength(3)
    expect(perPlayer.B!.responses).toHaveLength(3)
    expect(perPlayer.A!.responses.some((c) => perPlayer.B!.responses.includes(c))).toBe(false)
    expect(handBlock.redactContent!(content).responses).toEqual([])
  })

  it('renders the played card into the black card and ignores invented cards', () => {
    expect(handBlock.toVoteText!(content, { cards: ['regrets'] })).toBe('My flatmate collects regrets.')
    expect(handBlock.toVoteText!(content, { cards: ['free text'] })).toBe('')
    expect(handBlock.isComplete(content, { cards: [] })).toBe(false)
    expect(handBlock.isComplete(content, { cards: ['cats'] })).toBe(true)
  })
})

describe('Card Clash deck rows', () => {
  it('splits a Card deck into black and white piles', () => {
    const rows = [
      { call: 'Worst gift: ___.', response: '' },
      { call: 'Step one: ___. Step two: ___.', response: '' },
      ...['a', 'b', 'c', 'd'].map((response) => ({ call: '', response })),
    ]
      .map(cardFromRow)
      .filter((r) => r != null)
    const cfg = cardClash.buildConfig!('ROOM', { rounds: 2, rows })
    const hands = cfg.rounds.filter((r) => r.block === 'hand')
    expect(hands).toHaveLength(2)
    for (const h of hands) {
      const c = h.content as HandContent
      expect(c.responses).toEqual(['a', 'b', 'c', 'd'])
      expect(c.pick).toBe(blanksIn(c.prompt))
      expect(c.safetyAnswers.length).toBeGreaterThan(0)
    }
    expect(cfg.rounds.map((r) => r.block)).toEqual(['hand', 'vote', 'hand', 'vote'])
  })
})
