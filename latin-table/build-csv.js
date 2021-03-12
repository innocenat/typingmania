import fs from 'fs'
import { RBT } from 'icu-transliterator'

// CSV format is char,replacement

// Safe guard
throw new Error('Resulting table is further modified by hand. DO NOT OVERWRITE!')

function generate_table(start, end, auto_transliterate = false) {
  let table = []
  let translit = (x) => ''

  if (auto_transliterate) {
    const transliterator = RBT('Any-Latin; Latin-ASCII; NFD; [:Nonspacing Mark:] Remove; NFC; Lower();')
    translit = (x) => transliterator.transliterate(x)
  }

  while (start <= end) {
    const c = String.fromCharCode(start)
    table.push([c, translit(c)])
    start++
  }

  return table
}

function build_csv(table) {
  let c = ''
  for (let l of table) {
    c += `${l[0]},${l[1]}\n`
  }
  return c
}

function build_full_width(filename) {
  const table = generate_table(0xFF01, 0xFF65, true)
  const csv = build_csv(table)
  fs.writeFileSync(filename, csv)
}

function build_cjk_symbol(filename) {
  const table = generate_table(0x3001, 0x303E, true)
  const csv = build_csv(table)
  fs.writeFileSync(filename, csv)
}

function build_half_width(filename) {
  const kana = fs.readFileSync('japanese-kana.csv', 'utf8')
  const kana_lines = kana.split('\n')
  const transliterator = RBT('Fullwidth-Halfwidth')
  let result = ''
  for (let l of kana_lines) {
    if (l.length === 0)
      continue
    const new_line = transliterator.transliterate(l)
    const code = new_line.charCodeAt(0)
    if (0xFF60 < code && code <= 0xFF9F) {
      result += new_line + '\n'
    }
  }
  fs.writeFileSync(filename, result)
}

function build_enclosed_alnum(filename) {
  let csv = ''
  csv += build_csv(generate_table(0x2460, 0x24FF, true))
  csv += build_csv(generate_table(0x3248, 0x324F, true))
  csv += build_csv(generate_table(0x3251, 0x325F, true))
  csv += build_csv(generate_table(0x32B1, 0x32BF, true))
  fs.writeFileSync(filename, csv)
}

function build_latin_extended(filename) {
  let csv = ''
  csv += build_csv(generate_table(0x00BF, 0x00FF, true))
  csv += build_csv(generate_table(0x0100, 0x017F, true))
  csv += build_csv(generate_table(0x0180, 0x024F, true))
  csv += build_csv(generate_table(0x1E00, 0x1EFF, true))
  fs.writeFileSync(filename, csv)
}

// Uncomment the one you want to build
// build_full_width('full-width.csv')
// build_cjk_symbol('cjk-symbols.csv')
// build_half_width('japanese-kana-halfwidth.csv')
// build_enclosed_alnum('enclosed-alnum.csv')
// build_latin_extended('latin-extended.csv')
