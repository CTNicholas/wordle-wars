// All users sorted by score
import { LetterState, OtherUser } from '../types'

export function sortUsers (arr: OtherUser[]) {
  return arr.sort((a: OtherUser, b: OtherUser) => {
    const correctSort = b.score[LetterState.CORRECT] - a.score[LetterState.CORRECT]
    if (correctSort !== 0) {
      return correctSort
    }
    const presentSort = b.score[LetterState.PRESENT] = a.score[LetterState.PRESENT]
    if (presentSort !== 0) {
      return presentSort
    }
    return a.rowsComplete - b.rowsComplete
  })
}
