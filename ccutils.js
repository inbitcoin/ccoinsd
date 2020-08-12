module.exports = (function () {
  const axios = require('axios')
  var config = require('./config')
  var log = require('loglevel')
  var _ = require('lodash')

  const cexplorer = axios.create({
    baseURL: config.cexplorer.url,
    headers: { 'Content-Type': 'application/json' },
  })

  function ccutils() {}

  ccutils.getAddressInfo = function getAddressInfo(address) {
    return getUnspentsByAddress(Array.isArray(address) ? address : [address])
  }

  ccutils.getTransactionByTxid = function getTransactionByTxid(txid) {
    return getTransaction(txid)
  }

  ccutils.safeParse = function safeParse(item) {
    try {
      if (typeof item === 'string' || item instanceof Buffer) {
        return JSON.parse(item)
      } else {
        return item
      }
    } catch (e) {
      return item
    }
  }

  function getTransaction(txid) {
    return cexplorer.get('/api/gettransaction?txid=' + txid).then(function (response) {
      log.info('gettransaction status:', response.status)
      log.debug('gettransaction data:', response.data)
      if (response.status == 200) {
        return response.data
      } else if (response.data) {
        throw response.data
      } else {
        throw new Error('Status code was ' + response.status)
      }
    })
  }

  function getUnspentsByAddress(addresses) {
    addresses = { addresses: _.uniq(addresses) }
    return cexplorer.post('/api/getaddressesutxos', addresses).then(function (response) {
      log.info('getaddressesutxos status:', response.status)
      log.debug('getaddressesutxos data:', response.data)
      if (response.status == 200) {
        return response.data
      } else if (response.data) {
        throw response.data
      } else {
        throw new Error('Status code was ' + response.status)
      }
    })
  }

  return ccutils
})()
