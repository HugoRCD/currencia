import type { CryptoPrice } from '@prisma/client'
import type { UpsertCryptoDto, Crypto } from '~~/types/Crypto'

type CryptoAndPrices = Crypto & { prices: CryptoPrice[] }

export const usePublicCrypto = () => {
  return useState<CryptoAndPrices[]>('cryptos', () => [])
}

export function useCryptoPrice(symbol: string) {
  return useState<CryptoPrice>(`crypto-${symbol}-price`)
}

export function useCryptoPrices(symbol: string) {
  return useState<CryptoPrice[]>(`crypto-${symbol}-prices`)
}

export function useCryptoService() {
  const publicCryptos = usePublicCrypto()
  const { user } = useUserSession()

  const getLoading = ref(false)
  const loading = ref(false)
  const deleteLoading = ref(false)
  const modal = ref(false)

  const cryptos = ref<Crypto[]>([])

  async function fetchPublicCryptos() {
    const data = await $fetch<CryptoAndPrices[]>('/api/crypto')
    if (data) publicCryptos.value = user.value ? data : data.slice(0, 6)
  }

  async function fetchCryptos() {
    getLoading.value = true
    try {
      const response = await $fetch('/api/admin/crypto')
      if (response) cryptos.value = response
    } catch (error) {
      toast.error('Whoops! Something went wrong.')
    }
    getLoading.value = false
  }

  async function upsertCrypto(upsertCryptoDto: UpsertCryptoDto) {
    loading.value = true
    try {
      await $fetch('/api/admin/crypto', {
        method: 'POST',
        body: upsertCryptoDto,
      })
      toast.success('Operation successful !')
    } catch (error) {
      toast.error('Whoops! Something went wrong.')
    }
    loading.value = false
    await fetchCryptos()
    await fetchPublicCryptos()
    modal.value = false
  }

  async function deleteCrypto(id: number) {
    deleteLoading.value = true
    try {
      await $fetch(`/api/admin/crypto/${id}`, {
        method: 'DELETE',
      })
      const index = cryptos.value.findIndex((crypto) => crypto.id === id)
      cryptos.value.splice(index, 1)
      toast.success('Crypto deleted successfully.')
    } catch (error) {
      toast.error('Whoops! Something went wrong.')
    }
    deleteLoading.value = false
    await fetchCryptos()
    await fetchPublicCryptos()
  }

  return {
    getLoading,
    loading,
    deleteLoading,
    cryptos,
    modal,
    fetchCryptos,
    upsertCrypto,
    deleteCrypto,
    fetchPublicCryptos,
  }
}
