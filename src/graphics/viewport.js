import { applyReset } from './graphicsutil.js'

// Handle auto-resize of game DOM element
// Previous version of TypingMania in 2013 use complicated
// calculation of DOM sizing and position.
// Now we just use `transform: scale` on the parent element.
export default class Viewport {
  constructor (width, height) {
    this.width = width
    this.height = height

    this.initializeDom()
    window.addEventListener('resize', this.autoResize.bind(this))
  }

  initializeDom () {
    // Apply body style
    const body = document.body
    applyReset(body)
    body.style.backgroundColor = 'black'
    body.style.overflow = 'hidden'

    // Create container element
    this.el = document.createElement('div')
    applyReset(this.el)
    this.el.style.position = 'absolute'
    this.el.style.overflow = 'hidden'
    this.el.style.width = `${this.width}px`
    this.el.style.height = `${this.height}px`
    this.autoResize()

    body.appendChild(this.el)
  }

  autoResize () {
    const w = window.innerWidth
    const h = window.innerHeight
    const ratio_w = w / this.width
    const ratio_h = h / this.height
    const ratio = Math.min(ratio_w, ratio_h)
    const actual_width = 1920 * ratio
    const actual_height = 1080 * ratio
    this.el.style.transformOrigin = 'top left'
    this.el.style.transform = `scale(${ratio})`
    this.el.style.left = `${Math.round((w - actual_width) / 2)}px`
    this.el.style.top = `${Math.round((h - actual_height) / 2)}px`
  }
}
