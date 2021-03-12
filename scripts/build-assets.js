// This scripts is for building `assets/assets.dat`
// from file in `assets/raw/` folder.

// To simplify loading, the all required assets
// are packed into single file.

import PackedFile from '../src/lib/packedfile.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const RAW_ASSETS = fileURLToPath(new URL('../assets/raw', import.meta.url))
const TARGET_FILE = fileURLToPath(new URL('../assets/assets.dat', import.meta.url))

function walk (directory, filepaths = []) {
  const files = fs.readdirSync(directory)
  for (let filename of files) {
    if (filename[0] === '.')
      continue
    const filepath = path.join(directory, filename)
    const stat = fs.statSync(filepath)
    if (stat.isDirectory()) {
      walk(filepath, filepaths)
    } else {
      filepaths.push(filepath)
    }
  }
  return filepaths
}

const files = walk(RAW_ASSETS)
const packer = new PackedFile()

for (const file of files) {
  const fileName = file.replace(RAW_ASSETS, '').substring(1).replace('\\', '/')
  packer.addFile(fileName, fs.readFileSync(file))
  console.log(fileName)
}

const packed_buffer = packer.pack()
fs.writeFileSync(TARGET_FILE, Buffer.from(packed_buffer))
