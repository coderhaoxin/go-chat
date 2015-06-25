'use strict'

class Handler {
  constructor(opts) {
    opts = opts || {}

    const pathname = this.pathname = opts.pathname || 'entities'
    this.prefix = opts.prefix || ''

    let mapping = new Map()

    // default mapping
    mapping.set('query', {
      method: 'GET',
      route: `/${pathname}`
    })

    mapping.set('findOne', {
      method: 'GET',
      route: `/${pathname}/:id`
    })

    mapping.set('create', {
      method: 'POST',
      route: `/${pathname}`
    })

    mapping.set('update', {
      method: 'PUT',
      route: `/${pathname}/:id`
    })

    mapping.set('remove', {
      method: 'DELETE',
      route: `/${pathname}/:id`
    })

    this.mapping = opts.mapping || mapping
  }
}

/**
 * exports
 */

module.exports = Handler
