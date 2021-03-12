import { applyReset } from './graphicsutil.js'

class ElementBase {
  constructor (x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  _initEl (tag, children) {
    this.el = this._createElement(tag)
    this.el.style.display = 'block'
    this.el.style.position = 'absolute'
    this.el.style.top = `${this.y}px`
    this.el.style.left = `${this.x}px`
    this.el.style.width = `${this.width}px`
    this.el.style.height = `${this.height}px`

    for (const c of children) {
      this.el.appendChild(c.el)
    }
  }

  _createElement (tag) {
    const el = document.createElement(tag)
    applyReset(el)
    return el
  }

  hide () {
    this.el.style.display = 'none'
    return this
  }

  show () {
    this.el.style.display = 'block'
    return this
  }

  layer (x) {
    this.el.style.zIndex = x
    return this
  }
}

class GroupElem extends ElementBase {
  constructor (x, y, width, height, children) {
    super(x, y, width, height)
    this._initEl('div', children)
  }
}

class BoxElem extends ElementBase {
  constructor (x, y, width, height, children) {
    super(x, y, width, height)
    this._initEl('div', children)
  }

  fill (style) {
    style._setTo(this.el)
    return this
  }

  stroke (style) {
    style._setTo(this.el)
    return this
  }

  radius (radius) {
    this.el.style.borderRadius = `${radius}px`
    return this
  }
}

class TextElem extends BoxElem {
  constructor (x, y, width, height) {
    super(x, y, width, height, [])
    this.el.style.lineHeight = `${height}px`
  }

  text (txt) {
    this.el.innerText = txt
    return this
  }

  align (align) {
    this.el.style.textAlign = align
    return this
  }

  font (font) {
    font._setTo(this.el)
    return this
  }

  color (style) {
    style._setToText(this.el)
    return this
  }

  strokeText (style) {
    style._setToText(this.el)
    return this
  }

  wrap () {
    this.el.style.whiteSpace = 'normal'
    return this
  }

  noOverflow () {
    this.el.style.overflow = 'hidden'
    return this
  }
}

class ImageElem extends ElementBase {
  constructor (x, y, width, height) {
    super(x, y, width, height)
    this._initEl('img', [])
  }

  url (url) {
    this.el.src = url
    return this
  }

  fit (fit) {
    this.el.style.objectFit = fit
    return this
  }

  show () {
    this.el.style.opacity = '1'
    return this
  }

  hide () {
    this.el.style.opacity = '0'
    return this
  }

  fade (duration) {
    this.el.style.transition = `opacity ${duration} ease`
    return this
  }
}

class ProgressBarSubElem extends BoxElem {
  constructor (x, y, width, height) {
    super(x, y, width, height, [])

    this.el2 = this._createElement('div')
    this.el2.style.display = 'block'
    this.el2.style.position = 'absolute'
    this.el2.style.top = `0px`
    this.el2.style.left = `0px`
    this.el2.style.width = `${this.width}px`
    this.el2.style.height = `${this.height}px`
    this.el2.style.transform = 'scale(0, 1)'
    this.el2.style.transformOrigin = 'top left'

    this.el.appendChild(this.el2)
  }

  completed (style) {
    style._setTo(this.el2)
    return this
  }

  progress (progress) {
    this.el2.style.transform = `scale(${progress}, 1)`
    return this
  }
}

class ProgressBarElem extends GroupElem {
  constructor (x, y, width, height) {
    super(x, y, width, height, [])
    this.chapter([1])
  }

  chapter (chapter) {
    // Clear child
    while (this.el.firstChild) {
      this.el.removeChild(this.el.lastChild)
    }

    const GAP = 3
    this._chapter = chapter
    this.elems = []
    let last_chapter = 0, position = -GAP
    for (const c of chapter) {
      const x = position + GAP
      const width = c === 1 ? this.width - x : Math.round(this.width * (c - last_chapter) - GAP)
      position += width + GAP

      const p = new ProgressBarSubElem(x, 0, width, this.height)
      if (this._fill)
        p.fill(this._fill)
      if (this._completed)
        p.completed(this._completed)
      this.elems.push(p)
      this.el.appendChild(p.el)
      last_chapter = c
    }

    this._updateProgress(this._progress)
  }

  fill (style) {
    this._fill = style
    for (const el of this.elems) {
      el.fill(style)
    }
    return this
  }

  completed (style) {
    this._completed = style
    for (const el of this.elems) {
      el.completed(style)
    }
    return this
  }

  _updateProgress (progress) {
    let progress_set = false
    for (let i = 0; i < this._chapter.length; i++) {
      if (progress >= this._chapter[i]) {
        this.elems[i].progress(1)
      } else if (!progress_set) {
        progress_set = true
        const last_chapter = i > 0 ? this._chapter[i - 1] : 0
        const sub_progress = (progress - last_chapter) / (this._chapter[i] - last_chapter)
        this.elems[i].progress(sub_progress)
      } else {
        this.elems[i].progress(0)
      }
    }
  }

  progress (progress) {
    this._progress = progress
    this._updateProgress(progress)
    return this
  }
}

export function Group (x, y, width, height, children = []) {
  return new GroupElem(x, y, width, height, children)
}

export function Txt (x, y, width, height) {
  return new TextElem(x, y, width, height)
}

export function Box (x, y, width, height, children = []) {
  return new BoxElem(x, y, width, height, children)
}

export function Img (x, y, width, height) {
  return new ImageElem(x, y, width, height)
}

export function ProgressBar (x, y, width, height) {
  return new ProgressBarElem(x, y, width, height)
}
