'use strict'

const koao = require('../../')

class Item extends koao.BaseHandler {
  constructor() {
    super({
      pathname: 'items'
    })
  }

  * query(ctx, qs) {
    console.log(qs)

    ctx.body = {
      items: [{
        name: 'one'
      }, {
        name: 'two'
      }]
    }
  }

  * findOne(ctx, qs, params) {
    console.log(params)

    ctx.body = {
      name: 'hello'
    }
  }

  * validate(ctx, body) {
    console.log(body)
  }

  * create(ctx, body) {
    console.log(body)

    ctx.body = {
      message: 'success'
    }
  }

  * update(ctx, body, params) {
    console.log(params)
    console.log(body)

    ctx.body = {
      message: 'success'
    }
  }

  * remove(ctx, params) {
    console.log(params)

    ctx.body = {
      message: 'success'
    }
  }
}

module.exports = Item
