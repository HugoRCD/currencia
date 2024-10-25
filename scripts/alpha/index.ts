import { program } from 'commander'
import puppeteer from 'puppeteer'

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

const priceSelector = '#section-coin-overview > div.sc-65e7f566-0.czwNaM.flexStart.alignBaseline > span'

function isCrypto(crypto: string) {
  if (cryptos.includes(crypto)) return true
  throw new Error(`Invalid crypto: ${crypto}`)
}

// transform price like €62,839.22 to 62839.22
function formatPrice(price: string) {
  const priceWithoutSymbol = price.replace(/[€$]/g, '')
  const priceWithoutCommas = priceWithoutSymbol.replace(/,/g, '')
  return parseFloat(priceWithoutCommas)
}

/**
 * Get the price of a crypto
 * @param crypto crypto to scrap
 * @returns price of the crypto
 */
async function getCryptoPrice(crypto: string) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`${baseUrl}/${crypto}`)
  const element = await page.waitForSelector(priceSelector)
  const price = await element.evaluate((node) => node.textContent)
  console.log(crypto, formatPrice(price))
  return formatPrice(price)
}

program
  .name('Alpha scrapper: CoinMarketCap')
  .version('1.0.0')
  .option('-v, --verbose', 'enable verbose mode')
  .option('-t, --threads <threads>', 'number of threads to use', 1)
  .option('-c, --crypto <crypto>', 'crypto to scrap', 'bitcoin')
  .action(async (options) => {
    const threads = parseInt(options.threads)
    for (let i = 0; i < threads; i++) {
      try {
        if (options.crypto) isCrypto(options.crypto)
        await getCryptoPrice(options.crypto)
      } catch (error) {
        console.error(error)
      }
    }
    console.log('Done')
    process.exit(0)
  })

program.parse()


