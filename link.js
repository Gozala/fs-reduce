"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")

var _link = decorate(process.binding("fs").link)
function link(source, target) {
  return _link(makePath(source), makePath(target))
}

module.exports = link
