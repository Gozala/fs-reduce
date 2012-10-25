"use strict";

var withOpen = require("./with-open")
var writer = require("./writer")

function write(file, input, options) {
  options = options || {}
  options.flags = options.flags || "w"
  options.input = input
  return typeof(file) === "string" ? withOpen(file, writer, options) :
                                     writer(file, options)
}

module.exports = write
