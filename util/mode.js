"use strict";

function makeMode(value) {
  return typeof(value) === "string" ? parseInt(value, 8) :
                                      value
}

module.exports = makeMode
