import YouTubeMedia from './youtubemedia.js'
import AudioMedia from './audiomedia.js'
import VideoMedia from './videomedia.js'

export default class Sound {
  constructor () {
    // COMPAT: Safari still required prefixed version
    const AudioContext = window.AudioContext || window.webkitAudioContext
    this.context = new AudioContext()

    // Gain and DynamicCompress chain
    this.gain = this.context.createGain()
    this.compressor = this.context.createDynamicsCompressor()

    // For visualization
    this.analyser = this.context.createAnalyser()
    this.analyser.fftSize = 4096
    // this.analyser.smoothingTimeConstant = 0.8
    // this.analyser.minDecibels = -60
    // this.analyser.maxDecibels = -20

    this.analyser.connect(this.gain)
    this.gain.connect(this.compressor)
    this.compressor.connect(this.context.destination)

    // Active YouTube Media (for sound setting)
    this.youtube_media = []

    // Default sound volume
    this.setSoundValue(100)
  }

  setSoundValue (percent) {
    this.sound_value = Math.max(0, percent)
    const dbFS = this.sound_value - 100
    this.setDBFS(dbFS, percent === 0)

    const youtube_volume = this.getYouTubeVolume()
    for (let i = 0; i < this.youtube_media.length; i++) {
      if (this.youtube_media[i].destroyed) {
        this.youtube_media.splice(i, 1)
        i--
      } else {
        const player = this.youtube_media[i].player
        if (player !== null) {
          if (youtube_volume === 0) {
            player.mute()
          } else {
            player.unMute()
            player.setVolume(youtube_volume)
          }
        }
      }
    }
  }

  getYouTubeVolume () {
    return Math.max(0, Math.min(this.sound_value, 100))
  }

  setDBFS (value, mute) {
    this.dbFS = value
    if (mute) {
      this.gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.01)
    } else {
      this.gain.gain.exponentialRampToValueAtTime(Math.pow(10, this.dbFS / 40), this.context.currentTime + 0.1)
    }
  }

  initializeSound () {
    return new Promise((resolve, reject) => {
      if (this.context.state === 'suspended') {
        this.context.resume()
      }
      setTimeout(() => {
        if (this.context.state === 'suspended') {
          reject('SOUND_ERROR')
        } else {
          resolve()
        }
      }, 50)
    })
  }

  loadYouTubeAPI () {
    return new Promise((resolve, reject) => {
      window.onYouTubeIframeAPIReady = () => {
        resolve()
      }

      // Load YouTube iframe API
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.append(tag)
    })
  }

  createMedia (song) {
    const connectAudioDestinationFunc = (media) => {
      this.media_source = this.context.createMediaElementSource(media)
      this.media_source.connect(this.analyser)
    }
    switch (song.media_type) {
      case 'video':
        return new VideoMedia(song.media_url, connectAudioDestinationFunc)
      case 'audio':
        return new AudioMedia(song.media_url, connectAudioDestinationFunc)
      case 'youtube':
        const yt = new YouTubeMedia(song.media_url, this.getYouTubeVolume())
        this.youtube_media.push(yt)
        return yt
    }
    throw new Error('Unknown media type: ' + song.media_type)
  }
}
