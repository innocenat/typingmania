export default class ResultController {
  constructor (game) {
    this.game = game
  }

  async run () {
    this.game.background_screen.showResultUI(true)
    this.game.result_screen.show()

    if (this.game.game_mode === 'normal') {
      // Only save high score if in normal mode
      this.game.songs.current_song.saveHighScore(this.game.score.getClass(), this.game.score.score)
    }
    this.game.score.setToResultScreen(this.game.result_screen)
    this.game.result_screen.card_value[0].text(this.game.songs.current_song.title)

    await this.game.input.waitForAnyKey()

    this.game.reset()
    this.game.background_screen.showResultUI(false)
    this.game.result_screen.hide()
    return this.game.menu_controller
  }
}
