<script setup lang="ts">
import { createClient } from '@liveblocks/client'
import { createRoomId } from './lib/createRoomId'
import WordleWars from './WordleWars.vue'
import LiveblocksProvider from './lib-liveblocks/LiveblocksProvider.vue'
import RoomProvider from './lib-liveblocks/RoomProvider.vue'
import { GameState, LetterState } from './types'

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY as string,
})

const roomId = 'wordle-wars-' + createRoomId()

const defaultPresence = {
  name: '',
  board: '',
  score: { [LetterState.ABSENT]: 0, [LetterState.CORRECT]: 0, [LetterState.PRESENT]: 0 },
  stage: GameState.CONNECTING,
  rowsComplete: 0
}
</script>

<template>
  <LiveblocksProvider :client="client">
    <RoomProvider :id="roomId" :defaultPresence="defaultPresence">
      <WordleWars />
    </RoomProvider>
  </LiveblocksProvider>
</template>
