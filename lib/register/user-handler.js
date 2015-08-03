'use strict'

const debug = require('debug')('koao:register:user-handler')
const bcrypt = require('bcrypt-then')
const parse = require('co-body')

/**
 * exports
 */

module.exports = register

function register(userHandler, router, userAdaptor) {
  for (let mapping of userHandler.mapping.entries()) {
    let mName = mapping[0]
    let mOpts = mapping[1]

    let verb = mOpts.method.toLowerCase()
    let route = mOpts.route

    debug('mapping - name: %s, verb: %s, route: %s, opts: %j', mName, verb, route, mOpts)

    if (typeof userHandler[mName] !== 'function') {
      continue
    }

    if (mName === 'signup') {
      router[verb](route, signup(userHandler, userAdaptor))
    } else if (mName === 'signin') {
      router[verb](route, signin(userHandler, userAdaptor))
    } else if (mName === 'update') {
      router[verb](route, update(userHandler, userAdaptor))
    } else if (mName === 'logout') {
      router[verb](route, logout(userHandler, userAdaptor))
    } else if (mName === 'session') {
      router[verb](route, session(userHandler))
    }
  }
}

function signup(handler, adaptor) {
  return function*() {
    let body = yield parse(this)
    let exist

    if (adaptor) {
      exist = yield adaptor.exist(handler.uids, body)
    }

    yield handler.signup(this, body, exist)

    body.password = yield bcrypt.hash(body.password, 10)

    if (adaptor) {
      let result = yield adaptor.signup(body)

      this.body = {
        id: result._id || result.id,
        message: 'success'
      }
    }
  }
}

function signin(handler, adaptor) {
  return function*() {
    let body = yield parse(this)

    if (adaptor) {
      let user = yield adaptor.findUser(handler.uids, body)

      if (!user) {
        return yield handler.signin(this, body, false)
      }

      let pass = yield bcrypt.compare(body.password, user.password)

      if (!pass) {
        return yield handler.signin(this, body, false)
      }

      return yield handler.signin(this, body, true)
    }

    yield handler.signin(this, body, false)
  }
}

function update(handler, adaptor) {
  return function*() {
    let body = yield parse(this)

    yield handler.update(this, body)

    if (adaptor) {
      let result = yield adaptor.update(this.params.id, body)

      this.body = {
        message: 'success'
      }
    }
  }
}

function logout(handler, adaptor) {
  return function*() {
    yield handler.logout(this)

    if (!this.body) {
      this.body = {
        message: 'success'
      }
    }
  }
}

function session(handler) {
  return function*() {
    yield handler.session(this)
  }
}
