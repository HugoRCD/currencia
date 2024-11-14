import puppeteer from 'puppeteer'

declare let self: Worker

const selector = '#profile-info-header > div.coin-name > div.price-main.ng-scope > div.price-value > div'

function formatPrice(price: string) {
  const priceMatch = price.match(/[\d,.]+/)
  const priceFormat = priceMatch ? priceMatch[0].replace(/,/g, '') : null
  return priceFormat ? parseFloat(priceFormat) : null
}

async function getCryptoPrice(crypto: string, startUrl: string, endUrl: string) {
  console.log(`Starting scrapping for ${crypto}...`)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`${startUrl}${crypto}${endUrl}`)
  const element = await page.waitForSelector(selector)
  const price = await element.evaluate((node) => node.textContent)
  await browser.close()
  return formatPrice(price)
}

self.onmessage = async (event) => {
  const { crypto, cryptos, startUrl, endUrl } = event.data

  if (crypto) {
    const price = await getCryptoPrice(crypto, startUrl, endUrl)
    self.postMessage({ crypto, price })
  } else if (cryptos) {
    for (const crypto of cryptos) {
      try {
        const price = await getCryptoPrice(crypto, startUrl, endUrl)
        self.postMessage({ crypto, price })
      } catch (error) {
        console.error(`Error for ${crypto}:`, error)
      }
    }
  }
}

/*
(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const cryptoList = [
    'btc',
    'eth',
  ]

  const selector = '#profile-info-header > div.coin-name > div.price-main.ng-scope > div.price-value > div'

  const prices = []
  for (const crypto of cryptoList) {
    // Navigate the page to a URL.
    await page.goto('https://www.cryptocompare.com/coins/'+ crypto +'/overview/USD', {
      waitUntil: 'networkidle2', // Wait until there are no more than 2 network connections for at least 500 ms.
    })

    // Wait for the price element to appear
    await page.waitForSelector(selector, { timeout: 2000 }).catch(() => {
      console.log(`L'élément de prix n'a pas été trouvé pour ${crypto}`)
    })

    // Get the price
    const price = await page.evaluate(() => {
      const priceElement = document.querySelector(selector)
      return priceElement ? priceElement.textContent.trim() : null
    })

    // format the price get just the number
    // Utiliser une expression régulière pour extraire le nombre
    const priceFormat = formatPrice(price)

    // push the price to the array
    prices.push('price for ' + crypto + ' is ' + priceFormat)
  }
  console.log(prices)
  await browser.close()
})()
*/
