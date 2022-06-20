import Screen from '../graphics/screen.js'
import { Box, Group, ProgressBar, Txt } from '../graphics/elements.js'
import { Black, BtnBorder, Gray2, NumberFont, SongFont, UIColor, UIFont, White } from './0-common.js'
import { CENTER, RIGHT } from '../graphics/styles.js'

const VIS_BOXES = 32
const VIS_ALL = 2048

function a (f) {
  const f2 = f * f
  return 1.2588966 * 148840000 * f2 * f2 /
    ((f2 + 424.36) * Math.sqrt((f2 + 11599.29) * (f2 + 544496.41)) * (f2 + 148840000))
}

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
      this.game_mode_banner = Txt(0, 0, 1920, 45).font(UIFont.size(30)).align(CENTER).color(White),

      // Visualization box
      this.vis_box = Group(250, 810, 1920 - 250, 100).layer(-1),
    ])

    this.vis_box.el.style.display = 'grid'
    this.vis_box.el.style.gridTemplateColumns = `repeat(${VIS_BOXES}, 1fr)`
    this.vis_box.el.style.gridTemplateRows = '100px'
    this.vis_box.el.style.opacity = '0.5'
    this.vis_box.el.style.filter = 'blur(5px)'
    this.vis_box.el.style.contain = 'strict style'

    this.vis_boxes = []
    this.vis_factor = []

    const MAX_FREQ = Math.log2(24000) // Assume 48kHz
    const FREQ_STEP = MAX_FREQ / VIS_BOXES

    for (let i = 0; i < VIS_BOXES; i++) {
      const el = document.createElement('div')
      el.style.height = '100px'
      el.style.background = '#ccc'
      this.vis_boxes.push(el)
      this.vis_box.el.appendChild(el)

      // Make visualisation matrix
      const f_min = i * FREQ_STEP
      const f_max = (i+1) * FREQ_STEP
      const fft_min = VIS_ALL * Math.pow(2, f_min) / 24000
      const fft_max = VIS_ALL * Math.pow(2, f_max) / 24000
      const fft_min_rounded = Math.floor(0.5 + fft_min)
      const fft_max_rounded = Math.floor(0.5 + fft_max)
      const current_factor = new Array(VIS_ALL).fill(0)
      for (let j = fft_min_rounded; j <= fft_max_rounded; j++) {
        current_factor[j] = a(24000 * (j + 0.5) / VIS_ALL) / (fft_max - fft_min)
      }
      this.vis_factor.push(current_factor)
    }
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

  clearTypingRuby () {
    while (this.ui_ruby.el.firstChild) {
      this.ui_ruby.el.removeChild(this.ui_ruby.el.lastChild)
    }
  }

  updateGameMode (mode) {
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

  showVisualization (bins) {
    const vis_value = []
    for (let i = 0; i < VIS_BOXES; i++) {
      let val = 0
      for (let j = 0; j < VIS_ALL; j++) {
        val += bins[j] * this.vis_factor[i][j]
      }
      vis_value.push(val)
    }
    for (let i = 0; i < VIS_BOXES; i++) {
      const el = this.vis_boxes[i]
      el.style.opacity = `${Math.max(0, Math.min(vis_value[i] / 256, 1))}`
    }
  }
}
