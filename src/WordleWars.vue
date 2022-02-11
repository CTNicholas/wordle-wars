<script setup lang="ts">
import { onUnmounted, watchEffect } from 'vue'
import { GameCompleteProps, GameState, LettersGuessedProps, LetterState, OtherScore, OtherUser } from './types'
import Game from './components/Game.vue'
import MiniScores from './components/MiniScores.vue'
import MiniBoard from './components/MiniBoard.vue'
import MiniBoardPlaying from './components/MiniBoardPlaying.vue'
import MiniBoardScore from './components/MiniBoardScore.vue'
import { sortUsers } from './lib/sortUsers'
import ExampleInfo from './components/ExampleInfo.vue'
import ExampleWrapper from './components/ExampleWrapper.vue'
import { copyUrlToClipboard } from './lib/copyText'
import { getWordOfTheDay } from './lib/words'
import { useList, useOthers, usePresence } from './lib-liveblocks'
import titleMessage from './components/TitleMessages'

// TODO Add copy paste score result at end, and share button

// Get word of the day
const answer = getWordOfTheDay()
console.log('ANSWER', answer)

// Current state of game and username
let gameState: GameState = $ref(GameState.CONNECTING)
let username = $ref(localStorage.getItem('username') || '')
let startAnimation = $ref(false)

// Custom Liveblocks hooks, based on React library
const [myPresence, updateMyPresence] = usePresence()
const others = useOthers()
const savedScores = useList('scores-' + answer)

// Filter all others with presence, and return their presence
let othersPresence = $computed(() => {
  return others?.value
    ? [...others.value].filter(other => other.presence).map(other => other.presence)
    : []
})

// Filter others by odd or even number
const othersFilterOdd = (odd = true) => {
  return othersPresence.filter((o, index) => index % 2 === (odd ? 1 : 0))
}

// Users sorted by score
const sortedUsers = $computed(() => {
  if (!myPresence?.value || !othersPresence) {
    return []
  }
  return sortUsers([...othersPresence, myPresence.value] as OtherUser[])
})

// Updates the current game stage
function updateGameStage (stage: GameState) {
  if (myPresence?.value) {
    gameState = stage
    updateMyPresence({ stage })
  }
}

