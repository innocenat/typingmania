import { Component, h } from 'https://unpkg.com/preact?module'
import htm from 'https://unpkg.com/htm?module'

const html = htm.bind(h)

export default class Lyrics extends Component {
  render () {
    return html`
        <div class="lyrics-ruby">
            ${this.props.line.rubies.map((ruby) => {
                let base = ruby.base === '|' ? '' : ruby.base
                if (base === ' ') {
                    base = '\u00A0\u00A0'
                }
                if (ruby.show_reading) {
                    return html`
                        <div class="ruby-group">
                            <div class="ruby-base">${base}</div>
                            <div class="ruby-ruby">${ruby.reading}</div>
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
}
