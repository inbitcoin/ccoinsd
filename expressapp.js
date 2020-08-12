var api = require('./ccutils.js')
var express = require('express')

module.exports.register = function (app) {
  const v3 = express.Router()

  v3.get('/addressinfo/:address/', (req, res, next) => {
    tryAddressInfo(req, res, next)
  })

  v3.get('/gettransaction/:txid/', (req, res, next) => {
    tryGetTransaction(req, res, next)
  })

  const latestVersion = '/v3'
  app.use(latestVersion, v3)
  app.use('/', v3)
}

function tryAddressInfo(req, res, next) {
  const address = req.params.address
  api.getAddressInfo(address).then(function (data) {
    var jsondata = api.safeParse(data)
    res.status(200).send(Array.isArray(address) ? jsondata : jsondata[0])
  }, next)
}

function tryGetTransaction(req, res, next) {
  const txid = req.params.txid
  api.getTransactionByTxid(txid).then(function (data) {
    if (data == '') {
      // FIXME: cexplorer should return 404 instead of 200
      res.status(404).send({ error: 'txid ' + txid + ' not found' })
    } else {
      var jsondata = api.safeParse(data)
      delete jsondata.fee
      delete jsondata.totalsent
      res.status(200).send(jsondata)
    }
  }, next)
}
