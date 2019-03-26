/* global describe, expect, test */

const fetch = require('isomorphic-fetch')
const ExpressAsPromise = require('..')

describe('ExpressAsPromise', () => {
  test('module returns a constructor', () => {
    expect(typeof ExpressAsPromise).toBe('function')
  })

  describe('.app', () => {
    test('is the actual express object', async () => {
      const server = new ExpressAsPromise()

      server.app.get('/', (req, res) => {
        res.send('Hello World!')
      })

      await server.listen()

      const res = await fetch(server.url)
      const content = await res.text()

      expect(content).toBe('Hello World!')

      await server.stop()
    })
  })

  describe('.listen', () => {
    test('is a method', () => {
      const server = new ExpressAsPromise()

      expect(typeof server.listen).toBe('function')
    })

    test('starts a server', async () => {
      const server = new ExpressAsPromise()

      await server.listen()

      expect(typeof server.server.address()).toBe('object')

      await server.stop()
    })

    test('returns the base URL', async () => {
      const server = new ExpressAsPromise()

      const baseUrl = await server.listen(12345, 'localhost')

      expect(baseUrl).toBe('http://127.0.0.1:12345/')

      await server.stop()
    })
  })

  describe('.stop', () => {
    test('is a method', () => {
      const server = new ExpressAsPromise()

      expect(typeof server.stop).toBe('function')
    })

    test('stops the server', async () => {
      const server = new ExpressAsPromise()

      await server.listen()
      await server.stop()

      expect(server.server.listening).toBe(false)
    })
  })

  describe('.url', () => {
    test('is a readable property to get the base URL', async () => {
      const server = new ExpressAsPromise()

      await server.listen(12346, 'localhost')

      expect(server.url).toBe('http://127.0.0.1:12346/')

      await server.stop()
    })
  })
})
