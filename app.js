var config = require('./config')
var express = require('express')
var log = require('loglevel')
var server = require('./server')

log.setDefaultLevel(config.logLevel)
var originalFactory = log.methodFactory
log.methodFactory = function (methodName, logLevel, loggerName) {
  var rawMethod = originalFactory(methodName, logLevel, loggerName)
  return function () {
    var messages = [new Date().toISOString()]
    for (var i = 0; i < arguments.length; i++) {
      messages.push(arguments[i])
    }
    rawMethod(messages.join(' '))
  }
}
log.setLevel(log.getLevel()) // apply plugin

var app = express()
server.init(app)

app.listen(config.port, function (err) {
  if (err) return log.error('Critical error so killing server, error = ', err)
  log.info('Server is listening to *:' + config.port)
})
