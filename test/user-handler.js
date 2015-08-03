'use strict'

const MongoUserAdaptor = require('koao-mongo').User
const MongoAdaptor = require('koao-mongo')
const request = require('supertest')
const assert = require('assert')
const path = require('path')
const koao = require('..')
const koa = require('koa')
const join = path.join

describe('## user handler', function() {
  describe('# basic', function() {
    const prefix = '/api/v1/users'

    let username = Date.now()
    let app, uid

    it('init', function() {
      return genApp('/api/v1')
        .then(function(a) {
          app = a
        })
    })

    it('signup', function(done) {
      request(app.listen())
        .post(prefix + '/signup')
        .send({
          username: username,
          password: '123456'
        })
        .end(function(err, res) {
          uid = res.body.id
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'success')
          done()
        })
    })

    it('signup - exist', function(done) {
      request(app.listen())
        .post(prefix + '/signup')
        .send({
          username: username,
          password: '123456'
        })
        .end(function(err, res) {
          assert(err instanceof Error)
          assert.equal(res.status, 400)
          assert.equal(res.text, 'username exist')
          done()
        })
    })

    it('signin', function(done) {
      request(app.listen())
        .post(prefix + '/signin')
        .send({
          username: username,
          password: '123456'
        })
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'success')
          done()
        })
    })

    it('signin - invalid', function(done) {
      request(app.listen())
        .post(prefix + '/signin')
        .send({
          username: username,
          password: '12345'
        })
        .end(function(err, res) {
          assert(err instanceof Error)
          assert.equal(res.status, 400)
          assert.equal(res.text, 'invalid username or password')
          done()
        })
    })

    it('update', function(done) {
      request(app.listen())
        .put(prefix + '/' + uid)
        .send({
          desc: 'hello'
        })
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'success')
          done()
        })
    })

    it('session', function(done) {
      request(app.listen())
        .get(prefix + '/session')
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'success')
          done()
        })
    })

    it('logout', function(done) {
      request(app.listen())
        .get(prefix + '/logout')
        .end(function(err, res) {
          assert.ifError(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.message, 'success')
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
      userAdaptor: new MongoUserAdaptor({
        mongoURL: 'mongodb://localhost/test',
        connected: function() {
          resolve(app)
        },
        onerror: reject
      }),
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
