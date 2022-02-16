<script setup lang="ts">
import { OtherUser } from '../types'
import ScoreCard from './ScoreCard.vue'

const { sortedUsers, shrink = false } = defineProps<{
  sortedUsers: OtherUser[],
  shrink?: boolean
}>()

</script>

<template>
  <div class="mini-score-container">
    <div v-for="(user, index) in sortedUsers" :class="['mini-score', shrink && 'shrink']">

      <div class="mini-score-score">
        {{ index + 1 }}.
      </div>
      <div class="mini-score-name">{{ user.name }}</div>
      <ScoreCard :user="user" />
    </div>
    <div :class="['mini-score-mobile', shrink && 'shrink']">
      <span v-if="sortedUsers[0].score.correct === 5">
        <span class="mini-score-name">{{ sortedUsers[0].name }}</span> has finished!
      </span>
      <span v-else>
        <span class="mini-score-name">{{ sortedUsers[0].name }}</span> is leading with
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
  margin: 0 auto;
  width: 100%;
  max-width: 350px;
  font-size: 22px;
  padding-top: 20px;
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
  gap: 5px;
  margin-bottom: -20px
}

.mini-score-score {
  color: #6f7770;
  font-weight: 500;
  flex-shrink: 0;
  flex-grow: 0;
  width: 40px;
  text-align: left;
}

.dark .mini-score-score {
  color: #A1A1AA;
}

.mini-score-name {
  font-weight: 600;
  color: #373f3b;
  flex-grow: 1;
  text-align: center;
}

.dark .mini-score-name {
  color: #E5E7EB;
}


@media (max-height: 975px) {
  .mini-score.shrink {
    display: none;
  }

  .mini-score-mobile.shrink {
    display: flex;
  }
}

@media (max-width: 715px) {
  .mini-score-mobile {
    font-size: 18px;
  }
}
</style>
