import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'

export default function Lyrics (props) {
  return html`
      <div class="lyrics-ruby" onclick="${props.onclick}">
          ${props.line.rubies.map((ruby) => {
              let base = ruby.base === '|' ? '' : ruby.base
              if (base === ' ') {
                  base = '\u00A0\u00A0'
              }
              if (ruby.show_reading) {
                  return html`
                      <div class="ruby-group">
                          <div class="ruby-base">${base}</div>
                          <div class="ruby-ruby" style="margin-bottom: -0.5em">${ruby.reading}</div>
                      </div>
                  `
              } else {
                  return html`
                      <div class="ruby-group">
                          <div class="ruby-base">${base}</div>
                      </div>
                  `
              }
          })}
      </div>
  `
}
