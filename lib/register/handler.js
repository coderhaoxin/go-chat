'use strict'

const debug = require('debug')('koao:register:handler')
const userRegister = require('./user-handler')
const basename = require('path').basename
const parse = require('co-body')

/**
 * exports
 */

module.exports = register

function register(handlers, router, adaptor, userAdaptor) {
  for (let entry of handlers.entries()) {
    let hName = basename(entry[0], '.js')
    let Handler = entry[1]

    let handler = new Handler()

    debug('register: %s', hName)

    if (handler.type === 'user') {
      userRegister(handler, router, userAdaptor)
      continue
    }

    for (let mapping of handler.mapping.entries()) {
      let mName = mapping[0]
      let mOpts = mapping[1]

      let verb = mOpts.method.toLowerCase()
      let route = mOpts.route

      debug('mapping - name: %s, verb: %s, route: %s, opts: %j', mName, verb, route, mOpts)

      if (typeof handler[mName] !== 'function') {
        continue
      }

      if (mName === 'findOne') {
        router[verb](route, findOne(handler, adaptor))
      } else if (mName === 'create') {
        router[verb](route, create(handler, adaptor))
      } else if (mName === 'update') {
        router[verb](route, update(handler, adaptor))
      } else if (mName === 'remove') {
        router[verb](route, remove(handler, adaptor))
      } else if (mName === 'query') {
        router[verb](route, query(handler, adaptor))
      }
    }
  }
}

function findOne(handler, adaptor) {
  return function*() {
    let p = this.params
    let entity

    if (adaptor) {
      entity = yield adaptor.findOne(handler.entity, p.id)
    }

    yield handler.findOne(this, entity)
  }
}

function create(handler, adaptor) {
  return function*() {
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

    yield handler.create(this, body)

    if (adaptor) {
      let result = yield adaptor.create(handler.entity, body)

      this.body = {
        message: 'success',
        id: result._id
      }
    }
  }
}

function update(handler, adaptor) {
  return function*() {
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

    yield handler.update(this, body)

    if (adaptor) {
      yield adaptor.update(handler.entity, this.params.id, body)

      this.body = {
        message: 'success'
      }
    }
  }
}

function remove(handler, adaptor) {
  return function*() {
    let p = this.params

    yield handler.remove(this)

    if (adaptor) {
      yield adaptor.remove(handler.entity, p.id)

      this.body = {
        message: 'success'
      }
    }
  }
}

function query(handler, adaptor) {
  return function*() {
    let q = this.query
    let entities

    if (adaptor) {
      entities = yield adaptor.query(handler.entity, q)
    }

    yield handler.query(this, entities)
  }
}
