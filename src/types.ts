export const enum GameState {
  CONNECTING = 'connecting',
  INTRO = 'intro',
  WAITING = 'waiting',
  READY = 'ready',
  PLAYING = 'playing',
  COMPLETE = 'complete',
  SCORES = 'scores'
}

export type OtherScore = {
  correct: number
  present: number
  absent: number
}

export type OtherUser = {
  name: string
  board: string
  score: OtherScore
  stage: GameState
  rowsComplete: number
  timeFinished: number
}

export const enum LetterState {
  INITIAL = 0,
  CORRECT = 'correct',
  PRESENT = 'present',
  ABSENT = 'absent'
}

export type LettersGuessed = Record<string, LetterState>

export type LetterBoard = {
  letter: string,
  state: LetterState
}

export type LettersGuessedProps = {
  letterBoard: LetterBoard[][]
  letterStates: LettersGuessed
}

export type GameCompleteProps = {
  success: boolean,
  successGrid?: string
}
