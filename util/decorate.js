"use strict";

var accumulated = require("reducers/accumulated")
var error = require("reducers/error")
var end = require("reducers/end")
var accumulate = require("reducers/accumulate")

// Define a shortcut for `Array.prototype.slice.call`.
var unbind = Function.call.bind(Function.bind, Function.call)
var slice = Array.slice || unbind(Array.prototype.slice)

function AsyncAccumulator() {}
accumulate.define(AsyncAccumulator, function(self, next, initial) {
  try {
    self.lambda.apply(self, self.arguments.concat(function(e, value) {
      return e ? next(end(), next(error(e), initial)) :
                 Array.isArray(value) ? accumulate(value, next, initial) :
                 next(end(), next(value, initial))
    }))
  } catch (e) {
    next(end(), next(error(e), initial))
  }
})

function SyncAccumulator() {}
accumulate.define(SyncAccumulator, function(self, next, initial) {
  try {
    var value = self.lambda.apply(self, self.arguments)
    if (Array.isArray(value)) accumulate(value, next, initial)
    else next(end(), next(value, initial))
  } catch (e) {
    next(end(), next(error(e), initial))
  }
})

function decorate(lambda) {
  /**
  Function takes function in idiomatic async node style and returns
  decodated version of it, that will return reducible immediately.
  Decorated function also add's optional `options` argument, such
  that `options.sync` cause synchronous calls instead of asynchronous.
  **/
  return function decodated() {
    var args = slice(arguments)
    var options = args.pop()
    var value = options && options.sync ? new SyncAccumulator() :
                                          new AsyncAccumulator()
    value.lambda = lambda
    value.arguments = args
    return value
  }
}

module.exports = decorate
