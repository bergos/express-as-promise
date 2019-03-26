const ExpressAsPromise = require('..')

async function main () {
  // creates a new instance which also creates an express object
  const server = new ExpressAsPromise()

  server.app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  // starts the listener and writes the base URL to the console
  console.log(await server.listen())

  // wait 10s...
  await (new Promise(resolve => setTimeout(resolve, 10000)))

  // ...then stop the server
  await server.stop()
}

main()
