import Viewport from '../graphics/viewport.js'
import InputHandler from './input.js'
import Sound from '../media/sound.js'
import Sfx from '../media/sfx.js'
import SongSystem from '../song/songsystem.js'
import LoadingController from './controller/1-loading.js'
import MenuController from './controller/2-menu.js'
import SongLoadController from './controller/3-song-load.js'
import SongController from './controller/4-song.js'
import ResultController from './controller/5-result.js'
import VolumeController from './controller/9-volume.js'
import LoadingScreen from '../screen/1-loading.js'
import MenuScreen from '../screen/2-menu.js'
import SongScreen from '../screen/4-song.js'
import ResultScreen from '../screen/5-result.js'
import SongInfoScreen from '../screen/8-songinfo.js'
import BackgroundScreen from '../screen/9-background.js'

export default class TypingMania {
  constructor (config) {
    this.config = Object.assign({}, {
      assets_url: 'assets/assets.dat',
      songs_url: 'data/songs.json',
    }, config)

    this.viewport = new Viewport(1920, 1080)
    this.input = new InputHandler()
    this.sound = new Sound()
    this.sfx = new Sfx(this.sound)
    this.songs = new SongSystem(this.sound)

    // Will be set in song-load because they're not global
    this.typing = null
    this.score = null
    this.media = null

    this.background_screen = new BackgroundScreen(this.viewport, '1.1.2r2')
    this.songinfo_screen = new SongInfoScreen(this.viewport)
    this.loading_screen = new LoadingScreen(this.viewport)
    this.menu_screen = new MenuScreen(this.viewport)
    this.song_screen = new SongScreen(this.viewport)
    this.result_screen = new ResultScreen(this.viewport)

    this.loading_controller = new LoadingController(this)
    this.menu_controller = new MenuController(this)
    this.song_load_controller = new SongLoadController(this)
    this.song_controller = new SongController(this)
    this.result_controller = new ResultController(this)

    this.volume_controller = new VolumeController(this)

    this.game_mode = 'normal'
  }

  reset () {
    // Reset all song-dependant system
    if (this.media) {
      this.media.pause()
      this.media.destroy()
    }
    this.typing = null
    this.score = null
    this.media = null
  }

  // Main game/input loop
  async run () {
    let runner = this.loading_controller

    while (true) {
      runner = await runner.run()
      if (!runner) {
        break
      }
    }
  }
}
