export default class MediaPlayer {
  constructor () {
    this._mediaEl = null
    this._ytPlayer = null
    this._youtube_api_ready_func = null
    this._youtube_api_loaded = false

    this.status = 0
    this.duration = 0
  }

  loadYouTubeAPI () {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => {
      this._youtube_api_loaded = true
      if (this._youtube_api_ready_func)
        this._youtube_api_ready_func()
    }
  }

  getStatus () {
    return this.status
  }

  reset () {
    this.pause()
    this.status = 0
    if (this.media_el) {
      // Clear all child
      this.media_el.innerHTML = ''
    }
    this._ytPlayer = null
    this._mediaEl = null
  }

  loadAudio (url) {
    this.reset()
    this.status = 1
    this._mediaEl = new Audio()
    this._mediaEl.addEventListener('canplaythrough', () => {
      this.status = 2
      this.duration = this._mediaEl.duration
    })
    this._mediaEl.src = url
  }

  loadVideo (url) {
    this.reset()
    this.status = 1
    this._mediaEl = document.createElement('video')
    this._mediaEl.addEventListener('canplaythrough', () => {
      this.status = 2
      this.duration = this._mediaEl.duration
    })
    this._mediaEl.src = url
    this.media_el.appendChild(this._mediaEl)
  }

  loadYouTube (id) {
    this.reset()
    this.status = 1
    if (!this._youtube_api_loaded) {
      this._youtube_api_ready_func = () => {
        this.loadYouTube(id)
      }
      this.loadYouTubeAPI()
      return
    }

    const yt_el = document.createElement('div')
    this.media_el.appendChild(yt_el)
    this._ytPlayer = new YT.Player(yt_el, {
      height: '100%',
      width: '100%',
      videoId: id,
      playerVars: {
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
      },
      events: {
        'onReady': () => {
          this.status = 2
          this.duration = this._ytPlayer.getDuration()
        },
        'onStateChange': () => {
          this.duration = this._ytPlayer.getDuration()
        },
      },
    })
  }

  setMediaTarget (el) {
    this.media_el = el
  }

  getDuration () {
    return this.duration
  }

  getCurrentTime () {
    if (this.status !== 2)
      return 0
    if (this._mediaEl) {
      return this._mediaEl.currentTime
    }
    if (this._ytPlayer) {
      return this._ytPlayer.getCurrentTime()
    }
    return 0
  }

  seekTo (timestamp) {
    if (this.status !== 2)
      return
    if (this._mediaEl)
      this._mediaEl.currentTime = timestamp
    if (this._ytPlayer)
      this._ytPlayer.seekTo(timestamp, true)
  }

  seekBy (delta) {
    if (this.status !== 2)
      return
    if (this._mediaEl)
      this._mediaEl.currentTime += delta
    if (this._ytPlayer)
      this._ytPlayer.seekTo(this._ytPlayer.getCurrentTime() + delta, true)
  }

  play () {
    if (this.status !== 2)
      return
    if (this._mediaEl)
      this._mediaEl.play()
    if (this._ytPlayer)
      this._ytPlayer.playVideo()
  }

  pause () {
    if (this.status !== 2)
      return
    if (this._mediaEl)
      this._mediaEl.pause()
    if (this._ytPlayer)
      this._ytPlayer.pauseVideo()
  }
}
