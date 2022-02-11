<script setup lang="ts">
import { inject, onUnmounted, provide } from 'vue'
import { clientSymbol, roomSymbol } from './symbols'
import { Room } from '@liveblocks/client'

const { id, defaultPresence } = defineProps<{
  id: string,
  defaultPresence?: {}
}>()

if (!id) {
  console.error('RoomProvider requires an id')
}
const client: any = inject(clientSymbol)
const room = client.enter(id, defaultPresence)
provide<Room>(roomSymbol, room)

onUnmounted(() => {
  client.leave(id)
})
</script>

<template>
  <slot />
</template>
