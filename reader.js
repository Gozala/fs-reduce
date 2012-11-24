"use strict";

var decorate = require("./util/decorate")

var expand = require("reducers/expand")

var when = require("eventual/when")
var defer = require("eventual/defer")
var deliver = require("eventual/deliver")

var reducible = require("reducible/reducible")
var isReduced = require("reducible/is-reduced")
var end = require("reducible/end")

var fsbinding = process.binding("fs")
var _read = decorate(fsbinding.read)


function reader(fd, options) {
  /**
  Function takes file descriptor and set of options describing how to perform
  a read. In result it returns pseudo-lazy collection of chunks being read.
  Actual read is initiated by reduction over returned value, and read happens
  in chunks of specific `size` (default chunk size can be specified via
  optional `options.size`). Once consumer is given a chunk it could defer
  further reads by returning an eventual that's delivered when next chunk
  should be read (write and writer return eventuals that's delivered once
  chunk is written. In addition function can be passed `option.start` and
  `option.finish` positions to specify a range of the read. By default it will
  read from the current position till end of it. Read is asynchronous by
  default but synchronous read can be enforced by passing `options.sync`
  with a value `true`.
  **/

  var size = options && options.size || 64 * 1024
  var position = options && options.start >= 0 ? options.start : null
  var finish = options && options.end || Infinity
  var readChunk = options && options.sync ? readChunkSync : readChunkAsync
  var buffer = Buffer(size)

  return reducible(function(next, state) {
    // Since passing an error to `next` will error a collection, it's used
    // as an error handler.
    var onError = next

    // Function is used to read out given `count` bytes from the file starting
    // from the current position. Note that `position` is captured. `onChunk`
    // handler is invoked after reading a chunk of a file.
    function onChunk(count) {
      // If chunk read has no bytes than there is nothing left, so end a
      // collection.
      if (count === 0) return next(end)

      // Move a offset `position` with `count` towards the end unless
      // position was a `null` in which case we just keep it (`null` means
      // from a current position).
      position = position === null ? position : position + count
      // Read chunk is forwarded to a consumer that will return
      // a promise which is delivered once write is complete.
      // In a future we may switch to an approach similar to new
      // streams in node, where buffering watermarks are specified
      // via options and reads can buffer up up to that point in
      // parallel to write.
      when(next(buffer.slice(0, count), state), onDrain, onError)
    }

    // Handler is invoked whenever consumer of the collection finished
    // consumption of the previous chunk and can accept more data. It's
    // also passed a new state value that is being accumulated.
    function onDrain(value) {
      state = value
      // If value is marked as `reduced` no further reads should take place,
      // as consumer has finished consumption.
      if (isReduced(value)) return next(end)
      // If current `position` has reached or passed `finish` mark end a
      // collection.
      else if (position >= finish) return next(end, state)

      // Otherwise read another chunk from the current position & execute
      // `onChunk` handler or `onError` if fails. Note that `readChunk`
      // reads chunk and returns either number of bytes read or a promise
      // for that or an error if failed. Errors will invoke onError handler
      // causing collection error and end. `onChunk` will propagate data
      // further likely to the writer on the other end.
      when(readChunk(fd, buffer, position, size), onChunk, onError)
    }

    // Start reading!
    onDrain(state)
  })
}


function readChunkAsync(fd, buffer, start, size) {
  /**
  Function reads a chunk in specified range (`start`, `size`) from given
  `fd` file descriptor into a given `buffer` asynchronously and returns
  promise that is delivered a number of bytes being read or rejected with
  an error.
  **/
  var promise = defer()
  fsbinding.read(fd, buffer, 0, size, start, function onread(error, count) {
    deliver(promise, error || count)
  })
  return promise
}

function readChunkSync(fd, buffer, start, size) {
  /**
  Function reads a chunk in specified range (`start`, `size`) from given
  `fd` file descriptor into a given `buffer` synchronously and returns
  a number of bytes being read or an error if read failed.
  **/
  try {
    return fsbinding.read(fd, buffer, 0, size, start)
  } catch (error) {
    return error
  }
}

module.exports = reader
