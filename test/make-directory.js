"use strict";

var makeDirectory = require("../make-directory")
var removeDirectory = require("../remove-directory")
var stat = require("../stat")
var reduce = require("reducers/reduce")
var concat = require("reducers/concat")
var path = require("path")
var map = require("reducers/map")
var fixtures = require("./fixtures")
var capture = require("reducers/capture")
var test = require("./helper")

exports["test make directory"] = test(function(assert) {
  var async = false
  var file = fixtures.join("make-dir")
  var actual = concat(makeDirectory(file),
                      map([async], function($) { return async }),
                      map(stat(file), function($) { return $.directory }),
                      removeDirectory(file))
  assert(actual, [void(0), true, true, void(0)], "directory created")
  async = true
})

exports["test make directory sync"] = test(function(assert) {
  var async = false
  var file = fixtures.join("make-dir")
  var actual = concat(makeDirectory(file, { sync: true }),
                     map([async], function($) { return async }),
                     map(stat(file), function($) { return $.directory }),
                     removeDirectory(file))

  assert(actual, [void(0), false, true, void(0)], "directory created sync")
  async = true
})

exports["test can't make existing directory"] = test(function(assert) {
  var async = false
  var file = fixtures.join("remake-dir")
  var actual = concat(makeDirectory(file),
                      map([async], function($) { return async }),
                      map(stat(file), function($) { return $.directory }),
                      capture(makeDirectory(file), function(error) {
                        return (/EXIST/).test(error.message)
                      }),
                      removeDirectory(file))

  assert(actual, [void(0), true, true, true, void(0)],
         "can't make existing directory")
  async = true
})

exports["test can't make existing directory sync"] = test(function(assert) {
  var async = false
  var file = fixtures.join("remake-dir")
  var actual = concat(makeDirectory(file, { sync: true }),
                      map([async], function($) { return async }),
                      map(stat(file), function($) { return $.directory }),
                      capture(makeDirectory(file), function(error) {
                        return (/EXIST/).test(error.message)
                      }),
                      removeDirectory(file))

  assert(actual, [void(0), false, true, true, void(0)],
         "can't make existing directory")
  async = true
})

exports['test make with modes'] = test(function(assert) {
  var async = false
  var mode = parseInt('0755', 8)
  var file = fixtures.join("make-mode-dir")
  var actual = concat(makeDirectory(file, { mode: mode }),
                      map([async], function($) { return async }),
                      map(stat(file), function($) {
                        return $.mode & parseInt('777', 8)
                      }),
                      removeDirectory(file),
                      makeDirectory(file, {}),
                      removeDirectory(file),
                      capture(makeDirectory(file, { mode: "t" }), function(e) {
                        return (/argument/).test(e.message)
                      }))
  var expected = [void(0), true, mode, void(0), void(0), void(0), true]

  assert(actual, expected, "directory can be created with modes")
  async = true
})

exports['test make with modes sync'] = test(function(assert) {
  var async = false
  var mode = parseInt('0755', 8)
  var file = fixtures.join("make-mode-dir")
  var actual = concat(makeDirectory(file, { mode: mode, sync: true }),
                      map([async], function($) { return async }),
                      map(stat(file), function($) {
                        return $.mode & parseInt('777', 8)
                      }),
                      removeDirectory(file),
                      makeDirectory(file, {}),
                      removeDirectory(file),
                      capture(makeDirectory(file, { mode: "t" }), function(e) {
                        return (/argument/).test(e.message)
                      }))

  var expected = [void(0), false, mode, void(0), void(0), void(0), true]

  assert(actual, expected, "directory can be created with modes")
  async = true
})

if (require.main === module)
  require("test").run(exports)
