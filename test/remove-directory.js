"use strict";

var test = require("reducers/test/util/test")

var fixtures = require("./fixtures")

var path = require("path")

var makeDirectory = require("../make-directory")
var removeDirectory = require("../remove-directory")
var stat = require("../stat")

var concat = require("reducers/concat")
var map = require("reducers/map")
var capture = require("reducers/capture")

exports["test remove non-existing"] = test(function(assert) {
  var async = false
  var file = fixtures.join("does_not_exist")
  var actual = concat(capture(removeDirectory(file), function(error) {
                        return (/ENOENT/).test(error.message)
                      }),
                      map([async], function($) { return async }))

  assert(actual, [true, true], "can't remove non-existing directory")
  async = true
})

exports["test remove directory"] = test(function(assert) {
  var async = false
  var file = fixtures.join("romeve-dir")
  var actual = concat(makeDirectory(file, { sync: true }),
                      removeDirectory(file),
                      map([async], function($) { return async }),
                      capture(removeDirectory(file), function(error) {
                        return (/ENOENT/).test(error.message)
                      }))

  assert(actual, [void(0), (void 0), true, true],
         "created & removed directory")

  async = true
})

exports["test remove directory sync"] = test(function(assert) {
  var async = false
  var file = fixtures.join("romeve-dir")
  var actual = concat(makeDirectory(file, { sync: true }),
                      removeDirectory(file, { sync: true }),
                      map([async], function($) { return async }),
                      capture(removeDirectory(file), function(error) {
                        return (/ENOENT/).test(error.message)
                      }))

  assert(actual, [void(0), (void 0), false, true],
         "created & removed directory sync")

  async = true
})

if (require.main === module)
  require("test").run(exports)
