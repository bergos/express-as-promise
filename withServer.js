import ExpressAsPromise from './index.js'

async function withServer (func) {
  const server = new ExpressAsPromise()

  let error = null

  try {
    await func(server)
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

export default withServer
