import { html, useEffect, useRef, useMemo } from 'https://unpkg.com/htm/preact/standalone.module.js'
import Romanizer from '../../../typing/romanizer.js'
import TypingLine from '../../../typing/typingline.js'
import latinTable from '../../../../latin-table/latin-table.js'

const romanizer = new Romanizer(latinTable)

function doHighlight (tokens) {
  return tokens.map((token) => {
    switch(token[0]) {
      case 0: // TOK_SPECI
        return html`<span style="color: var(--lyrics-special)">${token[1]}</span>`
      case 1: // TOK_CHAR
        return html`<span style="color: var(--lyrics-text)">${token[1]}</span>`
      case 2: // TOK_NO_READING
        return html`<span style="color: var(--lyrics-base)">${token[1]}</span>`
    }
  })
}

function syncScroll (textarea, highlight) {
  highlight.scrollTop = textarea.scrollTop
  highlight.scrollLeft = textarea.scrollLeft
}

export default function LyricsTextarea (props) {
  const textarea = useRef(null)
  const highlight = useRef(null)

  const tokens = useMemo(() => {
    const typingLine = new TypingLine(props.text, 0, 0, romanizer, false)
    return typingLine._preTokenize()
  }, [props.text])

  const onchange = () => {
    props.onchange(textarea.current.value)
    syncScroll(textarea.current, highlight.current)
  }

  // Sync scroll on all update
  useEffect(() => {
    syncScroll(textarea.current, highlight.current)
  }, [props.text])

  return html`
      <div class="lyrics-editor" style="--height: ${props.height}">
          <textarea ref="${textarea}" class="textarea" oninput="${onchange}"
                    onscroll="$() => syncScroll(textarea.current, highlight.current)">${props.text}</textarea>
          <div ref="${highlight}" class="highlight">${doHighlight(tokens)}</div>
      </div>
  `
}