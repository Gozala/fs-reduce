"use strict";

var close = require("./close")
var open = require("./open")
var decorate = require("./util/decorate")

var concat = require("reducers/concat")
var expand = require("reducers/expand")

function withOpen(path, f, options) {
  // TODO: Close won't execute if part of the result is
  // consumed.
  options = options || {}
  options.cache = "cache" in options ? options.cache : false
  var file = open(path, options)
  return expand(file, function(fd) {
    return concat(f(fd, options), close(fd, options))
  })
}

module.exports = withOpen
