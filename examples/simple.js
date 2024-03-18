import { setTimeout } from 'node:timers/promises'
import ExpressAsPromise from '../index.js'

async function main () {
  // creates a new instance which also creates an express object
  const server = new ExpressAsPromise()

  server.app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  // starts the listener and writes the base URL to the console
  console.log(await server.listen())

  // wait 10s...
  await setTimeout(10000)

  // ...then stop the server
  await server.stop()
}

main()
