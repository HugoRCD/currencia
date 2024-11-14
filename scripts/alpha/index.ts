import { cryptos, isCrypto } from '@currencia/cryptos'
import { MongoDBClient } from '@currencia/mongo'
import { program } from 'commander'

const baseUrl = 'https://coinmarketcap.com/currencies'

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
      const cryptoArray = cryptos.map((crypto) => crypto.id)
      const cryptoChunks = chunkArray(cryptoArray, Math.ceil(cryptoArray.length / threads))
      const workerPromises: Promise<void>[] = []

      cryptoChunks.forEach(chunk => {
        const worker = new Worker('./worker.ts')
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
    const client = await MongoDBClient.create()
    await client.savePrices(results)
    await client.disconnect()
    process.exit(0)
  })

program.parse()
