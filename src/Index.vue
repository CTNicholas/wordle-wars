<script setup lang="ts">
import { createClient } from '@liveblocks/client'
import { createRoomId } from './lib/createRoomId'
import WordleWars from './WordleWars.vue'
import LiveblocksProvider from './lib-liveblocks/LiveblocksProvider.vue'
import RoomProvider from './lib-liveblocks/RoomProvider.vue'

/**
 * This component sets up the Liveblocks client and Room.
 * Check inside WordleWars.vue for the main component
 */

// Connect to public Liveblocks API
const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY as string,
})

// Get ID from, or add a random ID to, the current URL
// ?room=[ID]
const roomId = 'wordle-wars-' + createRoomId()
</script>

<!--
  The LiveblocksProvider and RoomProvider components are custom built
  to match the Liveblocks React library components. They provide the
  current room to the other custom-built hooks I'm using, inside of
  `/src/lib-liveblocks`
-->
<template>
  <LiveblocksProvider :client="client">
    <RoomProvider :id="roomId">
      <WordleWars />
    </RoomProvider>
  </LiveblocksProvider>
</template>
