export default class VolumeController {
  constructor (game) {
    this.game = game

    // Actually start volume controller thread
    this.run()
  }

  // Volume control thread (or loop, or whatever it is called)
  async run () {
    let keyEvent = null
    this.game.background_screen.volume_label.text(`${this.game.sound.sound_value}%`)

    while (keyEvent = await this.game.input.waitForAnyKey()) {
      if (keyEvent.key === 'PageUp') {
        this.game.sound.setSoundValue(this.game.sound.sound_value + 2)
      } else if (keyEvent.key === 'PageDown') {
        this.game.sound.setSoundValue(this.game.sound.sound_value - 2)
      }
      this.game.background_screen.volume_label.text(`${this.game.sound.sound_value}%`)
    }
  }
}
