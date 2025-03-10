export function usePrice(symbol: string) {
  const crypto = useCryptoPrice(symbol)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const wsRef = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const isMounted = ref(true)

  let retryTimeout: NodeJS.Timeout | null = null

  const cleanup = () => {
    if (retryTimeout) {
      clearTimeout(retryTimeout)
      retryTimeout = null
    }

    if (wsRef.value) {
      wsRef.value.close()
      wsRef.value = null
    }

    isConnected.value = false
    isLoading.value = false
  }

  const initWebSocket = () => {
    if (!isMounted.value) return

    cleanup()

    try {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
      const url = `${protocol}//${location.host}/api/crypto/${symbol}`
      const ws = new WebSocket(url)
      wsRef.value = ws

      ws.onopen = () => {
        if (!isMounted.value) {
          ws.close()
          return
        }
        console.log('WebSocket connected')
        isConnected.value = true
        isLoading.value = false
        error.value = null
      }

      ws.onmessage = (event) => {
        if (!isMounted.value) return
        try {
          crypto.value = JSON.parse(event.data)
        } catch (err) {
          console.error('Failed to parse WebSocket data:', err)
        }
      }

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        isConnected.value = false
        wsRef.value = null

        if (isMounted.value && event.code !== 1000) {
          error.value = 'Connection lost'
        }
      }

      ws.onerror = (event) => {
        if (!isMounted.value) return
        console.error('WebSocket error:', event)
        error.value = 'Connection error'
      }
    } catch (err) {
      if (!isMounted.value) return
      console.error('Failed to initialize WebSocket:', err)
      error.value = 'Failed to initialize connection'
      isLoading.value = false
    }
  }

  const reconnect = () => {
    if (!isMounted.value) return
    error.value = null
    isLoading.value = true
    initWebSocket()
  }

  onMounted(() => {
    if (import.meta.client) {
      isMounted.value = true
      initWebSocket()
    }
  })

  onBeforeUnmount(() => {
    isMounted.value = false
    cleanup()
  })

  watch(() => symbol, () => {
    if (import.meta.client && isMounted.value) {
      reconnect()
    }
  })

  return {
    crypto,
    isLoading,
    error,
    isConnected,
    reconnect
  }
}
