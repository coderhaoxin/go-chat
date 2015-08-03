'use strict'

const UserHandler = require('./base/user-handler')
const readdir = require('fs-readdir-recursive')
const BaseHandler = require('./base/handler')
const debug = require('debug')('koao:index')
const register = require('./register')
const path = require('path')
const resolve = path.resolve
const fs = require('fs')

/**
 * exports
 */

module.exports = {
  UserHandler,
  BaseHandler,
  init
}

/**
 * @param {Object} opts
 */

function init(app, opts) {
  opts = opts || {}

  opts.prefix = opts.prefix || ''

  let handlerDir = opts.handlerDir || 'handler'

  handlerDir = resolve(handlerDir)

  const handlers = requireDir(handlerDir)

  const routes = register(opts, handlers)

  app.use(routes)
}

function requireDir(dir) {
  fs.accessSync(dir)

  const m = new Map()

  readdir(dir)
    .filter(function(filename) {
      return filename.endsWith('.js')
    })
    .forEach(function(filename) {
      debug('require %s', filename)
      m.set(filename, require(resolve(dir, filename)))
    })

  return m
}
