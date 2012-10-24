"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")

var readlink = decorate(process.binding("fs").readlink)
function readLink(path, options) {
  return readlink(makePath(path), options)
}
module.exports = readLink
