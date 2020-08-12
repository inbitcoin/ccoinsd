var log = require('loglevel')

var config = {
  env: 'production',
  testnet: false,
  cexplorer: {
    url: 'https://cexplorer.example.com',
  },
  logLevel: 'info',
  port: 8080,
}

function moduleExists(name) {
  try {
    return require.resolve(name)
  } catch (e) {
    return false
  }
}

var localConfig = { cexplorer: {} }
if (moduleExists('./config-local')) {
  console.log('Loading a local configuration')
  localConfig = require('./config-local')
}

config.env = process.env.NODE_ENV || localConfig.env || config.env
config.cexplorer.url = process.env.CEXPLORER_URL || localConfig.cexplorer.url || config.cexplorer.url
config.testnet = process.env.TESTNET || localConfig.testnet || config.testnet
config.logLevel = process.env.LOG_LEVEL || localConfig.logLevel || config.logLevel
config.port = process.env.PORT || localConfig.port || config.port

module.exports = config
