"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")

var readdir = decorate(process.binding("fs").readdir)

function readDirectory(path, options) {
  /**
  Returns reducible sequence of directory entries.
  If `options.sync` is true option happens synchronously.
  **/
  return readdir(makePath(path), options)
}
module.exports = readDirectory
