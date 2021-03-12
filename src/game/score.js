import { format_decimal_fixed, format_number_comma, format_number_fixed } from '../screen/0-common.js'

export default class Score {
  constructor (scoring_char) {
    this.score = 0

    this.combo = 0
    this.max_combo = 0

    this.completed_line = 0
    this.skipped_line = 0
    this.skipped_char = 0

    this.correct = 0
    this.missed = 0

    this.missed_in_this_line = 0
    this.line_score = 0

    this.typing_time = 0
    this.last_type_time = 0

    // Calculate base score
    this.base_score = scoring_char * 1250
  }

  getClass () {
    if (this.score >= this.base_score * 1.25) return 'SSS'
    if (this.score >= this.base_score * 1.10) return 'SS'
    if (this.score >= this.base_score * 1.05) return 'S+'
    if (this.score >= this.base_score * 1.00) return 'S'
    if (this.score >= this.base_score * 0.95) return 'A+'
    if (this.score >= this.base_score * 0.90) return 'A'
    if (this.score >= this.base_score * 0.85) return 'B+'
    if (this.score >= this.base_score * 0.80) return 'B'
    if (this.score >= this.base_score * 0.75) return 'C+'
    if (this.score >= this.base_score * 0.70) return 'C'
    if (this.score >= this.base_score * 0.60) return 'D+'
    if (this.score >= this.base_score * 0.50) return 'D'
    if (this.score >= this.base_score * 0.40) return 'E+'
    if (this.score >= this.base_score * 0.30) return 'E'
    if (this.score >= this.base_score * 0.20) return 'F+'
    return 'F'

  }

  getCorrectPercent () {
    if (this.correct === 0)
      return 0
    return this.correct / (this.correct + this.missed)
  }

  getCorrectPercentWithSkipped () {
    if (this.correct === 0)
      return 0
    return this.correct / (this.correct + this.missed + this.skipped_char)
  }

  getCPM () {
    if (this.typing_time === 0) {
      return 0
    }
    return Math.round(60 * this.correct / this.typing_time)
  }

  onLineStart (timestamp) {
    this.last_type_time = timestamp
    this.missed_in_this_line = 0
    this.line_score = 0
  }

  onLineEnd (leftover) {
    if (leftover === 0) {
      this.completed_line++

      // Line complete bonus
      this.score += Math.ceil(this.line_score * 0.1)

      if (this.missed_in_this_line === 0) {
        // Line perfect bonus
        this.score += Math.ceil(this.line_score * 0.15)
      }
    } else {
      this.skipped_char += leftover
      this.skipped_line++
    }
  }

  // This get called on every typing
  // Minus score factor indicate missed.
  onType (timestamp, score_factor) {
    if (score_factor < 0) {
      // Missed penalty
      this.score -= 500

      this.missed++
      this.missed_in_this_line++
      this.combo = 0
    } else {
      this.correct++
      this.combo += score_factor
      this.max_combo = Math.max(this.combo, this.max_combo)

      // Score = base_score (1000) + CPM bonus (*.25) + combo bonus
      // I want to use current typing CPM, but due to low resolution
      // of the timing, we can get Infinity CPM easily for fast typist.
      const cpm_score = this.getCPM() * 0.25
      const combo_score = this.combo
      const score = Math.ceil(1000 + cpm_score + combo_score) * score_factor

      this.score += score
      this.line_score += score

      this.typing_time += timestamp - this.last_type_time
    }

    this.last_type_time = timestamp
  }

  setToSongScreen (screen) {
    screen.ui_score.text(format_number_comma(this.score))
    screen.ui_max_combo.text(format_number_fixed(this.max_combo, 3))
    screen.ui_completed.text(format_number_fixed(this.completed_line, 3))
    screen.ui_skipped.text(format_number_fixed(this.skipped_char, 3))

    screen.ui_typing_speed.text(format_number_fixed(this.getCPM(), 3))
    screen.ui_correct.text(format_number_fixed(this.correct, 3))
    screen.ui_missed.text(format_number_fixed(this.missed, 3))
    screen.ui_accuracy.text(format_decimal_fixed(this.getCorrectPercentWithSkipped() * 100, 1, 1) + '%')
    screen.ui_class.text(this.getClass())

    if (this.combo >= 2) {
      screen.ui_combo_label.show()
      screen.ui_combo.text(this.combo).show()
    } else {
      screen.ui_combo_label.hide()
      screen.ui_combo.text(this.combo).hide()
    }
  }

  setToResultScreen (screen) {
    screen.score_class.text(this.getClass())
    screen.score_value.text(format_number_comma(this.score))

    screen.card_value[1].text(this.getClass())
    screen.card_value[2].text(format_number_comma(this.score))
    screen.card_value[3].text(format_number_fixed(this.max_combo, 3))
    screen.card_value[4].text(format_number_fixed(this.correct, 3))
    screen.card_value[5].text(format_number_fixed(this.missed, 3))
    screen.card_value[6].text(format_number_fixed(this.completed_line, 3))
    screen.card_value[7].text(format_number_fixed(this.skipped_line, 3))
    screen.card_value[8].text(format_number_fixed(this.skipped_char, 3))
    screen.card_value[9].text(format_number_fixed(this.getCPM(), 3))
    screen.card_value[10].text(format_decimal_fixed(this.getCorrectPercent() * 100, 1, 1) + '%')
    screen.card_value[11].text(format_decimal_fixed(this.getCorrectPercentWithSkipped() * 100, 1, 1) + '%')
  }
}
