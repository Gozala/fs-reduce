/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true browser: true devel: true
         forin: true latedef: false globalstrict: true */

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
