import TypingChar from './typingchar.js'
import Observable from '../lib/observable.js'

export default class TypingRuby extends Observable {
  constructor (base, reading, typings, previous = null, show_reading = false) {
    super()
    this.base = base
    this.reading = reading
    this.typings = typings
    this.show_reading = show_reading

    this.current_char = 0
    this.is_blank = true

    this.active = false

    this.previous = previous
    this.next = null
    if (previous !== null) {
      previous.next = this
    }

    this.typing_chars = []
    this.makeTypingChar()
  }

  makeTypingChar () {
    let last_char = null
    if (this.previous !== null) {
      last_char = this.previous.typing_chars[this.previous.typing_chars.length - 1]
    }

    this.empty = true
    for (let i = 0; i < this.typings[0].length; i++) {
      const typing_char = new TypingChar(this.typings[1][i], this.typings[0][i], last_char)
      last_char = typing_char
      this.typing_chars.push(typing_char)
    }
  }

  initialize () {
    for (const t of this.typing_chars) {
      t.initialize()

      if (!t.is_blank)
        this.is_blank = false
    }
    this.advanceChar()
  }

  advanceChar () {
    while (this.current_char < this.typing_chars.length && this.typing_chars[this.current_char].isCompleted()) {
      this.current_char++
    }
  }

  isCompleted () {
    return this.current_char === this.typing_chars.length
  }

  accept (character) {
    if (this.isCompleted()) {
      return -1
    }
    const accept = this.typing_chars[this.current_char].accept(character)
    this.advanceChar()
    if (accept >= 0) {
      this._notify(this.isCompleted() ? 'completed' : 'in_progress')
    }
    return accept
  }

  getRemainingText () {
    let remaining_text = ''
    for (let i = 0; i < this.typing_chars.length; i++) {
      remaining_text += this.typing_chars[i].getRemainingText().replace(/ /g, '_')

      // Special case for | to represent visual space
      if (this.typing_chars[i].base === '|' || this.typing_chars[i].base === '\u3000') {
        remaining_text += '\u00A0\u00A0'
      }
    }
    return remaining_text
  }

  getCharacterCount () {
    let count = 0
    for (const c of this.typing_chars) {
      count += c.getCharacterCount()
    }
    return count
  }

  getLeftoverCharCount () {
    let count = 0
    for (const c of this.typing_chars) {
      count += c.getLeftoverCharCount()
    }
    return count
  }

  makeActive () {
    this.active = true
    this._notify('active')
    for (const c of this.typing_chars) {
      c.makeActive()
    }
  }
}
