import { Fill, Font, Stroke } from '../graphics/styles.js'

export const UIFont = Font('Iosevka Etoile').weight('500')
export const SongFont = Font('Noto Sans CJK JP').weight('500')
export const NumberFont = Font('Open Sans').weight('700')

export const White = Fill('white')
export const Black = Fill('black')
export const Gray = Fill('#999')
export const Gray2 = Fill('#A8A8A8')

export const BadgeAudio = Fill('#003')
export const BadgeVideo = Fill('#030')
export const BadgeYouTube = Fill('#300')

export const UIColor = Fill('#666').opacity('0.75')
export const BtnBorder = Stroke(1, 'white')

export function format_number_comma (number) {
  number = Math.floor(number)
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function format_number_fixed (number, digits) {
  number = Math.floor(number)
  number = number.toString()
  while (number.length < digits) {
    number = '0' + number
  }
  return number
}

export function format_decimal_fixed (number, digits, decimal) {
  for (let i = 0; i < decimal; i++)
    number *= 10
  number = Math.round(number).toString()
  const decimal_part = number.substr(number.length - decimal)
  let num_part = number.substr(0, number.length - decimal)
  while (num_part.length < digits)
    num_part = '0' + num_part
  return `${num_part}.${decimal_part}`
}

export function format_time (second) {
  second = Math.floor(second)
  const mm = Math.floor(second / 60)
  const ss = second % 60
  return mm.toString() + ':' + format_number_fixed(ss, 2)
}
