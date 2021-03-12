import { h, render } from 'https://unpkg.com/preact?module'
import htm from 'https://unpkg.com/htm?module'
import PreviewApp from './preview/previewapp.js'

const html = htm.bind(h)

export default function main () {
  render(html`
      <${PreviewApp}/>`, document.body)
}
