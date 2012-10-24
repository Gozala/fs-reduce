"use strict";

var fs = require("fs")
var exists = require("../exists")
var fixtures = require("./fixtures")
var reduce = require("reducers/reduce")
var capture = require("reducers/capture")

exports["test async dir exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("."))
  reduce(actual, function(_, actual) {
    assert.ok(true, "directory exists")
    assert.ok(async, "operation should be async")
    done()
  })
  async = true
}

exports["test sync dir exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("."), { sync: true })
  reduce(actual, function(_, actual) {
    assert.ok(true, "directory exists")
    assert.ok(!async, "operation should be sync")
    done()
  })
  async = true
}

exports["test async file exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("elipses.txt"))
  reduce(actual, function(_, actual) {
    assert.ok(true, "file exists")
    assert.ok(async, "operation should be async")
    done()
  })
  async = true
}

exports["test sync file exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("elipses.txt"), { sync: true })
  reduce(actual, function(_, actual) {
    assert.ok(true, "file exists")
    assert.ok(!async, "operation should be sync")
    done()
  })
  async = true
}


exports["test async does not exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("does-not-exists"))
  reduce(actual, function(_, actual) {
    assert.equal(actual, false, "directory does not exists")
    assert.ok(async, "operation should be async")
    done()
  })
  async = true
}

exports["test sync does not exists"] = function(assert, done) {
  var async = false
  var actual = exists(fixtures.join("does-not-exists"), { sync: true })
  reduce(actual, function(_, actual) {
    assert.equal(actual, false, "directory does not exists")
    assert.ok(!async, "operation should be sync")
    done()
  })
  async = true
}



if (module == require.main)
  require("test").run(exports)
