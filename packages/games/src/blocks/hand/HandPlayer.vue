<script setup lang="ts">
/**
 * Phone input for a Hand round: the player's own white cards as tappable cards. Tap to
 * play a card, tap again to take it back. With "pick 2" the cards fill the blanks in
 * the order tapped, and the black card preview above shows the result.
 */
import { computed } from 'vue'
import { type HandContent, type HandInput, fillCall } from './block'

const props = defineProps<{ content: HandContent; modelValue: HandInput; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: HandInput] }>()

const chosen = computed(() => props.modelValue.cards ?? [])
const preview = computed(() => fillCall(props.content.prompt, chosen.value))

function toggle(card: string) {
  if (props.disabled) return
  const cards = chosen.value.includes(card) ? chosen.value.filter((c) => c !== card) : [...chosen.value, card]
  // A full selection replaces the oldest card, so one tap always does something.
  emit('update:modelValue', { cards: cards.slice(-props.content.pick) })
}
</script>

<template>
  <div class="hand">
    <p class="black" aria-live="polite">{{ preview }}</p>
    <p class="hint">
      {{ content.pick > 1 ? `Pick ${content.pick} cards, in order.` : 'Pick your best card.' }}
    </p>
    <div class="cards" role="group" aria-label="Your hand">
      <button
        v-for="card in content.responses"
        :key="card"
        type="button"
        class="card"
        :class="{ on: chosen.includes(card) }"
        :disabled="disabled"
        :aria-pressed="chosen.includes(card)"
        @click="toggle(card)"
      >
        <span v-if="content.pick > 1 && chosen.includes(card)" class="order mono">{{ chosen.indexOf(card) + 1 }}</span>
        {{ card }}
      </button>
    </div>
    <p v-if="!content.responses.length" class="hint">Dealing your hand...</p>
  </div>
</template>

<style scoped>
.hand {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.black {
  background: #111;
  color: #fff;
  border-radius: var(--radius);
  padding: 14px;
  font-weight: 800;
  font-size: clamp(16px, 4.5vw, 20px);
  line-height: 1.3;
}
.hint {
  color: var(--ink-soft);
  font-size: 14px;
  font-weight: 600;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}
.card {
  position: relative;
  min-height: 84px;
  text-align: left;
  font: inherit;
  font-weight: 700;
  font-size: 15px;
  line-height: 1.25;
  color: #111;
  background: #fff;
  border: var(--bd) solid var(--line-soft);
  border-radius: var(--radius);
  padding: 12px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}
.card.on {
  border-color: var(--primary);
  outline: 3px solid var(--primary);
}
.card:disabled {
  opacity: 0.7;
  cursor: default;
}
.order {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-size: 13px;
  display: grid;
  place-items: center;
}
</style>
