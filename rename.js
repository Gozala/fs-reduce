"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")

var _rename = decorate(process.binding("fs").rename)
function rename(from, to, options) {
  return _rename(makePath(from), makePath(to), options)
}

module.exports = rename
