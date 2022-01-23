import { format_time } from '../../screen/0-common.js'
import HTMLTypingLine from '../../typing/dom/htmltypingline.js'
import AutoMode from '../automode.js'

export default class SongController {
  constructor (game) {
    this.game = game
    this.in_screen = false

    this.automode = null
    this.auto_paused = false

    this.vis_bins = new Uint8Array(game.sound.analyser.frequencyBinCount)

    // To pause song when tab go out of focus
    // This is kinda important because the main loop use the requestAnimationFrame mechanism
    document.addEventListener('visibilitychange', this.visibilityChanged.bind(this))
  }

  async run () {
    this.game.song_screen.show()
    this.game.song_screen.setTypingRuby(false)
    this.game.background_screen.showSongUI(true)
    this.game.score.setToSongScreen(this.game.song_screen)

    // These variables contain the lyrics display info
    this.typing_dom = null
    this.current_line = null
    this.current_typing = -1

    // Start the main loop
    this.in_screen = true
    this.animationFrame()

    // Set up split progressbar
    if (this.game.game_mode !== 'blank') {
      // No interval info for BLANK mode
      const song_intervals = this.game.typing.getIntervals().map((x) => x / this.game.media.getDuration())
      if (song_intervals[song_intervals.length - 1] < 1) {
        song_intervals.push(1)
      }
      this.game.song_screen.ui_progress_all.chapter(song_intervals)
    } else {
      this.game.song_screen.ui_progress_all.chapter([1])
    }

    // Play media
    this.game.media.play()
    this.triggerTypingChange()

    if (this.game.media.hasVideo()) {
      this.game.background_screen.hideSongBackground()
    }

    // End signaler from main loop to input loop (this function)
    this.ended_signal = new Promise((resolve) => {
      this.signal_end = resolve
    })

    // Set up automode
    if (this.game.game_mode === 'auto') {
      const song_cpm = this.game.songs.current_song.max_cpm
      const interval = 60 / song_cpm
      this.automode = new AutoMode(this.game.typing, this, interval * 0.8)
      this.automode.run()
    }

    while (true) {
      const keyEvent = await Promise.any([this.game.input.waitForAnyKey(), this.ended_signal])

      // End signal received
      if (keyEvent === true) {
        break
      }

      // Also exit if Esc is pressed
      if (keyEvent.key === 'Escape') {
        break
      }

      // Skip line
      if (keyEvent.key === 'Tab') {
        const line = this.game.typing.getCurrentLine()
        if (line) {
          this.game.media.skipTo(line.end_time - 0.2)
        }
        continue
      }

      // If it is typing key
      if (keyEvent.key.length === 1 && this.current_line && !this.current_line.isCompleted()) {
        const key = keyEvent.key
        if (this.game.game_mode === 'tempo') {
          if (this.current_line && !this.current_line.isCompleted()) {
            this.type(this.current_line.getRemainingText().substr(0, 1).replace('_', ' '))
          }
        } else {
          this.type(key)
        }
      }
    }

    this.game.song_screen.hide()
    this.game.background_screen.showSongUI(false)
    this.in_screen = false

    if (this.game.media.hasVideo()) {
      this.game.background_screen.showSongBackground()
    }

    if (this.automode) {
      this.automode.stop()
    }

    return this.game.result_controller
  }

  type(key) {
    // Try to process input key
    const accept = this.current_line.accept(key)

    this.game.score.onType(this.game.media.getCurrentTime(), accept)
    this.updateTypingLine()

    // Play sfx
    if (accept < 0) {
      this.game.sfx.play('error')
    } else {
      this.game.sfx.play('key')
    }

    // If line is completed
    if (this.current_line.isCompleted()) {
      this.game.score.onLineEnd(0)
      this.triggerTypingChange()
    }
  }

