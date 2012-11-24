"use strict";

var test = require("reducers/test/util/test")

var fixtures = require("./fixtures")

var unlink = require("../unlink")
var write = require("../write")

var map = require("reducers/map")
var concat = require("reducers/concat")
var capture = require("reducers/capture")

exports["test remove non-existing file"] = test(function(assert) {
  var async = false
  var file = fixtures.join("does-not-exists")
  var actual = concat(capture(unlink(file), function(error) {
                 return [(/ENOENT/).test(error.message), async]
               }))

  assert(actual, [ true, true ], "can not unlink unexisting")
  async = true
})

exports["test remove non-existing file sync"] = test(function(assert) {
  var async = false
  var file = fixtures.join("does-not-exists")
  var actual = concat(capture(unlink(file, { sync: true }), function(error) {
                 return [(/ENOENT/).test(error.message), async]
               }))

  assert(actual, [ true, false ], "can not unlink unexisting")
  async = true
})

exports["test remove file"] = test(function(assert) {
  var async = false
  var file = fixtures.join("temp")
  var actual = concat(write(file, ""),
                      map([async], function() { return async }),
                      unlink(file),
                      map([async], function() { return async }),
                      capture(unlink(file), function(error) {
                        return [(/ENOENT/).test(error.message), async]
                      }))

  assert(actual, [0, true, void(0), true, true, true],
         "unlink works on existing files")
  async = true
})

exports["test remove file sync"] = test(function(assert) {
  var async = false
  var file = fixtures.join("temp")
  var actual = concat(write(file, "", { sync: true }),
                      map([async], function() { return async }),
                      unlink(file, { sync: true }),
                      map([async], function() { return async }),
                      capture(unlink(file), function(error) {
                        return [(/ENOENT/).test(error.message), async]
                      }))

  assert(actual, [0, false, void(0), false, true, true],
         "unlink works on existing files")
  async = true
})

if (module == require.main)
  require("test").run(exports);
