import { program } from 'commander'

const baseUrl = 'https://coinmarketcap.com/fr/currencies'

const cryptos = [
  'bitcoin',
  'ethereum',
  'solana',
  'dogecoin',
  'litecoin',
  'ripple',
  'bitcoin-cash',
  'stellar',
  'cardano',
  'tether',
  'usd-coin',
  'binance-usd',
  'polkadot',
]

function isCrypto(crypto: string) {
  if (cryptos.includes(crypto)) return true
  throw new Error(`Invalid crypto: ${crypto}`)
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

program
  .name('Alpha scrapper: CoinMarketCap')
  .version('1.0.0')
  .option('-v, --verbose', 'enable verbose mode')
  .option('-t, --threads <threads>', 'number of threads to use', '4')
  .option('-c, --crypto <crypto>', 'specific crypto to scrap')
  .action(async (options) => {
    const threads = parseInt(options.threads)
    const results: Record<string, number> = {}

    if (options.crypto) {
      try {
        isCrypto(options.crypto)
        const worker = new Worker('./worker.ts')

        worker.postMessage({ crypto: options.crypto, baseUrl })

        worker.onmessage = (event) => {
          const { crypto, price } = event.data
          results[crypto] = price
          console.log(`${crypto}: ${price}`)
          worker.terminate()
        }

        await new Promise(resolve => worker.addEventListener('close', resolve))
      } catch (error) {
        console.error(error)
      }
    } else {
      const cryptoChunks = chunkArray(cryptos, Math.ceil(cryptos.length / threads))
      const workers: Worker[] = []
      const workerPromises: Promise<void>[] = []

      cryptoChunks.forEach(chunk => {
        const worker = new Worker('./worker.ts')
        workers.push(worker)

        const workerPromise = new Promise<void>((resolve) => {
          let processedCount = 0

          worker.onmessage = ({ data: { crypto, price } }) => {
            results[crypto] = price
            console.log(`${crypto}: ${price}`)
            processedCount++

            if (processedCount === chunk.length) {
              worker.terminate()
              resolve()
            }
          }
        })

        workerPromises.push(workerPromise)
        worker.postMessage({ cryptos: chunk, baseUrl })
      })

      await Promise.all(workerPromises)
    }

    console.log('Final results:')
    console.table(results)
    process.exit(0)
  })

program.parse()
