"use strict";

exports["test exists"] = require("./exists")
exports["test make directory"] = require("./make-directory")
exports["test read directory"] = require("./read-directory")
exports["test remove directory"] = require("./remove-directory")
exports["test chmod"] = require("./read-directory")




if (require.main === module)
  require("test").run(exports)
