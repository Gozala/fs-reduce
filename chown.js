"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")
var makeMode = require("./util/mode")

var _chown = decorate(process.binding("fs").chown)
function chown(path, uid, gid, options) {
  return _chown(makePath(path), uid, gid, options)
}

module.exports = chown
