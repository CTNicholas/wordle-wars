import { inject, onUnmounted, ref, watchEffect } from 'vue'
import { Presence, Room } from '@liveblocks/client'
import { roomSymbol } from './symbols'

/**
 * Works similarly to `liveblocks-react` useMyPresence
 * https://liveblocks.io/docs/api-reference/liveblocks-react#useMyPresence
 *
 * The first array index uses a vue ref so make sure to use .value
 * const [presence, updateMyPresence] = useMyPresence()
 * console.log(presence.value)
 *
 * But not for updateMyPresence:
 * updateMyPresence({ ... })
 */
export function useMyPresence (): [Presence|null, ((updatedPresence: any) => void)] {
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
