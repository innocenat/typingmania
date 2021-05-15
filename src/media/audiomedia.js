import Media from './media.js'

export default class AudioMedia extends Media {
  constructor (url, connectAudioDestinationFunc) {
    super()
    this.media_element = null
    this.url = url
    this.connectAudioDestinationFunc = connectAudioDestinationFunc
  }

  load (dom_element) {
    return new Promise((resolve) => {
      this.media_element = new Audio()
      this.media_element.addEventListener('canplaythrough', () => {
        resolve(this.media_element)
      })
      this.media_element.addEventListener('ended', () => {
        this.ended = true
      })
      this.media_element.src = this.url
      this.connectAudioDestinationFunc(this.media_element)
    })
  }

  destroy () {
    this.ended = true
    this.media_element = null
  }

  getDuration () {
    return this.media_element.duration
  }

  getCurrentTime () {
    return this.media_element.currentTime
  }

  skipTo (time) {
    this.media_element.currentTime = time
  }

  play () {
    if (!this.ended)
      this.media_element.play()
  }

  pause () {
    if (!this.ended)
      this.media_element.pause()
  }
}
