import fs from 'fs'
import path from 'path'
import PackedFile from '../src/lib/packedfile.js'
import TypingLine from '../src/typing/typingline.js'
import latinTable from '../latin-table/latin-table.js'
import Romanizer from '../src/typing/romanizer.js'
import child_process from 'child_process'

const romanizer = new Romanizer(latinTable)

const input_file = process.argv[2]
const input_dir = path.dirname(input_file)

function parse_typingmania_ass (contents) {
  const lines = contents.split(/\r?\n/)
  const regex = /^Dialogue: [0-9]+,([0-9\.\:]+),([0-9\.\:]+),.+?,(.+?),.*?,.*?,.*?,.*?,(.+)$/

  const ass_info = {}
  const lyrics = []

  for (const line of lines) {
    const match = line.match(regex)
    if (match !== null) {
      if (match[3].toLowerCase() === 'lyrics') {
        lyrics.push([assToMilisec(match[1]), assToMilisec(match[2]), match[4].trim()])
      } else {
        ass_info[match[3].toLowerCase()] = match[4].trim()
      }
    }
  }

  return [ass_info, lyrics]
}

function make_song_meta (ass_info) {
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

function build_song_lyrics (song_lyrics) {
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

function media_duration (filename) {
  const file = path.join(input_dir, filename)

  if (!fs.existsSync(file)) {
    throw new Error('Media file ' + filename + ' not found.')
  }

  const regexp = /Duration: ([0-9:.]+),/
  const proc = child_process.spawnSync(`ffmpeg -i ${file}`, { shell: true })
  const output = proc.stderr.toString()
  const matches = output.match(regexp)
  const msec = assToMilisec(matches[1])
  return Math.ceil(msec / 1000)
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

function assToMilisec (time) {
  const regex = /^([0-9]+)\:([0-9]+)\:([0-9]+)\.([0-9]+)$/
  const match = time.match(regex)
  return match[1] * 60 * 60 * 1000 + match[2] * 60 * 1000 + match[3] * 1000 + match[4] * 10
}

// Process input file
const contents = fs.readFileSync(input_file, { encoding: 'utf8' })
const [ass_info, lyrics] = parse_typingmania_ass(contents)
const song_meta = make_song_meta(ass_info)
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
