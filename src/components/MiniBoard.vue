<script setup lang="ts">
import { LetterState, OtherUser } from '../types'

defineProps<{
  user: OtherUser
}>()


const board = $ref(
  Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({
      letter: '',
      state: LetterState.INITIAL
    }))
  )
)

</script>

<template>
  <div>
    <div>{{ user.name }}</div>
    <pre>{{ user.board }}</pre>
  </div>
</template>

<style>
pre {
  font-size: 14px;
}
</style>
