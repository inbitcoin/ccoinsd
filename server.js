const swaggerDocument = require('./swagger.json')
const swaggerUi = require('swagger-ui-express')
var _ = require('lodash')
var bodyParser = require('body-parser')
var config = require('./config')
var cors = require('cors')
var errors = require('@inbitcoin/cerrors')
var express = require('express')
var expressapp = require('./expressapp')
var morgan = require('morgan')
var url = require('url')
var uuid = require('uuid')

var App = (module.exports = {})

App.init = function (app) {
  app.use(cors())

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  function assignId(req, res, next) {
    req.id = uuid.v4()
    next()
  }
  app.use(assignId)
  morgan.token('id', function getId(req) {
    return req.id
  })
  morgan.token('request-headers', function (req, res) {
    return JSON.stringify(req.headers)
  })
  app.use(
    morgan(
      ':date[iso] HTTP :http-version :method :url statusCode=:status ' +
        'responseTime=:response-time ms reqId=:id reqIp=:remote-addr ' +
        'reqHeaders=:request-headers'
    )
  )

  function getNthOccurrenceIndex(string, subString, index) {
    return string.split(subString, index).join(subString).length
  }
  app.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress)
    ip =
      ip ||
      (req.socket && req.socket.remoteAddress) ||
      (req.connection && req.connection.socket && req.connection.socket.remoteAddress)
    var parsed_url = url.parse(req.url) || {}
    var log_url = (parsed_url.pathname && parsed_url.pathname.toLowerCase()) || ''
    log_url = log_url.substring(0, getNthOccurrenceIndex(log_url, '/', 3))
    // for log-entries to parse Key-Value-Pairs ("/" in value is causing problems)
    req.log_ip = "'" + ip + "'"
    req.log_url = "'" + log_url + "'"
    next()
  })

  expressapp.register(app)

  app.get('/headers', function (req, res, next) {
    log.info(req.headers)
    res.status(200).send({ done: true })
  })

  app.get('/is_running', function (req, res, next) {
    res.send('OK')
  })

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  app.get('/', function (req, res) {
    res.redirect('/api-docs')
  })

  app.use(errors.errorHandler({ env: config.env }))
}
