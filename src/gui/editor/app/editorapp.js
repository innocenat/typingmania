import { html, useState, useRef, useCallback } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { loadSongFromBuffer, useLyrics, useSong } from '../song/song.js'
import { importSongFromASS } from '../song/importer.js'
import UIInfo from './uiinfo.js'
import UILyrics from './uilyrics.js'
import LyricsTextarea from './lyricstextarea.js'

export default function PreviewApp (props) {
  const [mode, setMode] = useState('initial')
  const [currentFile, setCurrentFile] = useState(null)
  const [errors, setErrors] = useState([])
  const filePicker = useRef(null)

  const [song, setSong, setSongField] = useSong()
  const [lyrics, setLyrics] = useLyrics()

  const [currentLineText, setCurrentLineText] = useState('')

  const openFile = async () => {
    filePicker.current.click()
  }

  const openFile__filePickerChanged = async (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]

      // Read file
      const ext = file.name.split('.').pop().toLowerCase()
      if (ext === 'ass' || ext === 'typingmania') {
        const reader = new FileReader()
        reader.onload = async (e) => {
          // Reset file
          filePicker.current.value = null

          // Process
          const data = e.target.result
          const [song_meta, lyrics, errors] = ext === 'ass' ? importSongFromASS(data) : loadSongFromBuffer(data)

          if (errors.length > 0) {
            setErrors(errors)
            setMode('error')
          } else {
            setErrors([])
            setMode('editor')

            setSong(song_meta)
            setLyrics(lyrics)

            setCurrentFile(file)
          }
        }
        if (ext === 'ass')
          reader.readAsText(file)
        else
          reader.readAsArrayBuffer(file)
      } else {
        alert('Only .typingmania or .ass files are supported')
      }
    }
  }

  const selectLine = (idx) => {
    setCurrentLineText(lyrics[idx][2])
  }

  const onchange = (text) => {
    setCurrentLineText(text)
  }

  return html`
      <div class="app">
          <div class="app-title">
              <div class="app-title-bar">
                  TypingMania NEO Editor - ${currentFile ? currentFile.name : '(empty)'}
              </div>
              <div class="app-title-toolbar">
                  <button onclick="${openFile}">
                      Open/Import...
                  </button>
                  ${currentFile ? html`
                      <button>Save...
                      </button>` : null}
              </div>
              <div hidden>
                  <input ref="${filePicker}" onchange="${openFile__filePickerChanged}" type="file"
                         accept=".typingmania,.ass"/>
              </div>
          </div>

          ${mode === 'initial' ? html`
              <div class="app-single single-page">
                  <div>
                      <h1>TypingMania NEO Editor</h1>
                      <ul>
                          <li>Use 'Open/Import...' button to load file.</li>
                          <li>Top left navigation switch between metadata and lyrics editor.</li>
                          <li>Import of .ass file is supported.</li>
                      </ul>
                  </div>
              </div>
          ` : ''}

          ${mode === 'error' ? html`
              <div class="h-max bg-gray-200 flex-1 overflow-y-scroll overflow-x-auto text-center p-16 space-y-16}">
                  <h2 class="text-5xl text-red-600">Import errors!</h2>
                  <ul class="text-red-600 list-outside list-disc text-left w-96 mx-auto space-y-4 text-lg">
                      ${errors.map(e => html`
                          <li>${e}</li>`)}
                  </ul>
              </div>
          ` : ''}

          ${mode === 'editor' ? html`
              <div class="app-editor">
                  <${LyricsTextarea} text="${currentLineText}" onchange="${onchange}"/>
              </div>
                  <${UIInfo} song=${song} setSong=${setSongField}/>
                  <${UILyrics} lyrics="${lyrics}" selectLine="${selectLine}" currentTime="0"/>
          ` : ''}
      </div>
  `
}
