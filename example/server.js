const WebSocket = require('ws')
const pako = require('pako')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const msg = JSON.parse(message)
    console.log(msg)

    const data = JSON.stringify({
      type: msg.type,
      data: 'gzip',
    })
    ws.send(
      JSON.stringify({
        type: msg.type,
        data: 'un-gzip',
      })
    )

    // const buffer = new Uint8Array(
    //   Buffer.from(
    //     pako.deflate(JSON.stringify(data), { to: 'string' }),
    //     'base64'
    //   )
    // )
    // console.log(buffer)
    ws.send(pako.deflate(data), {
      binary: true,
    })
    console.log('received: %s', msg)
  })
  console.log('connect succeed')
})
console.log('server start')
