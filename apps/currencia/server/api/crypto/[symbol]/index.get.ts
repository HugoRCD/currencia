import { CryptoPrice } from '@prisma/client'

const intervals = new Map<string, NodeJS.Timer>()
const connectedPeers = new Set<string>()

async function getCryptoPrice(symbol: string): Promise<CryptoPrice> {
  const crypto = await prisma.cryptoPrice.findFirst({
    where: {
      crypto: {
        symbol,
      }
    },
    orderBy: {
      timestamp: 'desc',
    },
  })
  if (!crypto) throw createError({ statusCode: 404, statusMessage: 'Crypto not found' })
  return crypto
}

class WebSocketManager {

  private static instance: WebSocketManager
  private intervals = new Map<string, NodeJS.Timer>()
  private connectedPeers = new Set<string>()

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!this.instance) {
      this.instance = new WebSocketManager()
    }
    return this.instance
  }

  addPeer(peerId: string) {
    this.connectedPeers.add(peerId)
    this.logConnectionStats()
  }

  removePeer(peerId: string) {
    this.connectedPeers.delete(peerId)
    this.clearInterval(peerId)
    this.logConnectionStats()
  }

  setInterval(peerId: string, interval: NodeJS.Timer) {
    this.clearInterval(peerId)
    this.intervals.set(peerId, interval)
  }

  private clearInterval(peerId: string) {
    const interval = this.intervals.get(peerId)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(peerId)
      console.log('Interval cleared for peer:', peerId)
    }
  }

  private logConnectionStats() {
    console.log(`Active connections: ${this.connectedPeers.size}`)
  }

}

const wsManager = WebSocketManager.getInstance()

export default defineWebSocketHandler({
  async open(peer) {
    try {
      if (!peer.websocket?.url) {
        throw new Error('Invalid WebSocket connection')
      }

      const symbol = new URL(peer.websocket.url).pathname.split('/').pop()
      if (!symbol) {
        throw new Error('Symbol is required')
      }

      wsManager.addPeer(peer.id)

      const crypto = await getCryptoPrice(symbol)
      peer.send(JSON.stringify(crypto))

      const interval = setInterval(async () => {
        try {
          if (peer.websocket?.readyState !== 1) {
            throw new Error('WebSocket not ready')
          }

          const crypto = await getCryptoPrice(symbol)
          peer.send(JSON.stringify(crypto))
        } catch (error) {
          console.error('Interval error:', error)
          wsManager.removePeer(peer.id)
        }
      }, 5000)

      wsManager.setInterval(peer.id, interval)
    } catch (error) {
      console.error('WebSocket open error:', error)
      peer.close(1011, error instanceof Error ? error.message : 'Unknown error')
    }
  },

  close(peer) {
    wsManager.removePeer(peer.id)
    console.log('WebSocket disconnected:', peer.id)
  },

  error(peer, error) {
    wsManager.removePeer(peer.id)
    console.error('WebSocket error:', error)
  }
})
