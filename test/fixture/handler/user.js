'use strict'

const koao = require('../../../')

class Item extends koao.BaseHandler {
  constructor() {
    super({
      entity: 'user',
      pathname: 'users'
    })
  }

  * query(ctx, entities) {
    ctx.body = {
      users: entities
    }
  }

  * findOne(ctx, entity) {
    ctx.body = entity

    if (!entity) {
      ctx.throw(404)
    }
  }

  * validate(ctx, body) {
    ctx.assert(body.name, 400, 'name required')
  }

  * create(ctx, body) {
    ctx.assert(typeof body === 'object', 400, 'invalid body')
  }

  * update(ctx, body) {
    ctx.assert(typeof body === 'object', 400, 'invalid body')
  }

  * remove() {}
}

module.exports = Item
