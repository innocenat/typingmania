import { applyReset } from '../../graphics/graphicsutil.js'
import HTMLTypingChar from './htmltypingchar.js'

export default class HTMLTypingRuby {
  constructor (ruby, config, line_has_reading) {
    this.ruby = ruby
    this.config = config

    // Ruby container
    this.el = document.createElement('div')
    applyReset(this.el)
    this.el.style.display = 'flex'
    this.el.style.flexDirection = 'column-reverse'

    // Ruby base
    this.base_el = document.createElement('div')
    applyReset(this.base_el)
    this.base_el.style.textAlign = 'center'
    this.base_el.style.color = ruby.active ? this.config.color : this.config.inactive_color
    if (line_has_reading) {
      this.base_el.style.height = this.config.base_height
      this.base_el.style.lineHeight = this.config.base_height
      this.config.base_font._setTo(this.base_el)
    } else {
      this.base_el.style.height = this.config.no_reading_height
      this.base_el.style.lineHeight = this.config.no_reading_height
      this.config.no_reading_font._setTo(this.base_el)
    }

    this.base_el.textContent = ruby.base === '|' ? '' : ruby.base
    if (ruby.base === ' ') {
      this.base_el.innerHTML = '\u00A0\u00A0'
    }
    this.el.appendChild(this.base_el)

    // Ruby element
    if (ruby.show_reading) {
      this.ruby_el = document.createElement('div')
      applyReset(this.ruby_el)
      this.ruby_el.style.textAlign = 'center'
      this.ruby_el.style.marginBottom = this.config.spacing
      this.ruby_el.style.height = this.config.ruby_height
      this.ruby_el.style.lineHeight = this.config.ruby_height
      this.config.ruby_font._setTo(this.ruby_el)

      for (const c of ruby.typing_chars) {
        this.ruby_el.appendChild(HTMLTypingChar.make(c, config))
      }

      this.el.appendChild(this.ruby_el)
    }

    // If blank
    if (ruby.is_blank) {
      this.base_el.style.color = this.config.disabled_color
    }

    ruby._observe(this.onNotify.bind(this))
  }

  onNotify (event) {
    switch (event) {
      case 'in_progress':
        this.base_el.style.color = this.config.progress_color
        break
      case 'completed':
        this.base_el.style.color = this.config.completed_color
        break
      case 'inactive':
        this.base_el.style.color = this.config.inactive_color
        break
      case 'active':
        if (!this.ruby.is_blank)
          this.base_el.style.color = this.config.color
        break
    }
  }

  static make (ruby, config, line_has_reading) {
    const c = new HTMLTypingRuby(ruby, config, line_has_reading)
    return c.el
  }
}
