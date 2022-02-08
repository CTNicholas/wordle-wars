<script lang="ts">
import { createClient } from '@liveblocks/client'
import { createRoomId } from './lib/createRoomId'

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY as string,
})

// Set and/or get ?room=[id] param
const roomId = createRoomId()
</script>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { LettersGuessedProps, GameState, OtherScore, OtherUser, GameCompleteProps, LetterState } from './types'
import Game from './components/Game.vue'
import { Others, Presence, Room } from '@liveblocks/client'
import MiniScores from './components/MiniScores.vue'
import MiniBoardPlaying from './components/MiniBoardPlaying.vue'
import MiniBoardScore from './components/MiniBoardScore.vue'
import { sortUsers } from './lib/sortUsers'
import ExampleInfo from './components/ExampleInfo.vue'
import ExampleWrapper from './components/ExampleWrapper.vue'

// Current state of game and username
let gameState: GameState = $ref(GameState.INTRO)
let username = $ref(localStorage.getItem('username') || '')

// Liveblocks variables
let room: Room = $ref()
let myPresence: Presence = $ref()
let others: Others<OtherUser> = $ref()
let unsubscribePresence = $ref(() => {})
let unsubscribeOthers = $ref(() => {})

// Filter all others with presence, and return their presence
let othersPresence = $computed(() => {
  return others
    ? [...others].filter(other => other.presence).map(other => other.presence)
    : []
})

// Filter others by odd or even number
const othersFilterOdd = (odd = true) => {
  return othersPresence.filter((o, index) => odd ? index % 2 : !(index % 2))
}

const sortedUsers = $computed(() => {
  if (!myPresence || !othersPresence) {
    return []
  }
  return sortUsers([...othersPresence, myPresence] as OtherUser[])
})

// Updates the current game stage
function updateGameStage (stage: GameState) {
  gameState = stage
  room.updatePresence({ stage })
}

// Create room with random ID, watch for other user changes
function enterRoom () {
  room = client.enter('wordle-wars-' + roomId)
  unsubscribePresence = room.subscribe('my-presence', onMyPresenceChange)
  unsubscribeOthers = room.subscribe('others', onOthersChange)
  room.updatePresence({
    name: username,
    board: '',
    score: { [LetterState.ABSENT]: 0, [LetterState.CORRECT]: 0, [LetterState.PRESENT]: 0 },
    position: 0,
    stage: gameState,
    rowsComplete: 0
  })
  updateGameStage(GameState.WAITING)
  localStorage.setItem('username', username)
}

// Game events that run for everyone when current user, or other user, changes
const gameEvents: { [key in GameState]?: () => void } = {
  // When all are ready, start game
  [GameState.READY]: () => {
    if (allInStages([GameState.READY])) {
      updateGameStage(GameState.PLAYING)
    }
  },

  // When all are complete, show scores
  [GameState.COMPLETE]: () => {
    if (allInStages([GameState.SCORES, GameState.COMPLETE, GameState.WAITING])) {
      updateGameStage(GameState.SCORES)
    }
  }
}

// When current user changes, update ref and run gameEvent
function onMyPresenceChange (updatedPresence: any) {
  myPresence = updatedPresence
  gameEvents[gameState]?.()
}

// When others change, update ref and run gameEvent
function onOthersChange (updatedOthers: Others<OtherUser>) {
  others = updatedOthers
  gameEvents[gameState]?.()
}

// Returns true if every user is in one of the `stages`
function allInStages (stages: GameState[]) {
  if (!others || !others.count) {
    return false
  }
  return stages.some(stage => {
    const othersReady = [...others].every(
      other => other.presence && other.presence.stage === stage
    )
    return Boolean(myPresence.stage === stage && othersReady)
  })
}

// When current player guesses a row of letters
function onLettersGuessed ({ letterStates, letterBoard }: LettersGuessedProps) {
  const currentScore: OtherScore|any = {
    [LetterState.CORRECT]: 0,
    [LetterState.PRESENT]: 0,
    [LetterState.ABSENT ]: 0
  }
  Object.values(letterStates).forEach(state => {
    currentScore[state] += 1
  })
  const rowsComplete = letterBoard.reduce((acc, curr) => {
    if (curr.every(obj => obj.state !== LetterState.INITIAL)) {
      return acc += 1
    }
    return acc
  }, 0)
  room.updatePresence({ score: currentScore, board: letterBoard, rowsComplete: rowsComplete })
}

