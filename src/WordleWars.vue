<script setup lang="ts">
import { watchEffect } from 'vue'
import ConfettiExplosion from 'vue-confetti-explosion'
import { GameCompleteProps, GameState, LettersGuessedProps, LetterState, OtherScore, OtherUser } from './types'
import ExampleWrapper from './components/ExampleWrapper.vue'
import MiniBoardPlaying from './components/MiniBoardPlaying.vue'
import MiniBoardScore from './components/MiniBoardScore.vue'
import MiniScores from './components/MiniScores.vue'
import MiniBoard from './components/MiniBoard.vue'
import Game from './components/Game.vue'
import { useList, useOthers, useMyPresence } from './lib-liveblocks'
import { copyTextToClipboard, copyUrlToClipboard } from './lib/copyText'
import { getWordOfTheDay } from './lib/getWordOfTheDay'
import { sortUsers } from './lib/sortUsers'
import messages from './lib/messages'
import Header from './components/Header.vue'

/**
 * WORDLE WARS is a Wordle clone that allows for multiplayer gameplay. It works
 * using Liveblocks (https://liveblocks.io), a set of tools helpful for building
 * collaborative experiences. This demo is written 100% on the front end.
 *
 * The `Game` component was forked from Evan You's open-source VVordle, thanks!
 */

// ================================================================================
// SETUP

// Get word of the day. Resets at UTC +00:00
const { answer, answerDay } = getWordOfTheDay()

// Current state of game, username, etc
let gameState: GameState = $ref(GameState.CONNECTING)
let username = $ref(localStorage.getItem('username') || '')
let startAnimation = $ref(false)
let confettiAnimation = $ref(false)
let emojiScore = $ref('')
let copyLinkMessage = $ref('')

// Custom Liveblocks hooks, based on the Liveblocks React library
const [myPresence, updateMyPresence] = useMyPresence()
const others = useOthers()
const savedScores = useList('scores-' + answer)

// Get all others with presence, and return their presence
let othersPresence = $computed(() => {
  return others?.value
    ? [...others.value].filter(other => other.presence).map(other => other.presence)
    : []
})

// Filter others by odd or even number for live scores on either side of screen
const othersFilterOdd = (odd = true) => {
  return othersPresence.filter((o, index) => o?.score && (index % 2 === (odd ? 1 : 0)))
}

// Get users sorted by score
const sortedUsers = $computed(() => {
  if (!myPresence?.value || !othersPresence) {
    return []
  }
  return sortUsers([...othersPresence, myPresence.value].filter(user => user?.score) as OtherUser[])
})

// ================================================================================
// GAME STATE

/**
 * Wordle Wars has a number of different game states, such as CONNECTING, READY,
 * COMPLETE etc. It has a decentralised method of control, meaning that each player
 * sets their own game state, and there is no central server or host. If any player
 * disconnects it will still run smoothly without problems. The game events below
 * run for every player when a change occurs. The event that runs depends on the
 * current state.
 */
const gameEvents: { [key in GameState]?: () => void } = {
  // CONNECTING stage starts when player first loads page
  // Move to intro when connected to presence and scores
  [GameState.CONNECTING]: () => {
    if (myPresence?.value && savedScores?.value()) {
      updateGameStage(GameState.INTRO)
    }
  },

  // INTRO stage starts when selecting username
  // When connected, if scores for current word found, show scores
  [GameState.INTRO]: () => {
    if (savedScores?.value()?.toArray().length) {
      updateGameStage(GameState.SCORES)
    }
  },

  // READY stage starts after ready button pressed
  // When all users are in the READY or PLAYING stages, start game
  [GameState.READY]: () => {
    if (allInStages([GameState.READY, GameState.PLAYING])) {
      startAnimation = true
      setTimeout(() => {
        startAnimation = false
        updateGameStage(GameState.PLAYING)
      }, 800)
    }
  },

  // COMPLETE stage starts on finishing the puzzle
  // When all users are finished, show scores
  [GameState.COMPLETE]: () => {
    if (allInStages([GameState.SCORES, GameState.COMPLETE, GameState.WAITING])) {
      updateGameStage(GameState.SCORES)
    }
  }
}

