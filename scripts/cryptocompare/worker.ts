import puppeteer from 'puppeteer'

declare let self: Worker

const selector = '#profile-info-header > div.coin-name > div.price-main.ng-scope > div.price-value > div'

function formatPrice(price: string | null) {
  if (!price) return null
  const priceMatch = price.match(/[\d,.]+/)
  const priceFormat = priceMatch ? priceMatch[0].replace(/,/g, '') : null
  return priceFormat ? parseFloat(priceFormat) : null
}

async function getCryptoPrice(crypto: string, startUrl: string, endUrl: string) {
  console.log(`Starting scrapping for ${crypto}...`)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const url = `${startUrl}${crypto.toLowerCase()}${endUrl}`
  await page.goto(url)
  const element = await page.waitForSelector(selector)
  if (!element) throw new Error(`Could not find element with selector: ${selector}`)
  const price = await element.evaluate((node) => node.textContent)
  await browser.close()
  return formatPrice(price)
}

self.onmessage = async (event) => {
  const { crypto, cryptos, startUrl, endUrl } = event.data

  if (crypto) {
    try {
      const price = await getCryptoPrice(crypto, startUrl, endUrl)
      self.postMessage({ crypto, price })
    } catch (error) {
      console.error(`Error for ${crypto}:`, error)
    }
  } else if (cryptos) {
    try {
      for (const crypto of cryptos) {
        const price = await getCryptoPrice(crypto, startUrl, endUrl)
        self.postMessage({ crypto, price })
      }
    } catch (error) {
      console.error(`Error for ${crypto}:`, error)
    }
  }
}
