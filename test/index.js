'use strict'

const request = require('supertest')
const assert = require('assert')
const path = require('path')
const koao = require('..')
const koa = require('koa')
const join = path.join

describe('## koao', function() {
  describe('# basic', function() {
    const prefix = '/api/v1'
    const app = genApp(prefix)

    it('query', function(done) {
      request(app.listen())
        .get(prefix + '/items')
        .query({
          name: 'hello'
        })
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { items: [{ name: 'one' }, { name: 'two' }] })
          done()
        })
    })

    it('findOne', function(done) {
      request(app.listen())
        .get(prefix + '/items/1')
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { name: 'hello' })
          done()
        })
    })

    it('create', function(done) {
      request(app.listen())
        .post(prefix + '/items')
        .send({
          name: 'haoxin'
        })
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { message: 'success' })
          done()
        })
    })

    it('create - name not exist', function(done) {
      request(app.listen())
        .post(prefix + '/items')
        .send({
          desc: 'hello'
        })
        .end(function(err, res) {
          assert(err instanceof Error)
          assert.equal(res.status, 400)
          assert.deepEqual(res.body, { message: 'name required' })
          done()
        })
    })

    it('update', function(done) {
      request(app.listen())
        .put(prefix + '/items/1')
        .send({
          name: 'haoxin'
        })
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { message: 'success' })
          done()
        })
    })

    it('remove', function(done) {
      request(app.listen())
        .del(prefix + '/items/1')
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { message: 'success' })
          done()
        })
    })
  })
})

function genApp(prefix) {
  const app = koa()

  koao.init(app, {
    prefix: prefix,
    handlerDir: join(__dirname, 'fixture/handler')
  })

  return app
}
