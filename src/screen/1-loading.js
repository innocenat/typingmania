import Screen from '../graphics/screen.js'
import { Txt } from '../graphics/elements.js'
import { UIFont, White } from './0-common.js'
import { CENTER } from '../graphics/styles.js'

export default class LoadingScreen extends Screen {
  constructor (viewport) {
    super(viewport, 0, 0, 1920, 1080)
    this.create(100, [
      this.main_text = Txt(0, 420, 1920, 120).color(White).font(UIFont.size(96)).align(CENTER),
      this.sub_text = Txt(0, 580, 1920, 60).color(White).font(UIFont.size(48)).align(CENTER),
    ])
  }

  setMainText (txt) {
    this.main_text.text(txt)
  }

  setSubText (txt) {
    this.sub_text.text(txt)
  }
}
