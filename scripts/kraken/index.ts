import { Worker } from 'worker_threads'
import { cryptos, isCrypto } from '@currencia/cryptos'
import { MongoDBClient } from '@currencia/mongo'
import { chunkArray } from '@currencia/utils'
import { program } from 'commander'

program
  .name('Kraken API Fetcher')
  .version('1.0.0')
  .option('-v, --verbose', 'enable verbose mode')
  .option('-t, --threads <threads>', 'number of threads to use', '4')
  .option('-c, --crypto <crypto>', 'specific crypto to fetch')
  .action(async (options) => {
    const results: Record<string, number> = {}
    const threads = parseInt(options.threads)
    const startUrl = 'https://api.kraken.com/0/public/Ticker?pair='
    const endUrl = 'USD'

    const fetchCryptoPrices = (cryptos: string[]) => {
      return new Promise<void>((resolve) => {
        const worker = new Worker('./worker.js', {
          workerData: { cryptos, startUrl, endUrl },
        })

        worker.on('message', ({ crypto, price }) => {
          results[crypto] = price
          console.log(`${crypto}: ${price}`)
        })

        worker.on('exit', resolve)
      })
    }

    if (options.crypto) {
      await fetchCryptoPrices([options.crypto])
    } else {
      const cryptoArray = cryptos.map((crypto) => crypto.symbol)
      const cryptoChunks = chunkArray(cryptoArray, Math.ceil(cryptoArray.length / threads))
      const promises = cryptoChunks.map(chunk => fetchCryptoPrices(chunk))
      await Promise.all(promises)
    }

    console.log('Final results:')
    console.table(results)
    const client = await MongoDBClient.create()
    await client.savePrices(results)
    await client.disconnect()
    process.exit(0)
  })

program.parse()
