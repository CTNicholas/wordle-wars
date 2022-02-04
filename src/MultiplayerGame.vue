<script lang="ts">
import { createClient } from '@liveblocks/client'
import { randomId } from './lib/randomId'

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY as string,
})

const roomId = new URLSearchParams(window.location.search).get('room') || randomId()
</script>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { GameEmitProps, GameState, OtherUser } from './types'
import { randomId } from './lib/randomId'
import Game from './components/Game.vue'
import { Others, Presence, Room } from '@liveblocks/client'
import MiniBoard from './components/MiniBoard.vue'

// Current state of game and username
let gameState: GameState = $ref(GameState.INTRO)
let username = $ref('')

// Liveblocks variables
let room: Room = $ref()
let myPresence: Presence = $ref()
let others: Others<OtherUser> = $ref()
let othersPresence = $computed(() => {
  return others
    ? [...others].filter(other => other.presence).map(other => other.presence)
    : []
})

let unsubscribePresence = $ref(() => {})
let unsubscribeOthers = $ref(() => {})

// Create room with random ID, watch for other user changes
function createRoom () {
  room = client.enter('wordle-wars-' + roomId)
  unsubscribePresence = room.subscribe('my-presence', onMyPresenceChange)
  unsubscribeOthers = room.subscribe('others', onOthersChange)
  room.updatePresence({ name: username, ready: false, board: '', score: {} })
  gameState = GameState.WAITING
}

const gameEvents: { [key in GameState]?: () => void } = {
  [GameState.WAITING]: () => {
    if (allAreReady()) {
      gameState = GameState.PLAYING
    }
  }
}

function onMyPresenceChange (updatedPresence: any) {
  myPresence = updatedPresence
  gameEvents[gameState]?.()
}

function onOthersChange (updatedOthers: Others<OtherUser>) {
  console.log(updatedOthers.toArray())
  others = updatedOthers
  gameEvents[gameState]?.()
}

function allAreReady () {
  const othersReady = [...others].every(other => other.presence && other.presence.ready)
  return myPresence.ready && othersReady
}

function onLettersGuessed ({ letterStates, letterBoard }: GameEmitProps ) {
  const currentScore: OtherScore|any = { correct: 0, present: 0, absent: 0 }
  Object.values(letterStates).forEach(state => {
    currentScore[state] += 1
  })
  room.updatePresence({ score: currentScore, board: letterBoard })
}

// Unsubscribe room if unmounted
onUnmounted(() => {
  unsubscribePresence()
  unsubscribeOthers()
  client.leave(roomId)
  gameState = GameState.INTRO
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

  <div v-if="gameState === GameState.INTRO" id="intro">
    <h2>Intro</h2>
    <form @submit.prevent="createRoom">
      <label for="set-username">Username</label>
      <input type="text" id="set-username" v-model="username" autocomplete="off" required />
      <input type="submit" value="Create room" />
    </form>
  </div>

  <div v-if="gameState === GameState.WAITING" id="waiting">
    <h2>Waiting for players</h2>
    <div class="waiting-list">
      <div class="waiting-player">
        <span>{{ myPresence.name }} (you)</span>
        <div :class="[myPresence.ready ? 'waiting-player-ready' : 'waiting-player-waiting']">
          {{ myPresence.ready ? 'Ready' : 'Waiting' }}
        </div>
      </div>
      <div v-for="other in othersPresence" class="waiting-player">
        <span>{{ other.name }}</span>
        <div :class="[other.ready ? 'waiting-player-ready' : 'waiting-player-waiting']">
          {{ other.ready ? 'Ready' : 'Waiting' }}
        </div>
      </div>
      <button v-if="!myPresence.ready" @click="room.updatePresence({ ready: true })" class="waiting-ready">
        Ready?
      </button>
      <div v-else>Game starting when all players ready</div>
    </div>
  </div>

  <div v-if="gameState === GameState.PLAYING">
    <div v-for="other in othersPresence">
      <MiniBoard :user="other" />
    </div>
    <Game @lettersGuessed="onLettersGuessed" />
  </div>

  <div v-if="gameState === GameState.COMPLETE" id="complete">
    complete
  </div>
</template>

<style>
#intro, #waiting, #complete {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

#intro form, .waiting-list {
  width: 100%;
  max-width: 250px;
  margin: 0 auto;
}

#intro form > * {
  display: block;
  margin-bottom: 12px;
  width: 100%;
}

#intro form label {
  text-align: left;
}

.waiting-player {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.waiting-player-waiting {
  color: #C9B458;
}

.waiting-player-ready {
  color: #6AAA64;
}

.waiting-ready {
  width: 100%;
  background-color: limegreen;
}
</style>
