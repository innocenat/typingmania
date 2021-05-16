import Screen from '../graphics/screen.js'
import { Group, Txt } from '../graphics/elements.js'
import {
  BadgeAudio,
  BadgeVideo,
  BadgeYouTube,
  Black,
  format_number_comma,
  format_number_fixed,
  format_time,
  NumberFont,
  SongFont,
  UIFont,
  White,
} from './0-common.js'
import SongCollection from '../song/songcollection.js'
import { CENTER } from '../graphics/styles.js'

export default class SongInfoScreen extends Screen {
  constructor (viewport) {
    super(viewport, 0, 0, 1920, 1080)
    this.create(20, [
      Group(0, 0, 1920, 1080, [
        this.song_path = Txt(70, 80, 1090, 30).font(SongFont.size(24)).color(White).noOverflow(),
        this.song_artist = Txt(35, 120, 1125, 48).font(SongFont.size(40)).color(White).noOverflow(),
        this.song_title = Txt(30, 180 - 18, 1130, 96).font(SongFont.size(72)).color(White).noOverflow(),
        this.song_subtitle = Txt(35, 267 - 10, 1125, 45).font(SongFont.size(30)).color(White).noOverflow(),

        // Language Badge
        this.song_language = Txt(30, 80, 30, 30).font(UIFont.size(18)).align(CENTER).color(White).fill(Black).radius(5),
      ]).layer(1),
      this.sub_info_group = Group(0, 0, 1920, 1080, [
        this.song_sub_group = Group(0, 0, 1920, 1080, [
          Txt(30, 600 - 260, 180, 36).text('High Score').font(UIFont.size(30)).color(White),
          Txt(30, 660 - 260, 130, 30).text('Length').font(UIFont.size(24)).color(White),
          Txt(30, 700 - 260, 130, 30).text('CPM/Max').font(UIFont.size(24)).color(White),
          this.song_highscore = Txt(230, 600 - 260, 250, 36).font(NumberFont.size(36)).color(White),
          this.song_duration = Txt(230, 660 - 260, 100, 30).font(NumberFont.size(24)).color(White),
          this.song_cpm = Txt(230, 700 - 260, 100, 30).font(NumberFont.size(24)).color(White),
        ]),
        this.collection_sub_group = Group(0, 0, 1920, 1080, [
          this.collection_description = Txt(30, 600 - 260, 1030, 1080 - 620 - 60).font(SongFont.size(24).line(36)).color(White).wrap(),
        ]),
      ]).layer(1),
    ])

    this.layer.el.style.transform = 'translate(0, 260px)'
    this.layer.el.style.transition = 'transform 0.5s ease'
  }

  updateSongPath (collection) {
    let paths = []
    while (collection.parent !== null) {
      paths.unshift(collection.name)
      collection = collection.parent
    }

    const path = paths.join(' / ')
    this.song_path.text(path)
  }

  updateSong (song) {
    if (!song) {
      // Empty collection
      this.song_artist.text('')
      this.song_title.text('Empty')
      this.song_subtitle.text('')
      this.collection_description.text('')
      this.song_language.hide()
      this.song_sub_group.hide()
      this.collection_sub_group.hide()
      this.song_path.hide()
    } else if (song instanceof SongCollection) {
      this.updateSongPath(song.parent)
      this.song_language.hide()
      this.song_artist.text('')
      this.song_title.text(song.name)
      this.song_subtitle.text('Collection')

      this.collection_description.text(song.description)

      this.song_sub_group.hide()
      this.collection_sub_group.show()
      this.song_path.hide()
    } else {
      this.updateSongPath(song.collection)
      this.song_language.text(song.language.toUpperCase()).fill(song.media_type === 'youtube' ? BadgeYouTube : song.media_type === 'video' ? BadgeVideo : BadgeAudio).show()
      this.song_artist.text(song.artist)
      this.song_title.text(song.title)
      this.song_subtitle.text(song.subtitle)

      this.song_highscore.text(song.high_score > 0 ? `${format_number_comma(song.high_score)} [${song.high_score_class}]` : '---')
      this.song_duration.text(format_time(song.duration))
      this.song_cpm.text(`${format_number_fixed(song.cpm, 3)} / ${format_number_fixed(song.max_cpm, 3)}`)

      this.song_sub_group.show()
      this.collection_sub_group.hide()
      this.song_path.show()
    }
  }

  menuMode (yes) {
    if (yes) {
      this.layer.el.style.transform = 'translate(0, 260px)'
      this.sub_info_group.show()
    } else {
      this.layer.el.style.transform = 'translate(0, 0)'
      this.sub_info_group.hide()
    }
  }
}
