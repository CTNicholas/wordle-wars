import { inject, onUnmounted, ref, watchEffect } from 'vue'
import { Presence, Room } from '@liveblocks/client'
import { roomSymbol } from './symbols'

export function usePresence (): [Presence|null, ((updatedPresence: any) => void)] {
  const room = inject<Room>(roomSymbol)

  if (!room) {
    console.error('Use RoomProvider as parent with id prop')
    return [null, updatePresence]
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

  function updatePresence (updatedPresence: any) {
    if (room && presence?.value) {
      room.updatePresence(updatedPresence)
    } else {
    }
  }

  return [presence, updatePresence]
}