// On any change, run game event for current state (defined above)
watchEffect(() => {
  gameEvents[gameState]?.()
})

// ================================================================================
// HELPER FUNCTIONS

// Updates the current game stage for local player
function updateGameStage (stage: GameState) {
  if (myPresence?.value) {
    gameState = stage
    updateMyPresence({ stage })
  }
}

// Returns true if every user is in one of the `stages`
function allInStages (stages: GameState[]) {
  if (!others?.value || !others?.value.count) {
    return false
  }
  let myPresenceFound = false
  return stages.some(stage => {
    const othersReady = others.value?.toArray().every(
      other => other.presence && other.presence.stage === stage
    )
    myPresenceFound = myPresenceFound || myPresence!.value.stage === stage
    return Boolean(othersReady)
  }) && myPresenceFound
}

// ================================================================================
// EVENT FUNCTIONS

// Enter the waiting room, set default presence, once username chosen
async function enterWaitingRoom () {
  updateMyPresence({
    name: username,
    board: '',
    score: { [LetterState.ABSENT]: 0, [LetterState.CORRECT]: 0, [LetterState.PRESENT]: 0 },
    stage: gameState,
    rowsComplete: 0,
    timeFinished: Infinity
  })

  updateGameStage(GameState.WAITING)
  localStorage.setItem('username', username)
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

// When current player wins or loses game, celebrate, update score with ticks, await others winning
function onGameComplete ({ success, successGrid }: GameCompleteProps) {
  if (!myPresence || !savedScores?.value) {
    return
  }
  updateGameStage(GameState.COMPLETE)
  let updatedPresence: { timeFinished: number, score?: {} } = { timeFinished: Number(Date.now()) }
  if (success) {
    updatedPresence = { ...updatedPresence, score: { ...myPresence.value.score, [LetterState.CORRECT]: 5 }}
    confettiAnimation = true
    setTimeout(() => confettiAnimation = false, 3000)
  }
  updateMyPresence(updatedPresence)
  savedScores.value()!.push(myPresence.value as OtherUser)
  emojiScore = createEmojiScore(successGrid || '')
}

// Copy link on click button
function onCopyLink () {
  copyUrlToClipboard()
  copyLinkMessage = 'Copied'
  setTimeout(() => copyLinkMessage = '', 1400)
}

// Create emoji scores
function createEmojiScore (successGrid: string) {
  let resultString = `#WordleWars #${answerDay}\n\n`
  sortedUsers.forEach((user, index) => {
    resultString += `${index + 1}. ${user.name}\n`
  })
  resultString += '\n' + successGrid
  return resultString + '\n\nhttps://wordlewars.ctnicholas.dev'
}
</script>

<template>
  <ExampleWrapper>
    <Header />

    <div class="transition-wrapper">
      <div v-if="gameState === GameState.CONNECTING" id="connecting">
        <MiniBoard class="animate-ping" :large="true" :showLetters="true" :user="{ board: messages.connecting }" :rows="messages.connecting.length" />
      </div>

      <div v-if="gameState === GameState.INTRO" id="intro">
        <div>
          <h2>Enter your name</h2>
          <form @submit.prevent="enterWaitingRoom">
            <label for="set-username">Username</label>
            <input type="text" id="set-username" v-model="username" autocomplete="off" required />
            <button class="ready-button">Join game</Button>
          </form>
          <div class="divider" />
          <button class="copy-button" @click="onCopyLink" :disabled="!!copyLinkMessage">
            {{ copyLinkMessage || 'Copy link' }} <svg xmlns="http://www.w3.org/2000/svg" class="inline -mt-0.5 ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" /><path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" /></svg>
          </button>
          <div class="small-center-message">Share link to play together</div>
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
              <div :class="[other.stage === GameState.WAITING || other.stage === GameState.INTRO ? 'waiting-player-waiting' : 'waiting-player-ready']">
                {{ other.stage === GameState.READY ? 'Ready' : other.stage === GameState.PLAYING ? 'Playing' : 'Waiting' }}
              </div>
            </div>
            <button v-if="myPresence.stage !== GameState.READY" @click="updateGameStage(GameState.READY)" class="ready-button">
              Ready to start?
            </button>
            <button v-else @click="updateGameStage(GameState.WAITING)" class="unready-button">
              Not ready?
            </button>
            <div class="divider" />
            <button class="copy-button" @click="onCopyLink">
              {{ copyLinkMessage || 'Copy link' }} <svg xmlns="http://www.w3.org/2000/svg" class="inline -mt-0.5 ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" /><path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" /></svg>
            </button>
            <div class="small-center-message">Share link to play together</div>
          </div>

          <div v-if="startAnimation" class="start-animation">
            <MiniBoard class="animate-ping" :large="true" :showLetters="true" :user="{ board: messages.fight }" :rows="messages.fight.length" />
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


      <Transition name="fade-scores">
        <div v-if="gameState === GameState.SCORES" id="scores">
          <div>
            <h2>
              <span>Final scores for Day {{ answerDay }}, <strong class="tracking-wider">{{ answer.toUpperCase() }}</strong></span>
            </h2>
            <div class="divider" />
            <div class="scores-grid">
              <MiniBoardScore v-for="(other, index) in sortUsers(savedScores().toArray())" :user="other" :position="index + 1" :showLetters="true" />
            </div>
            <button v-if="myPresence?.board?.length" @click="copyTextToClipboard(emojiScore)" class="ready-button">
              Copy emoji scores <svg xmlns="http://www.w3.org/2000/svg" class="inline -mt-0.5 ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" /><path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" /></svg>
            </button>
            <div class="divider" />
            <div class="text-center mt-6">
              Come back tomorrow for a new Wordle War!
            </div>
            <div class="text-center mt-2">
              Follow me on <a class="font-semibold text-green-600 dark:text-green-500" href="https://twitter.com/ctnicholasdev">Twitter</a> for more fun experiments.
            </div>

          </div>
        </div>
      </Transition>

      <div v-if="confettiAnimation" class="confetti-wrapper">
        <div>
          <ConfettiExplosion :colors="['#1bb238', '#d2a207', '#82918b']" />
        </div>
      </div>

    </div>

  </ExampleWrapper>
</template>

<style scoped>
.transition-wrapper {
  position: relative;
  height: 100%;
}

.transition-wrapper > div {
  min-height: 100%;
}

#connecting, #intro, #waiting {
  font-size: 18px;
  background: #eff5f0;
}

