import type { Peer } from 'crossws'
import { getQuery } from 'ufo'

let intervalId: NodeJS.Timeout

export default defineWebSocketHandler({
  open(peer: Peer) {
    console.log(`[ws] open ${peer}`)
    const { symbol } = getQuery(peer.url)
    console.log(`[ws] symbol ${symbol}`)

    peer.subscribe('value')

    const sendRandomNumber = () => {
      const randomNumber = generateRandomValue()
      peer.send({ number: randomNumber })
    }

    intervalId = setInterval(sendRandomNumber, 1500)
  },
  message(peer, message) {
    console.log(`[ws] message ${peer} ${message.text()}`)

    if (message.text() === 'ping') {
      peer.send('pong')
    }
  },
  close(peer) {
    console.log(`[ws] close ${peer}`)
    clearInterval(intervalId)
  },
  upgrade(req) {
    return {
      headers: {
        'x-powered-by': 'cross-ws',
      },
    }
  },
})
