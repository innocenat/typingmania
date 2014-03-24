###
  Lightweight Promise/A+ -like implementation with additional of progress
  event like in original Promise/A specification.

  Note that it currently does not pass Promise/A+ test suite.
###

###
  State ENUM
###
State =
  PENDING: 0
  FULFILLED: 1
  REJECTED: 2

###
  Callback object which stored callback functions,
  a promise object bind to this set of callback, and
  resolving status.
###
class PromiseCallback
  constructor: (@fulfilled, @rejected, @progress) ->
    @promise = new Promise State.PENDING
    @resolved = false

###
  Main class for promise
###
class Promise
  constructor: (@state = State.PENDING) ->
    @callbacks = []
    @value = undefined

  then: (fulfilled, failed, progress) ->
    callback = new PromiseCallback fulfilled, failed, progress
    if @state is State.PENDING
      @callbacks.push(callback)
    else
      @_resolve(callback)
    callback.promise

  fulfill: (value) ->
    if @state is State.PENDING
      @state = State.FULFILLED
      @value = value
      @_resolve_all()
    return

  reject: (reason) ->
    if @state is State.PENDING
      @state = State.REJECTED
      @value = reason
      @_resolve_all()
    return

  progress: (progress) ->
    if @state is State.PENDING
      for cb in @callbacks
        if typeof cb.progress is "function"
          @_do_callback ->
            cb.progress.call undefined, progress
    return

  @all: (args...) ->
    if args.length is 0
      p = new Promise true
      p.fulfill true
      return p

    if args.length is 1
      return args[0]

    p = args[0]
    i = 1
    while i < args.length
      p = p.then -> args[i]
      i++
    p

  _resolve_all: () ->
    for c in @callbacks
      @_resolve(c)
    return

  _resolve: (c) ->
    if @state is State.PENDING
      return
    if c.resolved
      return

    c.resolved = true
    callback = undefined

    try
      if @state is State.FULFILLED
        if typeof c.fulfilled is "function"
          callback = =>
            @_resolve_callback(c.fulfilled, @value, c.promise)
        else
          callback = =>
            c.promise.fulfill(@value)
      else if @state is State.REJECTED
        if typeof c.rejected is "function"
          callback = =>
            @_resolve_callback(c.rejected, @value, c.promise)
        else
          callback = =>
            c.promise.reject(@value)
    catch err
      callback = ->
        c.promise.reject(err)

    @_do_callback(callback)
    return

  ###
    Error-checked promise callback calling
  ###
  _resolve_callback: (callback, value, promise) ->
    try
      ret = callback(value)
      @_resolve_promise(promise, ret)
    catch err
      promise.reject(err)
    return

  ###
    Perform callback using async/not async mode as created
  ###
  _do_callback: (callback) ->
    setTimeout callback, 1
    return

  ###
    [[Resolve]](promise, x) as defined by Promise/A+ spec
  ###
  _resolve_promise: (promise, x) ->
    if promise is x
      promise.reject new TypeError "Cannot [[Resolve]] same object"
    else if x instanceof Promise
      x.then promise.fulfill, promise.reject, promise.progress
    else if typeof x is "function" or typeof x is "object"
      try
        thn = x.then
        if typeof thn is "function"
          thn.call x, promise.fulfill, promise.reject
        else
          promise.fulfill x
      catch err
        promise.reject err
    else
      promise.fulfill x
    return

# Exports
@Promise = Promise
