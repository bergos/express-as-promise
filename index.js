import { createServer } from 'node:http'
import { promisify } from 'node:util'
import express from 'express'
import fetch from 'node-fetch'
import { WebSocketServer } from 'ws'

class ExpressAsPromise {
  constructor () {
    this.app = express()
    this.server = createServer(this.app)
    this.wss = new WebSocketServer({ server: this.server })
  }

  async listen (port, host) {
    await (new Promise((resolve, reject) => {
      this.server.listen(port, host, err => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    }))

    return this.url
  }

  async stop () {
    if (!this.server.listening) {
      return
    }

    await promisify(this.server.close.bind(this.server))()
  }

  async fetch (pathname, options) {
    if (!this.server.listening) {
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
      return `[${address.address}]`
    }

    return 'localhost'
  }

  get port () {
    return this.server.address().port
  }

  get url () {
    return new URL(`http://${this.host}${this.port !== 80 ? `:${this.port}` : ''}/`)
  }
}

export default ExpressAsPromise
