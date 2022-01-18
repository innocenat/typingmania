import { html, useState } from 'https://unpkg.com/htm/preact/standalone.module.js'

export default function LyricsEditor(props) {
  const [text, setText] = useState(props.text)

  const onchange = (text) => {
    setText(text)
  }

  return html`
  
  `
}
