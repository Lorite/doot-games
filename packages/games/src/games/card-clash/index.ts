/**
 * Card Clash, a Cards Against Humanity style "Game From Doot": the big screen shows a
 * black card, every phone gets a private hand of white cards, each player plays the
 * card (or cards, for a "pick 2") that fills the blank best, and the room votes for the
 * funniest result. Authors score by vote share, the final round counts double.
 *
 * Pure composition, [hand, vote, hand, vote, ...]: the hand block deals and collects
 * the cards, the stock vote block judges them via the hand block's toVoteText. A deck
 * of kind Card feeds both piles: rows with a `call` are black cards, rows with a
 * `response` are white cards, so a Many Decks / Massive Decks deck converts directly.
 */
import { defineGame } from '@doot-games/sdk'
import type { RoundInstance } from '@doot-games/sdk'
import { BLANK, blanksIn, fillCall, handBlock } from '../../blocks/hand/block'
import { voteBlock } from '../../blocks/vote/block'
import { cardFromRow } from '../../runtime/decks'
import { seededShuffle } from '../../runtime/derive'

/** Built-in black cards, used when no deck is attached. */
const CALLS: string[] = [
  `The real reason I moved abroad: ${BLANK}.`,
  `My flatmate's new hobby: ${BLANK}.`,
  `What ended the group holiday early? ${BLANK}.`,
  `The worst thing to find in a shared fridge: ${BLANK}.`,
  `My LinkedIn headline, if I were honest: ${BLANK}.`,
  `Eurovision's next winning act: ${BLANK}.`,
  `Nobody warned me that adulthood is mostly ${BLANK}.`,
  `The budget airline now charges extra for ${BLANK}.`,
  `My therapist says my problems started with ${BLANK}.`,
  `First date tip: never mention ${BLANK}.`,
  `${BLANK} is the reason I have trust issues.`,
  `In my thirties I will finally have ${BLANK}.`,
  `The group chat went silent after someone sent ${BLANK}.`,
  `Step one: ${BLANK}. Step two: ${BLANK}. Step three: profit.`,
  `I never thought I would be fired for ${BLANK}, but here we are with ${BLANK}.`,
]

/** Built-in white cards. */
const RESPONSES: string[] = [
  'a suspicious amount of IKEA furniture',
  'my landlord',
  'crying in a train station',
  'a lukewarm kebab at 4 am',
  'an unpaid internship',
  'three Erasmus students in a trench coat',
  'passive-aggressive sticky notes',
  'a Ryanair seat that does not recline',
  'my ex',
  'the Wi-Fi password',
  'a hangover that lasts three days',
  'pretending to understand wine',
  'my mother',
  'a dramatic key change',
  'Danish design',
  'twelve unread emails from HR',
  'a LinkedIn influencer',
  'a sourdough starter with a name',
  'Spanish dinner at 11 pm',
  'a festival wristband I never cut off',
  'the night bus',
  'splitting the bill to the cent',
  'a plant I keep forgetting to water',
  'oversharing at the office party',
  'a half-finished language course',
  'emotional damage',
  'a very confident tourist',
  'a cheese board as a personality',
  'my pension plan',
  'a gym membership I never use',
  'jazz',
  'an inflatable flamingo',
  'Excel',
  'a group project',
  'the last slice of pizza',
  'a German sense of humor',
  'a sudden interest in birdwatching',
  'sock sandals',
  'a voice message that lasts nine minutes',
  'existential dread',
  'a goat',
  'my browser history',
  'a stag party in Prague',
  'Sunday scaries',
  'a crypto bro',
  'an inspirational quote',
  'a small dog with a big attitude',
  'free samples',
  'my horoscope',
  'a mysterious rash',
  'being the only one who brought a gift',
  'tax season',
  'an awkward hug',
  'a karaoke ballad',
  'a quarter-life crisis',
  'Nordic noir',
  'my tiny balcony',
  'a power nap',
  'a 7 am flight',
  'a sincere apology',
]

const ROUNDS_PER_GAME = 5
const SAFETY_PER_ROUND = 8

/** One hand+vote pair. The safety answers are pre-filled black cards, so a player who
 *  runs out of time still has a sentence in the gallery (scored at half by the vote). */
function pair(call: string, responses: string[], seed: string): RoundInstance[] {
  const pick = Math.min(3, blanksIn(call))
  const shuffled = seededShuffle(`cards-safety:${seed}:${call}`)(responses)
  const safetyAnswers = Array.from({ length: Math.min(SAFETY_PER_ROUND, Math.floor(shuffled.length / pick)) }, (_, i) =>
    fillCall(call, shuffled.slice(i * pick, i * pick + pick)),
  )
  return [
    { block: 'hand', content: { prompt: call, pick, responses, handSize: 7, timer: 60, safetyAnswers } },
    { block: 'vote', content: { prompt: 'Which card wins?', options: [], mode: 'field', timer: 30 } },
  ]
}

/** Split deck rows into the two piles. A black card without a blank gets one at the end. */
function piles(rows: Array<Record<string, string | number>>): { calls: string[]; responses: string[] } {
  const calls: string[] = []
  const responses: string[] = []
  for (const r of rows) {
    const call = String(r.call ?? '').trim()
    const response = String(r.response ?? '').trim()
    if (call) calls.push(call.includes(BLANK) ? call : `${call} ${BLANK}`)
    if (response) responses.push(response)
  }
  return { calls: [...new Set(calls)], responses: [...new Set(responses)] }
}

/** The built-in piles as deck rows; a creator Card deck replaces them. */
const DEFAULT_ROWS = [
  ...CALLS.map((call) => ({ call, response: '' })),
  ...RESPONSES.map((response) => ({ call: '', response })),
]

export const cardClash = defineGame({
  manifest: {
    id: 'card-clash',
    name: 'Card Clash',
    version: '0.1.0',
    description: 'Fill the black card with the best white card from your hand, then vote for the funniest.',
    author: 'Doot',
    capabilities: ['timer'],
    minPlayers: 3,
    flagship: true,
  },
  blocks: [handBlock, voteBlock],
  defaultConfig: { title: 'Card Clash', rounds: CALLS.slice(0, 3).flatMap((c) => pair(c, RESPONSES, 'default')) },
  contentPool: {
    defaultRows: DEFAULT_ROWS,
    deckKind: 'card',
    fromRow: cardFromRow,
    requires: [
      ['call', 'black', 'prompt', 'question'],
      ['response', 'white', 'answer', 'card'],
    ],
  },
  // Each play: draw a fresh set of black cards by the room code. A deck with too few
  // white cards (fewer than three) falls back to the built-in white pile.
  buildConfig: (seed: string, opts?: { rounds?: number; rows?: Array<Record<string, string | number>> }) => {
    const deck = piles(opts?.rows?.length ? opts.rows : DEFAULT_ROWS)
    const calls = deck.calls.length ? deck.calls : CALLS
    const responses = deck.responses.length >= 3 ? deck.responses : RESPONSES
    const n = Math.max(1, Math.min(opts?.rounds ?? ROUNDS_PER_GAME, calls.length))
    return {
      title: 'Card Clash',
      rounds: seededShuffle(`cards:${seed}`)(calls)
        .slice(0, n)
        .flatMap((call) => pair(call, responses, seed)),
    }
  },
  roundOptions: { min: 1, max: 10, default: ROUNDS_PER_GAME, label: 'Black cards' },
})