// When current player wins or loses game
function onGameComplete ({ success, successGrid }: GameCompleteProps) {
  updateGameStage(GameState.COMPLETE)
  if (success) {
    room.updatePresence({ score: { ...myPresence.score, [LetterState.CORRECT]: 5 }})
  }
}

// Unsubscribe room if unmounted
onUnmounted(() => {
  unsubscribePresence()
  unsubscribeOthers()
  client.leave(roomId)
  updateGameStage(GameState.INTRO)
})
</script>

<template>
  <ExampleWrapper>
    <ExampleInfo />
    <header>
      <h1>WORDLE WARS</h1>
    </header>

    <div v-if="gameState === GameState.INTRO" id="intro">
      <h2>Intro</h2>
      <form @submit.prevent="enterRoom">
        <label for="set-username">Username</label>
        <input type="text" id="set-username" v-model="username" autocomplete="off" required />
        <input type="submit" value="Join room" />
      </form>
    </div>

    <div v-if="gameState === GameState.WAITING || gameState === GameState.READY" id="waiting">
      <h2>Waiting for players</h2>
      <div class="waiting-list">
        <div class="waiting-player">
          <span>{{ myPresence.name }} (you)</span>
          <div :class="[myPresence.stage === GameState.READY ? 'waiting-player-ready' : 'waiting-player-waiting']">
            {{ myPresence.stage === GameState.READY ? 'Ready' : 'Waiting' }}
          </div>
        </div>
        <div v-for="other in othersPresence" class="waiting-player">
          <span>{{ other.name }}</span>
          <div :class="[other.stage === GameState.READY ? 'waiting-player-ready' : 'waiting-player-waiting']">
            {{ other.stage === GameState.READY ? 'Ready' : 'Waiting' }}
          </div>
        </div>
        <button v-if="myPresence.stage !== GameState.READY" @click="updateGameStage(GameState.READY)" class="waiting-ready">
          Ready?
        </button>
        <div v-else>Game starting when all players ready</div>
      </div>
    </div>

    <div v-if="gameState === GameState.PLAYING || gameState === GameState.COMPLETE" id="playing">
      <MiniScores :sortedUsers="sortedUsers" :shrink="true" />
      <Game @lettersGuessed="onLettersGuessed" @gameComplete="onGameComplete">
        <template v-slot:board-left>
          <div class="mini-board-container">
            <MiniBoardPlaying v-for="other in othersFilterOdd(true)" :user="other" :showLetters="gameState === GameState.COMPLETE" />
          </div>
        </template>
        <template v-slot:board-right>
          <div class="mini-board-container">
            <MiniBoardPlaying v-for="other in othersFilterOdd(false)" :user="other" :showLetters="gameState === GameState.COMPLETE" />
          </div>
        </template>
      </Game>
    </div>

    <div v-if="gameState === GameState.SCORES" id="scores">
      <div>
        <h2>Final scores</h2>
        <MiniScores :sortedUsers="sortedUsers" />
        <!--<button @click="updateGameStage(GameState.WAITING)">Play again</button>-->
        <MiniBoardScore v-for="other in sortedUsers" :user="other" :showLetters="true" />
      </div>
    </div>
  </ExampleWrapper>
</template>

<style>
h1 {
  letter-spacing: 1.5px;
}

#intro, #waiting, #complete, #playing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

#playing {
  justify-content: space-between;
}

#scores {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
}

.mini-board-container {
  margin: 0 40px;
  display: grid;
  grid-template-rows: repeat(2, calc(var(--height) / 2));
  grid-auto-columns: auto;
  grid-auto-flow: column;
  gap: 0 40px;
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

@media (max-width: 415px) {
  header h1 {
    font-size: 28px;
  }
}

@media (max-width: 715px) {
  .board-left, .board-right {
    display: none;
  }
}

</style>
