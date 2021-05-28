import Screen from '../graphics/screen.js'
import { Box, Txt } from '../graphics/elements.js'
import { Black, BtnBorder, NumberFont, SongFont, UIColor, UIFont, White } from './0-common.js'
import { CENTER, RIGHT } from '../graphics/styles.js'

export default class ResultScreen extends Screen {
  constructor (viewport) {
    super(viewport, 0, 0, 1920, 1080)

    // Build UI Components
    const score_label = []
    const score_value = []
    let pos = 0
    for (const k of [
      'Song name', 'Class', 'Score', 'Max Combo',
      'Correct', 'Missed', 'Completed Line', 'Skipped Line',
      'Skipped Char', 'Typing Speed', 'Accuracy', 'Typing Accuracy',
    ]) {
      score_label.push(Txt(1260, 450 + pos * 45, 190, 45).align(RIGHT).color(Black).font(UIFont.size(20)).text(k))
      score_value.push(Txt(1470, 450 + pos * 45, 330, 45).color(Black).font(SongFont.size(25)))
      pos++
    }

    this.create(100, [
      // Top Right Infobar
      Box(1629, 0, 291, 60).fill(UIColor).layer(121),
      Txt(1644, 18, 83, 24).layer(122).radius(5).text('Any Key').fill(Black).stroke(BtnBorder).align(CENTER).font(UIFont.size(18)).color(White),
      Txt(1742, 15, 1633, 30).layer(122).color(White).text('Back to menu').font(UIFont.size(24)),

      Txt(55, 410, 135, 60).text('Class').color(White).align(RIGHT).font(UIFont.size(48)),
      Txt(45, 510, 145, 60).text('Score').color(White).align(RIGHT).font(UIFont.size(48)),
      this.score_class = Txt(220, 374, 800, 96).color(White).font(NumberFont.size(96)),
      this.score_value = Txt(220, 498, 800, 72).color(White).font(NumberFont.size(72)),

      Txt(1230, 375, 600, 75).align(CENTER).color(Black).font(NumberFont.size(36)).text('Score Card'),
      ...score_label,
      ...score_value,

      // Game mode banner
      this.game_mode_banner = Txt(0, 0, 1920, 45).font(UIFont.size(30)).align(CENTER).color(White)
    ])

    this.card_value = score_value
  }

  updateGameMode(mode) {
    switch (mode) {
      case 'normal':
        this.game_mode_banner.text('')
        break
      case 'easy':
        this.game_mode_banner.text('-- EASY MODE --')
        break
      case 'tempo':
        this.game_mode_banner.text('-- TEMPO MODE --')
        break
      case 'auto':
        this.game_mode_banner.text('-- AUTO MODE --')
        break
      case 'blind':
        this.game_mode_banner.text('-- BLIND MODE --')
        break
      case 'blank':
        this.game_mode_banner.text('-- BLANK MODE --')
        break
    }
  }
}
