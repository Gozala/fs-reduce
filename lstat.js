"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")
// Import stat to make sure stat prototype is extended.
var stat = require("./stat")

var _lstat = decorate(process.binding("fs"))
function lstat(path, options) {
  return _lstat(makePath(path, options))
}

module.exports = lstat
