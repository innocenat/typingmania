import FileLoader from '../lib/fileloader.js'
import PackedFile from '../lib/packedfile.js'

export default class Song {
  constructor (options, collection) {
    this.collection = collection

    this.title = options.title
    this.subtitle = options.subtitle
    this.artist = options.artist

    this.latin_title = options.latin_title || ''
    this.latin_subtitle = options.latin_subtitle || ''
    this.latin_artist = options.latin_artist || ''

    this.url = options.url

    this.language = options.language
    this.cpm = options.cpm
    this.max_cpm = options.max_cpm
    this.duration = options.duration

    if ('youtube' in options) {
      this.media_type = 'youtube'
    } else if ('video' in options) {
      this.media_type = 'video'
    } else if ('audio' in options) {
      this.media_type = 'audio'
    }

    // These data are from secondary loading
    this.loaded = false
    this.media_url = ''
    this.lyrics_csv = ''
    this.image_url = ''

    this.loadHighScore()
  }

  loadHighScore () {
    const key = 'typingmania:high_score:' + this.url
    try {
      const storage = window.localStorage
      this.high_score = storage.getItem(key) || 0
      this.high_score_class = storage.getItem(key + ':class') || ''
    } catch {
      this.high_score = 0
      this.high_score_class = ''
    }
  }

  saveHighScore (cls, score) {
    if (score >= this.high_score) {
      this.high_score = score
      this.high_score_class = cls

      const key = 'typingmania:high_score:' + this.url
      window.localStorage.setItem(key, score)
      window.localStorage.setItem(key + ':class', cls)
    }
  }

  async load (progress_handler) {
    if (this.loaded) {
      return this
    }

    const raw_song = await FileLoader.load(this.url, progress_handler)

    const packed_song = new PackedFile()
    packed_song.unpackFromBuffer(raw_song)
    this.loadFromPackedFile(packed_song)
    packed_song.destroy()
    this.loaded = true
    return this
  }

  loadFromPackedFile (packed_song) {
    const song_meta = JSON.parse(packed_song.getAsText('song.json'))

    this.image_url = packed_song.getFileAsURL(song_meta.image)
    this.lyrics_csv = packed_song.getAsText('lyrics.csv')

    if (this.media_type === 'youtube') {
      this.media_url = song_meta.youtube
    } else if (this.media_type === 'video') {
      this.media_url = packed_song.getFileAsURL(song_meta.video)
    } else if (this.media_type === 'audio') {
      this.media_url = packed_song.getFileAsURL(song_meta.audio)
    }
  }
}
