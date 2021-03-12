export default class Observable {
  _observe (callback) {
    if (!this.__callbacks) {
      this.__callbacks = []
    }
    this.__callbacks.push(callback)
  }

  _notify (event) {
    if (this.__callbacks)
      for (const fn of this.__callbacks) {
        fn(event)
      }
  }
}
