"use strict";

var when = require("eventual/when")
var defer = require("eventual/defer")
var deliver = require("eventual/deliver")
var eventual = require("eventual/decorate")
var sequential = require("reducers/sequential")
var expand = require("reducers/expand")
var reduce = require("reducers/reduce")
var Buffer = require("buffer").Buffer
var fsbinding = process.binding("fs")



function writeChunck(fd, chunk, start, offset) {
  var promise = defer()
  var position = start === null ? start : start + offset
  fsbinding.write(fd, chunk, 0, chunk.length, position, function(error, value) {
    deliver(promise, error || offset + value)
  })
  return promise
}

function writeChunckSync(fd, chunk, start, offset) {
  var position = start === null ? start : start + offset
  try {
    return offset + fsbinding.write(fd, chunk, 0, chunk.length, position)
  } catch(error) {
    return error
  }
}

function writer(file, options) {
  options = options || {}
  var start = options.start || null
  var input = options.input
  var sync = options.sync
  return sequential(expand(file, function(fd) {
    return reduce(input, eventual(function(wrote, chunk) {
      var buffer = Buffer.isBuffer(chunk) ? chunk : Buffer(chunk)
      return !buffer.length ? buffer.length :
             sync ? writeChunckSync(fd, buffer, start, wrote) :
             writeChunck(fd, buffer, start, wrote)
    }), 0)
  }))
}

module.exports = writer
