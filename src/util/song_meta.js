import TypingLine from '../typing/typingline.js'
import Romanizer from '../typing/romanizer.js'
import latinTable from '../../latin-table/latin-table.js'

const romanizer = new Romanizer(latinTable)

export function song_meta_from_ass (ass_info) {
  const meta_list = ['title', 'subtitle', 'artist']
  const song_meta = {}
  for (const meta of meta_list) {
    if (!(meta in ass_info)) {
      throw new Error(`Key ${meta} not found in .ass file`)
    }

    const split = ass_info[meta].split('//')
    if (split.length === 1) {
      song_meta[meta] = split[0].trim()
      song_meta['latin_' + meta] = split[0].trim()
    } else {
      song_meta[meta] = split[0].trim()
      song_meta['latin_' + meta] = split[1].trim()
    }
  }

  song_meta.language = ass_info.language || 'U' // unknown

  return song_meta
}

export function build_song_lyrics (song_lyrics) {
  song_lyrics.sort((a, b) => {
    return a[0] - b[0]
  })

  const cpms = []
  let csv = ''

  for (const lyric of song_lyrics) {
    const typing_line = new TypingLine(lyric[2], lyric[0], lyric[1], romanizer)
    const char_count = typing_line.getCharacterCount()
    const cpm = char_count * 1000 * 60 / (lyric[1] - lyric[0])
    cpms.push(cpm)
    csv += `${lyric[0]},${lyric[1]},${lyric[2]}\n`
  }
  return [csv, ...p75(cpms)]
}

function p75 (arr) {
  arr.sort((a, b) => a - b)
  const pos = (arr.length - 1) * 0.75
  const base_pos = Math.floor(pos)
  if (base_pos === arr.length - 1) {
    return [Math.ceil(arr[arr.length - 1]), Math.ceil(arr[arr.length - 1])]
  } else {
    const f0 = pos - base_pos
    return [Math.ceil(arr[base_pos] * (1 - f0) + arr[base_pos + 1] * f0), Math.ceil(arr[arr.length - 1])]
  }
}
