<script setup lang="ts">
import { LetterState, OtherUser } from '../types'

const { user, rows = 6, large = false, showLetters = false } = defineProps<{
  user: OtherUser,
  rows?: number
  large?: boolean,
  showLetters?: boolean
}>()

const [fontSize, boxSize] = large ? ['32px', '47px'] : ['16px', '25px']

const emptyBoard = $ref(
  Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({
      letter: '',
      state: LetterState.INITIAL
    }))
  )
)

const currentBoard = $computed(() => {
  return user.board.length ? user.board : emptyBoard
})

</script>

<template>
  <div>
    <slot />
    <div class="mini-board">
      <div
        v-for="row in currentBoard"
        class="mini-board-row"
      >
        <div
          v-for="(tile, index) in row"
          :class="['mini-board-tile', tile.state && 'revealed']"
        >
          <div class="front mini-board-tile-unset"  :style="{ transitionDelay: `${index * 300}ms` }" />
          <div
            :class="['back', tile.state]"
            :style="{
              transitionDelay: `${index * 300}ms`,
              animationDelay: `${index * 100}ms`
            }"
          >
            {{ showLetters ? tile.letter.toUpperCase() : '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-board {
  --box-size: v-bind(boxSize);
  --board-rows: v-bind(rows);
  --border-radius: 2px;

  font-size: v-bind(fontSize);
  display: grid;
  grid-template-rows: repeat(var(--board-rows), var(--box-size));
  grid-gap: 3px;
  box-sizing: border-box;
}

.mini-board-row {
  display: grid;
  grid-template-columns: repeat(5, var(--box-size));
  grid-gap: 3px;
}

.mini-board-tile {
  position: relative;
}

.mini-board-tile > div {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.mini-board-tile-unset {
  border: 1px solid #d3d6da;
  background: #fff;
  border-radius: var(--border-radius);
}

.dark .mini-board-tile-unset {
  background: #18181B;
  border-color: #3F3F46;
}

.mini-board-tile .front,
.mini-board-tile .back {
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
  font-weight: 600;
}

.mini-board-tile .back {
  transform: rotateX(180deg);
}

.mini-board-tile.revealed .front {
  transform: rotateX(180deg);
  border-radius: var(--border-radius);

}

.mini-board-tile.revealed .back {
  transform: rotateX(0deg);
  border-radius: var(--border-radius);

}
</style>
