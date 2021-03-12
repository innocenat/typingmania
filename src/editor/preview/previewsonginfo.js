import { Component, h } from 'https://unpkg.com/preact?module'
import htm from 'https://unpkg.com/htm?module'
import { format_time } from '../../screen/0-common.js'

const html = htm.bind(h)

function showEmpty (t) {
  if (t.toString().trim().length === 0) {
    return html`<span class="empty-text">empty</span>`
  }
  return html`${t}`
}

export default class PreviewSongInfo extends Component {
  render () {
    if (this.props.song === null) {
      return html`
          <div class="info-panel">
              <h2>Song Info</h2>
              <div class="info-panel-content">
                  <p class="panel-empty">Please select file first</p>
              </div>
          </div>
      `
    }

    let media_url = ''
    if (this.props.song.media_type === 'youtube') {
      media_url = `https://www.youtube.com/watch?v=${this.props.song.media_url}`
    }

    return html`
        <div class="info-panel">
            <h2>Song Info</h2>
            <table class="info-panel-table">
                <thead>
                <tr>
                    <th>Properties</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Title</td>
                    <td>${showEmpty(this.props.song.title)}</td>
                </tr>
                <tr>
                    <td>Latin Title</td>
                    <td>${showEmpty(this.props.song.latin_title)}</td>
                </tr>
                <tr>
                    <td>Subtitle</td>
                    <td>${showEmpty(this.props.song.subtitle)}</td>
                </tr>
                <tr>
                    <td>Latin Subtitle</td>
                    <td>${showEmpty(this.props.song.latin_subtitle)}</td>
                </tr>
                <tr>
                    <td>Artist</td>
                    <td>${showEmpty(this.props.song.artist)}</td>
                </tr>
                <tr>
                    <td>Latin Artist</td>
                    <td>${showEmpty(this.props.song.latin_artist)}</td>
                </tr>
                <tr>
                    <td>Duration</td>
                    <td>${format_time(this.props.song.duration)}</td>
                </tr>
                <tr>
                    <td>CPM (P90)</td>
                    <td>${showEmpty(this.props.song.cpm)}</td>
                </tr>
                <tr>
                    <td>CPM (Max)</td>
                    <td>${showEmpty(this.props.song.max_cpm)}</td>
                </tr>
                <tr>
                    <td>Media Type</td>
                    <td>${showEmpty(this.props.song.media_type)}</td>
                </tr>
                <tr>
                    <td>Media URL</td>
                    <td>${showEmpty(media_url)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    `
  }
}
