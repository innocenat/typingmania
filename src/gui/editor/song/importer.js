import { parse_typingmania_ass } from '../../../util/ass.js'
import { song_meta_from_ass } from '../../../util/song_meta.js'
import TypingLine from '../../../typing/typingline.js'
import Romanizer from '../../../typing/romanizer.js'
import latinTable from '../../../../latin-table/latin-table.js'

const romanizer = new Romanizer(latinTable)

export function importSongFromASS(contents) {
  const [ass_info, lyrics] = parse_typingmania_ass(contents)

  let errors = []

  let song_meta
  try {
    song_meta = song_meta_from_ass(ass_info)
  } catch(e) {
    errors.push(e.message)
  }

  lyrics.sort((a, b) => {
    return a[0] - b[0]
  })

  for (const lyric of lyrics) {
    try {
      new TypingLine(lyric[2], lyric[0], lyric[1], romanizer)
    } catch(e) {
      console.log(e)
      errors.push(e.message)
    }
  }

  return [
    song_meta,
    lyrics,
    errors,
  ]
}
