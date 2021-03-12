import Song from './song.js'

export default class SongCollection {
  constructor (options, parent = null) {
    this.parent = parent

    let contents
    if (Array.isArray(options)) {
      // For root collection
      this.name = ':root:'
      this.description = ''

      contents = options
    } else {
      this.name = options.name
      this.description = options.description

      contents = options.contents
    }

    this.children = []
    this.recursiveMakeSong(contents)
  }

  recursiveMakeSong (contents) {
    for (const c of contents) {
      if (c.type === 'collection') {
        this.children.push(new SongCollection(c, this))
      } else {
        this.children.push(new Song(c, this))
      }
    }
  }
}
