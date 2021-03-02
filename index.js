const express = require('express')
const fetch = require('node-fetch')
const { promisify } = require('util')

class ExpressAsPromise {
  constructor () {
    this.app = express()
    this.server = null

    this._listen = null
  }

  async listen (port, host) {
    await (new Promise((resolve, reject) => {
      this.server = this.app.listen(port, host, err => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    }))

    return this.url
  }

  async stop () {
    await promisify(this.server.close.bind(this.server))()

    this.server = null
  }

  async fetch (pathname, options) {
    if (!this.server) {
      await this.listen()
    }

    const fullUrl = new URL(pathname, this.url)

    return fetch(fullUrl.toString(), options)
  }

  get host () {
    const address = this.server.address()

    if (address.family === 'IPv4' && address.address !== '0.0.0.0') {
      return address.address
    }

    if (address.family === 'IPv6' && address.address !== '::') {
      return address.address
    }

    return 'localhost'
  }

  get port () {
    return this.server.address().port
  }

  get url () {
    return `http://${this.host}${this.port !== 80 ? `:${this.port}` : ''}/`
  }

  static async withServer (callback) {
    const server = new ExpressAsPromise()

    let error = null

    try {
      await callback(server)
    } catch (err) {
      error = err
    }

    if (server.server) {
      await server.stop()
    }

    if (error) {
      throw error
    }
  }
}

module.exports = ExpressAsPromise
