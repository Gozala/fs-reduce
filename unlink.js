"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")

var _unlink = decorate(process.binding("fs"))
function unlink(path, options) {
  return _unlink(makePath(path), options)
}

module.exports = unlink
