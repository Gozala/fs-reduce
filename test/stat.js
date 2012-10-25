"use strict";

var stat = require("../stat")
var concat = require("reducers/concat")
var capture = require("reducers/capture")
var map = require("reducers/map")
var fixtures = require("./fixtures")
var test = require("./helper")

function Stat(stat) {
  return {
    directory: stat.directory,
    file: stat.file,
    mtime: stat.mtime instanceof Date
  }
}

exports["test stat pwd"] = test(function(assert) {
  var async = false
  var actual = concat(map(stat("."), Stat),
                      map([async], function() { return async }))

  assert(actual, [{ directory: true, file: false, mtime: true }, true],
         "stat for the pwd")

  async = true
})

exports["test stat pwd sync"] = test(function(assert) {
  var async = false
  var actual = concat(map(stat(".", { sync: true }), Stat),
                      map([async], function() { return async }))

  assert(actual, [{ directory: true, file: false, mtime: true }, false],
         "sync stat for the pwd")

  async = true
})

exports["test stat file"] = test(function(assert) {
  var async = false
  var actual = concat(map(stat(fixtures.join("x.txt")), Stat),
                      map([async], function() { return async }))
 

  assert(actual, [{ directory: false, file: true, mtime: true }, true],
        "stat for file")
  async = true
})

exports["test stat file sync"] = test(function(assert) {
  var async = false
  var actual = concat(map(stat(fixtures.join("x.txt", { sync: true })), Stat),
                      map([async], function() { return async }))
 

  assert(actual, [{ directory: false, file: true, mtime: true }, true],
        "stat for file")
  async = true
})

exports["test stat non-existing"] = test(function(assert) {
  var async = false
  var stats = stat(fixtures.join("does-not-exist"))
  var actual = capture(stats, function(error) {
    return [(/ENOENT/).test(error.message), async]
  })

  assert(actual, [true, true], "error occured on non-existing file")
  async = true
})

exports["test stat non-existing sync"] = test(function(assert) {
  var async = false
  var stats = stat(fixtures.join("does-not-exist"), { sync: true })
  var actual = capture(stats, function(error) {
    return [(/ENOENT/).test(error.message), async]
  })

  assert(actual, [true, false], "error occured on non-existing file")
  async = true
})

if (module == require.main)
  require("test").run(exports)
