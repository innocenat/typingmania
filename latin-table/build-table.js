import fs from 'fs'

// This script convert csv to latin-table.js

const FILE_LIST = [
  'japanese-kana.csv',
  'japanese-kana-halfwidth.csv',
  'full-width.csv',
  'cjk-symbols.csv',
  'enclosed-alnum.csv',
  'latin-extended.csv',
  'quote.csv'
]

let final_table = []

for (let file of FILE_LIST) {
  const csv = fs.readFileSync(file, 'utf-8')
  const csv_lines = csv.split('\n')
  for (let line of csv_lines) {
    if (line.length === 0)
      continue
    const content = line.split(',')
    const src = content[0]
    const target = content.slice(1).join(',').replace(':SPACE', ' ')
    final_table.push([src, target])
  }
}

const content = 'export default ' + JSON.stringify(final_table)
fs.writeFileSync('latin-table.js', content)
