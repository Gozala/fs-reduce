"use strict";

var close = require("./close")
var open = require("./open")
var concat = require("reducers/concat")

var decorate = require("./util/decorate")

function withOpen(path, f, options) {
  var file = open(path, options)
  // TODO: Close won't execute if part of the result is
  // consumed.
  return concat(f(file, options), close(file))
}

module.exports = withOpen
