"use strict";

var test = require("reducers/test/util/test")

var fixtures = require("./fixtures")

var unlink = require("../unlink")
var write = require("../write")
var read = require("../read")
var decode = require("../decode")
var encode = require("../encode")

var map = require("reducers/map")
var concat = require("reducers/concat")
var capture = require("reducers/capture")

exports["test write to file"] = test(function(assert) {
  var async = false
  var file = fixtures.join("write.txt")
  var content = "012345678910"
  var actual = concat(write(file, content),
                      map([async], function() { return async }),
                      unlink(file),
                      map([async], function() { return async }))

  assert(actual, [ content.length, true, void(0), true ],
         "content is written to file")
  async = true
})

exports["test write to file sync"] = test(function(assert) {
  var async = false
  var file = fixtures.join("write.txt")
  var content = "012345678910"
  var actual = concat(write(file, content, { sync: true }),
                      map([async], function() { return async }),
                      unlink(file),
                      map([async], function() { return async }))

  assert(actual, [ content.length, false, void(0), true ],
         "content is written to file")
  async = true
})

exports["test append / overwrite"] = test(function(assert) {
  var async = false
  var file = fixtures.join("append-overwrite.txt")
  var initalContent = "abcdefghijklmnopqrstuvwxyz"

  var isAsync = map([async], function() { return async })
  var fileContent = decode(read(file))
  var initalWrite = write(file, initalContent)
  var append = write(file, "123456", { start: 10, flags: "r+" })
  var overwrite = write(file, "\u2026\u2026", { start: 10, flags: "r+" })
  var stupidOverwrite = write(file, "boom", { start: -5, flags: "r+" })

  var actual = concat(initalWrite, isAsync,
                      fileContent, isAsync,
                      append, isAsync,
                      fileContent, isAsync,
                      overwrite, isAsync,
                      fileContent, isAsync,
                      stupidOverwrite, isAsync,
                      fileContent, isAsync,
                      unlink(file))

  var expected = [
    initalContent.length, true,
    initalContent, true,
    "123456".length, true,
    "abcdefghij123456qrstuvwxyz", true,
    Buffer("\u2026\u2026", "utf-8").length, true,
    "abcdefghij\u2026\u2026qrstuvwxyz", true,
    "boom".length, true,
    "boomefghij\u2026\u2026qrstuvwxyz", true,
    void(0)
  ]

  assert(actual, expected, "append / overwrite files")
  async = true
})

exports["test append / overwrite sync"] = test(function(assert) {
  var async = false
  var file = fixtures.join("append-overwrite.txt")
  var initalContent = "abcdefghijklmnopqrstuvwxyz"

  var isAsync = map([async], function() { return async })
  var fileContent = decode(read(file, { sync: true }))
  var initalWrite = write(file, initalContent, { sync: true })
  var append = write(file, "123456", { start: 10, flags: "r+", sync: true })
  var overwrite = write(file, "\u2026\u2026", { start: 10, flags: "r+", sync: true })
  var stupidOverwrite = write(file, "boom", { start: -5, flags: "r+", sync: true })

  var actual = concat(initalWrite, isAsync,
                      fileContent, isAsync,
                      append, isAsync,
                      fileContent, isAsync,
                      overwrite, isAsync,
                      fileContent, isAsync,
                      stupidOverwrite, isAsync,
                      fileContent, isAsync,
                      unlink(file))

  var expected = [
    initalContent.length, false,
    initalContent, false,
    "123456".length, false,
    "abcdefghij123456qrstuvwxyz", false,
    Buffer("\u2026\u2026", "utf-8").length, false,
    "abcdefghij\u2026\u2026qrstuvwxyz", false,
    "boom".length, false,
    "boomefghij\u2026\u2026qrstuvwxyz", false,
    void(0)
  ]

  assert(actual, expected, "append / overwrite files")
  async = true
})

exports["test write a lot"] = test(function(assert) {
  var N = 10240
  var file = fixtures.join("out.txt")
  var line = "aaaaaaaaaaaaaaaaaaaaaaaaaaaa\n"
  var i = 0

  var content = Array(N + 1).join(line)
  var actual = concat(write(file, content),
                      decode(read(file, {
                        start: line.length * (N - 4),
                        size: line.length
                      })),
                      unlink(file))

  assert(actual, [N * line.length, line, line, line, line, void(0) ],
         "write a lot of content")
})

exports["test write in base64"] = test(function(assert) {
  var file = fixtures.join("test.jpg")
  var data = [
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcH",
    "Bw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/",
    "2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4e",
    "Hh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAQABADASIAAhEBAxEB/8QA",
    "HwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUF",
    "BAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkK",
    "FhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1",
    "dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG",
    "x8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEB",
    "AQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAEC",
    "AxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRom",
    "JygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOE",
    "hYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU",
    "1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDhfBUFl/wk",
    "OmPqKJJZw3aiZFBw4z93jnkkc9u9dj8XLfSI/EBt7DTo7ea2Ox5YXVo5FC7g",
    "Tjq24nJPXNVtO0KATRvNHCIg3zoWJWQHqp+o4pun+EtJ0zxBq8mnLJa2d1L5",
    "0NvnKRjJBUE5PAx3NYxxUY0pRtvYHSc5Ka2X9d7H/9k="
  ].join("\n")

  var writeStream = write(file, encode(data, "base64"))
  var readStream = decode(read(file), "base64")

  var actual = concat(writeStream,
                      readStream,
                      unlink(file))

  assert(actual, [
    Buffer(data, "base64").length,
    data.replace(/\n/g, ""),
    void(0)
  ], "read / write in base64")
})

exports["test write mode"] = test(function(assert) {
  var content = "ümlaut."
  var file = fixtures.join("write-mode.txt")
  var stream = write(file, encode(["", content, ""]), { mode: "0644" })

  var actual = concat(stream,
                      decode(read(file)),
                      unlink(file))

  assert(actual, [
    Buffer(content, "utf-8").length,
    content,
    void(0)
  ], "write in utf-8")
})

exports["test pipe write"] = test(function(assert) {
  var sourceFile = fixtures.join("y.txt")
  var sourceContent = "Hello streamer! How is life? Does all your tests pass?"
  var targetFile = fixtures.join("piped.txt")
  var source = read(sourceFile, { size: 7 })
  var targetContent = decode(read(targetFile))
  var pipe = write(targetFile, source)

  var actual = concat(capture(targetContent, function(error) {
                        return (/ENOENT/).test(error.message)
                      }),
                      pipe,
                      targetContent,
                      unlink(targetFile))

  assert(actual, [
    true,
    sourceContent.length,
    sourceContent,
    void(0)
  ], "pipeing data from one file to another works")
})

if (require.main === module)
  require("test").run(exports)
