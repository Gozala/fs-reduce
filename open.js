"use strict";

var cache = require("cache-reduce")

var decorate = require("./util/decorate")
var makePath = require("./util/path")
var makeMode = require("./util/mode")
var makeFlags = require("./util/flags")

var DEFAULT_FILE_MODE = makeMode("0666")

var _open = decorate(process.binding("fs").open)
function open(path, options) {
  var flags = makeFlags(options && options.flags || "r")
  var mode = makeMode(options && options.mode || DEFAULT_FILE_MODE)
  var file = _open(makePath(path), flags, mode, options)
  return options && options.cache === false ? file : cache(file)
}

module.exports = open
