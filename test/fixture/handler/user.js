'use strict'

const koao = require('../../../')

class Item extends koao.UserHandler {
  constructor() {
    super({
      uids: ['username']
    })
  }

  * signup(ctx, data, exist) {
    ctx.assert(!exist, 400, 'username exist')
  }

  * signin(ctx, data, passed) {
    ctx.assert(passed, 400, 'invalid username or password')

    ctx.body = {
      message: 'success'
    }
  }

  * update(ctx, data) {
  }

  * logout(ctx) {
    ctx.body = {
      message: 'success'
    }
  }

  * session(ctx) {
    ctx.body = {
      message: 'success'
    }
  }
}

module.exports = Item
