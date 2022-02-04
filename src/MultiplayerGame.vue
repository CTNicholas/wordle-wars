<script lang="ts">
import { createClient } from '@liveblocks/client'

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY as string,
})
</script>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { GameState, LettersGuessed } from './types'
import { randomId } from './lib/randomId'
import Game from './components/Game.vue'
import { Others, Presence, Room } from '@liveblocks/client'

type OtherScore = {
  correct: number
  present: number
  absent: number
}

type OtherUser = {
  name: string
  ready: boolean
  score: OtherScore
}

// Current state of game and username
let gameState = $ref(GameState.INTRO)
let username = $ref('')

// Liveblocks variables
let room: Room = $ref()
let myPresence: Presence = $ref()
let others: Others<OtherUser> = $ref()

// Return only others with `presence`
let othersReady = $computed(() => {
  return others ? others.toArray().filter(other => other.presence) : []
})

let unsubscribePresence = $ref(() => {})
let unsubscribeOthers = $ref(() => {})

// Create room with random ID, watch for other user changes
function createRoom () {
  const roomId = new URLSearchParams(window.location.search).get('room') || randomId()
  room = client.enter('wordle-wars-' + roomId)

  unsubscribePresence = room.subscribe('my-presence', onMyPresenceChange)
  room.updatePresence({ name: username, ready: false, score: {} })
  unsubscribeOthers = room.subscribe('others', onOthersChange)

  gameState = GameState.WAITING
}



function onMyPresenceChange (updatedPresence: any) {
  myPresence = updatedPresence

  switch (gameState) {

    case GameState.WAITING: {
      if (allAreReady()) {
        gameState = GameState.PLAYING
      }
      break
    }

  }
}

function onOthersChange (updatedOthers: Others<OtherUser>) {
  console.log(updatedOthers.toArray())
  others = updatedOthers

  switch (gameState) {

    case GameState.WAITING: {
      if (allAreReady()) {
        gameState = GameState.PLAYING
      }
      break
    }

  }
}

function allAreReady () {
  const othersReady = [...others].every(other => other.presence && other.presence.ready)
  return myPresence.ready && othersReady
}

function onLettersGuessed (letters: LettersGuessed) {
  const currentScore: OtherScore = { correct: 0, present: 0, absent: 0 }
  Object.values(letters).forEach(state => {
    currentScore[state] += 1
  })
}

// Unsubscribe room if unmounted
onUnmounted(() => {
  unsubscribePresence()
  unsubscribeOthers()
})
</script>

<template>
  <header>
    <h1>WORDLE WARS</h1>
    <a
      id="source-link"
      href="https://github.com/yyx990803/vue-wordle"
      target="_blank"
    >Source</a
    >
  </header>

  <div v-if="gameState === GameState.INTRO">
    <h2>Intro</h2>
    <form @submit.prevent="createRoom">
      <label for="set-username">Username</label>
      <input type="text" id="set-username" v-model="username" autocomplete="off" required />
      <input type="submit" value="Create room" />
    </form>
  </div>

  <div v-if="gameState === GameState.WAITING">
    <h2>Waiting for players</h2>
    <div>
      <div>
        <span>{{ myPresence.name }}</span>
        <div>{{ myPresence.ready ? 'Ready' : 'Waiting' }}</div>
      </div>
      <div v-for="({ presence }) in othersReady">
        <span>{{ presence.name }}</span>
        <div>{{ presence.ready ? 'Ready' : 'Waiting' }}</div>
      </div>
      <button @click="room.updatePresence({ ready: true })">Ready</button>
    </div>
  </div>

  <Game v-if="gameState === GameState.PLAYING" @lettersGuessed="onLettersGuessed" />

  <div v-if="gameState === GameState.COMPLETE">
    complete
  </div>
</template>
