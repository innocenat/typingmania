import { Component, createRef, h } from 'https://unpkg.com/preact?module'
import htm from 'https://unpkg.com/htm?module'

const html = htm.bind(h)

export default class MediaPlayerTarget extends Component {

  mediaEl = createRef()

  // Component will be updated externally
  shouldComponentUpdate () {
    return false
  }

  componentDidMount () {
    this.props.mediaplayer.setMediaTarget(this.mediaEl.current)
  }

  render () {
    return html`
        <div class="media-player-container" ref="${this.mediaEl}"></div>
    `
  }
}
