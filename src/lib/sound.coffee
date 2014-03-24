
define (require, exports) ->
  class BasicSound
    constructor: (aud) ->
      @audio = aud

    play: ->
      @audio.currentTime = 0
      @audio.play()

    pause: ->
      @audio.pause()

    resume: ->
      @audio.play()

    stop: ->
      @audio.pause()

    getPosition: ->
      @audio.currentTime * 1000

    getDuration: ->
      @audio.duration * 1000

  exports.BasicSound = BasicSound

  return