// Create room with random ID, watch for other user changes
async function enterRoom () {
  updateMyPresence({
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
  // Move to intro when connected to presence and scores
  [GameState.CONNECTING]: () => {
    if (myPresence?.value && savedScores?.value()) {
      updateGameStage(GameState.INTRO)
    }
  },
  // When connected, if scores for current word found, show scores
  [GameState.INTRO]: () => {
    if (savedScores?.value()?.toArray().length) {
      updateGameStage(GameState.SCORES)
    }
  },
  // When all are ready, start game
  [GameState.READY]: () => {
    if (allInStages([GameState.READY])) {
      startAnimation = true
      setTimeout(() => {
        startAnimation = false
        updateGameStage(GameState.PLAYING)
      }, 800)
    }
  },
  // When all are complete, show scores
  [GameState.COMPLETE]: () => {
    if (allInStages([GameState.SCORES, GameState.COMPLETE, GameState.WAITING])) {
      updateGameStage(GameState.SCORES)
    }
  }
}

// On changes, run game events
watchEffect(() => {
  gameEvents[gameState]?.()
})

// Returns true if every user is in one of the `stages`
function allInStages (stages: GameState[]) {
  if (!others?.value || !others?.value.count) {
    return false
  }
  return stages.some(stage => {
    const othersReady = [...others.value].every(
      other => other.presence && other.presence.stage === stage
    )
    return Boolean(myPresence!.value.stage === stage && othersReady)
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
  updateMyPresence({ score: currentScore, board: letterBoard, rowsComplete: rowsComplete })
}

// When current player wins or loses game
function onGameComplete ({ success, successGrid }: GameCompleteProps) {
  if (!myPresence || !savedScores?.value) {
    return
  }
  updateGameStage(GameState.COMPLETE)
  if (success) {
    updateMyPresence({ score: { ...myPresence.value.score, [LetterState.CORRECT]: 5 }})
  }
  savedScores.value().push(myPresence.value as OtherUser)
}

onUnmounted(() => {
  updateGameStage(GameState.INTRO)
})
</script>

<template>
  <ExampleWrapper>
    <ExampleInfo />
    <header>
      <h1>WORDLE WARS</h1>
    </header>

    <div v-if="gameState === GameState.CONNECTING" id="connecting">
      <MiniBoard class="animate-ping" :large="true" :showLetters="true" :user="{ board: titleMessage.connecting }" :rows="titleMessage.connecting.length" />
    </div>

    <div v-if="gameState === GameState.INTRO" id="intro">
      <div>
        <h2>Enter your name</h2>
        <!--<MiniBoard :large="true" :showLetters="true" :user="{ board: enterYourName }" :rows="enterYourName.length" />-->
        <form @submit.prevent="enterRoom">
          <label for="set-username">Username</label>
          <input type="text" id="set-username" v-model="username" autocomplete="off" required />
          <button>Join game</Button>
        </form>
      </div>
    </div>

    <div v-if="gameState === GameState.WAITING || gameState === GameState.READY" id="waiting">
      <div>
        <h2>Waiting for players</h2>
        <div class="waiting-list">
          <div class="waiting-player">
            <span>{{ myPresence.name }} (you)</span>
            <div :class="[myPresence.stage === GameState.READY ? 'waiting-player-ready' : 'waiting-player-waiting']">
              {{ myPresence.stage === GameState.READY ? 'Ready' : 'Waiting' }}
            </div>
          </div>
          <div v-for="other in othersPresence" class="waiting-player">
            <span v-if="other.name">{{ other.name }}</span>
            <span v-else><i>Selecting name...</i></span>
            <div :class="[other.stage === GameState.READY ? 'waiting-player-ready' : 'waiting-player-waiting']">
              {{ other.stage === GameState.READY ? 'Ready' : 'Waiting' }}
            </div>
          </div>
          <button v-if="myPresence.stage !== GameState.READY" @click="updateGameStage(GameState.READY)" class="">
            Ready to start?
          </button>
          <button v-else @click="updateGameStage(GameState.WAITING)" class="button-yellow">
            Not ready?
          </button>
          <div class="divider" />
          <button class="button-gray" @click="copyUrlToClipboard">
            Copy link <svg xmlns="http://www.w3.org/2000/svg" class="inline -mt-0.5 ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" /><path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" /></svg>
          </button>
          <div class="small-center-message">Share link to play together</div>
        </div>

        <div v-if="startAnimation" class="start-animation">
          <MiniBoard class="animate-ping" :large="true" :showLetters="true" :user="{ board: titleMessage.fight }" :rows="titleMessage.fight.length" />
        </div>
      </div>
    </div>

    <div v-if="gameState === GameState.PLAYING || gameState === GameState.COMPLETE" id="playing">
      <MiniScores :sortedUsers="sortedUsers" :shrink="true" />
      <Game :answer="answer" @lettersGuessed="onLettersGuessed" @gameComplete="onGameComplete">
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
        <h2>
          <span>Final scores for</span>
          <MiniBoard :large="false" :showLetters="true" :user="{ board: titleMessage.wordToBoard(answer, 'correct') }" :rows="titleMessage.wordToBoard(answer, 'correct').length" />
        </h2>
        <div class="divider" />
        <!--<MiniScores :sortedUsers="sortedUsers" />-->
        <!--<button @click="updateGameStage(GameState.WAITING)">Play again</button>-->
        <div class="scores-grid">
          <MiniBoardScore v-for="(other, index) in savedScores().toArray()" :user="other" :position="index + 1" :showLetters="true" />
        </div>
        <div class="divider" />
        <div class="text-center mt-8">Come back tomorrow for a new Wordle War!</div>
      </div>
    </div>
  </ExampleWrapper>
</template>

<style scoped>
#connecting, #intro, #waiting, #scores {
  font-size: 18px;
  background: #eff5f0;
}

#connecting {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#intro > div, #waiting > div {
  width: 330px;
  max-width: 100%;
  background: #fff;
  padding: 40px 40px 30px 40px;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  flex-direction: column;
}

label  {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.6;
}

input {
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid lightgrey;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

button {
  width: 100%;
  background-color: #1bb238;
  padding: 9px 10px;
  border-radius: 4px;
  color: #fff;
  font-weight: 600;
  transition: background-color ease-in-out 150ms;
  margin-top: 24px;
  margin-bottom: 0;
}

button:hover {
  background-color: #28c549;
}

button:active {
  background-color: #1bb238;
}

input:focus-visible, input:focus, button:focus-visible {
  outline: 2px solid #118f2b;
}

button.button-yellow {
  filter: hue-rotate(286deg);
}

button.button-gray {
  filter: grayscale(1);
}

.divider {
  background: lightgrey;
  height: 1px;
  display: block;
  width: 100%;
  margin: 24px 0 0;
}

h1 {
  letter-spacing: 1.5px;
}

h2 {
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 24px;
}

#intro, #waiting, #complete, #playing {
  position: relative;
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

.small-center-message {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  opacity: 0.6;
  margin-top: 12px;
}

.waiting-player {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.waiting-player-waiting, .waiting-player-ready {
  font-weight: 600;
}

.waiting-player-message {
  margin-top: 24px;
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

.start-animation {
  position: fixed;
  display: flex;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;
}

#scores > div {
  max-width: 538px;
  width: 100%;
  margin: 0 auto;
}

#scores h2 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.scores-grid {
  width: 100%;
  display: grid;
  margin: 40px 0;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;
  grid-gap: 40px;
}

@media (max-width: 415px) {
  header h1 {
    font-size: 28px;
  }
}

@media (max-width: 715px) {
  #scores > div {
    max-width: 250px;
  }

  .scores-grid {
    width: 250px;
    grid-template-columns: repeat(1, 1fr);
  }

  .board-left, .board-right {
    display: none;
  }
}

</style>
