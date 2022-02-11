<script setup lang="ts">
import { createClient } from '@liveblocks/client'
import { createRoomId } from './lib/createRoomId'
import WordleWars from './WordleWars.vue'
import LiveblocksProvider from './lib-liveblocks/LiveblocksProvider.vue'
import RoomProvider from './lib-liveblocks/RoomProvider.vue'

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY as string,
})

const roomId = 'wordle-wars-' + createRoomId()
</script>

<template>
  <LiveblocksProvider :client="client">
    <RoomProvider :id="roomId">
      <WordleWars />
    </RoomProvider>
  </LiveblocksProvider>
</template>
