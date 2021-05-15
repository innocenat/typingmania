import Media from './media.js'

export default class YouTubeMedia extends Media {
  constructor (url, volume) {
    super()
    this.url = url
    this.player = null
    this.destroyed = false
    this.initial_volume = volume
  }

  load (dom_element) {
    this._parent = dom_element
    return new Promise((resolve, reject) => {
      // create child for replacement
      this.el = document.createElement('div')
      dom_element.appendChild(this.el)
      this.player = new YT.Player(this.el, {
        width: '1920',
        height: '1080',
        videoId: this.url,
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
        },
        events: {
          'onReady': () => {
            if (this.initial_volume === 0) {
              this.player.mute()
            } else {
              this.player.unMute()
              this.player.setVolume(this.initial_volume)
            }
            resolve(false)
          },
          'onStateChange': (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              this.ended = true
            }
          },
        },
      })
    })
  }

  destroy () {
    this.player.destroy()
    this.player = null
    this._parent.removeChild(this.el)
    this.destroyed = true
    this.ended = true
  }

  getDuration () {
    return this.player.getDuration()
  }

  getCurrentTime () {
    return this.player.getCurrentTime()
  }

  skipTo (time) {
    this.player.seekTo(time)
  }

  play () {
    if (!this.ended)
      this.player.playVideo()
  }

  pause () {
    if (!this.ended)
      this.player.pauseVideo()
  }

  hasVideo () {
    return true
  }
}
