import { parentPort, workerData } from 'worker_threads'

const fetchCryptoPrice = async (crypto: string, startUrl: string, endUrl: string) => {
  try {
    const response = await fetch(`${startUrl}${crypto}${endUrl}`)
    const data = await response.json()
    const price = data.result[Object.keys(data.result)[0]].c[0]
    return parseFloat(price)
  } catch (error) {
    console.error(`Error fetching ${crypto}:`, error)
    return null
  }
}

const { cryptos, startUrl, endUrl } = workerData;

(async () => {
  for (const crypto of cryptos) {
    const price = await fetchCryptoPrice(crypto, startUrl, endUrl)
    parentPort?.postMessage({ crypto, price })
  }
})()
