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

  let eventSource: EventSource | null = null

  const initEventSource = () => {
    if (eventSource) {
      eventSource.close()
    }

    const url = `${location.origin}/api/crypto/${symbol}`
    eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      try {
        crypto.value = JSON.parse(event.data)
        isLoading.value = false
        retryCount.value = 0
      } catch (err) {
        console.error('Failed to parse SSE data:', err)
      }
    }

    eventSource.onerror = () => {
      eventSource?.close()

      if (retryCount.value < MAX_RETRIES) {
        retryCount.value++
        setTimeout(() => {
          console.log(`Retrying connection (${retryCount.value}/${MAX_RETRIES})...`)
          initEventSource()
        }, RETRY_DELAY * retryCount.value)
      } else {
        error.value = 'Failed to connect to stats stream after multiple attempts'
        isLoading.value = false
      }
    }
  }

  const reconnect = () => {
    retryCount.value = 0
    initEventSource()
  }

  onMounted(() => {
    if (import.meta.client) {
      initEventSource()
    }
  })

  onUnmounted(() => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
  })

  return {
    crypto,
    isLoading,
    error,
    reconnect
  }
}
