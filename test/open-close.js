"use strict";

var test = require("reducers/test/util/test")

var open = require("../open")

var fixtures = require("./fixtures")

var capture = require("reducers/capture")
var concat = require("reducers/concat")


exports["test open for read non-existing"] = test(function(assert) {
  var async = false
  var file = fixtures.join("does-not-exists")
  var actual = capture(open(file), function(error) {
    return [(/ENOENT/).test(error.message), async]
  })

  assert(actual, [true, true], "can not open non existing file")
  async = true
})

exports["test open for read non-existing sync"] = test(function(assert) {
  var async = false
  var file = fixtures.join("does-not-exists")
  var actual = capture(open(file, { sync: true }), function(error) {
    return [(/ENOENT/).test(error.message), async]
  })

  assert(actual, [true, false], "can not open non existing file")
  async = true
})

/*
exports["test open for write non-existing"] = function(expect, complete) {
  var file = path.join(root, "open-for-write")
  var actual = fs.open(file, { flags: "w" })

  expect(test(actual)).to.be(true)
  expect(fs.close(actual)).to.be.empty()
  expect(fs.remove(file)).to.be.empty().then(complete)
}

exports["test on two opens"] = function(expect, complete) {
  var file = path.join(root, "x.txt"), fds = []
  function push(fd) { fds.push(fd); return !!fd }

  var file1 = fs.open(file)
  var file2 = fs.open(file)
  expect(streamer.map(push, file1)).to.be(true)
  expect(streamer.map(push, file2)).to.be(true).then(function(assert) {
    assert.notEqual(fds[0], fds[1], "created new descriptor on each open")
    expect(fs.close(file1)).to.be.empty()
    expect(fs.close(file2)).to.be.empty().then(complete)
  })
}

exports["test second close fails"] = function(expect, complete) {
  var file = fs.open(path.join(root, "y.txt"))

  expect(fs.close(file)).to.be.empty()
  expect(fs.close(file)).to.have.error(/EBADF/).then(complete)
}

exports["test open / close file"] = function(expect, complete) {
  var file = path.join(root, "x.txt"), fds = []
  function push(fd) { fds.push(fd); return !!fd }

  var file1 = fs.open(file)
  expect(streamer.map(push, file1)).to.be(true)
  expect(fs.close(file1)).to.be.empty().then(function(assert) {
    var file2 = fs.open(file)
    expect(streamer.map(push, file2)).to.be(true).then(function(assert) {
      assert.equal(fds[0], fds[1], "created same descriptor if closed")
      expect(fs.close(file2)).to.be.empty().then(complete)
    })
  })
}
*/

if (module == require.main)
  require("test").run(exports)
