import { createApp } from 'vue'
import MultiplayerGame from './MultiplayerGame.vue'
import './styles/game.css'

// resize for scaling the board size
window.addEventListener('resize', onResize)
// set size on startup
onResize()

function onResize () {
  // get actual vh on mobile
  document.body.style.setProperty('--vh', window.innerHeight + 'px')
}

createApp(MultiplayerGame).mount('#app')
