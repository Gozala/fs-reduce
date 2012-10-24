"use strict";

var decorate = require("./util/decorate")
var makeMode = require("./util/mode")
var makePath = require("./util/path")

var mkdir = decorate(process.binding("fs").mkdir)
var DEFAULT_DIR_MODE = makeMode("0777")

function makeDirectory(path, options) {
  var mode = options && options.mode ? makeMode(options.mode) : DEFAULT_DIR_MODE
  return mkdir(makePath(path), mode, options)
}

module.exports = makeDirectory
