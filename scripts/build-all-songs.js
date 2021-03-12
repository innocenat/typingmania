import fs from 'fs'
import path from 'path'
import child_process from 'child_process'
import { fileURLToPath } from 'url'

const BUILD_SONG_PATH = fileURLToPath(new URL('./build-song.js', import.meta.url))

const input = process.argv[2]

function walk (directory, filepaths = []) {
  const files = fs.readdirSync(directory)
  for (let filename of files) {
    if (filename[0] === '.')
      continue
    const filepath = path.join(directory, filename)
    const stat = fs.statSync(filepath)
    if (stat.isDirectory()) {
      walk(filepath, filepaths)
    } else if (filename.split('.').pop() === 'ass') {
      filepaths.push(filepath)
    }
  }
  return filepaths
}

const files = walk(input)

for (let f of files) {
  console.log(`node ${BUILD_SONG_PATH} ${f}`)
  child_process.execSync(`node ${BUILD_SONG_PATH} ${f}`)
}
