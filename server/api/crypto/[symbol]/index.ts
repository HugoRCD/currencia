import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const { params } = event.context
  const body = await readBody(event)
  if (!params) throw createError({ statusCode: 400, statusMessage: 'Missing params' })
  const symbol = parseInt(params.symbol)
  console.log(`[event] symbol ${symbol}`)

  defineWebSocketHandler({
    open(peer) {
      console.log(`[ws] open ${peer}`)

      peer.subscribe('value')

      const sendRandomNumber = () => {
        const randomNumber = (Math.floor(Math.random() * 10000)).toFixed(2)
        peer.send({ number: randomNumber })
      }

      peer.intervalId = setInterval(sendRandomNumber, 2000)
    },
    message(peer, message) {
      console.log(`[ws] message ${peer} ${message.text()}`)

      if (message.text() === 'ping') {
        peer.send('pong')
      }
    },
    close(peer) {
      console.log(`[ws] close ${peer}`)

      if (peer.intervalId) {
        clearInterval(peer.intervalId)
      }
    }
  })
})
