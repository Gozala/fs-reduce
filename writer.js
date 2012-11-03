"use strict";

var when = require("eventual/when")
var defer = require("eventual/defer")
var deliver = require("eventual/deliver")
var eventual = require("eventual/decorate")
var reduce = require("reducers/reduce")
var Buffer = require("buffer").Buffer
var fsbinding = process.binding("fs")


function writer(fd, options) {
  /**
  Function takes file descriptor and set of options describing how to perform
  a write. `options.input` represents a `reducible` collection of content
  to be written into given `fd` file descriptor. By default write happens from
  the current position in a file, although that can be overridden by giving
  optionally `options.start` position. Writer is asynchronous by default but
  synchronous write can be enforced by setting `options.sync` to `true`.
  Although that does not necessary means that overall operation will be
  synchronous since `options.input` still can be asynchronous.
  **/
  options = options || {}
  var start = options.start || null
  var input = options.input
  var sync = options.sync
  var writeChunk = options.sync ? writeChunkSync : writeChunkAsync
  // Provided content input is reduced and written number of bytes are
  // accumulated. Also note that `reduceWriterInput` is decorated via
  // `eventual` function that way even if chunks are are pushed too fast
  // they will be queued until last write is finished, although reader
  // from this library will play nicely, it's lazy & reads new chunks only
  // only once writes are done. Decorator also enables writing form arrays
  // of promises for example as it will wait on the `chunk` to be delivered
  // before actually running a function.
  return reduce(input, eventual(function reduceWriterInput(wrote, chunk) {
    var buffer = Buffer.isBuffer(chunk) ? chunk : Buffer(chunk)
    // If buffer is empty there's nothing to write, if not then dispatch
    // to `writeChunk` that is either asynchronous or synchronous depending
    // on options being passed, returning number of bytes written overall or
    // a promise for it. Note that `input` if provided by this library will
    // not further read chunks until promise is delivered.
    return !buffer.length ? wrote :
           writeChunk(fd, buffer, start, wrote)
  }), 0)
}


function writeChunkAsync(fd, chunk, start, offset) {
  /**
  Function writes a given `chunk` into a given `fd` file descriptor
  from the `start` position passed the given `offset` asynchronously
  and returns promise for `offset + wrote` were `wrote` is number of
  bytes written (note that `offset` is provided only because `writer`
  needs to accumulate a number of bytes it wrote which would be more
  efficient by summing up here). If write fails returned promise is
  delivered an error.
  **/
  var promise = defer()
  var position = start === null ? start : start + offset
  fsbinding.write(fd, chunk, 0, chunk.length, position, function(error, value) {
    deliver(promise, error || offset + value)
  })
  return promise
}


function writeChunkSync(fd, chunk, start, offset) {
  /**
  Function writes a given `chunk` into a given `fd` file descriptor
  from the `start` position passed the given `offset` synchronously
  and returns `offset + wrote` were `wrote` is number of bytes written
  If write fails error is returned back.
  **/
  var position = start === null ? start : start + offset
  try {
    return offset + fsbinding.write(fd, chunk, 0, chunk.length, position)
  } catch(error) {
    return error
  }
}

module.exports = writer
