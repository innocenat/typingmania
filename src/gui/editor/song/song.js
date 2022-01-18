import { useState } from 'https://unpkg.com/htm/preact/standalone.module.js'
import PackedFile from '../../../lib/packedfile.js'
import TypingLine from '../../../typing/typingline.js'

export function loadSongFromBuffer(buffer) {
  const packed_song = new PackedFile()
  packed_song.unpackFromBuffer(buffer)

  const song_meta = JSON.parse(packed_song.getAsText('song.json'))
  const lyrics_csv = packed_song.getAsText('lyrics.csv')

  // Parse lyrics
  const lines = lyrics_csv.split(/\r?\n/)
  let lyrics = []
  for (const line of lines) {
    if (line.trim().length === 0) {
      continue
    }
    const [start, end, ...lyric_p] = line.split(',')
    const lyric = lyric_p.join(',')
    lyrics.push([+start, +end, lyric])
  }

  return [song_meta, lyrics, []]
}

export function useSong() {
  const [song, setSong] = useState({
    title: '',
    subtitle: '',
    artist: '',

    latin_title: '',
    latin_subtitle: '',
    latin_artist: '',

    language: '',
    cpm: '',
    max_cpm: '',
    duration: '',

    media_type: '',
    media_file: '',
    image_file: '',
  })

  const setField = (field, value) => {
    setSong({
      ...song,
      [field]: value
    })
  }

  return [song, setSong, setField]
}

export function useLyrics() {
  const [lyrics, setLyrics] = useState([])
  return [lyrics, setLyrics]
}
