import { html, useState } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { format_number_fixed } from '../../../screen/0-common.js'
import Romanizer from '../../../typing/romanizer.js'
import TypingLine from '../../../typing/typingline.js'
import Lyrics from './lyrics.js'
import latinTable from '../../../../latin-table/latin-table.js'

const romanizer = new Romanizer(latinTable)

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

export default function UILyrics (props) {
  if (!props.lyrics || props.lyrics.length === 0) {
    return null
  }

  const [hover, setHover] = useState(-1)

  return html`
      <div class="app-lyrics">
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
                  this.props.lyrics.map((line, idx) => {
                      const typing = new TypingLine(line[2], line[0] / 1000, line[1] / 1000, romanizer)
                      const active = typing.start_time <= this.props.currentTime && this.props.currentTime <= typing.end_time
                      return html`
                          <tr onclick="${() => this.props.selectLine(idx)}" onmouseover="${() => setHover(idx)}" onmouseleave="${() => setHover(-1)}" class="${ active ? 'active' : hover === idx ? 'hover' : ''}">
                              <td rowspan="2" class="start-time">
                                  ${formatTime(typing.start_time)}
                              </td>
                              <td rowspan="2" class="end-time">
                                  ${formatTime(typing.end_time)}
                              </td>
                              <td class="lyrics">
                                  <${Lyrics} line="${typing}"/>
                              </td>
                          </tr>
                          <tr onclick="${() => this.props.selectLine(idx)}" onmouseover="${() => setHover(idx)}" onmouseleave="${() => setHover(-1)}" class="${ active ? 'active' : hover === idx ? 'hover' : ''}">
                              <td class="typing">
                                  ${typing.getRemainingText()}
                              </td>
                          </tr>
                      `
                  })
          }
          </tbody>
      </table>
      </div>
  `
}