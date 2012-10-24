"use strict";

var decorate = require("./util/decorate")
var makePath = require("./util/path")
var fsbinding = process.binding("fs")


var _exists = decorate(function(path, callback) {
  try {
    fsbinding.stat(path, callback && function(e) {
      callback(null, e ? false : true)
    })
    return true
  } catch (error) {
    return false
  }
})

function exists(path, options) {
  /**
  Test whether or not the given path exists by checking with the file system.
  Returns sequence of one item containing either true or false.
  **/
  return _exists(makePath(path), options)
}

module.exports = exists
