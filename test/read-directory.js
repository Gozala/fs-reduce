"use strict";

var fs = require("fs")

var readDirectory = require("../read-directory")

var fixtures = require("./fixtures")

var fold = require("reducers/fold")
var capture = require("reducers/capture")

exports["test read directory"] = function(assert, done) {
  var entries = readDirectory(fixtures.join("."))
  var expected = fs.readdirSync(fixtures.join("."))
  var async = false

  var asserts = fold(entries, function(actual, expected) {
    assert.deepEqual(expected.shift(), actual, "item listed: " + actual)
    if (!async) assert.fail("operation was not async")
    if (expected.length) return expected
    else done()
    return expected
  }, expected)
  async = true
}

exports["test read directory sync"] = function(assert, done) {
  var entries = readDirectory(fixtures.join("."), { sync: true })
  var expected = fs.readdirSync(fixtures.join("."))
  var async = false

  var asserts = fold(entries, function(actual, expected) {
    assert.deepEqual(expected.shift(), actual, "item listed: " + actual)
    if (async) assert.fail("operation was async")
    if (expected.length) return expected
    else done()
    return expected
  }, expected)
  async = true
}

exports["test read non-existing directory"] = function(assert, done) {
  var errored = false
  var entries = readDirectory(fixtures.join("does-not-exists"))
  var async = false
  var recovered = capture(entries, function(error) {
    errored = true
    assert.ok(/ENOENT/.test(error.message), "ENOENT error")
    return [ "not-found"  ]
  })

  fold(recovered, function(entries) {
    assert.equal(entries, "not-found", "error recovered")
    assert.ok(async, "operation should be async")
    done()
  })
  async = true
}

exports["test read non-existing directory sync"] = function(assert, done) {
  var errored = false
  var entries = readDirectory(fixtures.join("does-not-exists"), { sync: true })
  var async = false
  var recovered = capture(entries, function(error) {
    errored = true
    assert.ok(/ENOENT/.test(error.message), "ENOENT error")
    return [ "not-found"  ]
  })

  fold(recovered, function(entries) {
    assert.equal(entries, "not-found", "error recovered")
    assert.ok(!async, "operation should be sync")
    done()
  })

  async = true
}

if (module == require.main)
  require("test").run(exports)
