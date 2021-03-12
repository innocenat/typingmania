export default class HTMLTypingChar {
  constructor (char, config) {
    this.char = char
    this.config = config
    this.el = document.createElement('span')
    this.el.style.color = char.active ? this.config.color : this.config.inactive_color
    this.el.textContent = char.base
    char._observe(this.onNotify.bind(this))
  }

  onNotify (event) {
    switch (event) {
      case 'in_progress':
        this.el.style.color = this.config.progress_color
        break
      case 'completed':
        this.el.style.color = this.config.completed_color
        break
      case 'inactive':
        this.el.style.color = this.config.inactive_color
        break
      case 'active':
        this.el.style.color = this.config.color
        break
    }
  }

  static make (char, config) {
    const c = new HTMLTypingChar(char, config)
    return c.el
  }
}