  updateTypingLine () {
    // This update the typing text at the bottom of the screen
    // Blind mode only shows 1 char, blank mode shows nothing.
    if (this.current_line && this.game.game_mode !== 'blank') {
      this.game.song_screen.setTypingText(this.current_line.getRemainingText(), this.game.game_mode === 'blind')
    } else {
      this.game.song_screen.setTypingText('')
    }

    // Also update score
    this.game.score.setToSongScreen(this.game.song_screen)
  }

  triggerTypingChange () {
    const current_line = this.game.typing.getCurrentLine()
    const next_line = this.game.typing.getNextLine()

    this.current_line = current_line

    if (current_line && !current_line.isCompleted()) {
      // The typing line is active
      if (this.current_typing !== this.game.typing.current_line) {
        // First time, create new typing
        this.current_typing = this.game.typing.current_line
        if (this.game.game_mode !== 'blind' && this.game.game_mode !== 'blank') {
          this.typing_dom = new HTMLTypingLine(current_line)
          this.game.song_screen.setTypingRuby(this.typing_dom.el)
        }
      }
      current_line.makeActive()
      this.updateTypingLine()
    } else if (next_line) {
      // Show the next line preview if the line is completed
      if (this.current_typing !== this.game.typing.current_line + 1) {
        // First time, create new typing
        this.current_typing = this.game.typing.current_line + 1
        if (this.game.game_mode !== 'blind' && this.game.game_mode !== 'blank') {
          this.typing_dom = new HTMLTypingLine(next_line)
          this.game.song_screen.setTypingRuby(this.typing_dom.el)
        }
      }
      this.updateTypingLine()
    } else {
      this.game.song_screen.setTypingRuby(false)
      this.updateTypingLine()
    }
  }

  animationFrame () {
    // Only request animation frame if screen is still active
    if (this.in_screen) {
      const current_time = this.game.media.getCurrentTime()
      const duration = this.game.media.getDuration()

      // Update song playback info on screen
      this.game.song_screen.ui_time.text(`${format_time(current_time)} / ${format_time(duration)}`)

      // Main progress bar
      this.game.song_screen.ui_progress_all.progress(current_time / duration)

      // Interval progress bar
      const current_line = this.game.typing.getCurrentLine()
      if (current_line && this.game.game_mode !== 'blank') {
        this.game.song_screen.ui_progress_int.progress((current_time - current_line.start_time) / (current_line.duration))
      } else {
        this.game.song_screen.ui_progress_int.progress(0)
      }

      // Update typing system
      if (this.game.game_mode === 'easy' && current_line && current_time > current_line.end_time && !current_line.isCompleted()) {
        // In easy mode, wait for the line to complete before advancing
        const left_percent =  (1 - (current_line.getLeftoverCharCount() / current_line.getCharacterCount()))
        this.game.media.skipTo(current_line.start_time + left_percent * (current_line.end_time - current_line.start_time))
      } else {
        const [changed, leftover] = this.game.typing.update(current_time)
        if (changed) {
          // Typing line has changed
          if (leftover > 0) {
            // The line isn't completed, update the score
            this.game.score.onLineEnd(leftover)
            // Play skip sfx when line is skipped
            this.game.sfx.play('skip')
          }

          // Trigger start of the new line
          this.game.score.onLineStart(current_time)
          this.triggerTypingChange()
        }
      }

      // If typing has ended
      if (this.game.typing.hasEnded()) {
        this.signal_end(true)
      }

      // Or media has ended
      if (this.game.media.ended) {
        this.signal_end(true)
      }

      // Visualization
      this.game.sound.analyser.getByteFrequencyData(this.vis_bins)
      this.game.song_screen.showVisualization(this.vis_bins)

      requestAnimationFrame(this.animationFrame.bind(this))
    }
  }

  visibilityChanged () {
    if (document.hidden) {
      this.auto_paused = true
      if (this.game.media)
        this.game.media.pause()
    } else {
      this.auto_paused = false
      if (this.game.media && this.in_screen)
        this.game.media.play()
    }
  }
}
