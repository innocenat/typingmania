import SongCollection from '../../song/songcollection.js'
import Song from '../../song/song.js'

export default class MenuController {
  constructor (game) {
    this.game = game

    this.current_collection = null
    this.current_index = 0
    this.local_collection = null
    this.loaded_from_url = false

    // Listen for drop event
    window.addEventListener('drop', this.processDroppedFile.bind(this))
    window.addEventListener('dragover', this.processDragOver.bind(this))
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

  processDragOver (e) {
    e.preventDefault()
  }

  processDroppedFile (e) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault()
    let files = []

    if (!this.signal_drop) {
      // Not accepting drop right now
      return
    }

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (const item of e.dataTransfer.items) {
        if (item.kind === 'file') {
          files.push(item.getAsFile())
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      files = e.dataTransfer.files
    }

    let results = []
    for (const file of files) {
      if (file.name.match(/\.typingmania$/)) {
        results.push([file.name, URL.createObjectURL(file)])
      } else {
        console.error('Cannot load', file.name, ', invalid file.')
      }
    }

    if (results.length > 0)
      this.signal_drop(results)
  }

  async importSong (filename, url) {
    // Create local collection if not
    if (!this.local_collection) {
      this.local_collection = new SongCollection({
        name: 'Imported song',
        description: 'Locally-imported song.',
        contents: [],
      }, this.game.songs.root)
      this.game.songs.root.children.unshift(this.local_collection)
    }

    const song = await Song.fromURL(url, this.local_collection)

    // Since the high score is keyed via URL, change the URL so that it keyed correctly
    // if the source URL is blob url (i.e. drag-drop file)
    if (filename) {
      song.url = 'import://file/' + filename
      song.loadHighScore() // reload high score
    }

    this.local_collection.children.push(song)
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

    // To signal that a file is dropped
    this.dropped_signal = new Promise((resolve) => {
      this.signal_drop = resolve
    })

    while (true) {
      // Flag to break the loop and transition to song-load controller
      let is_song_chosen = false

      // Check if we process the load via URL yet
      if (!this.loaded_from_url) {
        this.loaded_from_url = true

        if (this.game.specified_song) {
          await this.importSong(this.game.specified_song_path, this.game.specified_song)
          this.current_collection = this.local_collection
          this.current_index = this.local_collection.children.length - 1
          this.updateSong(true)
          is_song_chosen = true
          break
        }
      }

      // Wait for input key
      const action = await Promise.any([this.game.input.waitForAnyKey(), this.dropped_signal])
      if (action instanceof KeyboardEvent) {
        const key = action.key
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
            } else if (this.current_collection.children[this.current_index]) {
              // If a song, so transition to Song screen
              is_song_chosen = true
            } else {
              // Empty
              this.game.sfx.play('error')
            }
            break

          case 'F9':
            if (this.game.game_mode === 'normal')
              this.game.game_mode = 'easy'
            else if (this.game.game_mode === 'easy')
              this.game.game_mode = 'tempo'
            else if (this.game.game_mode === 'tempo')
              this.game.game_mode = 'auto'
            else if (this.game.game_mode === 'auto')
              this.game.game_mode = 'blind'
            else if (this.game.game_mode === 'blind')
              this.game.game_mode = 'blank'
            else if (this.game.game_mode === 'blank')
              this.game.game_mode = 'normal'

            // Update all screen with message
            this.game.menu_screen.updateGameMode(this.game.game_mode)
            this.game.loading_screen.updateGameMode(this.game.game_mode)
            this.game.song_screen.updateGameMode(this.game.game_mode)
            this.game.result_screen.updateGameMode(this.game.game_mode)
            break
        }
      } else {
        // Process dropped song
        for (const file of action) {
          await this.importSong(file[0], file[1])
        }

        // Set menu to the top of imported song
        this.current_collection = this.local_collection
        this.current_index = this.local_collection.children.length - action.length

        // Update song screen
        this.updateSong(true)

        // Reset signal
        this.dropped_signal = new Promise((resolve) => {
          this.signal_drop = resolve
        })
      }

      if (is_song_chosen) {
        break
      }
    }

    this.signal_drop = undefined

    // Standard song chosen
    this.game.songs.setSong(this.current_collection.children[this.current_index])
    this.game.menu_screen.hide()
    this.game.background_screen.showMenuUI(false)
    this.game.songinfo_screen.menuMode(false)
    return this.game.song_load_controller
  }
}
