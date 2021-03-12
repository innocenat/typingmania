import { Component, createRef, h } from 'https://unpkg.com/preact?module'
import htm from 'https://unpkg.com/htm?module'
import PackedFile from '../../lib/packedfile.js'

const html = htm.bind(h)
export default class PreviewFileChooser extends Component {
  state = {
    filename: '',
  }

  fileChooserEl = createRef()

  loadFile = (ev) => {
    if (ev.target.files.length === 1) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.processFile(reader.result)
      })
      reader.readAsArrayBuffer(ev.target.files[0])
      this.setState({
        filename: ev.target.files[0].name,
      })
    }
  }

  processFile = (buffer) => {
    const packed_song = new PackedFile()
    packed_song.unpackFromBuffer(buffer)

    this.props.loadSong(packed_song)
  }

  triggerFileDialog = () => {
    this.fileChooserEl.current.click()
  }

  componentDidMount () {
    this.setState({
      filename: '<none>',
    })
  }

  render () {
    return html`
        <div class="song-info-file">
            <input type="file" id="file_chooser" style="display: none" accept=".typingmania"
                   onchange="${this.loadFile}" ref="${this.fileChooserEl}"/>
            <button class="btn big-toolbar-btn" onclick="${this.triggerFileDialog}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z"/>
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                </svg>
                Load file...
            </button>
            <div class="song-info-fileinfo">
                <h2>Current file</h2>
                <p>${this.state.filename}</p>
            </div>
        </div>
    `
  }
}
