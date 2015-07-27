'use strict'

const koao = require('../../../')

class Item extends koao.BaseHandler {
  constructor() {
    super({
      pathname: 'items'
    })
  }

  * query(ctx, entities) {
    ctx.assert(entities === undefined, 500)

    ctx.body = {
      items: [{
        name: 'one'
      }, {
        name: 'two'
      }]
    }
  }

  * findOne(ctx, entity) {
    ctx.assert(entity === undefined, 500)

    ctx.body = {
      name: 'hello'
    }
  }

  * validate(ctx, body) {
    ctx.assert(body.name, 400, 'name required')
  }

  * create(ctx, body) {
    ctx.assert(body.name === 'haoxin', 400, 'invalid name')

    ctx.body = {
      message: 'success'
    }
  }

  * update(ctx, body) {
    ctx.assert(body.name === 'haoxin', 400, 'invalid name')

    ctx.body = {
      message: 'success'
    }
  }

  * remove(ctx) {
    ctx.body = {
      message: 'success'
    }
  }
}

module.exports = Item
