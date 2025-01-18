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

function clearPeerInterval(peerId: string) {
  const interval = intervals.get(peerId)
  if (interval) {
    clearInterval(interval)
    intervals.delete(peerId)
    console.log('Interval cleared for peer:', peerId)
  }
}

function logConnectionStats() {
  console.log(`Active connections: ${connectedPeers.size}`)
}

export default defineWebSocketHandler({
  async open(peer) {
    connectedPeers.add(peer.id)
    console.log('WebSocket connected:', peer.id)
    logConnectionStats()

    if (!peer.websocket) {
      peer.close(1008, 'WebSocket connection required')
      return
    }
    if (!peer.websocket.url) {
      peer.close(1008, 'WebSocket URL is required')
      return
    }
    const url = new URL(peer.websocket.url)
    const symbol = url.pathname.split('/').pop()

    if (!symbol) {
      peer.close(1008, 'Symbol is required')
      return
    }

    try {
      const crypto = await getCryptoPrice(symbol)
      peer.send(JSON.stringify(crypto))

      const interval = setInterval(async () => {
        const crypto = await getCryptoPrice(symbol)
        if (peer.websocket?.readyState === 1) { // 1 = OPEN
          peer.send(JSON.stringify(crypto))
        } else {
          clearPeerInterval(peer.id)
        }
      }, 5000)

      intervals.set(peer.id, interval)
    } catch (error) {
      peer.close(1011, 'Failed to fetch crypto data')
    }
  },

  close(peer) {
    connectedPeers.delete(peer.id)
    console.log('WebSocket disconnected:', peer.id)
    clearPeerInterval(peer.id)
  },

  error(peer, error) {
    connectedPeers.delete(peer.id)
    console.error('WebSocket error:', error)
    clearPeerInterval(peer.id)
  }
})
