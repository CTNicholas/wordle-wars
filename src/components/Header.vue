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

function toggleInfoOpen () {
  infoOpen = !infoOpen
  document.documentElement.classList.toggle('overflow-hidden')
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
        <button @click="toggleInfoOpen">
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
      <p>
        The first to guess the WORDLE wins <strong>WORDLE WARS</strong>.
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
    <button @click="toggleInfoOpen">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
    <h1>
      <svg xmlns="http://www.w3.org/2000/svg" width="224.85" height="33.891" viewBox="0 0 224.85 33.891" fill="currentColor" class="mt-0.5">
        <path d="M-96.862-8.864l-3.186-24.6h-6.15l-3.186,24.6-3.23-24.6h-6.814s.973,1.106,1.681,5.973c1.062,6.769,2.7,17.609,3.407,22.3.354,2.124,1.549,3.23,4.026,3.23h4.646l2.566-19.512,2.522,19.512h8.141l4.823-31.5h-6.061Zm21.282-24.6c-5.708,0-9.6,3.672-9.6,10.53v10.84c0,6.814,3.894,10.486,9.6,10.486s9.6-3.672,9.6-10.486v-10.84C-65.98-29.792-69.873-33.464-75.581-33.464ZM-72-12.094c0,4.292-1.77,5.885-3.54,5.885-1.858,0-3.628-1.593-3.628-5.885v-10.84c0-4.336,1.77-5.929,3.628-5.929,1.77,0,3.54,1.593,3.54,5.929Zm22.3.177c3.407-.929,4.955-3.54,4.955-7.477v-6.15c0-5-2.61-7.92-8.318-7.92H-63.192s.8,1.018.8,5.973V-1.962h6.017v-9.513H-54.7S-53.9.294-48.371.294c3.761,0,4.292-4.557,4.292-4.557C-48.769-4.263-49.211-9.262-49.7-11.917Zm-1.062-6.194c0,1.77-1.283,2.035-2.3,2.035h-3.318V-28.863h3.318c1.018,0,2.3.265,2.3,2.079ZM-32-33.464H-42.088s.8,1.018.8,5.973V-1.962H-32c5.752,0,8.318-2.876,8.318-7.92V-25.544C-23.682-30.544-26.248-33.464-32-33.464ZM-29.7-8.6c0,1.814-1.283,2.035-2.256,2.035h-3.318v-22.3h3.318c.973,0,2.256.265,2.256,2.079Zm15.972,2.522V-33.464h-6.814s.8,1.018.8,5.973V-1.962C-7.71-1.962-7.267.427-1.471.427c3.761,0,5.84-3.407,3.717-7.522C-1.427-3.6-7.931-5.192-13.727-6.077Zm4.336-22.3V-9.661H3.086v-5.088a4.239,4.239,0,0,1-3.23,1.106h-4.07v-5.929h5.8v-3.982h-5.8v-5.929h4.07a4.239,4.239,0,0,1,3.23,1.106v-5.088H-10.055S-9.391-32.579-9.391-28.376ZM35.827-8.864l-3.186-24.6h-6.15l-3.186,24.6-3.23-24.6H13.262s.973,1.106,1.681,5.973c1.062,6.769,2.7,17.609,3.407,22.3.354,2.124,1.549,3.23,4.026,3.23h4.646l2.566-19.512L32.11-1.962h8.141l4.823-31.5H39.012Zm13.185-24.6s.929,1.5.221,6.327L45.383-1.962H51.4l.841-6.46h5.442l.885,6.46h6.017l-4.823-31.5Zm3.849,20.441,2.124-16.238,2.124,16.238Zm27.3,1.106c3.407-.929,4.955-3.54,4.955-7.477v-6.15c0-5-2.61-7.92-8.318-7.92H66.665s.8,1.018.8,5.973V-1.962h6.017v-9.513H75.16S75.956.294,81.487.294c3.761,0,4.292-4.557,4.292-4.557C81.089-4.263,80.646-9.262,80.159-11.917ZM79.1-18.111c0,1.77-1.283,2.035-2.3,2.035H73.479V-28.863H76.8c1.018,0,2.3.265,2.3,2.079ZM97.813-28.863c3.54,0,5.177,3.5,5.177,3.5l2.433-4.336a9.5,9.5,0,0,0-7.61-3.761c-5.708,0-9.6,2.964-9.6,8.318,0,8.628,11.194,10.928,11.194,15.928,0,2.389-1.77,3.009-3.628,3.009-3.5,0-5.177-3.451-5.177-3.451L88.212-5.369a9.469,9.469,0,0,0,7.566,3.761c5.752,0,9.645-2.964,9.645-8.318,0-8.185-11.194-10.884-11.194-15.928C94.229-28.2,96-28.863,97.813-28.863Z" transform="translate(119.427 33.464)"/>
      </svg>
    </h1>
    <button @click="toggleDarkMode">
      <svg v-if="!darkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  top: 52px;
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
  transition: background-color 150ms ease-in-out;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.dark button:hover {
  background-color: rgba(255, 255, 255, 0.1);
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
  height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-bottom: 1px solid #ccc;
  color: #000;
  text-align: center;
  background: #fff;
  padding: 1px 0;
}

.dark header {
  background: #18181B;
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

@media (max-width: 350px) {
  h1 svg {
    width: 180px;
  }
}
</style>
