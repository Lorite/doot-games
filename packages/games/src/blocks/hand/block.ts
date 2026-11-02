/**
 * Hand block: the "make" half of a Cards Against Humanity style round. The big screen
 * shows a black card (`prompt`, with one `___` per card to play); the host deals each
 * phone a private hand of white cards from `responses`, and each player plays `pick`
 * of them. The played cards fill the black card's blanks and become the options a
 * `vote` round judges next (via `toVoteText`), exactly like a quip feeds a vote.
 *
 * Hands are dealt per round through `assignContent` (the hidden-role path Faker uses),
 * so a player only ever sees their own cards, and the full white pool never leaves the
 * host (`redactContent` empties it). Like quip, this block scores nothing itself.
 */
import {
  type AssignContext,
  type AssignedContent,
  type ResultsFragment,
  defineBlock,
  promptText,
  z,
} from '@doot-games/sdk'
import HandHost from './HandHost.vue'
import HandPlayer from './HandPlayer.vue'

export const BLANK = '___'

export const handContentSchema = z.object({
  prompt: promptText(`The secret to a happy flat share: ${BLANK}`),
  pick: z.number().int().min(1).max(3).default(1).describe('How many cards each player plays.'),
  responses: z.array(z.string()).default([]).describe('The white cards hands are dealt from.'),
  handSize: z.number().int().min(3).max(12).default(7).describe('Cards in each hand.'),
  timer: z
    .number()
    .int()
    .nonnegative()
    .nullable()
    .default(60)
    .describe('Seconds to play your cards. Turn off for an untimed round.'),
  safetyAnswers: z
    .array(z.string())
    .default([])
    .describe('Filled black cards given to a player who runs out of time (scored at half).'),
})
export type HandContent = z.infer<typeof handContentSchema>
export interface HandInput {
  cards: string[]
}

/** Number of blanks in a black card, at least 1 (a card without one gets it at the end). */
export function blanksIn(prompt: string): number {
  return Math.max(1, prompt.split(BLANK).length - 1)
}

/** The black card with its blanks filled by `cards`, in order. Unfilled blanks stay. Pure. */
export function fillCall(prompt: string, cards: string[]): string {
  const text = prompt.includes(BLANK) ? prompt : `${prompt.trimEnd()} ${BLANK}`
  let i = 0
  return text.replace(/_{3,}/g, (blank) => {
    const card = cards[i++]
    return card ? card.trim() : blank
  })
}

/** Deal `size` cards to each player from one shuffled pool, wrapping when it runs out. Pure. */
export function dealHands(pool: string[], pids: string[], size: number): Record<string, string[]> {
  const hands: Record<string, string[]> = {}
  if (!pool.length) {
    for (const pid of pids) hands[pid] = []
    return hands
  }
  const n = Math.min(size, pool.length)
  pids.forEach((pid, p) => {
    hands[pid] = Array.from({ length: n }, (_, k) => pool[(p * n + k) % pool.length] as string)
  })
  return hands
}

export const handBlock = defineBlock<HandContent, HandInput>({
  kind: 'hand',
  name: 'Play a card',
  contentSchema: handContentSchema,
  defaultContent: () => ({
    prompt: `The secret to a happy flat share: ${BLANK}`,
    pick: 1,
    responses: [],
    handSize: 7,
    timer: 60,
    safetyAnswers: [],
  }),
  defaultTimer: 60,
  timerOf: (c) => c.timer,
  emptyInput: () => ({ cards: [] }),
  isComplete: (c, input) => (input.cards?.length ?? 0) >= c.pick,
  PlayerInput: HandPlayer,
  HostDisplay: HandHost,

  // The white pool stays on the host: phones get only their own hand (assignContent).
  redactContent: (content) => ({ ...content, responses: [] }),

  assignContent: (ctx: AssignContext<HandContent>): AssignedContent<HandContent> => {
    const pool = ctx.shuffle([...new Set(ctx.content.responses.map((r) => r.trim()).filter(Boolean))])
    const hands = dealHands(
      pool,
      ctx.players.map((p) => p.id),
      ctx.content.handSize,
    )
    const perPlayer: Record<string, HandContent> = {}
    for (const p of ctx.players) perPlayer[p.id] = { ...ctx.content, responses: hands[p.id] ?? [], safetyAnswers: [] }
    return { perPlayer }
  },

  // Only cards that exist in the pool count, so a tampered client cannot write free text.
  toVoteText: (c, input) => {
    const known = new Set(c.responses.map((r) => r.trim()))
    const cards = (input.cards ?? []).map((x) => x.trim()).filter((x) => known.has(x))
    return cards.length ? fillCall(c.prompt, cards.slice(0, c.pick)) : ''
  },

  aggregate: (ctx): ResultsFragment => ({
    stats: [{ label: 'Cards played', value: ctx.rounds.reduce((n, r) => n + ctx.inputsFor(r.index).size, 0) }],
  }),
})
