import puppeteer from 'puppeteer'

declare let self: Worker

const priceSelector = '#section-coin-overview > div.sc-65e7f566-0.czwNaM.flexStart.alignBaseline > span'

function formatPrice(price: string) {
  const priceWithoutSymbol = price.replace(/[€$]/g, '')
  const priceWithoutCommas = priceWithoutSymbol.replace(/,/g, '')
  return parseFloat(priceWithoutCommas)
}

async function getCryptoPrice(crypto: string, baseUrl: string) {
  console.log(`Starting scrapping for ${crypto}...`)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`${baseUrl}/${crypto}`)
  const element = await page.waitForSelector(priceSelector)
  const price = await element.evaluate((node) => node.textContent)
  await browser.close()
  return formatPrice(price)
}

self.onmessage = async (event) => {
  const { crypto, cryptos, baseUrl } = event.data

  if (crypto) {
    const price = await getCryptoPrice(crypto, baseUrl)
    self.postMessage({ crypto, price })
  } else if (cryptos) {
    for (const crypto of cryptos) {
      try {
        const price = await getCryptoPrice(crypto, baseUrl)
        self.postMessage({ crypto, price })
      } catch (error) {
        console.error(`Error for ${crypto}:`, error)
      }
    }
  }
}
