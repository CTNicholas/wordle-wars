<!--
  Works similarly to `liveblocks-react` LiveblocksProvider
  https://liveblocks.io/docs/api-reference/liveblocks-react#RoomProvider
-->
<script setup lang="ts">
import { provide } from 'vue'
import { clientSymbol } from './symbols'
import { Client } from '@liveblocks/client'

const { client } = defineProps<{
  client: Client
}>()

if (!client) {
  console.error('LiveblocksProvider requires a client')
}

provide<Client>(clientSymbol, client)
</script>

<template>
  <slot />
</template>