.dark #connecting, .dark #intro, .dark #waiting, .dark #scores {
  background: #18181B;
}

#connecting {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#intro > div, #waiting > div {
  width: 320px;
  max-width: 100%;
  background: #fff;
  padding: 40px 35px 30px 35px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.dark #intro > div, .dark #waiting > div {
  background: #27272A;
}

label {
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

.dark input {
  background: #18181B;
  border-color: #52525B;
}

button {
  width: 100%;
  padding: 9px 10px;
  border-radius: 4px;
  color: #fff;
  font-weight: 600;
  transition: background-color ease-in-out 150ms, opacity 150ms ease-in-out;
  margin-top: 24px;
  margin-bottom: 0;
}

button:disabled {
  background-color: #1bb238 !important;
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

h2 {
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 24px;
}

#intro, #waiting, #playing {
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

#intro form > *:last-child {
  margin-bottom: 0;
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

#scores {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
  padding-top: 20px;
}

#scores > div {
  max-width: 538px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 60px;
  position: relative;
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
  margin: 28px 0 10px;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;
  grid-gap: 40px;
}

.confetti-wrapper {
  position: fixed;
  top: -15%;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  pointer-events: none;
}

.fade-scores-enter-active,
.fade-scores-leave-active,
.fade-scores-enter-from,
.fade-scores-leave-to {
  left: 50%;
  transform: translateX(-50%);
}

@media (max-width: 415px) {
  header h1 {
    font-size: 28px;
  }
}

@media (max-width: 715px) {
  #intro, #waiting {
    display: block;
    background: #fff;
  }

  #intro > div, #waiting > div {
    margin: 0 auto;
    box-shadow: none;
  }

  #intro > div, #waiting > div {
    background: transparent !important;
  }

  #scores > div {
    max-width: 250px;
  }

  #scores h2 {
    flex-direction: column;
  }

  .scores-grid {
    width: 250px;
    grid-template-columns: repeat(1, 1fr);
  }
}

</style>
