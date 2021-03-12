import SongCollection from './songcollection.js'

export default class SongSystem {
  constructor (sound) {
    this.sound = sound
    this.current_song = null
  }

  load (json) {
    this.root = new SongCollection(json)
  }

  setSong (song) {
    this.current_song = song
  }
}
