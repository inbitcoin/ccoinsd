var config = require('./config')
var express = require('express')
var log = require('loglevel')
var server = require('./server')

log.setDefaultLevel(config.logLevel)

var app = express()
server.init(app)

app.listen(config.port, function (err) {
  if (err) return log.error('Critical error so killing server, error = ', err)
  log.info('Server is listening to *:' + config.port)
})
