'use strict'

const app = require('koa')()
const koao = require('../')

koao.init(app)

app.listen(3000)
