import fs from 'fs'
import path from 'path'
import child_process from 'child_process'
import PackedFile from '../src/lib/packedfile.js'
import { ass_to_ms, parse_typingmania_ass } from '../src/util/ass.js'
import { build_song_lyrics, song_meta_from_ass } from '../src/util/song_meta.js'

const input_file = process.argv[2]
const input_dir = path.dirname(input_file)

function media_duration (filename) {
  const file = path.join(input_dir, filename)

  if (!fs.existsSync(file)) {
    throw new Error('Media file ' + filename + ' not found.')
  }

  const regexp = /Duration: ([0-9:.]+),/
  const proc = child_process.spawnSync(`ffmpeg -i ${file}`, { shell: true })
  const output = proc.stderr.toString()
  const matches = output.match(regexp)
  const msec = ass_to_ms(matches[1])
  return Math.ceil(msec / 1000)
}

// Process input file
const contents = fs.readFileSync(input_file, { encoding: 'utf8' })
const [ass_info, lyrics] = parse_typingmania_ass(contents)
const song_meta = song_meta_from_ass(ass_info)
const [lyrics_csv, cpm, max] = build_song_lyrics(lyrics)

song_meta.cpm = cpm
song_meta.max_cpm = max

// Process background image
if (!('image' in ass_info)) {
  throw new Error('No song image is specified.')
}
const imageName = path.basename(ass_info.image)
const imagePath = path.join(input_dir, ass_info.image)
if (!fs.existsSync(imagePath)) {
  throw new Error('No song image not found: ' + imagePath)
}
song_meta.image = imageName

// Process media
if ('youtube' in ass_info) {
  song_meta.youtube = ass_info.youtube
  song_meta.duration = ass_info.duration || 0
} else if ('video' in ass_info) {
  song_meta.video = path.basename(ass_info.video)
  song_meta.duration = media_duration(ass_info.video)
} else if ('audio' in ass_info) {
  song_meta.audio = path.basename(ass_info.audio)
  song_meta.duration = media_duration(ass_info.audio)
} else {
  throw new Error('No media specified. Require youtube, video, or audio')
}

// Initialize packer
const packer = new PackedFile()
const encoder = new TextEncoder()

packer.addFile('song.json', encoder.encode(JSON.stringify(song_meta)))
packer.addFile('lyrics.csv', encoder.encode(lyrics_csv))
packer.addFile(imageName, fs.readFileSync(imagePath))
if ('video' in ass_info) {
  packer.addFile(path.basename(ass_info.video), fs.readFileSync(path.join(input_dir, ass_info.video)))
} else if ('audio' in ass_info) {
  packer.addFile(path.basename(ass_info.audio), fs.readFileSync(path.join(input_dir, ass_info.audio)))
}

const packed_buffer = packer.pack()
fs.writeFileSync(input_file.split('.').slice(0, -1).join('.') + '.typingmania', Buffer.from(packed_buffer))
