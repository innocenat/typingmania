export function parse_typingmania_ass (contents) {
  const lines = contents.split(/\r?\n/)
  const regex = /^Dialogue: [0-9]+,([0-9\.\:]+),([0-9\.\:]+),.+?,(.+?),.*?,.*?,.*?,.*?,(.+)$/

  const ass_info = {}
  const lyrics = []

  for (const line of lines) {
    const match = line.match(regex)
    if (match !== null) {
      if (match[3].toLowerCase() === 'lyrics') {
        lyrics.push([ass_to_ms(match[1]), ass_to_ms(match[2]), match[4].trim()])
      } else {
        ass_info[match[3].toLowerCase()] = match[4].trim()
      }
    }
  }

  return [ass_info, lyrics]
}

export function ass_to_ms (time) {
  const regex = /^([0-9]+)\:([0-9]+)\:([0-9]+)\.([0-9]+)$/
  const match = time.match(regex)
  return match[1] * 60 * 60 * 1000 + match[2] * 60 * 1000 + match[3] * 1000 + match[4] * 10
}
