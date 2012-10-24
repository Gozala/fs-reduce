"use strict";

var decorate = require("./util/decorate")
var expand = require("reducers/expand")
var drop = require("reducers/drop")

var _close = decorate(process.binding("fs").close)
function close(file, options) {
  return expand(file, function(fd) {
    return drop(_close(fd, options), 1)
  })
}

module.exports = close
