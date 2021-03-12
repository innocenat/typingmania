import Romanizer from './romanizer.js'
import latinTable from '../../latin-table/latin-table.js'
import TypingLine from './typingline.js'

const romanizer = new Romanizer(latinTable)

export default class Typing {
  constructor (lyrics_csv) {
    this.lines = []
    this.current_line = 0

    // Parse lyrics
    const lines = lyrics_csv.split(/\r?\n/)
    let current_time = 0
    for (const line of lines) {
      if (line.trim().length === 0) {
        continue
      }
      const [start, end, ...lyrics] = line.split(',')
      const lyric = lyrics.join(',')

      if (start !== current_time) {
        // Add buffer line
        this.lines.push(new TypingLine('', current_time / 1000, start / 1000, romanizer))
      }
      this.lines.push(new TypingLine(lyric, start / 1000, end / 1000, romanizer))

      current_time = end
    }
  }

  hasEnded () {
    return this.current_line >= this.lines.length
  }

  getCurrentLine () {
    if (this.current_line < this.lines.length)
      return this.lines[this.current_line]
    return false
  }

  getNextLine () {
    if (this.current_line + 1 < this.lines.length)
      return this.lines[this.current_line + 1]
    return false
  }

  getScoringCharCount () {
    let scoring_char = 0
    for (const l of this.lines) {
      scoring_char += l.getCharacterCount()
    }
    return scoring_char
  }

  // This is used to draw split progressbar
  getIntervals () {
    const t = []
    for (const l of this.lines) {
      t.push(l.end_time)
    }
    return t
  }

  update (current_time) {
    let changed = false
    let leftover = 0

    const current_line = this.getCurrentLine()
    if (current_line) {
      if (current_time > current_line.end_time) {
        // Line end, move
        this.current_line++
        changed = true

        if (!current_line.isCompleted()) {
          leftover = current_line.getLeftoverCharCount()
        }
      }
    }

    // 0 = nothing, 1 = line changed, 2 = line changed, skipped
    return [changed, leftover]
  }
}
