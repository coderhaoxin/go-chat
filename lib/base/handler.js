'use strict'

class Handler {
  constructor(opts) {
    opts = opts || {}

    const pathname = this.pathname = opts.pathname || 'entities'
    this.entity = opts.entity || 'entity'

    const prefix = this.prefix = opts.prefix || ''

    let mapping = new Map()

    mapping.set('query', {
      method: 'GET',
      route: `${prefix}/${pathname}`
    })

    mapping.set('findOne', {
      method: 'GET',
      route: `${prefix}/${pathname}/:id`
    })

    mapping.set('create', {
      method: 'POST',
      route: `${prefix}/${pathname}`
    })

    mapping.set('update', {
      method: 'PUT',
      route: `${prefix}/${pathname}/:id`
    })

    mapping.set('remove', {
      method: 'DELETE',
      route: `${prefix}/${pathname}/:id`
    })

    this.mapping = mapping
  }
}

/**
 * exports
 */

module.exports = Handler
