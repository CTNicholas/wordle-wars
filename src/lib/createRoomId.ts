import { randomId } from './randomId'

export function createRoomId () {
  let id = new URLSearchParams(window.location.search).get('room')
  if (!id) {
    id = randomId()
    window.location.search = `?room=${id}`
  }
  return id
}
