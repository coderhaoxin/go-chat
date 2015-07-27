'use strict'

const MongoAdaptor = require('koao-mongo')
const request = require('supertest')
const assert = require('assert')
const path = require('path')
const koao = require('..')
const koa = require('koa')
const join = path.join

describe('## mongo adaptor', function() {
  describe('# handler', function() {
    const prefix = '/api/v1/users'

    let app
    let id

    it('init', function() {
      return genApp('/api/v1')
        .then(function(a) {
          app = a
        })
    })

    it('create', function(done) {
      request(app.listen())
        .post(prefix)
        .send({
          name: 'haoxin'
        })
        .end(function(err, res) {
          id = res.body.id
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'success')
          done()
        })
    })

    it('query', function(done) {
      request(app.listen())
        .get(prefix)
        .query({
          name: 'haoxin'
        })
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert(res.body.users.length > 0)
          assert.equal(res.body.users[0].name, 'haoxin')
          done()
        })
    })

    it('findOne', function(done) {
      request(app.listen())
        .get(prefix + '/' + id)
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.name, 'haoxin')
          done()
        })
    })

    it('create - name not exist', function(done) {
      request(app.listen())
        .post(prefix)
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
        .put(prefix + '/' + id)
        .send({
          name: 'hello'
        })
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { message: 'success' })
          done()
        })
    })

    it('findOne', function(done) {
      request(app.listen())
        .get(prefix + '/' + id)
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.deepEqual(res.body.name, 'hello')
          done()
        })
    })

    it('remove', function(done) {
      request(app.listen())
        .del(prefix + '/' + id)
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { message: 'success' })
          done()
        })
    })

    it('findOne', function(done) {
      request(app.listen())
        .get(prefix + '/' + id)
        .end(function(err, res) {
          assert(err instanceof Error)
          assert.equal(res.status, 404)
          done()
        })
    })
  })
})

function genApp(prefix) {
  return new Promise(function(resolve, reject) {
    const app = koa()

    koao.init(app, {
      prefix: prefix,
      handlerDir: join(__dirname, 'fixture/handler'),
      adaptor: new MongoAdaptor({
        mongoURL: 'mongodb://localhost/test',
        connected: function() {
          resolve(app)
        },
        onerror: reject
      })
    })
  })
}
