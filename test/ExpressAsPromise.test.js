const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const fetch = require('node-fetch')
const { delay } = require('promise-the-world')
const ExpressAsPromise = require('..')

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

    it('should return the base URL', async () => {
      const server = new ExpressAsPromise()

      const baseUrl = await server.listen(12345, 'localhost')

      strictEqual(baseUrl, 'http://127.0.0.1:12345/')

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
    it('should be a readable property to get the base URL', async () => {
      const server = new ExpressAsPromise()

      await server.listen(12346, 'localhost')

      strictEqual(server.url, 'http://127.0.0.1:12346/')

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

      strictEqual(server.url, 'http://127.0.0.1/')

      await server.stop()
    })
  })

  describe('.withServer', () => {
    it('should be a static method', () => {
      strictEqual(typeof ExpressAsPromise.withServer, 'function')
    })

    it('should call the given callback function', async () => {
      let called = false

      await ExpressAsPromise.withServer(() => {
        called = true
      })

      strictEqual(called, true)
    })

    it('should wait for the callback', async () => {
      let finish = false
      let finished = false

      ExpressAsPromise.withServer(async () => {
        while (!finish) { // eslint-disable-line no-unmodified-loop-condition
          await delay(1)
        }
      }).then(() => {
        finished = true
      })

      strictEqual(finished, false)

      finish = true
      await delay(10)

      strictEqual(finished, true)
    })

    it('should create a ExpressAsPromise object and forward it to the callback', async () => {
      let instance = null

      await ExpressAsPromise.withServer(arg => {
        instance = arg
      })

      strictEqual(instance instanceof ExpressAsPromise, true)
    })

    it('should forward any error thrown by the callback', async () => {
      let error = null

      try {
        await ExpressAsPromise.withServer(() => {
          throw new Error()
        })
      } catch (err) {
        error = err
      }

      strictEqual(error instanceof Error, true)
    })

    it('should create a ExpressAsPromise object and forward it to the callback', async () => {
      let instance = null

      await ExpressAsPromise.withServer(arg => {
        instance = arg
      })

      strictEqual(instance instanceof ExpressAsPromise, true)
    })

    it('should stop the server if it was started', async () => {
      let instance = null

      await ExpressAsPromise.withServer(async arg => {
        instance = arg
        await instance.listen()
      })

      strictEqual(instance.server.address(), null)
    })
  })
})
