<script setup lang="ts">
import MiniBoard from './MiniBoard.vue'
import { OtherUser } from '../types'

const { user, number, showLetters = false } = defineProps<{
  user: OtherUser,
  position: number,
  showLetters: boolean
}>()
</script>

<template>
  <MiniBoard :large="true" :user="user" :showLetters="showLetters">
     <div class="mini-board-name mini-board-final-score">
      <div>
        {{ position }}. {{ user.name }}
      </div>
    </div>
  </MiniBoard>
</template>

<style scoped>
.mini-board-final-score {
  text-align: left;
}

.mini-board-name {
  position: relative;
  padding-bottom: 48px;
  font-weight: 600;
  font-size: 21px;
  color: #000;
}

.dark .mini-board-name {
  color: #fff;
}

.mini-board-name > div {
  position: absolute;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  padding-top: 8px;
}
</style>
