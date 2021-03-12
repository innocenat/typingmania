import { Component, h } from 'https://unpkg.com/preact?module'
import htm from 'https://unpkg.com/htm?module'
import Song from '../../song/song.js'
import Typing from '../../typing/typing.js'
import PreviewSongInfo from './previewsonginfo.js'
import PreviewFileChooser from './previewfilechooser.js'
import PreviewImage from './previewimage.js'
import PreviewLyrics from './previewlyrics.js'
import MediaPlayer from '../media/mediaplayer.js'
import PreviewMediaPlayer from './previewmediaplayer.js'

const html = htm.bind(h)

export default class PreviewApp extends Component {
  mediaPlayer = new MediaPlayer()

  state = {
    song: null,
    typings: null,
    media: {
      status: 0,
      currentTime: 0,
      duration: 0,
    },
  }

  loadSong = (packed_song) => {
    const song_meta = JSON.parse(packed_song.getAsText('song.json'))
    const song = new Song(song_meta, [])
    song.loadFromPackedFile(packed_song)

    const typings = new Typing(song.lyrics_csv)

    if (song.media_type === 'audio') {
      this.mediaPlayer.loadAudio(song.media_url)
    }
    if (song.media_type === 'video') {
      this.mediaPlayer.loadVideo(song.media_url)
    }
    if (song.media_type === 'youtube') {
      this.mediaPlayer.loadYouTube(song.media_url)
    }

    this.setState({ song, typings })
  }

  seekTo = (timestamp) => {
    this.mediaPlayer.seekTo(timestamp)
  }

  animationFrame = () => {
    this.setState({
      media: {
        status: this.mediaPlayer.getStatus(),
        currentTime: this.mediaPlayer.getCurrentTime(),
        duration: this.mediaPlayer.getDuration(),
      },
    })

    this.animFrame = requestAnimationFrame(this.animationFrame)
  }

  componentDidMount () {
    this.animFrame = requestAnimationFrame(this.animationFrame)
  }

  componentWillUnmount () {
    cancelAnimationFrame(this.animFrame)
  }

  render () {
    return html`
        <div class="app-container">
            <div class="panel-song-info">
                <${PreviewFileChooser} loadSong="${this.loadSong}"/>
                <${PreviewImage} song="${this.state.song}"/>
                <${PreviewMediaPlayer} media="${this.state.media}" mediaplayer="${this.mediaPlayer}"/>
                <${PreviewSongInfo} song="${this.state.song}"/>
            </div>
            <div class="panel-song-lyrics">
                <${PreviewLyrics} typings="${this.state.typings}" seekTo="${this.seekTo}"
                                  currentTime="${this.state.media.currentTime}"/>
            </div>
        </div>
    `
  }
}
