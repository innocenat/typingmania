/*

Packed Assets Format:

<<packed_assets>
str:'TPMN'
i4:file_size
str:'LIST'
i4:files_count
repeat <<file_entry>>
str:'FILE'
repeat <<file>>

<<file_entry>>
i1:filename_length
str:filename
i4:offset
i4:length

<<file>>
bin:file_content

 */

export default class PackedFile {
  constructor () {
    this.file_count = 0
    this.file_buffer = []
    this.file_name = []
    this.file_url = {}

    this.destroyed = false
  }

  destroy () {
    // Deallocate all buffers (potentially)
    this.file_buffer = []
    this.destroyed = true
  }

  hasFile (filename) {
    for (let i = 0; i < this.file_count; i++) {
      if (this.file_name[i] === filename) {
        return true
      }
    }
    return false
  }

  getFileAsBuffer (filename) {
    if (this.destroyed) {
      throw Error('Cannot request file buffer from destroyed packed file.')
    }

    for (let i = 0; i < this.file_count; i++) {
      if (filename === this.file_name[i])
        return this.file_buffer[i]
    }
    throw Error(`File ${filename} not found in packed file.`)
  }

  getFileAsURL (filename) {
    if (filename in this.file_url)
      return this.file_url[filename]
    const url = URL.createObjectURL(
      new Blob(
        [new Uint8Array(this.getFileAsBuffer(filename))],
        { type: PackedFile.mimeType(filename) },
      ),
    )
    return this.file_url[filename] = url
  }

  getAsText (filename) {
    const decoder = new TextDecoder('utf8')
    return decoder.decode(this.getFileAsBuffer(filename))
  }

  addFile (filename, buffer) {
    this.file_buffer[this.file_count] = buffer
    this.file_name[this.file_count] = filename
    this.file_count++
  }

  unpackFromBuffer (buffer) {
    const views = new DataView(buffer)
    const decoder = new TextDecoder()
    const length = buffer.byteLength

    let offset = 0

    // Read magic number
    if (views.getUint32(offset, true) !== 0x4E4D5054) { // "TPMN"
      throw new Error('Invalid assets file -- 4CC failed')
    }
    offset += 4

    // Read file length
    if (views.getUint32(offset, true) !== length - 8) {
      throw new Error('Invalid assets file -- invalid length')
    }
    offset += 4

    // 'LIST'
    if (views.getUint32(offset, true) !== 0x5453494C) { // "LIST"
      throw new Error('Invalid assets file -- expect "LIST"')
    }
    offset += 4

    this.file_count = views.getUint32(offset, true)
    offset += 4

    for (let i = 0; i < this.file_count; i++) {
      // File name length
      const filename_length = views.getUint8(offset)
      offset += 1

      // File name
      const filename = decoder.decode(buffer.slice(offset, offset + filename_length))
      offset += filename_length

      this.file_name.push(filename)

      const file_offset = views.getUint32(offset, true)
      const file_length = views.getUint32(offset + 4, true)
      offset += 8

      // File offset + length
      const file = buffer.slice(file_offset, file_offset + file_length)
      this.file_buffer.push(file)
    }
  }

  pack () {
    const encoder = new TextEncoder()

    let packed_length = 0
    packed_length += 4 // 'TPMN'
    packed_length += 4 // i4:size
    packed_length += 4 // 'LIST'
    packed_length += 4 // i4:files_count

    const file_offset = []
    const file_name_encoded = []

    for (let i = 0; i < this.file_count; i++) {
      const encoded = encoder.encode(this.file_name[i])
      file_name_encoded.push(encoded)
      packed_length += 1 // i1:filename_length
      packed_length += encoded.byteLength // str:filename
      packed_length += 4 // i4:offset
      packed_length += 4 // i4:length
    }

    packed_length += 4 // 'FILE'
    for (let i = 0; i < this.file_count; i++) {
      file_offset.push(packed_length)
      packed_length += this.file_buffer[i].byteLength // binary:file
    }

    let packed_buffer = new ArrayBuffer(packed_length)
    let byte_array = new Uint8Array(packed_buffer)
    let buffer_view = new DataView(packed_buffer)
    let offset = 0

    // 'TPMN'
    buffer_view.setUint32(offset, 0x4E4D5054, true)
    offset += 4

    // i4:size
    buffer_view.setUint32(offset, packed_length - 8, true)
    offset += 4

    // 'LIST'
    buffer_view.setUint32(offset, 0x5453494C, true)
    offset += 4

    // i4:files_count
    buffer_view.setUint32(offset, this.file_count, true)
    offset += 4

    // file_header
    for (let i = 0; i < this.file_count; i++) {
      // i1:filename_length
      buffer_view.setUint8(offset, file_name_encoded[i].byteLength)
      offset += 1

      // str:filename
      byte_array.set(file_name_encoded[i], offset)
      offset += file_name_encoded[i].byteLength

      // i4:offset
      buffer_view.setUint32(offset, file_offset[i], true)
      offset += 4

      // i4:length
      buffer_view.setUint32(offset, this.file_buffer[i].byteLength, true)
      offset += 4
    }

    // 'FILE'
    buffer_view.setUint32(offset, 0x454C4946, true)
    offset += 4

    // Write each file
    for (let i = 0; i < this.file_count; i++) {
      byte_array.set(this.file_buffer[i], offset)
      offset += this.file_buffer[i].byteLength
    }

    return packed_buffer
  }

  // Just file format that may be use in TypingMania
  static mimeType (filename) {
    const extension = filename.split('.').pop()
    switch (extension) {
      // Text data
      case 'csv':
        return 'text/csv'
      case 'json':
        return 'application/json'
      case 'txt':
        return 'text/plain'

      // Image
      case 'avif':
        return 'image/avif'
      case 'gif':
        return 'image/gif'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'svg':
        return 'image/svg+xml'
      case 'webp':
        return 'image/webp'

      // Audio & Video
      case 'aac':
        return 'audio/aac'
      case 'avi':
        return 'video/x-msvideo'
      case 'flac':
        return 'audio/flac'
      case 'mp3':
        return 'audio/mpeg'
      case 'm4a':
        return 'audio/m4a'
      case 'mp4':
      case 'm4v':
        return 'video/mp4'
      case 'oga':
      case 'ogg':
        return 'audio/oga'
      case 'ogv':
        return 'video/ogv'
      case 'opus':
        return 'audio/opus'
      case 'wav':
        return 'audio/wav'
      case 'weba':
        return 'audio/webm'
      case 'webm':
        return 'video/webm'

      // Font
      case 'woff':
        return 'font/woff'
      case 'woff2':
        return 'font/woff2'
    }
  }
}
