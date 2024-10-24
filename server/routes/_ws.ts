import { createServer } from 'http'
import { WebSocketServer } from 'ws'

const server = createServer()
const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  console.log('Client connected')

  const sendRandomNumber = () => {
    if (ws.readyState === ws.OPEN) {
      const randomNumber = Math.floor(Math.random() * 10000)
      const formattedNumber = (randomNumber).toFixed(2) // Diviser par 100 et formater avec deux décimales
      ws.send(JSON.stringify({ number: formattedNumber }))
    }
  }


  const intervalId = setInterval(sendRandomNumber, 2000)

  ws.on('close', () => {
    clearInterval(intervalId)
    console.log('Client disconnected')
  })
})

server.listen(8080, () => {
  console.log('WebSocket server is running on ws://localhost:8080')
})
