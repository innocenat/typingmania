import { applyReset } from '../../graphics/graphicsutil.js'
import HTMLTypingRuby from './htmltypingruby.js'
import { SongFont } from '../../screen/0-common.js'

export default class HTMLTypingLine {
  constructor (line, config = {}) {
    this.config = Object.assign({}, {
      base_height: '45px',
      base_font: SongFont.size(45),
      ruby_height: '30px',
      ruby_font: SongFont.size(30),
      spacing: '5px',
      no_reading_height: '90px',
      no_reading_font: SongFont.size(60),
      color: 'white',
      disabled_color: '#999',
      inactive_color: '#ccc',
      progress_color: '#fefe00',
      completed_color: '#00fefe',
    }, config)

    // Make container div
    this.el = document.createElement('div')
    applyReset(this.el)
    this.el.style.display = 'flex'
    this.el.style.flexDirection = 'row'
    this.el.style.flexWrap = 'nowrap'
    this.el.style.alignItems = 'flex-end'
    this.el.style.justifyContent = 'flex-start'
    this.el.style.color = config.color

    const line_has_reading = line.hasReading()

    for (const ruby of line.rubies) {
      const el = HTMLTypingRuby.make(ruby, this.config, line_has_reading)
      this.el.appendChild(el)
    }
  }
}
