# express-as-promise

ExpressAsPromise is a simple Promise wrapper for [Express](http://expressjs.com/).
It also adds some convenient methods & properties which are especially useful for testing.

## Usage

The package returns a class.
Instances can be created without any options.
The actual express object is available as `.app` property.
The methods `.listen` and `.stop` start and stop the listener.
The `.url` property contains a string to the base URL.

### Methods

- `async listen(port, host)`: Forwards the optional `port` and `host` parameters to express method.
  Returns the base URL as string.
- `async stop()`: Stops the listener. 

### Properties 

- `.app`: The actual express object.
- `.url`: The base URL of the listener.

## Example

Simple example which adds one route, starts the server, write the base URL to the console and waits 10s before it stops the server. 

```
const ExpressAsPromise = require('express-as-promise')

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

```
