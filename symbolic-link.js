"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")

var symlink = decorate(process.binding("fs").symlink)
var isWindows = process.platform === "win32"

function preprocessSymlinkDestination(path, type) {
  return !isWindows ? path : // No preprocessing is needed on Unix.
         // Junctions paths need to be absolute and \\?\-prefixed.
         type === "junction" ? makePath(path) :
         // Windows symlinks don't tolerate forward slashes.
         ('' + path).replace(/\//g, "\\")
}

function symbolicLink(destination, path, options) {
  var type = options && options.type || null
  var target = preprocessSymlinkDestination(destination)
  return symlink(target, makePath(path), type)
}

module.exports = symbolicLink
