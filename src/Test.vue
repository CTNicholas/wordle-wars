<script setup lang="ts">
import { useList } from './liveblocks/useList'
import { useStorage } from './liveblocks/useStorage'
import { usePresence } from './liveblocks/usePresence'

// const storage = useStorage()
// console.log(storage.value())
// setTimeout(() => console.log(storage.value().toObject()), 1000)
// setTimeout(() => storage.value().set('y', 7), 1500)
// setTimeout(() => console.log(storage.value().toObject()), 2000)

// const list = useList('people', ['rachel'])
// setTimeout(() => list.value().push('saggs'), 1000)
// //console.log(list.value)
// console.log(list.value())
// setTimeout(() => {
//   console.log(list.value().toArray())
// }, 800)
const a = usePresence()
a.value = { hello: 1 }
setTimeout(() => a.value = { hello: 2 }, 2000)

</script>

<template>
  {{ a.hello }}
  <div v-if="false && list()">
    <div v-for="person of list().toArray()">
      {{ person }}
    </div>
  </div>
</template>
