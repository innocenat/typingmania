import { Component, h } from 'https://unpkg.com/preact?module'
import htm from 'https://unpkg.com/htm?module'
import { format_number_fixed } from '../../screen/0-common.js'
import Lyrics from '../common/lyrics.js'

const html = htm.bind(h)

function formatTime (t) {
  t = Math.round(t * 1000)
  const ms = t % 1000
  t = Math.floor(t / 1000)
  const s = t % 60
  t = Math.floor(t / 60)
  const m = t % 60
  t = Math.floor(t / 60)
  return `${t}:${format_number_fixed(m, 2)}:${format_number_fixed(s, 2)}:${format_number_fixed(ms, 3)}`
}

export default class PreviewLyrics extends Component {
  render () {
    if (this.props.typings === null) {
      return html``
    }
    return html`
        <table class="lyrics-preview-table">
            <thead>
            <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Lyrics</th>
            </tr>
            </thead>
            <tbody>
            ${
                    this.props.typings.lines.filter((x) => !x.is_blank).map((line) => {
                        const className = line.start_time <= this.props.currentTime && this.props.currentTime <= line.end_time ? 'active' : ''
                        return html`
                            <tr class="${className}">
                                <td rowspan="2" class="start-time"
                                    onclick="${() => this.props.seekTo(line.start_time)}">
                                    ${formatTime(line.start_time)}
                                </td>
                                <td rowspan="2" class="end-time" onclick="${() => this.props.seekTo(line.end_time)}">
                                    ${formatTime(line.end_time)}
                                </td>
                                <td class="lyrics">
                                    <${Lyrics} line="${line}"/>
                                </td>
                            </tr>
                            <tr class="${className}">
                                <td class="typing">${line.getRemainingText()}</td>
                            </tr>
                        `
                    })
            }
            </tbody>
        </table>
    `
  }
}
