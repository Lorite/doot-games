<script setup lang="ts">
/**
 * Big-screen view while players pick cards. Like Quip, it shows only a COUNT, never
 * the played cards, so the following vote stays anonymous. The black card itself is
 * the round prompt, which the generic host renders above this view.
 */
import type { RoundState } from '@doot-games/engine'
import { computed } from 'vue'
import type { HandContent, HandInput } from './block'

const props = defineProps<{
  content: HandContent
  inputs: Map<string, HandInput>
  state: RoundState
  answer?: unknown
}>()

const count = computed(() => {
  let n = 0
  for (const v of props.inputs.values()) if ((v?.cards?.length ?? 0) >= props.content.pick) n++
  return n
})
const done = computed(() => props.state === 'locked' || props.state === 'reveal')
</script>

<template>
  <div class="hand-host">
    <div class="big-count">
      <span class="num mono">{{ count }}</span>
      <span class="lbl">{{ done ? 'cards locked in' : 'cards played' }}</span>
    </div>
    <p v-if="content.pick > 1" class="pick">Pick {{ content.pick }}</p>
    <p class="hint">{{ done ? 'On to the vote!' : 'Choosing from their hands...' }}</p>
  </div>
</template>

<style scoped>
.hand-host {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 220px;
}
.big-count {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.num {
  font-size: clamp(56px, 12vw, 120px);
  font-weight: 800;
  line-height: 1;
  color: var(--primary);
}
.lbl {
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
  font-size: 14px;
}
.pick {
  font-weight: 900;
  font-size: 20px;
  padding: 4px 14px;
  border-radius: 999px;
  background: var(--ink);
  color: var(--surface);
}
.hint {
  color: var(--ink-soft);
  font-weight: 600;
}
</style>
