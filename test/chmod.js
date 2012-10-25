"use strict";

var fs = require("fs")
var stat = require("../stat")
var reduce = require("reducers/reduce")
var concat = require("reducers/concat")
var path = require("path")
var map = require("reducers/map")
var fixtures = require("./fixtures")
var capture = require("reducers/capture")
var test = require("./helper")
var chmod = require("../chmod")

var isWindows = process.platform === "win32"

// Need to hijack fs.open/close to make sure that things
// get closed once they"re opened.
fs._open = fs.open;
fs._openSync = fs.openSync;
fs.open = open;
fs.openSync = openSync;
fs._close = fs.close;
fs._closeSync = fs.closeSync;
fs.close = close;
fs.closeSync = closeSync;

var openCount = 0;

function open() {
  openCount++;
  return fs._open.apply(fs, arguments);
}

function openSync() {
  openCount++;
  return fs._openSync.apply(fs, arguments);
}

function close() {
  openCount--;
  return fs._close.apply(fs, arguments);
}

function closeSync() {
  openCount--;
  return fs._closeSync.apply(fs, arguments);
}

// On Windows chmod is only able to manipulate read-only bit
var mode_async = isWindows ? parseInt("0400", 8) : parseInt("0777", 8)
var mode_sync = isWindows ? parseInt("0600", 8) : parseInt("0644", 8)
var file2 = fixtures.join("a1.js")

exports["test chmod"] = test(function(assert) {
  var async = false
  var file = fixtures.join("a.js")
  var actual = concat(chmod(file, mode_async.toString(8), { sync: true }),
                      map([async], function($) { return async }),
                      map(stat(file), function($) {
                        return $.mode & parseInt("0777", 8)
                      }),
                      chmod(file, mode_sync.toString(8)),
                      map([async], function($) { return async }),
                      map(stat(file), function($) {
                        return $.mode & parseInt("0777", 8)
                      }))
  assert(actual, [void(0), false, mode_async,
                  void(0), true, mode_sync], "chmod worked")
  async = true
})


/*

fs.open(file2, "a", function(err, fd) {
  if (err) {
    got_error = true;
    console.error(err.stack);
    return;
  }
  fs.fchmod(fd, mode_async.toString(8), function(err) {
    if (err) {
      got_error = true;
    } else {
      console.log(fs.fstatSync(fd).mode);

      if (is_windows) {
        assert.ok((fs.fstatSync(fd).mode & 0777) & mode_async);
      } else {
        assert.equal(mode_async, fs.fstatSync(fd).mode & 0777);
      }

      fs.fchmodSync(fd, mode_sync);
      if (is_windows) {
        assert.ok((fs.fstatSync(fd).mode & 0777) & mode_sync);
      } else {
        assert.equal(mode_sync, fs.fstatSync(fd).mode & 0777);
      }
      success_count++;
      fs.close(fd);
    }
  });
});

// lchmod
if (fs.lchmod) {
  var link = path.join(common.tmpDir, "symbolic-link");

  try {
    fs.unlinkSync(link);
  } catch (er) {}
  fs.symlinkSync(file2, link);

  fs.lchmod(link, mode_async, function(err) {
    if (err) {
      got_error = true;
    } else {
      console.log(fs.lstatSync(link).mode);
      assert.equal(mode_async, fs.lstatSync(link).mode & 0777);

      fs.lchmodSync(link, mode_sync);
      assert.equal(mode_sync, fs.lstatSync(link).mode & 0777);
      success_count++;
    }
  });
} else {
  success_count++;
}


process.on("exit", function() {
  assert.equal(3, success_count);
  assert.equal(0, openCount);
  assert.equal(false, got_error);
});

*/


if (require.main === module)
  require("test").run(exports)
