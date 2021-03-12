class FontStyle {
  constructor (family) {
    this._family = family
    this._size = 18
    this._line = false
    this._weight = 400
    this._italic = false
    this._spacing = 'normal'
  }

  size (size) {
    const s = this._clone()
    s._size = size
    return s
  }

  line (line) {
    const s = this._clone()
    s._line = line
    return s
  }

  weight (weight) {
    const s = this._clone()
    s._weight = weight
    return s
  }

  italic (italic) {
    const s = this._clone()
    s._italic = italic
    return s
  }

  spacing (spacing) {
    const s = this._clone()
    s._spacing = spacing
    return s
  }

  _setTo (el) {
    el.style.fontFamily = this._family
    el.style.fontSize = `${this._size}px`
    if (this._line) {
      // Otherwise it should be set by height of the elem automatically
      el.style.lineHeight = `${this._line}px`
    }
    el.style.fontWeight = `${this._weight}`
    el.style.fontStyle = this._italic ? 'italic' : 'normal'
    el.style.letterSpacing = this._spacing
  }

  _clone () {
    const c = new FontStyle(this._family)
    c._size = this._size
    c._line = this._line
    c._weight = this._weight
    c._italic = this._italic
    c._spacing = this._spacing
    return c
  }
}

class FillStyle {
  constructor (color) {
    this._color = color
    this._opacity = 1
  }

  opacity (opacity) {
    const s = this._clone()
    s._opacity = opacity
    return s
  }

  _setTo (el) {
    el.style.backgroundColor = this._color
    el.style.opacity = `${this._opacity}`
  }

  _setToText (el) {
    el.style.color = this._color
    el.style.opacity = `${this._opacity}`
  }

  _clone () {
    const c = new FillStyle(this._color)
    c._opacity = this._opacity
    return c
  }
}

class StrokeStyle {
  constructor (width, color) {
    this._width = width
    this._color = color
    this._style = 'solid'
  }

  style (style) {
    const s = this._clone()
    s._style = style
    return s
  }

  _setTo (el) {
    el.style.border = `${this._width}px ${this._style} ${this._color}`
  }

  _setToText (el) {
    el.style.webkitTextStroke = `${this._width}px ${this._color}`
  }

  _clone () {
    const c = new StrokeStyle(this._width, this._color)
    c._style = this._style
    return c
  }
}

export function Font (family) {
  return new FontStyle(family)
}

export function Fill (color) {
  return new FillStyle(color)
}

export function Stroke (width, color) {
  return new StrokeStyle(width, color)
}

export const LEFT = 'left', RIGHT = 'right', CENTER = 'center'
export const COVER = 'cover', CONTAIN = 'contain'
