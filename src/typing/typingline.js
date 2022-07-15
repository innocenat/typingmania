import TypingRuby from './typingruby.js'

const TOK_SPECI = 0, TOK_CHAR = 1, TOK_NO_READING = 2

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

  _preTokenize () {
    let pretokens = []
    let last_token = ''
    let in_bracket = false
    let has_reading = true
    let escaped = false
    for (let pos = 0; pos < this.line.length; pos++) {
      const c = this.line.charAt(pos)
      if (!escaped && c === '\\') {
        escaped = true
      } else if (!escaped && c === '<' && pos + 1 < this.line.length && this.line.charAt(pos + 1) === '<') {
        if (last_token !== '') {
          pretokens.push([has_reading ? TOK_CHAR : TOK_NO_READING, last_token])
          last_token = ''
        }
        pretokens.push([TOK_SPECI, '<<'])
        in_bracket = true
        pos++
      } else if (!escaped && c === '>' && pos + 1 < this.line.length && this.line.charAt(pos + 1) === '>') {
        if (last_token !== '') {
          pretokens.push([has_reading ? TOK_CHAR : TOK_NO_READING, last_token])
          last_token = ''
        }
        pretokens.push([TOK_SPECI, '>>'])
        in_bracket = false
        pos++
      } else if (!escaped && c === '[') {
        if (last_token !== '') {
          pretokens.push([has_reading ? TOK_CHAR : TOK_NO_READING, last_token])
          last_token = ''
        }
        pretokens.push([TOK_SPECI, '['])
        in_bracket = true
      } else if (!escaped && c === '<') {
        if (last_token !== '') {
          pretokens.push([has_reading ? TOK_CHAR : TOK_NO_READING, last_token])
          last_token = ''
        }
        pretokens.push([TOK_SPECI, '<<'])
        in_bracket = true
      } else if (!escaped && c === '>') {
        if (last_token !== '') {
          pretokens.push([has_reading ? TOK_CHAR : TOK_NO_READING, last_token])
          last_token = ''
        }
        pretokens.push([TOK_SPECI, '>>'])
        in_bracket = false
      } else if (!escaped && c === '[') {
        if (last_token !== '') {
          pretokens.push([has_reading ? TOK_CHAR : TOK_NO_READING, last_token])
          last_token = ''
        }
        pretokens.push([TOK_SPECI, '['])
        in_bracket = true
      } else if (!escaped && c === ']') {
        if (last_token !== '') {
          pretokens.push([has_reading ? TOK_CHAR : TOK_NO_READING, last_token])
          last_token = ''
        }
        pretokens.push([TOK_SPECI, ']'])
        in_bracket = false
      } else if (in_bracket) {
        last_token += c
        has_reading = true
        escaped = false
      } else if (this._romanizer.isReadingAvailable(c)) {
        if (last_token !== '' && !has_reading) {
          pretokens.push([TOK_NO_READING, last_token])
          last_token = ''
        }
        last_token += c
        has_reading = true
        escaped = false
      } else {
        if (last_token !== '' && has_reading) {
          pretokens.push([TOK_CHAR, last_token])
          last_token = ''
        }
        last_token += c
        has_reading = false
        escaped = false
      }
    }

    if (last_token !== '') {
      pretokens
        .push([has_reading ? TOK_CHAR : TOK_NO_READING, last_token])
    }

    return pretokens
  }

  _splitReadingBlock (base, reading) {
    const readings = reading.split('|')
    const blocks = []
    if (readings.length > 1 && readings.length === base.length) {
      for (let i = 0; i < base.length; i++) {
        blocks.push([base[i], readings[i], true])
      }
    } else {
      blocks.push([base, readings.join(''), true])
    }
    return blocks
  }

  tokenize () {
    const pretokens = this._preTokenize()

    for (let t = 0; t < pretokens.length; t++) {
      switch (pretokens[t][0]) {
        case TOK_SPECI:
          switch (pretokens[t][1]) {
            case '<<':
              // Special reading with for readable base
              if (t + 5 < pretokens.length && pretokens[t + 1][0] === TOK_CHAR && pretokens[t + 2][1] === '>>' && pretokens[t + 3][1] === '[' && pretokens[t + 4][0] === TOK_CHAR && pretokens[t + 5][1] === ']') {
                // Must be in << base >> [ reading ]
                this.tokens.push(...this._splitReadingBlock(pretokens[t + 1][1], pretokens[t + 4][1]))
                t += 5
                break
              } else if (t + 4 < pretokens.length && pretokens[t + 1][0] === TOK_CHAR && pretokens[t + 2][1] === '>>' && pretokens[t + 3][1] === '[' && pretokens[t + 4][1] === ']') {
                // Or << base >> [ ] to remove some text from typing
                this.tokens.push([pretokens[t + 1][1], '', false])
                t += 4
                break
              } else {
                throw new Error('Invalid << >> pattern, must be <<base>>[reading?] (line:' + this.line + ')')
              }
          }
          break
        case TOK_NO_READING:
          // Next token must be [ reading ]
          if (t + 3 >= pretokens.length || pretokens[t + 1][1] !== '[' || pretokens[t + 2][0] !== TOK_CHAR || pretokens[t + 3][1] !== ']') {
            throw new Error('No reading available for: ' + pretokens[t][1] + ' (line: ' + this.line + ')')
          }

          this.tokens.push(...this._splitReadingBlock(pretokens[t][1], pretokens[t + 2][1]))
          t += 3
          break
        case TOK_CHAR:
          const tokens = this._romanizer.splitReading(pretokens[t][1])[1]
          for (const token of tokens) {
            this.tokens.push([token, token, false])
          }
          break
      }
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
