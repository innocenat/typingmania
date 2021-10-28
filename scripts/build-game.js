// This script is for building distribution
// file in `dist/` folder. This will pack the entire
// game javascript into one file (using esbuild)
// and copy the assets, along with the proper `index.html`
// NOTE: This does not copy song data folder.

// The resulting `dist/` folder is ready for distribution.

import fs from 'fs'
import esbuild from 'esbuild'
import { fileURLToPath } from 'url'

const DIST_PATH = fileURLToPath(new URL('../dist', import.meta.url))
const SRC_PATH = fileURLToPath(new URL('../src', import.meta.url))
const ASSETS_PATH = fileURLToPath(new URL('../assets/assets.dat', import.meta.url))

if (!fs.existsSync(DIST_PATH))
  fs.mkdirSync(DIST_PATH)

fs.copyFileSync(ASSETS_PATH, DIST_PATH + '/assets.dat')
esbuild.buildSync({
  entryPoints: [SRC_PATH + '/game.js'],
  outfile: DIST_PATH + '/game.js',
  bundle: true,
  minify: true,
  format: 'esm'
})
fs.writeFileSync(DIST_PATH + '/index.html', `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name=viewport content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1"><title>TypingMania NEO</title></head>
<body>
<script type="module">
  import game from './game.js'

  game({
    assets_url: 'assets.dat',
    songs_url: 'data/songs.json',
  })
</script>
<noscript>
    <p>
        TypingMania NEO is a song lyrics typing game. It is a spiritual successor to SightSeekerStudio's TypingMania Odyssey.
        Check <a href="https://github.com/innocenat/typingmania" rel="noopener">GitHub repository</a> for more information.
    </p>
    <p>
        JavaScript is required to play.
    </p>
</noscript>
</body>
</html>
`)
