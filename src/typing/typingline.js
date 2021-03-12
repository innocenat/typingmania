import TypingRuby from './typingruby.js'

export default class TypingLine {
  constructor (line, start_time, end_time, romanizer) {
    this.is_blank = line.length === 0
    this.line = line
    this.start_time = start_time
    this.end_time = end_time
    this.duration = this.end_time - this.start_time
    this._romanizer = romanizer
    this.rubies = []
    this.tokens = []

    this.current_ruby = 0
    this.completed = this.is_blank

    this.active = false

    this.tokenize()
    this.makeRubies()
  }

  tokenize () {
    let start_pos = 0
    let paren_pos = -1
    let to_tokenize = ''
    for (let pos = 0; pos < this.line.length; pos++) {
      const c = this.line.charAt(pos)
      if (c === '[') {
        if (to_tokenize.length > 0) {
          const tokens = this._romanizer.splitReading(to_tokenize)[1]
          for (const token of tokens) {
            this.tokens.push([token, token, false])
          }
          to_tokenize = ''
        }

        paren_pos = pos
      } else if (c === ']') {
        const base = this.line.substring(start_pos, paren_pos)
        const reading = this.line.substring(paren_pos + 1, pos)

        this.tokens.push([base, reading, true])

        start_pos = pos + 1
        paren_pos = -1
      } else if (paren_pos === -1 && this._romanizer.isReadingAvailable(c)) {
        if (start_pos !== pos) {
          throw new Error('No reading available for: ' + this.line.substring(start_pos, pos - 1) + ' (line:' + this.line + ':' + pos + ')')
        }

        to_tokenize += c
        start_pos++
      }
    }

    if (to_tokenize.length > 0) {
      const tokens = this._romanizer.splitReading(to_tokenize)[1]
      for (const token of tokens) {
        this.tokens.push([token, token, false])
      }
    }

    // There should not be any leftover
    if (start_pos !== this.line.length) {
      throw new Error('No reading available for: ' + this.line.substring(start_pos))
    }
  }

  makeRubies () {
    let last_ruby = null
    for (let token of this.tokens) {
      const this_ruby = new TypingRuby(token[0], token[1], this._romanizer.splitReading(token[1]), last_ruby, token[2])
      this.rubies.push(this_ruby)
      last_ruby = this_ruby
    }
    for (const r of this.rubies) {
      r.initialize()
    }

    this.advanceRuby()
  }

  advanceRuby () {
    while (this.current_ruby < this.rubies.length && this.rubies[this.current_ruby].isCompleted()) {
      this.current_ruby++
    }
    if (this.current_ruby === this.rubies.length) {
      this.completed = true
    }
  }

  isCompleted () {
    return this.completed
  }

  getRemainingText () {
    let typing = ''

    for (let i = this.current_ruby; i < this.rubies.length; i++) {
      typing += this.rubies[i].getRemainingText()
    }

    return typing.toUpperCase()
  }

  getCharacterCount () {
    let count = 0
    for (const ruby of this.rubies) {
      count += ruby.getCharacterCount()
    }
    return count
  }

  getLeftoverCharCount () {
    let count = 0
    for (const ruby of this.rubies) {
      count += ruby.getLeftoverCharCount()
    }
    return count
  }

  hasReading () {
    for (const ruby of this.rubies) {
      if (ruby.show_reading) {
        return true
      }
    }
    return false
  }

  accept (character) {
    if (this.isCompleted()) {
      return -1
    }
    const accept = this.rubies[this.current_ruby].accept(character)
    this.advanceRuby()
    return accept
  }

  makeActive () {
    this.active = true
    for (const ruby of this.rubies) {
      ruby.makeActive()
    }
  }
}
