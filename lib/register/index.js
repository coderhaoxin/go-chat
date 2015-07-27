'use strict'

const debug = require('debug')('koao:register:index')
const handlerRegister = require('./handler')
const Router = require('koa-router')

/**
 * exports
 */

module.exports = register

function register(opts, handlers) {
  const prefix = opts.prefix

  debug('router prefix: %s', prefix)

  const router = new Router({
    prefix: prefix
  })

  handlerRegister(handlers, router, opts.adaptor)

  return router.routes()
}
