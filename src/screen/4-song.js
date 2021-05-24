import Screen from '../graphics/screen.js'
import { Box, Group, ProgressBar, Txt } from '../graphics/elements.js'
import { Black, BtnBorder, Gray2, NumberFont, SongFont, UIColor, UIFont, White } from './0-common.js'
import { CENTER, RIGHT } from '../graphics/styles.js'

export default class SongScreen extends Screen {
  constructor (viewport) {
    super(viewport, 0, 0, 1920, 1080)
    this.create(100, [
      // Top Right Infobar
      Box(1670, 0, 250, 60).fill(UIColor).layer(121),
      Txt(1686, 18, 45, 24).layer(122).radius(5).text('Esc').fill(Black).stroke(BtnBorder).align(CENTER).font(UIFont.size(18)).color(White),
      Txt(1739, 15, 166, 30).layer(122).color(White).text('Abandon Game').font(UIFont.size(24)),

      // Top Score Bar
      Txt(340, 756, 87, 40).text('Score').color(White).font(UIFont.size(30)),
      Txt(880, 756, 160, 40).text('Max Combo').color(White).font(UIFont.size(30)),
      Txt(1244, 756, 156, 40).text('Completed').color(White).font(UIFont.size(30)),
      Txt(1603, 756, 117, 40).text('Skipped').color(White).font(UIFont.size(30)),

      this.ui_score = Txt(460, 753, 340, 40).color(White).font(NumberFont.size(40)).align(RIGHT),
      this.ui_max_combo = Txt(1080, 754, 100, 40).color(White).font(NumberFont.size(40)),
      this.ui_completed = Txt(1440, 754, 100, 40).color(White).font(NumberFont.size(40)),
      this.ui_skipped = Txt(1760, 754, 100, 40).color(White).font(NumberFont.size(40)),

      // Bottom Score Bar
      Txt(325, 1039, 175, 24).text('Typing Speed').color(White).font(UIFont.size(24)).align(RIGHT),
      Txt(640, 1039, 120, 24).text('/min').color(White).font(UIFont.size(24)),
      Txt(675, 1039, 175, 24).text('Correct').color(White).font(UIFont.size(24)).align(RIGHT),
      Txt(975, 1039, 175, 24).text('Missed').color(White).font(UIFont.size(24)).align(RIGHT),
      Txt(1275, 1039, 175, 24).text('Accuracy').color(White).font(UIFont.size(24)).align(RIGHT),
      Txt(1650, 1039, 100, 24).text('Class').color(White).font(UIFont.size(24)).align(RIGHT),

      this.ui_typing_speed = Txt(540, 1025, 100, 40).color(White).font(NumberFont.size(40)),
      this.ui_correct = Txt(890, 1025, 100, 40).color(White).font(NumberFont.size(40)),
      this.ui_missed = Txt(1190, 1025, 100, 40).color(White).font(NumberFont.size(40)),
      this.ui_accuracy = Txt(1490, 1025, 100, 40).color(White).font(NumberFont.size(40)),
      this.ui_class = Txt(1790, 1025, 100, 40).color(White).font(NumberFont.size(40)),

      // Duration & Progress
      Txt(250, 678, 80, 30).text('Total').color(White).font(UIFont.size(24)).align(RIGHT),
      Txt(250, 718, 80, 30).text('Line').color(White).font(UIFont.size(24)).align(RIGHT),
      this.ui_progress_all = ProgressBar(340, 690, 1510, 10).fill(Gray2).completed(White),
      this.ui_progress_int = ProgressBar(340, 730, 1510, 10).fill(Gray2).completed(White),

      this.ui_time = Txt(1580, 630, 270, 45).color(White).font(NumberFont.size(45)).align(RIGHT),

      // Typing
      this.ui_typing_next = Txt(60, 880, 140, 110).color(White).font(SongFont.size(110)).align(CENTER),
      this.ui_typing_line = Txt(200, 930, 1720, 60).color(White).font(SongFont.size(60)),
      this.ui_ruby = Group(270, 820, 1920 - 270, 80),

      // Combo
      this.ui_combo_label = Txt(125, 767, 85, 20).text('Combo').color(White).font(UIFont.size(24)).align(RIGHT),
      this.ui_combo = Txt(30, 750, 95, 40).color(White).font(NumberFont.size(40)).align(RIGHT),

      // Game mode banner
      this.game_mode_banner = Txt(0, 0, 1920, 45).font(UIFont.size(30)).align(CENTER).color(White)
    ])
  }

  setTypingText (text, blind_mode = false) {
    this.ui_typing_next.text(text.substr(0, 1))
    if (!blind_mode) {
      this.ui_typing_line.text(text.substr(1))
    }
  }

  setTypingRuby (element) {
    // Clear existing ruby
    this.clearTypingRuby()

    // Append current ruby
    if (element)
      this.ui_ruby.el.appendChild(element)
  }

  clearTypingRuby() {
    while (this.ui_ruby.el.firstChild) {
      this.ui_ruby.el.removeChild(this.ui_ruby.el.lastChild)
    }
  }

  updateGameMode(mode) {
    switch (mode) {
      case 'normal':
        this.game_mode_banner.text('')
        break
      case 'easy':
        this.game_mode_banner.text('-- EASY MODE --')
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
