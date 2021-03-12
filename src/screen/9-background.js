import Screen from '../graphics/screen.js'
import { Box, Group, Img, Txt } from '../graphics/elements.js'
import { Black, BtnBorder, Gray, UIColor, UIFont, White } from './0-common.js'
import { CENTER } from '../graphics/styles.js'

export default class BackgroundScreen extends Screen {
  constructor (viewport, typingmania_version) {
    super(viewport, 0, 0, 1920, 1080)
    this.create(1, [
      this.game_background = Img(0, 0, 1920, 1080).layer(1).hide(),
      this.song_bg_container = Group(0, 0, 1920, 1080).layer(2),
      this.song_background = Img(0, 0, 1920, 1080).layer(3).fit('cover').hide(),
      this.menu_ui = Img(0, 0, 1920, 1080).layer(4).hide(),
      this.song_ui = Img(0, 0, 1920, 1080).layer(5).hide(),
      this.result_ui = Img(0, 0, 1920, 1080).layer(6).hide(),
      Txt(30, 1025, 200, 22).text('TypingMania').color(Gray).font(UIFont.size(18)).layer(9),
      Txt(30, 1025 + 22, 200, 22).text(typingmania_version).color(Gray).font(UIFont.size(18)).layer(9),

      // Volume bar
      this.volume_bar = Group(0, 0, 1920, 1080, [
        Box(0, 0, 330, 60).layer(1).fill(UIColor),
        Txt(113, 18, 78, 24).layer(2).radius(5).text('PgDown').fill(Black).stroke(BtnBorder).align(CENTER).font(UIFont.size(18)).color(White),
        Txt(262, 18, 53, 24).layer(2).radius(5).text('PgUp').fill(Black).stroke(BtnBorder).align(CENTER).font(UIFont.size(18)).color(White),
        Txt(15, 15, 83, 30).layer(2).text('Volume').font(UIFont.size(24)).color(White).layer(2),
        this.volume_label = Txt(199, 15, 56, 30).font(UIFont.size(24)).align('center').color(White).layer(2),
      ]).layer(10).hide(),
    ])
  }

  loadAssets (packed_file) {
    this.game_background.url(packed_file.getFileAsURL('ui/background.png'))
    this.menu_ui.url(packed_file.getFileAsURL('ui/menu-ui.svg'))
    this.song_ui.url(packed_file.getFileAsURL('ui/song-ui.svg'))
    this.result_ui.url(packed_file.getFileAsURL('ui/result-ui.svg'))

    this.game_background.show()
  }

  showSongBackground (url = false) {
    if (url)
      this.song_background.url(url)
    this.song_background.fade('0.5s')
    this.song_background.show()
  }

  hideSongBackground () {
    this.song_background.fade('0.5s')
    this.song_background.hide()
  }

  showMenuUI (show) {
    if (show) {
      this.menu_ui.show()
    } else {
      this.menu_ui.hide()
    }
  }

  showSongUI (show) {
    if (show) {
      this.song_ui.show()
    } else {
      this.song_ui.hide()
    }
  }

  showResultUI (show) {
    if (show) {
      this.result_ui.show()
    } else {
      this.result_ui.hide()
    }
  }

  getSongBackgroundContainer () {
    return this.song_bg_container.el
  }
}
