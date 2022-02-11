import { inject, Ref, ref, watch, watchEffect } from 'vue'
import { LiveObject, Room } from '@liveblocks/client'
import { roomSymbol } from './symbols'

export function useStorage (): Ref<() => LiveObject> {
  const room = inject<Room>(roomSymbol)
  // @ts-ignore
  const rootRef = ref<() => LiveObject>(() => {})

  watchEffect(() => {
    if (!room) {
      console.error('Use RoomProvider as parent with id prop')
      return null
    }

    async function fetchStorage() {
      const { root }: { root: LiveObject } = await room!.getStorage()
      rootRef.value = () => root
    }

    fetchStorage()
  })

  return rootRef
}
