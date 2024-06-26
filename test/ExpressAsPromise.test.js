import { match, notStrictEqual, strictEqual } from 'node:assert'
import { describe, it } from 'mocha'
import fetch from 'node-fetch'
import { WebSocket, WebSocketServer } from 'ws'
import ExpressAsPromise from '../index.js'

describe('ExpressAsPromise', () => {
  it('should be a constructor', () => {
    strictEqual(typeof ExpressAsPromise, 'function')
  })

  describe('.app', () => {
    it('should be the actual express object', async () => {
      const server = new ExpressAsPromise()

      server.app.get('/', (req, res) => {
        res.send('Hello World!')
      })

      await server.listen()

      const res = await fetch(server.url)
      const content = await res.text()

      strictEqual(content, 'Hello World!')

      await server.stop()
    })
  })

  describe('.wss', () => {
    it('should be a WebSocketServer object', async () => {
      const server = new ExpressAsPromise()

      server.app.get('/', (req, res) => {
        res.send('Hello World!')
      })

      await server.listen()

      strictEqual(server.wss instanceof WebSocketServer, true)

      await server.stop()
    })

    it('should be bound to the server socket', async () => {
      const server = new ExpressAsPromise()

      server.wss.on('connection', ws => {
        ws.send('test')
      })

      const url = await server.listen()
      const socket = new WebSocket(`ws://${url.host}/`)

      await new Promise(resolve => {
        socket.on('message', message => {
          strictEqual(message.toString(), 'test')

          socket.close()

          resolve()
        })
      })

      await server.stop()
    })
  })

  describe('.fetch', () => {
    it('should be a method', () => {
      const server = new ExpressAsPromise()

      strictEqual(typeof server.fetch, 'function')
    })

    it('should start listening on a random port', async () => {
      const server = new ExpressAsPromise()

      await server.fetch('/')

      notStrictEqual(server.server, null)

      await server.stop()
    })

    it('should send a request to the path expanded with the base URL', async () => {
      const path = '/some/path'
      const text = 'test'
      const server = new ExpressAsPromise()

      server.app.get(path, (req, res) => {
        res.end(text)
      })

      const res = await server.fetch('/some/path')
      const content = await res.text()

      strictEqual(content, text)

      await server.stop()
    })

    it('should use the options argument', async () => {
      const path = '/some/path'
      const text = 'test'
      const server = new ExpressAsPromise()

      server.app.delete(path, (req, res) => {
        res.end(text)
      })

      const res = await server.fetch('/some/path', { method: 'DELETE' })
      const content = await res.text()

      strictEqual(content, text)

      await server.stop()
    })
  })

  describe('.listen', () => {
    it('should be a method', () => {
      const server = new ExpressAsPromise()

      strictEqual(typeof server.listen, 'function')
    })

    it('should start a server', async () => {
      const server = new ExpressAsPromise()

      await server.listen()

      strictEqual(typeof server.server.address(), 'object')

      await server.stop()
    })

    it('should return the base URL as URL object', async () => {
      const server = new ExpressAsPromise()

      const baseUrl = await server.listen(12345, 'localhost')

      strictEqual(baseUrl instanceof URL, true)
      match(baseUrl.toString(), /http:\/\/(127.0.0.1|\[::1\]):12345\//)

      await server.stop()
    })
  })

  describe('.stop', () => {
    it('should be a method', () => {
      const server = new ExpressAsPromise()

      strictEqual(typeof server.stop, 'function')
    })

    it('should stop the server', async () => {
      const server = new ExpressAsPromise()

      await server.listen()
      await server.stop()

      strictEqual(server.server.listening, false)
    })
  })

  describe('.url', () => {
    it('should be a readable URL property to get the base URL', async () => {
      const server = new ExpressAsPromise()

      await server.listen(12346, 'localhost')

      strictEqual(server.url instanceof URL, true)
      match(server.url.toString(), /http:\/\/(127.0.0.1|\[::1\]):12346\//)

      await server.stop()
    })

    it('should build an URL without port number if the port is 80', async () => {
      class Mock extends ExpressAsPromise {
        get port () {
          return 80
        }
      }

      const server = new Mock()

      await server.listen(12347, 'localhost')

      match(server.url.toString(), /http:\/\/(127.0.0.1|\[::1\])\//)

      await server.stop()
    })
  })
})
