# express-as-promise

[![build status](https://img.shields.io/github/actions/workflow/status/bergos/express-as-promise/test.yaml?branch=master)](https://github.com/bergos/express-as-promise/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/express-as-promise.svg)](https://www.npmjs.com/package/express-as-promise)

ExpressAsPromise is a simple Promise wrapper for [Express](https://expressjs.com/).
It also adds some convenient methods & properties which are especially useful for testing.

## Usage

The package returns a class.
Instances can be created without any options.
The actual express object is available as `.app` property.
The methods `.listen` and `.stop` start and stop the listener.
The `.url` property contains a string to the base URL.

### Methods

- `async fetch(url, options)`: Makes a request with `node-fetch` to the express server.
  The `url` is expanded using the servers base URL.
  If the server isn't listening yet, the server starts listening on a random port.
- `async listen(port, host)`: Forwards the optional `port` and `host` parameters to express method.
  Returns the base URL as string.
- `async stop()`: Stops the listener. 

### Properties 

- `.app`: The actual express object.
- `.url`: The base URL of the listener.

### withServer

The `withServer` function can be imported from `express-as-promise/withServer.js`.
It creates a server instance and hands it over to an async callback function.
Once the callback function finished with resolve or reject, it stops the server and forwards the error if it finished with reject.
This function is intended for testing using a pattern like shown in the examples below.

## Examples

Simple example which adds one route, starts the server, write the base URL to the console and waits 10s before it stops the server. 

```javascript
import { setTimeout } from 'node:timers/promises'
import ExpressAsPromise from 'express-as-promise'

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
```

The following example starts a server with `withServer`, adds a route, makes a request.
Once the function is finished, the server is automatically stopped.

```javascript
import withServer from 'express-as-promise/withServer.js'

async function main () {
  await withServer(async server => {
    server.app.get('/test', (req, res) => {
      res.end('test response')
    })

    const res = await server.fetch('/test')
    const content = await res.text()

    console.log(content)
  })
}

main()
```
