import FileLoader from '../../lib/fileloader.js'
import PackedFile from '../../lib/packedfile.js'
import FontLoader from '../../lib/fontloader.js'

export default class LoadingController {
  constructor (game) {
    this.game = game
  }

  // noinspection JSUnusedAssignment
  async run () {
    // Show all scene
    this.game.background_screen.show()
    this.game.loading_screen.show()

    // Load assets file
    this.game.loading_screen.setMainText('Loading...')
    this.game.loading_screen.setSubText('Downloading assets 0%')

    let assets, packed_file
    let is_error = false

    try {
      // Load with progress report
      assets = await FileLoader.load(this.game.config.assets_url, (progress) => {
        if (!is_error) {
          const p = Math.floor(progress * 100)
          this.game.loading_screen.setSubText(`Downloading assets ${p}%`)
        }
      })
    } catch (error) {
      // Handle Assets error
      this.game.loading_screen.setMainText('Error.')
      is_error = true
      switch (error) {
        case 'NETWORK_ERROR':
          this.game.loading_screen.setSubText('Unable to download assets file.')
          return false
        case 'NOT_FOUND':
          this.game.loading_screen.setSubText('Assets file not found.')
          return false
        case 'HTTP_ERROR':
        default:
          this.game.loading_screen.setSubText('Error downloading assets file.')
          return false
      }
    }

    // Unpack assets
    this.game.loading_screen.setSubText('Unpacking assets.')

    try {
      packed_file = new PackedFile()
      packed_file.unpackFromBuffer(assets)
    } catch (error) {
      console.error(error)
      this.game.loading_screen.setMainText('Error.')
      this.game.loading_screen.setSubText('Invalid assets file.')
      return false
    }

    // Set up UI Image
    this.game.loading_screen.setSubText('Setting up UI.')
    this.game.background_screen.loadAssets(packed_file)

    // Set up Font
    this.game.loading_screen.setSubText('Setting up custom fonts.')
    await FontLoader.load(packed_file.getFileAsURL('fonts/iosevka-etoile-500.woff2'), 'Iosevka Etoile', '500', 'normal')
    await FontLoader.load(packed_file.getFileAsURL('fonts/notojp-500.woff2'), 'Noto Sans CJK JP', '500', 'normal')
    await FontLoader.load(packed_file.getFileAsURL('fonts/opensans-700.woff2'), 'Open Sans', '700', 'normal')

    // Set up SFX
    this.game.loading_screen.setSubText('Setting up custom SFX.')
    for (const name of ['decide', 'error', 'exit', 'intro', 'key', 'ready', 'select', 'select2', 'skip']) {
      await this.game.sfx.registerSfx(name, packed_file.getFileAsBuffer(`sfx/${name}.wav`))
    }

    // Also load YouTube API here
    this.game.loading_screen.setSubText('Setting up YouTube API.')
    await this.game.sound.loadYouTubeAPI()

    // Load Song List
    this.game.loading_screen.setSubText('Downloading songs list 0%')
    let songJson
    try {
      // Load with progress report
      const songList = await FileLoader.load(this.game.config.songs_url, (progress) => {
        if (!is_error) {
          const p = Math.floor(progress * 100)
          this.game.loading_screen.setSubText(`Downloading songs list ${p}%`)
        }
      })
      songJson = JSON.parse(FileLoader.decode(songList))
    } catch (error) {
      is_error = true
      this.game.loading_screen.setMainText('Error.')
      switch (error) {
        case 'NETWORK_ERROR':
          this.game.loading_screen.setSubText('Unable to download songs list file.')
          return false
        case 'NOT_FOUND':
          this.game.loading_screen.setSubText('Songs list file not found.')
          return false
        case 'HTTP_ERROR':
        default:
          this.game.loading_screen.setSubText('Error downloading songs list file.')
          return false
      }
    }

    // Process song list
    this.game.loading_screen.setSubText('Processing song list')
    this.game.songs.load(songJson)

    // Check if we are direct-loading any song
    const query_string = new URLSearchParams(window.location.search)
    const song_url = query_string.get('song')
    if (song_url !== null) {
      this.game.loading_screen.setSubText('Downloading specified song 0%')
      try {
        // Load with progress report
        const song_file = await FileLoader.load(song_url, (progress) => {
          if (!is_error) {
            const p = Math.floor(progress * 100)
            this.game.loading_screen.setSubText(`Downloading specified song ${p}%`)
          }
        })
        const song_blob = new Blob([song_file])
        const song_blob_url = URL.createObjectURL(song_blob)

        this.game.specified_song = song_blob_url
        this.game.specified_song_path = song_url
      } catch (error) {
        is_error = true
        this.game.loading_screen.setMainText('Error.')
        switch (error) {
          case 'NETWORK_ERROR':
            this.game.loading_screen.setSubText('Unable to download specified song file.')
            return false
          case 'NOT_FOUND':
            this.game.loading_screen.setSubText('Specified song file not found.')
            return false
          case 'HTTP_ERROR':
          default:
            this.game.loading_screen.setSubText('Error downloading specified song.')
            return false
        }
      }
    }

    // Wait for sound initialization keydown
    this.game.loading_screen.setMainText('Ready')
    this.game.loading_screen.setSubText('Press any key')

    // Start sound system on key input
    let sound_system_promise
    await this.game.input.waitForAnyKey(() => {
      // Sound needs to be initialize directly from input event handler
      sound_system_promise = this.game.sound.initializeSound()
    })

    this.game.loading_screen.setMainText('Please wait...')
    this.game.loading_screen.setSubText('Starting sound system.')

    try {
      await sound_system_promise
    } catch {
      this.game.loading_screen.setMainText('Error')
      this.game.loading_screen.setSubText('Sound system fail to start.')
      return false
    }

    // Destroy assets buffer
    // Sfx are already decoded into AudioBuffer
    // Other media have been made into Blob URL
    packed_file.destroy()

    // Move to menu screen/controller
    this.game.loading_screen.hide()
    this.game.sfx.play('decide')
    return this.game.menu_controller
  }
}
