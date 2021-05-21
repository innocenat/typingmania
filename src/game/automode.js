export default class AutoMode {
  constructor(typing, typer, interval) {
    this.stop_signal = new Promise((resolve) => {
      this.signal_stop = resolve
    })

    this.typing = typing
    this.typer = typer
    this.interval = Math.floor(interval * 1000)
  }

  _timeoutPromise() {
    return new Promise((resolve) => {
      setTimeout(resolve, this.interval)
    })
  }

  async run() {
    while (true) {
      const timeout = await Promise.any([this._timeoutPromise(), this.stop_signal])

      if (timeout === 'STOP')
        break

      const current_line = this.typing.getCurrentLine()
      if (current_line && current_line.getRemainingText().length > 0 && !this.typer.auto_paused) {
        this.typer.type(current_line.getRemainingText().substr(0, 1).replace('_', ' '))
      }
    }
  }

  stop() {
    this.signal_stop('STOP')
  }
}
