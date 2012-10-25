"use strict";

var fixtures = require("./fixtures")
var test = require("./helper")
var unlink = require("../unlink")
var write = require("../write")
var read = require("../read")
var decode = require("../decode")
var reduce = require("reducers/reduce")
var map = require("reducers/map")
var concat = require("reducers/concat")
var capture = require("reducers/capture")


exports["test read in buffers"] = test(function(assert) {
  var async = false
  var content = read(fixtures.join("x.txt"))
  var actual = map(content, function(buffer) {
    return {
      isBuffer: Buffer.isBuffer(buffer),
      string: buffer.toString(),
      async: async
    }
  })

  assert(actual, [{
    isBuffer: true,
    string: "xyz\n",
    async: true
  }], "file reads in buffers")

  async = true
})


exports["test read in buffers sync"] = test(function(assert) {
  var async = false
  var content = read(fixtures.join("x.txt"), { sync: true })
  var actual = map(content, function(buffer) {
    return {
      isBuffer: Buffer.isBuffer(buffer),
      string: buffer.toString(),
      async: async
    }
  })

  assert(actual, [{
    isBuffer: true,
    string: "xyz\n",
    async: false
  }], "file reads in buffers")

  async = true
})

exports["test read in defined chuncks sizes"] = test(function(assert) {
  var async = false
  var content = read(fixtures.join("x.txt"), { size: 2 })
  var actual = map(content, function($) {
    return { data: String($), async: async }
  })

  assert(actual, [
    { data: "xy", async: true },
    { data: "z\n", async: true }
  ], "read in defined chunk sizes")
  async = true
})

exports["test read in defined chuncks sizes sync"] = test(function(assert) {
  var async = false
  var content = read(fixtures.join("x.txt"), { size: 2, sync: true })
  var actual = map(content, function($) {
    return { data: String($), async: async }
  })

  assert(actual, [
    { data: "xy", async: false },
    { data: "z\n", async: false }
  ], "read in defined chunk sizes sync")
  async = true
})

exports["test read with offset"] = test(function(assert) {
  var async = false
  var content = decode(read(fixtures.join("x.txt"), { size: 2, start: 1 }))
  var actual = map(content, function(chunk) {
    return { data: chunk, async: async }
  })

  assert(actual, [
    { data: "yz", async: true },
    { data: "\n", async: true }
  ], "read in defined chunk sizes from given offset")
  async = true
})

exports["test read with offset sync"] = test(function(assert) {
  var async = false
  var content = read(fixtures.join("x.txt"), { size: 2, start: 1, sync: true })
  var actual = map(decode(content), function(chunk) {
    return { data: chunk, async: async }
  })

  assert(actual, [
    { data: "yz", async: false },
    { data: "\n", async: false }
  ], "read in defined chunk sizes from given offset sync")
  async = true
})

exports["test read chucked range"] = test(function(assert) {
  var async = false
  var content = decode(read(fixtures.join("x.txt"), {
    start: 1,
    size: 1,
    end: 3
  }), "utf-8")
  var actual = map(decode(content), function(chunk) {
    return { data: chunk, async: async }
  })


  assert(actual, [
    { data: "y", async: true },
    { data: "z", async: true }
  ], "read in specified chunck sizes and given range")
  async = true
})

exports["test read chucked range sync"] = test(function(assert) {
  var async = false
  var content = decode(read(fixtures.join("x.txt"), {
    start: 1,
    size: 1,
    end: 3,
    sync: true
  }), "utf-8")
  var actual = map(decode(content), function(chunk) {
    return { data: chunk, async: async }
  })


  assert(actual, [
    { data: "y", async: false },
    { data: "z", async: false }
  ], "read in specified chunck sizes and given range")
  async = true
})

exports["test read unexistning"] = test(function(assert) {
  var async = false
  var content = read(fixtures.join("does-not-exist"))
  var actual = capture(content, function(error) {
    return [/ENOENT/.test(error.message), async]
  })

  assert(actual, [true, true], "can't read non-existing file")
  async = true
})

exports["test read unexistning sync"] = test(function(assert) {
  var async = false
  var content = read(fixtures.join("does-not-exist"), { sync: true })
  var actual = capture(content, function(error) {
    return [/ENOENT/.test(error.message), async]
  })

  assert(actual, [true, false], "can't read non-existing file")
  async = true
})

exports["test read unicode"] = test(function(assert) {
  var async = false
  var content = decode(read(fixtures.join("elipses.txt")))
  var actual = map(content, function(data) {
    return { data: data, async: async }
  })

  assert(actual, [{ data: Array(10001).join("\u2026"), async: true }],
         "read file in unicode")
  async = true
})

exports["test read unicode sync"] = test(function(assert) {
  var async = false
  var content = decode(read(fixtures.join("elipses.txt"), { sync: true }))
  var actual = map(content, function(data) {
    return { data: data, async: async }
  })

  assert(actual, [{ data: Array(10001).join("\u2026"), async: false }],
         "read file in unicode")
  async = true
})

exports["test read empty"] = test(function(assert) {
  var async = false
  var actual = concat(read(fixtures.join("empty.txt")),
                      map([async], function() { return async }))

  assert(actual, [true], "read empty")
  async = true
})

exports["test read sync"] = test(function(assert) {
  var async = false
  var actual = concat(read(fixtures.join("empty.txt"), { sync: true }),
                      map([async], function() { return async }))

  assert(actual, [false], "read empty")
  async = true
})


if (module == require.main)
  require("test").run(exports)
