"use strict";

var fs = require("fs")
var exists = require("../exists")
var fixtures = require("./fixtures")
var fold = require("reducers/fold")
var capture = require("reducers/capture")

exports["test async dir exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("."))
  fold(actual, function(actual) {
    assert.ok(true, "directory exists")
    assert.ok(async, "operation should be async")
    done()
  })
  async = true
}

exports["test sync dir exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("."), { sync: true })
  fold(actual, function(actual) {
    assert.ok(true, "directory exists")
    assert.ok(!async, "operation should be sync")
    done()
  })
  async = true
}

exports["test async file exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("elipses.txt"))
  fold(actual, function(actual) {
    assert.ok(true, "file exists")
    assert.ok(async, "operation should be async")
    done()
  })
  async = true
}

exports["test sync file exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("elipses.txt"), { sync: true })
  fold(actual, function(actual) {
    assert.ok(true, "file exists")
    assert.ok(!async, "operation should be sync")
    done()
  })
  async = true
}


exports["test async does not exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("does-not-exists"))
  fold(actual, function(actual) {
    assert.equal(actual, false, "directory does not exists")
    assert.ok(async, "operation should be async")
    done()
  })
  async = true
}

exports["test sync does not exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("does-not-exists"), { sync: true })
  fold(actual, function(actual) {
    assert.equal(actual, false, "directory does not exists")
    assert.ok(!async, "operation should be sync")
    done()
  })
  async = true
}



if (module == require.main)
  require("test").run(exports)
