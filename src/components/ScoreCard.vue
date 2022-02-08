<script setup lang="ts">
import { OtherUser, LetterState } from '../types'

const { user } = defineProps<{
  user: OtherUser
}>()
</script>

<template>
  <div class="mini-score-scores">
    <div class="mini-score-number correct" v-if="user.score[LetterState.CORRECT] === 5">
      ✓
    </div>
    <div class="mini-score-number correct" v-else-if="user.score[LetterState.CORRECT] > 0">
      {{ user.score[LetterState.CORRECT] }}
    </div>
    <div class="mini-score-number absent" v-else>
      0
    </div>
    <div class="mini-score-number present" v-if="user.score[LetterState.PRESENT] > 0">
      {{ user.score[LetterState.PRESENT] }}
    </div>
    <div class="mini-score-number correct" v-else-if="user.score[LetterState.CORRECT] === 5">
      ✓
    </div>
    <div class="mini-score-number absent" v-else>
      0
    </div>
  </div>
</template>

<style scoped>

.mini-score-scores {
  --border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mini-score-number {
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  margin: 0 0 0 3px;
  aspect-ratio: 1 / 1;
}
</style>
