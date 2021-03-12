import AudioMedia from './audiomedia.js'

export default class VideoMedia extends AudioMedia {
  load (dom_element) {
    this._parent = dom_element
    return new Promise((resolve, reject) => {
      this.media_element = document.createElement('video')
      this.media_element.addEventListener('canplaythrough', () => {
        resolve(this.media_element)
      })
      this.media_element.src = this.url

      // Append to DOM
      this.media_element.style.objectFit = 'contain'
      this.media_element.style.width = '1920px'
      this.media_element.style.height = '1080px'
      dom_element.appendChild(this.media_element)

      this.connectAudioDestinationFunc(this.media_element)
    })
  }

  destroy () {
    this._parent.removeChild(this.media_element)
    this.media_element = null
  }

  hasVideo () {
    return true
  }
}
