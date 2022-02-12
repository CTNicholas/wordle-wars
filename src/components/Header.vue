<script lang="ts">
// Runs immediately to avoid FOUC
const defaultDarkTheme = (() => {
  let dark
  const alreadySet = localStorage.getItem('darkMode')
  if (alreadySet) {
    dark = alreadySet === 'dark'
  } else {
    dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  if (dark) {
    document.documentElement.classList.add('dark')
  }
  return dark
})()
</script>

<script lang="ts" setup>
import ExampleInfo from './ExampleInfo.vue'
import MiniBoard from './MiniBoard.vue'
import messages from '../lib/messages'

let darkMode = $ref(defaultDarkTheme)
let infoOpen = $ref(false)

function toggleDarkMode () {
  darkMode = !darkMode
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('darkMode', darkMode ? 'dark' : 'light')
}
</script>

<template>
  <ExampleInfo class="example-info-main" />
  <div v-if="infoOpen" class="info">
    <div>
      <h2>
        <span>
          How to play
        </span>
        <button @click="infoOpen = false">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </h2>
      <p>
        Guess the <strong>WORDLE</strong> in six tries.
      </p>
      <p>
        Each guess must be a valid five-letter word. Hit the enter button to submit.
      </p>
      <p>
        After each guess, the color of the tiles will change to show how close your guess was to the word.
      </p>
      <div class="divider" />
      <p>
        <strong>Examples</strong>
      </p>
      <div class="example">
        <p>
          <MiniBoard :large="true" :showLetters="true" :user="{ board: messages.relay }" :rows="messages.relay.length" />
        </p>
        <p>The letter <strong>R</strong> is in the word and in the correct spot.</p>
      </div>
      <div class="example">
        <p>
          <MiniBoard :large="true" :showLetters="true" :user="{ board: messages.happy }" :rows="messages.happy.length" />
        </p>
        <p>The letter <strong>A</strong> is in the word but in the wrong spot.</p>
      </div>
      <div class="example">
        <p>
          <MiniBoard :large="true" :showLetters="true" :user="{ board: messages.minds }" :rows="messages.minds.length" />
        </p>
        <p>No letters are in the word in any spot.</p>
      </div>
      <div class="divider" />
      <p>
        <strong>A new WORDLE will be available each day!</strong>
      </p>
      <ExampleInfo class="relative left-0 top-0 my-8 !w-full" />
    </div>
  </div>
  <header>
    <button @click="infoOpen = !infoOpen">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
    <h1>WORDLE WARS</h1>
    <button @click="toggleDarkMode">
      <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  </header>
</template>

<style scoped>
.info {
  position: fixed;
  top: 63px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: #fff;
  overflow-y: auto;
}

.dark .info {
  background: #18181B;
}

.info > div {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.info h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 10px;
}

.example, .divider {
  margin:  20px 0;
}

button {
  padding: 15px;
}

p {
  margin-top: 10px;
}

h1 {
  letter-spacing: 1.5px;
  margin: 4px 0;
  font-size: 36px;
  font-weight: 700;
}

header {
  height: 63px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-bottom: 1px solid #ccc;
  color: #000;
  text-align: center;
  background: #fff;
  padding: 0 5px;
}

.dark header {
  background: #27272A;
  color: #fff;
  border-color: #52525B;
}

@media (max-width: 715px) {
  .example-info-main {
    display: none;
  }
}

@media (max-width: 415px) {
  h1 {
    font-size: 22px;
  }
}
</style>
