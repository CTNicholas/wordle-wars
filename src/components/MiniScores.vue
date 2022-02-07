<script setup lang="ts">
import { OtherUser } from '../types'
import ScoreCard from './ScoreCard.vue'

const { users } = defineProps<{
  users: OtherUser[]
}>()

// TODO sort scores
let sortedUsers = $computed(() => {
  return users
})
</script>

<template>
  <div class="mini-score-container">
    <div v-for="(user, index) in sortedUsers" class="mini-score">

      <div class="mini-score-score">
        {{ index + 1 }}.
      </div>
      <div class="mini-score-name">{{ user.name }}</div>
      <ScoreCard :user="user" />
    </div>
    <div class="mini-score-mobile">
      <span v-if="sortedUsers[0].score.correct < 5">
        {{ sortedUsers[0].name }} is leading with
      </span>
      <span v-else>
        {{ sortedUsers[0].name }} has won!
      </span>
      <ScoreCard :user="sortedUsers[0]" />
    </div>
  </div>
</template>

<style scoped>
.mini-score-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 18px;
  margin-bottom: 0;
  width: 100%;
  max-width: 350px;
  font-size: 22px;
}

.mini-score {
  --border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mini-score-mobile {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.mini-score-score {
  color: #6f7770;
  font-weight: 500;
  flex-shrink: 0;
  flex-grow: 0;
  width: 40px;
  text-align: left;
}

.mini-score-name {
  font-weight: 600;
  color: #373f3b;
  flex-grow: 1;
  text-align: center;
}


@media (max-height: 975px) {
  .mini-score {
    display: none;
  }

  .mini-score-mobile {
    display: flex;
  }
}
</style>
