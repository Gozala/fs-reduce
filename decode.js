"use strict";

var map = require("reducers/map")

function decode(content, encoding) {
  /**
  Function takes a stream of buffers likely from file read and
  returns stream of same data but in a specified `encoding`. If
  `encoding` is not specified "utf-8" is used. For raw format
  just use `read`.
  **/
  encoding = encoding || "utf-8"
  return map(content, function(buffer) {
    return buffer.toString(encoding)
  })
}

module.exports = decode
