import type { CryptoPrice } from '@prisma/client'

export function usePrice(symbol: string): {
  crypto: Ref<CryptoPrice>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  reconnect: () => void
} {
  const crypto = useCryptoPrice(symbol)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const retryCount = ref(0)
  const MAX_RETRIES = 3
  const RETRY_DELAY = 2000

  let ws: WebSocket | null = null

  const initWebSocket = () => {
    if (ws) {
      ws.close()
    }

    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${protocol}//${location.host}/api/crypto/${symbol}`
    ws = new WebSocket(url)

    ws.onmessage = (event) => {
      try {
        crypto.value = JSON.parse(event.data)
        isLoading.value = false
        retryCount.value = 0
      } catch (err) {
        console.error('Failed to parse WebSocket data:', err)
      }
    }

    ws.onclose = () => {
      if (retryCount.value < MAX_RETRIES) {
        retryCount.value++
        setTimeout(() => {
          console.log(`Retrying connection (${retryCount.value}/${MAX_RETRIES})...`)
          initWebSocket()
        }, RETRY_DELAY * retryCount.value)
      } else {
        error.value = 'Failed to connect to stats stream after multiple attempts'
        isLoading.value = false
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
    }
  }

  const reconnect = () => {
    retryCount.value = 0
    initWebSocket()
  }

  onMounted(() => {
    if (import.meta.client) {
      initWebSocket()
    }
  })

  onUnmounted(() => {
    if (ws) {
      ws.close()
      ws = null
    }
  })

  return {
    crypto,
    isLoading,
    error,
    reconnect
  }
}
