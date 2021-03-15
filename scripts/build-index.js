// This script is for automatically building `data/songs.json` index file
// automatically from the songs and folder structure in the `data/` folder.

import PackedFile from '../src/lib/packedfile.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const SONGS_FOLDER = fileURLToPath(new URL('../data', import.meta.url))
const BASE = fileURLToPath(new URL('../data', import.meta.url))
const INDEX_FILE = fileURLToPath(new URL('../data/songs.json', import.meta.url))

function build_songs (directory) {
  const files = fs.readdirSync(directory)
  let collection = []

  for (let filename of files) {
    if (filename[0] === '.')
      continue

    const filepath = path.join(directory, filename)
    const stat = fs.statSync(filepath)
    if (stat.isDirectory()) {
      // Make a collection
      const new_collection = {}
      new_collection.type = 'collection'

      // Check if there is collection info file
      const infofile = path.join(filepath, 'info.txt')
      if (fs.existsSync(infofile)) {
        const content = fs.readFileSync(infofile, { encoding: 'utf8' })
        new_collection.name = content.split(/\r?\n/)[0]
        new_collection.description = content.split(/\r?\n/).splice(0, 1).join('\n')
      } else {
        new_collection.name = filename
        new_collection.description = ''
      }

      new_collection.contents = build_songs(filepath)
      collection.push(new_collection)

    } else if (filename.split('.').pop() === 'typingmania') {
      // Read .typingmania file
      const content = fs.readFileSync(filepath)
      const packed = new PackedFile()
      packed.unpackFromBuffer(content.buffer)
      const song = JSON.parse(packed.getAsText('song.json'))
      song.url = 'data' + filepath.replace(BASE, '').replace('\\', '/')
      collection.push(song)
    }
  }

  return collection
}

const songs = build_songs(SONGS_FOLDER)
fs.writeFileSync(INDEX_FILE, JSON.stringify(songs))

