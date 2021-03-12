export default class Romanizer {
  constructor (mapping_table = []) {
    this.table = []
    this.max_token_len = 0

    for (let p of mapping_table) {
      if (p[0] in this.table) {
        this.table[p[0]].push(p[1])
      } else {
        this.table[p[0]] = [p[1]]
      }
      this.max_token_len = Math.max(this.max_token_len, p[0].length)
    }

    // Special case for '|' to represent visual space
    this.table['|'] = ['', '|']
  }

  getTypableCharRegex () {
    return [/[\u0020-\u007B\u007D\u007E]/g, /[^\u0020-\u007B\u007D\u007E]/g]
  }

  isTypableChar (character) {
    return this.getTypableCharRegex()[0].test(character)
  }

  isReadingAvailable (character) {
    return this.isTypableChar(character) || character in this.table
  }

  splitReading (text) {
    let readings = []
    let tokens = []
    let pos = 0
    while (pos < text.length) {
      let token_len = this.max_token_len
      while (token_len > 0) {
        if (pos + token_len <= text.length) {
          let possible_token = text.substr(pos, token_len)

          if (this.table.hasOwnProperty(possible_token)) {
            readings.push([...this.table[possible_token]]) // NEED TO CLONE THIS
            tokens.push(possible_token)
            break
          } else if (token_len === 1 && this.isTypableChar(possible_token)) {
            readings.push([possible_token])
            tokens.push(possible_token)
            break
          }
        }
        token_len--
      }

      if (token_len === 0) {
        throw new Error('No reading found for character ' + text.charAt(pos))
      }

      pos += token_len
    }

    return [readings, tokens]
  }

  filterTyping (typing) {
    return typing.replace(this.getTypableCharRegex()[1], '')
  }
}
