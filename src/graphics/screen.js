import { Group } from './elements.js'

export default class Screen {
  constructor (viewport, x, y, width, height) {
    this._viewport = viewport
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  create (layer, children) {
    this.layer = Group(this.x, this.y, this.width, this.height, children).layer(layer).hide()
    this._viewport.el.appendChild(this.layer.el)
  }

  show () {
    this.layer.show()
  }

  hide () {
    this.layer.hide()
  }
}
