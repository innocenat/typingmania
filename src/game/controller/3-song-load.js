import Typing from '../../typing/typing.js'
import Score from '../score.js'

export default class SongLoadController {
  constructor (game) {
    this.game = game
    this.abort_signal = null

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.abort_signal) {
        this.abort_signal()
      }
    })
  }

  async run () {
    const song = this.game.songs.current_song
    this.game.loading_screen.show()
    this.game.sfx.play('decide')

    // Load song
    this.game.loading_screen.setMainText('Loading...')
    this.game.loading_screen.setSubText('Downloading song 0%')

    let is_error = false
    try {
      if (!song.loaded) {
        // Load abort controller
        const abort_controller = new AbortController()
        const abort_signal = abort_controller.signal
        this.abort_signal = () => {
          abort_controller.abort()
        }

        // If song hasn't been load yet, then load song with progress
        await song.load((progress) => {
          if (!is_error) {
            const p = Math.floor(progress * 100)
            this.game.loading_screen.setSubText(`Downloading song ${p}%`)
          }
        }, abort_signal)

        this.abort_signal = null
      }
    } catch (error) {
      is_error = true
      console.log(error)
      this.game.loading_screen.setMainText('Error.')
      switch (error) {
        case 'ABORTED':
          // Exit to menu if aborted
          this.game.loading_screen.hide()
          this.game.reset()
          return this.game.menu_controller
        case 'NETWORK_ERROR':
          this.game.loading_screen.setSubText('Unable to download song file.')
          break
        case 'NOT_FOUND':
          this.game.loading_screen.setSubText('Song file not found.')
          break
        case 'HTTP_ERROR':
        default:
          this.game.loading_screen.setSubText('Error downloading song file.')
      }
    }

    if (is_error) {
      this.game.sfx.play('error')
      await this.game.input.waitForAnyKey()
      this.game.loading_screen.hide()
      return this.game.menu_controller
    }

    // Set Song Image
    this.game.background_screen.showSongBackground(song.image_url)

    // Process lyrics
    this.game.loading_screen.setSubText('Processing lyrics.')
    try {
      this.game.typing = new Typing(song.lyrics_csv)
      this.game.score = new Score(this.game.typing.getScoringCharCount())
    } catch (e) {
      console.log(e)
      this.game.loading_screen.setMainText('Error.')
      this.game.loading_screen.setSubText('Error during lyrics parsing.')
      this.game.sfx.play('error')
      await this.game.input.waitForAnyKey()
      this.game.loading_screen.hide()
      return this.game.menu_controller
    }

    // Process media
    this.game.loading_screen.setSubText('Processing media.')
    this.game.media = this.game.sound.createMedia(song)
    await this.game.media.load(this.game.background_screen.getSongBackgroundContainer())

    // Ready
    if (!this.game.specified_song) {
      this.game.loading_screen.setMainText('Ready')
      this.game.loading_screen.setSubText('Press any key')

      // Wait for key
      const key = await this.game.input.waitForAnyKey()
      if (key.key === 'Escape' || key.key === 'Backspace') {
        // Exit to menu if Esc or Backspace is pressed
        this.game.loading_screen.hide()
        this.game.reset()
        return this.game.menu_controller
      }
    } else {
      this.game.specified_song = null
    }
    this.game.loading_screen.hide()
    this.game.sfx.play('intro')
    return this.game.song_controller
  }
}
