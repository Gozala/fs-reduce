"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")

var rmdir = decorate(process.binding("fs").rmdir)

function removeDirectory(path, options) {
  return rmdir(makePath(path), options)
}

module.exports = removeDirectory
