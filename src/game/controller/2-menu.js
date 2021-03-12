import SongCollection from '../../song/songcollection.js'

export default class MenuController {
  constructor (game) {
    this.game = game

    this.current_collection = null
    this.current_index = 0
  }

  updateSong (update_all = false) {
    // Update menu screen
    if (update_all) {
      this.game.menu_screen.setSongList(this.current_collection)
    }
    this.game.menu_screen.setSongListPosition(this.current_index)

    // Also update song info
    this.game.songinfo_screen.updateSong(this.current_collection.children[this.current_index])
  }

  async run () {
    // Show all scene
    this.game.menu_screen.show()
    this.game.songinfo_screen.show()
    this.game.songinfo_screen.menuMode(true)
    this.game.background_screen.showMenuUI(true)
    this.game.background_screen.hideSongBackground()
    this.game.background_screen.volume_bar.show()

    if (this.current_collection === null) {
      // First time loading menu screen, initialize with default
      this.current_collection = this.game.songs.root
      this.updateSong(true)
    } else {
      // Need to update to show new high score
      this.updateSong(false)
    }

    while (true) {
      // Flag to break the loop and transition to song-load controller
      let is_song_chosen = false

      // Wait for input key
      const key = (await this.game.input.waitForAnyKey()).key
      switch (key) {
        case 'ArrowUp':
          // Move UP
          this.current_index--
          if (this.current_index < 0) {
            this.current_index = 0
            this.game.sfx.play('error')
          } else {
            this.updateSong(false)
            this.game.sfx.play('select')
          }
          break

        case 'ArrowDown':
          // Move DOWN
          this.current_index++
          if (this.current_index >= this.current_collection.children.length) {
            this.current_index = this.current_collection.children.length - 1
            this.game.sfx.play('error')
          } else {
            this.updateSong(false)
            this.game.sfx.play('select')
          }
          break

        case 'Backspace':
          // Move OUT
          if (this.current_collection.parent !== null) {
            // Set default position to be the current collection
            // position on the parent collection
            const present = this.current_collection
            this.current_collection = this.current_collection.parent
            for (this.current_index = 0; this.current_index <= this.current_collection.children.length; this.current_index++) {
              if (this.current_collection.children[this.current_index] === present) {
                break
              }
            }

            this.updateSong(true)
            this.game.sfx.play('exit')
          } else {
            this.game.sfx.play('error')
          }
          break

        case 'Space':
        case ' ':
        case 'Enter':
          // Move IN
          if (this.current_collection.children[this.current_index] instanceof SongCollection) {
            // A collection, so enter
            this.current_collection = this.current_collection.children[this.current_index]
            this.current_index = 0

            this.updateSong(true)
            this.game.sfx.play('select2')
          } else {
            // A song, so transition to Song screen
            is_song_chosen = true
          }
      }

      if (is_song_chosen) {
        break
      }
    }

    this.game.songs.setSong(this.current_collection.children[this.current_index])
    this.game.menu_screen.hide()
    this.game.background_screen.showMenuUI(false)
    this.game.songinfo_screen.menuMode(false)
    return this.game.song_load_controller
  }
}
