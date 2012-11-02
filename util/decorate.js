"use strict";

var end = require("reducers/end")
var accumulate = require("reducers/accumulate")

var slicer = Array.prototype.slice

function decorate(lambda) {
  /**
  Function takes function in idiomatic async node style and returns
  decorated version of it, that will return reducible immediately.
  Decorated function also adds optional `options` argument, such
  that if `options.sync` is `true` synchronous operations will be
  enforced instead of asynchronous.
  **/
  return function decorated() {
    // This is ugly but falter way to capture arguments.
    var params = slicer.call(arguments, 0, arguments.length - 1)
    var options = arguments[arguments.length - 1]
    return options && options.sync ? new DecoratedSync(lambda, params) :
                                     new DecoratedAsync(lambda, params)
  }
}

function DecoratedAsync(lambda, params) {
  /**
  Type representing reducible collection of `lambda(...params)` computation,
  where `lambda` is idiomatic node asynchronous function that takes a callback.
  */
  this.lambda = lambda
  this.params = params
}
accumulate.define(DecoratedAsync, function(self, next, initial) {
  try {
    self.lambda.apply(self, self.params.concat(function(error, value) {
      return error ? next(error, initial) :
                     Array.isArray(value) ? accumulate(value, next, initial) :
                     next(end, next(value, initial))
    }))
  } catch (error) {
    next(error, initial)
  }
})

function DecoratedSync(lambda, params) {
  /**
  Type representing reducible collection of `lambda(...params)` computation.
  */
  this.lambda = lambda
  this.params = params
}
accumulate.define(DecoratedSync, function(self, next, initial) {
  try {
    var value = self.lambda.apply(self, self.params)
    if (Array.isArray(value)) accumulate(value, next, initial)
    else next(end, next(value, initial))
  } catch (error) {
    next(end, next(error, initial))
  }
})



module.exports = decorate
