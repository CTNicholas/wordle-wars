<script setup lang="ts">
import { onUnmounted } from 'vue'
import { allWords } from '../words'
import Keyboard from './Keyboard.vue'
import { GameCompleteProps, LettersGuessedProps, LettersGuessed, LetterState } from '../types'

const emit = defineEmits<{
  (e: 'lettersGuessed', key: LettersGuessedProps): void
  (e: 'gameComplete', key: GameCompleteProps): void
}>()

const { answer } = defineProps<{
  answer: string
}>()

// Board state. Each tile is represented as { letter, state }
const board = $ref(
  Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({
      letter: '',
      state: LetterState.INITIAL
    }))
  )
)

// Current active row.
let currentRowIndex = $ref(0)
const currentRow = $computed(() => board[currentRowIndex])

// Feedback state: message and shake
let message = $ref('')
let grid = $ref('')
let shakeRowIndex = $ref(-1)
let success = $ref(false)

// Keep track of revealed letters for the virtual keyboard
const letterStates: LettersGuessed = $ref({})

// Handle keyboard input.
let allowInput = true

const onKeyup = (e: KeyboardEvent) => onKey(e.key)

window.addEventListener('keyup', onKeyup)

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
})

function onKey (key: string) {
  if (!allowInput) return
  if (/^[a-zA-Z]$/.test(key)) {
    fillTile(key.toLowerCase())
  } else if (key === 'Backspace') {
    clearTile()
  } else if (key === 'Enter') {
    completeRow()
  }
}

function fillTile (letter: string) {
  for (const tile of currentRow) {
    if (!tile.letter) {
      tile.letter = letter
      break
    }
  }
}

function clearTile () {
  for (const tile of [...currentRow].reverse()) {
    if (tile.letter) {
      tile.letter = ''
      break
    }
  }
}

function completeRow () {
  if (currentRow.every((tile) => tile.letter)) {
    const guess = currentRow.map((tile) => tile.letter).join('')
    if (!allWords.includes(guess) && guess !== answer) {
      shake()
      showMessage(`Not in word list`)
      return
    }

    const answerLetters: (string | null)[] = answer.split('')
    // first pass: mark correct ones
    currentRow.forEach((tile, i) => {
      if (answerLetters[i] === tile.letter) {
        tile.state = letterStates[tile.letter] = LetterState.CORRECT
        answerLetters[i] = null
      }
    })
    // second pass: mark the present
    currentRow.forEach((tile) => {
      if (!tile.state && answerLetters.includes(tile.letter)) {
        tile.state = LetterState.PRESENT
        answerLetters[answerLetters.indexOf(tile.letter)] = null
        if (!letterStates[tile.letter]) {
          letterStates[tile.letter] = LetterState.PRESENT
        }
      }
    })
    // 3rd pass: mark absent
    currentRow.forEach((tile) => {
      if (!tile.state) {
        tile.state = LetterState.ABSENT
        if (!letterStates[tile.letter]) {
          letterStates[tile.letter] = LetterState.ABSENT
        }
      }
    })

    // Emit lettersGuessed event to parent
    emit('lettersGuessed', { letterStates: letterStates, letterBoard: board })

    allowInput = false
    if (currentRow.every((tile) => tile.state === LetterState.CORRECT)) {
      // yay!
      setTimeout(() => {
        grid = genResultGrid()
        showMessage(
          ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'][
            currentRowIndex
          ],
          -1
        )
        emit('gameComplete', { success: true, successGrid: grid })
        success = true
      }, 1600)
    } else if (currentRowIndex < board.length - 1) {
      // go the next row
      currentRowIndex++
      setTimeout(() => {
        allowInput = true
      }, 1600)
    } else {
      // game over :(
      setTimeout(() => {
        showMessage(answer.toUpperCase(), -1)
        emit('gameComplete', { success: false })
      }, 1600)
    }
  } else {
    shake()
    showMessage('Not enough letters')
  }
}

function showMessage (msg: string, time = 1000) {
  message = msg
  if (time > 0) {
    setTimeout(() => {
      message = ''
    }, time)
  }
}

function shake () {
  shakeRowIndex = currentRowIndex
  setTimeout(() => {
    shakeRowIndex = -1
  }, 1000)
}

const icons = {
  [LetterState.CORRECT]: '🟩',
  [LetterState.PRESENT]: '🟨',
  [LetterState.ABSENT]: '⬜',
  [LetterState.INITIAL]: null
}

function genResultGrid () {
  return board
    .slice(0, currentRowIndex + 1)
    .map((row) => {
      return row.map((tile) => icons[tile.state]).join('')
    })
    .join('\n')
}
</script>

