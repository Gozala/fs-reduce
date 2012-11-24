"use strict";

exports["test exists"] = require("./exists")
exports["test make directory"] = require("./make-directory")
exports["test read directory"] = require("./read-directory")
exports["test remove directory"] = require("./remove-directory")
exports["test chmod"] = require("./read-directory")
exports["test unlink"] = require("./unlink")
exports["test stat"] = require("./stat")
exports["test open / close"] = require("./open-close")
exports["test read"] = require("./read")
exports["test write"] = require("./write")

if (require.main === module)
  require("test").run(exports)
