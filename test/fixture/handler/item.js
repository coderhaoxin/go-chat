'use strict'

const koao = require('../../../')
const assert = require('assert')

class Item extends koao.BaseHandler {
  constructor() {
    super({
      pathname: 'items'
    })
  }

  * query(ctx, qs, params) {
    assert.deepEqual(qs, { name: 'hello' })
    assert.deepEqual(params, {})

    ctx.body = {
      items: [{
        name: 'one'
      }, {
        name: 'two'
      }]
    }
  }

  * findOne(ctx, qs, params) {
    assert.deepEqual(qs, { name: 'hello' })
    assert.deepEqual(params, { id: '1' })

    ctx.body = {
      name: 'hello'
    }
  }

  * validate(ctx, body) {
    ctx.assert(body.name, 400, 'name required')
  }

  * create(ctx, body, params) {
    assert.deepEqual(body, { name: 'haoxin' })
    assert.deepEqual(params, {})

    ctx.body = {
      message: 'success'
    }
  }

  * update(ctx, body, params) {
    assert.deepEqual(body, { name: 'haoxin' })
    assert.deepEqual(params, { id: '1' })

    ctx.body = {
      message: 'success'
    }
  }

  * remove(ctx, params) {
    assert.deepEqual(params, { id: '1' })

    ctx.body = {
      message: 'success'
    }
  }
}

module.exports = Item
