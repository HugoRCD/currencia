const puppeteer = require('puppeteer');

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
    const priceMatch = price.match(/[\d,.]+/)
    const priceFormat = priceMatch ? priceMatch[0].replace(/,/g, '') : null

    // push the price to the array
    prices.push('price for ' + crypto + ' is ' + priceFormat)
  }
  console.log(prices)
  await browser.close()
})()
