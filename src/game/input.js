// This helper class just map the key event to promise
// to allow easier flow control
export default class InputHandler {
  constructor () {
    window.addEventListener('keydown', this._keyDown.bind(this))
    this.pending_promises = []
  }

  _keyDown (e) {
    const new_pending = []
    for (const handler of this.pending_promises) {
      if (!handler(e)) {
        new_pending.push(handler)
      }
    }
    this.pending_promises = new_pending

    if (e.key.toLowerCase() === 'r' && (e.metaKey || e.ctrlKey)) {
      // Allow page refresh
    } else if (e.key.toLowerCase() === 'f12') {
      // Allow easy operation of devtool
    } else {
      e.preventDefault()
      e.cancelBubble = true
    }

    return false
  }

  // The direct handler is required for initializing sound
  // due to browser autoplay policy
  waitForAnyKey (handler = () => {
  }) {
    return new Promise((resolve, _) => {
      this.pending_promises.push((e) => {
        handler(e)
        resolve(e)
        return true
      })
    })
  }
}
