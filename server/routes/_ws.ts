export default defineWebSocketHandler({
  open(peer) {
    console.log(`[ws] open ${peer}`)

    peer.subscribe('value')

    const sendRandomNumber = () => {
      const randomNumber = (Math.floor(Math.random() * 10000)).toFixed(2)
      peer.send({ number: randomNumber })
    }

    peer.intervalId = setInterval(sendRandomNumber, 1500)
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
      console.log('clearing interval')
      clearInterval(peer.intervalId)
    }
  }
})
