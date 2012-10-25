"use strict";

var withOpen = require("./with-open")
var reader = require("./reader")

function read(file, options) {
  options = options || {}
  options.flags = options.flags || "r"
  return typeof(file) === "string" ? withOpen(file, reader, options) :
                                     reader(file, options)
}

module.exports = read
