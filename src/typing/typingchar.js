import Observable from '../lib/observable.js'

export default class TypingChar extends Observable {
  constructor (base, typings, previous = null) {
    super()
    this.base = base
    this.typings = typings

    this.completed = false
    this.is_blank = false

    this.previous = previous
    this.next = null
    if (previous !== null) {
      previous.next = this
    }

    this.active = false

    this.accepted_input = ''
    this.remaining_text = ''

    this.base_point = 0
    this.counted_point = 0
  }

  initialize () {
    for (let i = 0; i < this.typings.length; i++) {
      if (this.typings[i].length === 0) {
        this.completed = true
        this.is_blank = true
      }

      if (this.typings[i] === ':SMALL_TSU') {
        this.typings.splice(i, 1)
        if (this.next !== null) {
          for (const typing of this.next.typings) {
            if (typing.length > 0) {
              this.typings.splice(i, 0, typing.charAt(0))
              i++
            }
          }
        }
      }
      if (this.typings[i] === ':RUBY_REPEAT') {
        this.typings.splice(i, 1)
        if (this.previous !== null) {
          this.typings = this.previous.typings
          break
        }
      }
      if (this.typings[i] === ':RUBY_REPEAT_DAKUTEN') {
        this.typings.splice(i, 1)
        if (this.previous !== null) {
          // TODO actually make it dakuten
          this.typings = this.previous.typings
          break
        }
      }

      this.typings[i] = this.typings[i].toLowerCase()
    }

    this.base_point = this.typings[0].length
    this.calculateRemainingText()
  }

  isCompleted () {
    return this.completed
  }

  calculateRemainingText () {
    if (this.completed) {
      this.remaining_text = ''
    } else {
      // Search for shortest remaining representation
      // that has correct prefix as typed character
      this.remaining_text = this.typings[this.typings.length - 1]
      for (let c of this.typings) {
        if (this.accepted_input.length <= c.length && this.accepted_input === c.substring(0, this.accepted_input.length)) {
          const t = c.substring(this.accepted_input.length, c.length)
          if (t.length < this.remaining_text.length) {
            this.remaining_text = t
          }
        }
      }

      if (this.remaining_text === '') {
        this.completed = true
      }
    }
  }

  getRemainingText () {
    return this.remaining_text
  }

  canAccept (character) {
    const new_accepted_text = this.accepted_input + character
    for (let c of this.typings) {
      if (new_accepted_text.length <= c.length && new_accepted_text === c.substring(0, new_accepted_text.length)) {
        return true
      }
    }
    return false
  }

  canAcceptAs (character) {
    const new_accepted_text = character
    for (let c of this.typings) {
      if (new_accepted_text.length <= c.length && new_accepted_text === c.substring(0, new_accepted_text.length)) {
        return true
      }
    }
    return false
  }

  dispensePoint (required_point) {
    if (required_point > this.base_point - this.counted_point) {
      required_point = this.base_point - this.counted_point
    }
    this.counted_point += required_point
    return required_point
  }

  accept (character) {
    character = character.toLowerCase()
    let accept = -1

    if (this.canAccept(character)) {
      accept = this.dispensePoint(character.length)
      this.accepted_input += character
      this.calculateRemainingText()

    } else if (this.previous !== null) {
      const new_accepted_text = this.accepted_input + character

      // Try to split current input text to check if it can be accepted by previous input
      for (let i = 1; i <= new_accepted_text.length; i++) {
        const prev_accept = new_accepted_text.substring(0, i)
        const self_accept = new_accepted_text.substring(i)

        if (this.canAcceptAs(self_accept)) {
          accept = this.previous.accept(prev_accept)
          if (accept >= 0) {
            this.accepted_input = self_accept
            this.calculateRemainingText()
            break
          }
        }
      }
    }

    if (this.accepted_input.length >= 0) {
      this._notify(this.isCompleted() ? 'completed' : 'in_progress')
    }

    return accept
  }

  getCharacterCount () {
    // Char Count == Base Point
    return this.base_point
  }

  getLeftoverCharCount () {
    return this.base_point - this.counted_point
  }

  makeActive () {
    this.active = true
    this._notify('active')
  }
}
