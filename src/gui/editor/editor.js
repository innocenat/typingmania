import { html, render } from 'https://unpkg.com/htm/preact/standalone.module.js'
import EditorApp from '../../gui/editor/app/editorapp.js'

window.hasChanged = false

export default function main () {
  // Set beforeunload handler
  window.addEventListener('beforeunload', function (event) {
    if (window.hasChanged) {
      event.preventDefault()
      event.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
    } else {
      delete event['returnValue']
    }
  })

  render(html`
      <${EditorApp}/>`, document.body)
}

