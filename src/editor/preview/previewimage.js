import { Component, h } from 'https://unpkg.com/preact?module'
import htm from 'https://unpkg.com/htm?module'

const html = htm.bind(h)
export default class PreviewImage extends Component {
  render () {
    if (this.props.song === null) {
      return html`
          <div class="info-panel">
              <h2>Preview Image</h2>
              <div class="info-panel-content">
                  <p class="panel-empty">Please select file first</p>
              </div>
          </div>
      `
    }
    return html`
        <div class="info-panel">
            <h2>Preview Image</h2>
            <div class="info-panel-content">
                <img src="${this.props.song.image_url}"/>
            </div>
        </div>
    `
  }
}
