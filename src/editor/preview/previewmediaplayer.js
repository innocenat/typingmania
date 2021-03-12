import { Component, h } from 'https://unpkg.com/preact?module'
import htm from 'https://unpkg.com/htm?module'
import MediaPlayerTarget from '../media/mediaplayertarget.js'
import { format_time } from '../../screen/0-common.js'

const html = htm.bind(h)

export default class PreviewMediaPlayer extends Component {
  onSeek = (e) => {
    this.props.mediaplayer.seekTo(e.target.value)
  }

  render () {
    if (this.props.media.status === 0) {
      // No media loaded
      return html`
          <div class="info-panel">
              <h2>Media</h2>
              <div class="info-panel-content">
                  <${MediaPlayerTarget} mediaplayer="${this.props.mediaplayer}"/>
                  <p class="panel-empty">Please select file first</p>
              </div>
          </div>
      `
    }
    if (this.props.media.status === 1) {
      // Media loading
      return html`
          <div class="info-panel">
              <h2>Media</h2>
              <div class="info-panel-content">
                  <${MediaPlayerTarget} mediaplayer="${this.props.mediaplayer}"/>
                  <p class="panel-empty">Loading...</p>
              </div>
          </div>
      `
    }
    return html`
        <div class="info-panel">
            <h2>Media</h2>
            <div class="info-panel-content">
                <${MediaPlayerTarget} mediaplayer="${this.props.mediaplayer}"/>
                <div class="media-player">
                    <input type="range" class="media-player-progress" min="0" value="${this.props.media.currentTime}"
                           max="${this.props.media.duration}" step="any" oninput="${this.onSeek}"/>
                    <div class="media-player-control">
                        <div class="media-player-control-bar toolbar">
                            <button class="btn toolbar-btn" onclick="${() => this.props.mediaplayer.play()}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                </svg>
                            </button>
                            <button class="btn toolbar-btn" onclick="${() => this.props.mediaplayer.pause()}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                                </svg>
                            </button>
                            <div class="btn-separator"></div>
                            <button class="btn toolbar-btn" onclick="${() => this.props.mediaplayer.seekTo(0)}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0V4z"/>
                                </svg>
                            </button>
                            <button class="btn toolbar-btn" onclick="${() => this.props.mediaplayer.seekBy(-5)}">
                                -5
                            </button>
                            <button class="btn toolbar-btn" onclick="${() => this.props.mediaplayer.seekBy(5)}">
                                +5
                            </button>
                            <button class="btn toolbar-btn"
                                    onclick="${() => this.props.mediaplayer.seekTo(this.props.media.duration)}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="media-player-control-info">
                            ${format_time(this.props.media.currentTime)} / ${format_time(this.props.media.duration)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
  }
}