<template>
  <Transition>
  </Transition>
  <div id="board-wrapper">
    <div id="board">
      <div v-if="message" :class="['board-message', 'backdrop-blur', success && 'board-message-success']">
        <button v-if="success" @click="message = ''" class="absolute right-6 top-3 text-gray-300 hover:text-gray-100 focus:text-gray-100 w-8 h-8 flex items-center justify-center -mr-3 rounded-full">
          <span class="sr-only">Close dialog</span>
          <svg class="w-6 h-6" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.96967 11.9697L11.9697 2.96967L13.0303 4.03033L4.03033 13.0303L2.96967 11.9697Z"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0303 11.9697L4.03033 2.96967L2.96968 4.03033L11.9697 13.0303L13.0303 11.9697Z"></path>
          </svg>
        </button>
        <div class="board-message-main">
          {{ message }}
        </div>
        <div v-if="success">
          Waiting for other players to finish...
        </div>
      </div>
      <div class="board-left">
        <slot name="board-left" />
      </div>
      <div
        v-for="(row, index) in board"
        :class="[
          'row',
          shakeRowIndex === index && 'shake',
          success && currentRowIndex === index && 'jump'
        ]"
      >
        <div
          v-for="(tile, index) in row"
          :class="['tile', tile.letter && 'filled', tile.state && 'revealed']"
        >
          <div class="front" :style="{ transitionDelay: `${index * 300}ms` }">
            {{ tile.letter }}
          </div>
          <div
            :class="['back', tile.state]"
            :style="{
              transitionDelay: `${index * 300}ms`,
              animationDelay: `${index * 100}ms`
            }"
          >
            {{ tile.letter }}
          </div>
        </div>
      </div>
      <div class="board-right">
        <slot name="board-right" />
      </div>
    </div>
  </div>
  <div id="keyboard-wrapper">
    <Keyboard @key="onKey" :letter-states="letterStates" />
  </div>
</template>

<style scoped>
#board-wrapper {
  --border-radius: 4px;

  display: flex;
  width: 100%;
  max-width: 100vw;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  flex-grow: 12;
  --height: min(420px, calc(var(--vh, 100vh) - 380px)); /* was 310 */
  overflow: hidden;
}

#board {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;
  box-sizing: border-box;
  height: var(--height);
  width: min(350px, calc(var(--height) / 6 * 5));
  position: relative;
}

.board-left, .board-right {
  position: absolute;
  top: 0;
  bottom: 0;
}

.board-left {
  right: 100%;
}

.board-right {
  left: 100%;
}

#keyboard-wrapper {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.board-message {
  white-space: nowrap;
  font-size: 16px;
  position: absolute;
  left: 50%;
  top: 80px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.80);
  padding: 16px 20px;
  z-index: 2;
  border-radius: var(--border-radius);
  transform: translateX(-50%);
  transition: opacity 0.3s ease-out;
  font-weight: 600;
}

.board-message.board-message-success {
  white-space: normal;
  font-size: 16px;
  width: 100%;
  max-width: 80%;
}

/*
.board-message.board-message-success {
  white-space: normal;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.80);
  padding: 16px 20px;
  z-index: 2;
  border-radius: var(--border-radius);
  transition: opacity 0.3s ease-out;
  font-size: 18px;
  text-align: center;
  transform: none;
}
 */

.board-message-success .board-message-main {
  font-size: 21px;
  font-weight: 500;
  margin-bottom: 10px;
}

.message.v-leave-to {
  opacity: 0;
}

.row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
}

.tile {
  width: 100%;
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  vertical-align: middle;
  text-transform: uppercase;
  user-select: none;
  position: relative;
}

.tile.filled {
  animation: zoom 0.2s;
}

.tile .front,
.tile .back {
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: var(--border-radius);
}

.tile {
  color: #000;
}

.dark .tile {
  color: #fff;
}

.tile .front {
  border: 2px solid #d3d6da;
}

.dark .tile .front {
  border-color: #3F3F46;
}

.tile.filled .front {
  border-color: #999;
}

.dark .tile.filled .front {
  border-color: #52525B;
}

.tile .back {
  transform: rotateX(180deg);
}

.tile.revealed .front {
  transform: rotateX(180deg);
}

.tile.revealed .back {
  transform: rotateX(0deg);
}

@keyframes zoom {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(1px);
  }
  10% {
    transform: translate(-2px);
  }
  20% {
    transform: translate(2px);
  }
  30% {
    transform: translate(-2px);
  }
  40% {
    transform: translate(2px);
  }
  50% {
    transform: translate(-2px);
  }
  60% {
    transform: translate(2px);
  }
  70% {
    transform: translate(-2px);
  }
  80% {
    transform: translate(2px);
  }
  90% {
    transform: translate(-2px);
  }
  100% {
    transform: translate(1px);
  }
}

.jump .tile .back {
  animation: jump 0.5s;
}

@keyframes jump {
  0% {
    transform: translateY(0px);
  }
  20% {
    transform: translateY(5px);
  }
  60% {
    transform: translateY(-25px);
  }
  90% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(0px);
  }
}

@media (max-height: 680px) {
  .tile {
    font-size: 3vh;
  }
}

@media (max-width: 715px) {
  .board-left, .board-right {
    display: none;
  }
}
</style>
