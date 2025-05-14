import fs from 'fs'
import path from 'path'
import child_process from 'child_process'
import PackedFile from '../src/lib/packedfile.js'
import { ass_to_ms, parse_typingmania_ass } from '../src/util/ass.js'
import { build_song_lyrics, song_meta_from_ass } from '../src/util/song_meta.js'

if (process.argv.length < 6) {
	console.log(`Usage: ${process.argv[0]} ${process.argv[1]} data_file media_file image_file output_file`)
	process.exit(1)
}

const data_file = process.argv[2]
const media_file = process.argv[3]
const image_file = process.argv[4]
const output_file = process.argv[5]

function media_duration (filename) {
  const file = filename

  if (!fs.existsSync(file)) {
    throw new Error('Media file ' + filename + ' not found.')
  }

  const regexp = /Duration: ([0-9:.]+),/
  const proc = child_process.spawnSync(`ffmpeg -i "${file}"`, { shell: true })
  const output = proc.stderr.toString()
  const matches = output.match(regexp)
  const msec = ass_to_ms(matches[1])
  return Math.ceil(msec / 1000)
}

// Process input file
const contents = fs.readFileSync(data_file, { encoding: 'utf8' })
const [ass_info, lyrics] = parse_typingmania_ass(contents)
const song_meta = song_meta_from_ass(ass_info)
const [lyrics_csv, cpm, max] = build_song_lyrics(lyrics)

song_meta.cpm = cpm
song_meta.max_cpm = max

// Process background image
if (!fs.existsSync(image_file)) {
  throw new Error('Song image not found: ' + image_file)
}
song_meta.image = path.basename(image_file)

// Process media
if (!fs.existsSync(media_file)) {
  throw new Error('Media not found: ' + media_file)
}
const mediaExt = path.extname(media_file)
if (mediaExt == '.mp4' || mediaExt == '.mkv' || mediaExt == '.webm' || mediaExt == 'avi') {
  song_meta.video = path.basename(media_file)
  song_meta.duration = media_duration(media_file)
} else {
  song_meta.audio = path.basename(media_file)
  song_meta.duration = media_duration(media_file)
}

// Initialize packer
const packer = new PackedFile()
const encoder = new TextEncoder()

packer.addFile('song.json', encoder.encode(JSON.stringify(song_meta)))
packer.addFile('lyrics.csv', encoder.encode(lyrics_csv))
packer.addFile(path.basename(image_file), fs.readFileSync(image_file))
if ('video' in song_meta) {
  packer.addFile(path.basename(media_file), fs.readFileSync(media_file))
} else if ('audio' in song_meta) {
  packer.addFile(path.basename(media_file), fs.readFileSync(media_file))
}

const packed_buffer = packer.pack()
fs.writeFileSync(output_file, Buffer.from(packed_buffer))
