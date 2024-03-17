import { strictEqual } from 'node:assert'
import { setTimeout } from 'node:timers/promises'
import { describe, it } from 'mocha'
import ExpressAsPromise from '../index.js'
import withServer from '../withServer.js'

describe('withServer', () => {
  it('should be a static method', () => {
    strictEqual(typeof withServer, 'function')
  })

  it('should call the given callback function', async () => {
    let called = false

    await withServer(() => {
      called = true
    })

    strictEqual(called, true)
  })

  it('should wait for the callback', async () => {
    let finish = false
    let finished = false

    withServer(async () => {
      while (!finish) { // eslint-disable-line no-unmodified-loop-condition
        await setTimeout(1)
      }
    }).then(() => {
      finished = true
    })

    strictEqual(finished, false)

    finish = true
    await setTimeout(10)

    strictEqual(finished, true)
  })

  it('should create a ExpressAsPromise object and forward it to the callback', async () => {
    let instance = null

    await withServer(arg => {
      instance = arg
    })

    strictEqual(instance instanceof ExpressAsPromise, true)
  })

  it('should forward any error thrown by the callback', async () => {
    let error = null

    try {
      await withServer(() => {
        throw new Error()
      })
    } catch (err) {
      error = err
    }

    strictEqual(error instanceof Error, true)
  })

  it('should create a ExpressAsPromise object and forward it to the callback', async () => {
    let instance = null

    await withServer(arg => {
      instance = arg
    })

    strictEqual(instance instanceof ExpressAsPromise, true)
  })

  it('should stop the server if it was started', async () => {
    let instance = null

    await withServer(async arg => {
      instance = arg
      await instance.listen()
    })

    strictEqual(instance.server, null)
  })
})
