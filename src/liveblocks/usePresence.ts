import { inject, onUnmounted, ref, watch, watchEffect } from 'vue'
import { Presence, Room } from '@liveblocks/client'
import { roomSymbol } from './symbols'

export function usePresence () {
  const room = inject<Room>(roomSymbol)

  if (!room) {
    console.error('Use RoomProvider as parent with id prop')
    return null
  }

  const presence = ref<Presence>({})
  watchEffect(() => {
    room.updatePresence(presence.value)
  })

  const unsubscribe = room.subscribe('my-presence', newPresence => {
    presence.value = newPresence
  })
  onUnmounted(() => {
    unsubscribe()
  })

  return presence
}
