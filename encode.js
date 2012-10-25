"use strict";

var map = require("reducers/map")

function encode(content, encoding) {
  /**
  Function takes a stream of text likely to be written into file
  and returns stream of buffers encoded with specified `encoding`.
  If `encoding` is not specified "utf-8" is used. For raw format
  just use buffers.
  **/
  encoding = encoding || "utf-8"
  return map(content, function(data) {
    return Buffer(data, encoding)
  })
}

module.exports = encode
