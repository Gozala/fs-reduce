"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")

var _truncate = decorate(process.binding("fs").truncate)
function truncate(fd, options) {
  return _truncate(fd, options)
}

module.exports = truncate
