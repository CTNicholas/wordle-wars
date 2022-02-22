import { inject, onUnmounted, Ref, ref, watch } from 'vue'
import { roomSymbol } from './symbols'
import { LiveList, Room } from '@liveblocks/client'
import { useStorage } from './useStorage'

/**
 * Works similarly to `liveblocks-react` useList
 * https://liveblocks.io/docs/api-reference/liveblocks-react#useList
 *
 * Two differences:
 * 1. It's a vue ref, so use .value
 * 2. .value must be called as a function every time
 *
 * const list = useList("animals", ["🦁", "🦊", "🐵"])
 * console.log([...list.value()])
 * console.log(list.value().get(2))
 */
export function useList (name: string, initial?: any[]): Ref<() => LiveList<any>|void>|null {
  const room = inject<Room>(roomSymbol)

  if (!room) {
    console.error('Use RoomProvider as parent with id prop')
    return null
  }

  const root = useStorage()
  const list = ref(() => {})

  watch(root, () => {
    if (!root.value().get(name)) {
      root.value().set(name, new LiveList(initial))
    }

    list.value = () => root.value().get(name)

    const unsubscribe = room.subscribe(root.value().get(name), (newList) => {
      list.value = () => newList
    })

    onUnmounted(() => {
      unsubscribe()
    })
  })

  return list
}
