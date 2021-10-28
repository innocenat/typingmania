export default class FileLoader {
  // This returns ArrayBuffer
  static load (url, on_progress = () => {
  }, abortSignal = null) {
    const fetchParam = {}
    if (abortSignal) {
      fetchParam.signal = abortSignal
    }
    return new Promise((resolve, reject) => {
      fetch(url, fetchParam).then(async (response) => {
        // Handle HTTP error
        if (response.status === 404) {
          reject('NOT_FOUND')
        } else if (response.status !== 200) {
          reject('HTTP_ERROR')
        }

        // For length calculation
        const length = +response.headers.get('Content-Length')
        const chunks = []
        let received = 0

        // Read incoming chunk
        const reader = response.body.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          chunks.push(value)
          received += value.length

          // Progress event handler
          on_progress(received / length)
        }

        // Loaded, reassemble file
        const file = new Uint8Array(received)
        let offset = 0
        for (let chunk of chunks) {
          file.set(chunk, offset)
          offset += chunk.length
        }

        // Resolve promise to the file content array buffer
        resolve(file.buffer)
      }).catch((e) => {
        if (e.name === 'AbortError') {
          reject('ABORTED')
        } else {
          reject('NETWORK_ERROR')
        }
      })
    })
  }

  // Utility to decode ArrayBuffer to text
  static decode (buffer) {
    const decoder = new TextDecoder('utf8')
    return decoder.decode(buffer)
  }
}
