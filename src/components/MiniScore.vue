<script setup lang="ts">
import { OtherUser } from '../types'

const { user } = defineProps<{
  user: OtherUser
}>()

console.log(user.score)
</script>



<template>
  <div class="mini-score" v-if="user.score">
    <div>{{ user.name }}</div>
    <div class="mini-score-scores">
      <div class="mini-score-number correct" v-if="user.score.correct > 0">
        {{ user.score.correct }}
      </div>
      <div class="mini-score-number absent" v-else>
        0
      </div>
      <div class="mini-score-number present" v-if="user.score.present > 0">
        {{ user.score.present }}
      </div>
      <div class="mini-score-number absent" v-else>
        0
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-score {
  --border-radius: 2px;

  text-align: center;
}

.mini-score-scores {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
}

.mini-score-number {
  border-radius: var(--border-radius);
  font-weight: 600;
  display: block;
  width: 20px;
  height: 20px;
  margin: 0 4px;
  aspect-ratio: 1 / 1;
}
</style>
