"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")

var binding = process.binding("fs")

// Make stat object stat object return
var statbase = binding.Stats.prototype
Object.defineProperties(statbase, {
  directory: { get: statbase.isDirectory },
  file: { get: statbase.isFile },
  blockDevice: { get: statbase.isBlockDevice },
  characterDevice: { get: statbase.isCharacterDevice },
  symbolicLink: { get: statbase.isSymbolicLink },
  fifo: { get: statbase.isFIFO },
  FIFO: { get: statbase.isFIFO },
  socket: { get: statbase.isSocket },
})

var _stat = decorate(binding.stat)
function stat(path, options) {
  return _stat(makePath(path), options)
}

module.exports = stat
