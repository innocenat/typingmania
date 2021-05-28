import Screen from '../graphics/screen.js'
import { Box, Group, Txt } from '../graphics/elements.js'
import {
  BadgeAudio,
  BadgeVideo,
  BadgeYouTube,
  Black,
  BtnBorder,
  Gray,
  SongFont,
  UIColor,
  UIFont,
  White,
} from './0-common.js'
import SongCollection from '../song/songcollection.js'
import { CENTER } from '../graphics/styles.js'

export default class MenuScreen extends Screen {
  constructor (viewport) {
    super(viewport, 0, 0, 1920, 1080)
    this.create(100, [
      // Top Right Infobar
      Box(1425, 0, 1920 - 1420, 60).fill(UIColor).layer(121),
      Txt(1440, 18, 68, 24).layer(122).radius(5).text('Space').fill(Black).stroke(BtnBorder).align(CENTER).font(UIFont.size(18)).color(White),
      Txt(1520, 15, 100, 30).layer(122).color(White).text('Select').font(UIFont.size(24)),
      Txt(1628, 18, 107, 24).layer(122).radius(5).text('Backspace').fill(Black).stroke(BtnBorder).align(CENTER).font(UIFont.size(18)).color(White),
      Txt(1746, 15, 159, 30).layer(122).color(White).text('Go To Parent').font(UIFont.size(24)),

      // Empty view text
      this.empty_text = Txt(1250, 510, 620, 60).layer(200).color(White).text('Empty').font(UIFont.size(48)),

      // Song List Container
      this.songs_list_container = Box(1300, 0, 620, 1080).layer(110),

      // Game mode banner
      this.game_mode_banner = Txt(350, 0, 1500, 60).font(UIFont.size(30)).color(White)
    ])

    this.empty = true

    // List move animation
    this.songs_list_container.el.style.transition = 'transform 0.2s ease'
    this.song_list_item = []
    this.current_position = 0
  }

  setSongList (collection) {
    // Clear all child
    while (this.songs_list_container.el.firstChild) {
      this.songs_list_container.el.removeChild(this.songs_list_container.el.lastChild)
    }
    this.song_list_item = []

    // If the collection is empty
    if (collection.children.length === 0) {
      this.empty_text.show()
      this.empty = true
      return
    }

    this.empty_text.hide()
    this.empty = false

    let position = 0
    for (const c of collection.children) {
      let group
      if (c instanceof SongCollection) {
        group = Group(0, position * 100, 620, 100, [
          Txt(0, 24, 720, 36).text(c.name).font(SongFont.size(36)).color(White),
          Txt(0, 0, 720, 18).text('Collection').font(SongFont.size(22)).color(White),
          Txt(-40, 28, 30, 30).fill(Gray).radius(5),
        ])
      } else {
        const color = c.media_type === 'youtube' ? BadgeYouTube : c.media_type === 'video' ? BadgeVideo : BadgeAudio
        group = Group(0, position * 100, 620, 100, [
          Txt(0, 24, 720, 36).text(c.title).font(SongFont.size(36)).color(White),
          Txt(0, 0, 720, 18).text(c.artist).font(SongFont.size(22)).color(White),
          Txt(-40, 28, 30, 30).text(c.language.toUpperCase()).font(UIFont.size(18)).align(CENTER).color(White).fill(color).radius(5),
        ])
      }

      group.el.style.transition = 'transform 0.2s ease'
      this.songs_list_container.el.appendChild(group.el)
      this.song_list_item.push(group)

      position++
    }

    this.current_position = 0
  }

  setSongListPosition (position) {
    if (this.empty) {
      return
    }

    this.songs_list_container.el.style.transform = `translate(0, ${-position * 100 + 500}px)`

    this.song_list_item[this.current_position].el.style.transform = ''
    this.song_list_item[position].el.style.transform = 'translate(-50px, 0)'

    this.current_position = position
  }

  updateGameMode(mode) {
    switch (mode) {
      case 'normal':
        this.game_mode_banner.text('')
        break
      case 'easy':
        this.game_mode_banner.text('EASY mode. F9 to cycle.')
        break
      case 'tempo':
        this.game_mode_banner.text('TEMPO mode. F9 to cycle.')
        break
      case 'auto':
        this.game_mode_banner.text('AUTO mode. F9 to cycle.')
        break
      case 'blind':
        this.game_mode_banner.text('BLIND mode. F9 to cycle.')
        break
      case 'blank':
        this.game_mode_banner.text('BLANK mode. F9 to cycle.')
        break
    }
  }
}
