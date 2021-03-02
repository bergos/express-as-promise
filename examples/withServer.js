const { withServer } = require('..')

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
