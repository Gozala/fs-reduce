"use strict";

var path = require("path")
exports.join = path.join.bind(path, path.dirname(module.filename), "fixtures")
