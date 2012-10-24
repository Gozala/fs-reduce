"use strict";

var when = require("eventual/when")
var defer = require("eventual/defer")
var deliver = require("pending/deliver")
var sequential = require("reducers/sequential")
var expand = require("reducers/expand")
var reduce = require("reducers/reduce")
var eventual = require("eventual/decorate")
var fsbinding = process.binding("fs")


function writeChunck(fd, chunk, start, offset) {
  var promise = defer()
  var position = start === null ? start : start + offset
  fsbinding.write(fd, chunk, 0, chunk.length, position, function(error, value) {
    deliver(promise, error || offset + value)
  })
  return promise
}

function writer(file, options) {
  options = options || {}
  var start = options.start || null
  var input = options.input
  return sequential(expand(file, function(fd) {
    return reduce(input, eventual(function(wrote, chunk) {
      return writeChunck(fd, chunk, start, wrote)
    }), 0)
  }))
}

module.exports = writer
