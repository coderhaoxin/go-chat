'use strict'

class Handler {
  constructor(opts) {
    opts = opts || {}

    const pathname = this.pathname = opts.pathname || 'entities'
    this.entity = opts.entity || 'entity'

    this.prefix = opts.prefix || ''

    let mapping = new Map()

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

    this.mapping = mapping
  }
}

/**
 * exports
 */

module.exports = Handler
