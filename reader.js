"use strict";

var decorate = require("./util/decorate")
var expand = require("reducers/expand")
var convert = require("reducers/convert")
var when = require("eventual/when")
var defer = require("eventual/defer")
var deliver = require("eventual/deliver")
var accumulated = require("reducers/accumulated")
var error = require("reducers/error")
var end = require("reducers/end")
var Box = require("reducers/box")
var pause = Box("Indicator that source has to be paused")



var fsbinding = process.binding("fs")
var _read = decorate(fsbinding.read)

function readChunckAsync(fd, buffer, start, size) {
  var promise = defer()
  fsbinding.read(fd, buffer, 0, size, start, function onread(error, count) {
    deliver(promise, error || count)
  })
  return promise
}

function readChunckSync(fd, buffer, start, size) {
  try {
    return fsbinding.read(fd, buffer, 0, size, start)
  } catch (error) {
    return error
  }
}

function reader(file, options) {
  var size = options && options.size || 64 * 1024
  var start = options && options.start >= 0 ? options.start : null
  var finish = options && options.end || Infinity
  var encoding = options && options.encoding || "binary"
  var readChunck = options && options.sync ? readChunckSync : readChunckAsync
  var buffer = Buffer(size)

  return expand(file, function(fd) {
    return convert(file, function(self, next, state) {
      function onError(e) { next(error(e)) }
      function onChunk(count) {
        if (count === 0)
          return next(end(), state)

        start = start === null ? start : start + count
        when(next(buffer.slice(0, count), state), onNext, onError)
      }

      function onNext(value) {
        state = value
        if (state && state.is === accumulated)
          return next(end(), state.value)
        else if (start >= finish)
          return next(end(), state)

        if (state && state.is == pause)
          return state

        when(readChunck(fd, buffer, start, size), onChunk, onError)
      }

      onNext(state)
    })
  })
}

module.exports = reader
