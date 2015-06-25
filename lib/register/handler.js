'use strict'

const debug = require('debug')('koao:register:handler')
const basename = require('path').basename
const parse = require('co-body')

/**
 * exports
 */

module.exports = register

function register(handlers, router) {
  for (let entry of handlers.entries()) {
    let hName = basename(entry[0], '.js')
    let Handler = entry[1]

    let handler = new Handler()

    debug('register: %s', hName)

    for (let mapping of handler.mapping.entries()) {
      let mName = mapping[0]
      let mOpts = mapping[1]

      let verb = mOpts.method.toLowerCase()
      let route = mOpts.route

      debug('mapping - name: %s, verb: %s, route: %s opts: %j', mName, verb, route, mOpts)

      if (typeof handler[mName] !== 'function') {
        continue
      }

      if (verb === 'get') {
        router[verb](route, function*() {
          yield handler[mName](this, this.query, this.params)
        })
      } else if (verb === 'post' || verb === 'put') {
        router[verb](route, function*() {
          let body = yield parse(this)

          if (typeof handler.validate === 'function') {
            try {
              yield handler.validate(this, body)
            } catch (e) {
              this.status = e.status || 400
              this.body = {
                message: e.message
              }

              return
            }
          }

          yield handler[mName](this, body, this.params)
        })
      } else if (verb === 'delete') {
        router[verb](route, function*() {
          yield handler[mName](this, this.params)
        })
      }
    }
  }
}
