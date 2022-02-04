export const enum LetterState {
  INITIAL = 0,
  CORRECT = 'correct',
  PRESENT = 'present',
  ABSENT = 'absent'
}

export type LettersGuessed = Record<string, LetterState>

export const enum GameState {
  INTRO = 'intro',
  CONNECTING = 'connecting',
  WAITING = 'waiting',
  PLAYING = 'playing',
  COMPLETE = 'complete'
}
