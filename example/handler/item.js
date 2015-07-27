'use strict'

const koao = require('../../')

class Item extends koao.BaseHandler {
  constructor() {
    super({
      pathname: 'items'
    })
  }

  * query(ctx, entities) {
    console.log(entities)

    ctx.body = {
      items: entities
    }
  }

  * findOne(ctx, entity) {
    console.log(entity)

    ctx.body = entity
  }

  * validate(ctx, body) {
    console.log(body)

    // pass
  }

  * create(ctx, body) {
    console.log(body)

    ctx.body = {
      message: 'success'
    }
  }

  * update(ctx, body) {
    console.log(body)

    ctx.body = {
      message: 'success'
    }
  }

  * remove() {
    // pass
  }
}

module.exports = Item
