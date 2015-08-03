
'use strict'

const assert = require('assert')
const isArray = Array.isArray

class Handler {
  constructor(opts) {
    opts = opts || {}

    assert(isArray(opts.uids), 'invalid uids')

    const pathname = this.pathname = opts.pathname || 'users'
    const prefix = this.prefix = opts.prefix || ''
    this.entity = opts.entity || 'user'
    this.type = 'user'
    // such as: username, phone, email
    const uids = this.uids = opts.uids

    let mapping = new Map()

    mapping.set('signup', {
      method: 'POST',
      route: `${prefix}/${pathname}/signup`
    })

    mapping.set('signin', {
      method: 'POST',
      route: `${prefix}/${pathname}/signin`
    })

    mapping.set('update', {
      method: 'PUT',
      route: `${prefix}/${pathname}/:id`
    })

    mapping.set('logout', {
      method: 'GET',
      route: `${prefix}/${pathname}/logout`
    })

    mapping.set('session', {
      method: 'GET',
      route: `${prefix}/${pathname}/session`
    })

    this.mapping = mapping
  }
}

/**
 * exports
 */

module.exports = Handler
