"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")
var makeMode = require("./util/mode")

var _chmod = decorate(process.binding("fs").chmod)
function chmod(path, mode, options) {
  return _chmod(makePath(path), makeMode(mode), options)
}

module.exports = chmod
