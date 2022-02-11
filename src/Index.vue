<script setup lang="ts">
import { createClient } from '@liveblocks/client'
import { createRoomId } from './lib/createRoomId'
import WordleWars from './WordleWars.vue'
import LiveblocksProvider from './liveblocks/LiveblocksProvider.vue'
import RoomProvider from './liveblocks/RoomProvider.vue'
import Test from './Test.vue'

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY as string,
})

const roomId = createRoomId()
</script>

<template>
  <LiveblocksProvider :client="client">
    <RoomProvider id="roomId">
      <Test />
      <!--<WordleWars />-->
    </RoomProvider>
  </LiveblocksProvider>
</template>
