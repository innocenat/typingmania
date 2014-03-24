###
  XHR2-based Asynchronous Loader
  Dependancy: Promise.coffee
###

define (require, exports) ->

  Promise = require 'lib/promise'

  # Polyfill
  window.URL = window.URL || window.webkitURL
  if not window.URL
    throw new Error "Require browser URL support"

  ###
    Base loader class that abstract XHR callback
    to Promise
  ###
  class Base extends Promise
    @xhr = null
    @response = null

    constructor: (@method, @url, @username, @password) ->
      super()
      @xhr = new XMLHttpRequest()
      @xhr.open @method, @url, true, @username, @password

      @xhr.addEventListener 'progress',  (evt) => @_xhrprogress evt
      @xhr.addEventListener 'load',      (evt) => @_xhrload evt
      @xhr.addEventListener 'error',     (evt) => @_xhrerror evt
      @xhr.addEventListener 'abort',     (evt) => @_xhrabort evt

    send: (data) ->
      @xhr.send(data)

    _xhrprogress: (evt) ->
      @progress evt

    _xhrload: (evt) ->
      @response = @xhr.response
      @fulfill @response

    _xhrerror: (evt) ->
      @reject evt

    _xhrabort: (evt) ->
      @reject evt

  class JSONLoader extends Base
    _xhrload: (evt) ->
      @response = JSON.parse @xhr.responseText
      @fulfill @response

  class BlobLoader extends Base
    constructor: (method, url, username, password) ->
      super method, url, username, password
      @xhr.responseType = "blob"

  class ArrayBufferLoader extends Base
    constructor: (method, url, username, password) ->
      super method, url, username, password
      @xhr.responseType = "arraybuffer"

  class ImageLoader extends BlobLoader
    @blob_id = ''

    _xhrload: (evt) ->
      @blob_id = window.URL.createObjectURL(@xhr.response)
      @response = new Image()
      @response.addEventListener 'load', => @fulfill @response
      @response.src = @blob_id

  class MusicLoader extends BlobLoader
    @blob_id = ''

    _xhrload: (evt) ->
      @blob_id = window.URL.createObjectURL(@xhr.response)
      @response = new Audio()
      @response.addEventListener 'canplaythrough', (evt) => @fulfill @response # or just 'canplay' event?
      @response.src = @blob_id
      @response.load()

  class SoundLoader extends ArrayBufferLoader

  @Loader = {}

  exports.json = (method, url, username, password) ->
    return new JSONLoader method, url, username, password

  exports.image = (method, url, username, password) ->
    return new ImageLoader method, url, username, password

  exports.music = (method, url, username, password) ->
    return new MusicLoader method, url, username, password

  exports.sound = (method, url, username, password) ->
    return new SoundLoader method, url, username, password

  return
