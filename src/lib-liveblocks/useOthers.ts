import { inject, onUnmounted, ref, watchEffect } from 'vue'
import { Others, Room } from '@liveblocks/client'
import { roomSymbol } from './symbols'

/**
 * Works similarly to `liveblocks-react` useOthers
 * https://liveblocks.io/docs/api-reference/liveblocks-react#useOthers
 *
 * This uses a vue ref so make sure to use .value
 * const others = useOthers()
 * console.log(others.value)
 */
export function useOthers () {
  const room = inject<Room>(roomSymbol)

  if (!room) {
    console.error('Use RoomProvider as parent with id prop')
    return null
  }

  const others = ref<Others>()

  watchEffect(() => {
    others.value = room.getOthers()
  })

  const unsubscribe = room.subscribe('others', newOthers => {
    others.value = newOthers
  })

  onUnmounted(() => {
    unsubscribe()
  })

  return others
}
