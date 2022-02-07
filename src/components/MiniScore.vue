<script setup lang="ts">
import { OtherUser } from '../types'

const { user } = defineProps<{
  user: OtherUser
}>()
</script>

<template>
  <div class="mini-score" v-if="user.score">
    <div class="mini-score-name">{{ user.name }}</div>
    <div class="mini-score-scores">
      <div class="mini-score-number correct" v-if="user.score.correct === 5">
        ✓
      </div>
      <div class="mini-score-number correct" v-else-if="user.score.correct > 0">
        {{ user.score.correct }}
      </div>
      <div class="mini-score-number absent" v-else>
        0
      </div>
      <div class="mini-score-number present" v-if="user.score.present > 0">
        {{ user.score.present }}
      </div>
      <div class="mini-score-number absent" v-else-if="user.score.correct < 5">
        0
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-score {
  --border-radius: 2px;
}

.mini-score-name {
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  color: #47504c;
}

.mini-score-scores {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
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
  margin: 0 3px;
  aspect-ratio: 1 / 1;
}
</style>
