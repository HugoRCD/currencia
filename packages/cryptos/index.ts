type Crypto = {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
};

export const cryptos: Crypto[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
    description: 'Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    description: 'Ethereum is a decentralized platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third-party interference.',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.svg',
    description: 'Solana is a decentralized blockchain project that aims to provide a sustainable, scalable, and secure platform for the next generation of blockchain applications.',
  },
  {
    id: 'xrp',
    name: 'XRP',
    symbol: 'XRP',
    logo: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
    description: 'XRP is a digital payment protocol that operates as both a cryptocurrency and a technology for payment settlements.',
  },
  {
    id: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
    description: 'Tether is a blockchain-based cryptocurrency whose cryptocoins in circulation are backed by an equivalent amount of traditional fiat currencies, like the dollar, the euro or the Japanese yen, which are held in a designated bank account.',
  },
  {
    id: 'bnb',
    name: 'Binance Coin',
    symbol: 'BNB',
    logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg',
    description: 'Binance Coin is a cryptocurrency used to pay for fees on the Binance cryptocurrency exchange.',
  },
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    logo: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg',
    description: 'Dogecoin is a cryptocurrency invented by software engineers Billy Markus and Jackson Palmer, who decided to create a payment system that is instant, fun, and free from traditional banking fees.',
  },
  {
    id: 'usd-coin',
    name: 'USD Coin',
    symbol: 'USDC',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    description: 'USD Coin (USDC) is a type of cryptocurrency that is referred to as a stablecoin. You can always redeem 1 USD Coin for US$1.00, giving it a stable price.',
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    logo: 'https://cryptologos.cc/logos/cardano-ada-logo.svg',
    description: 'Cardano is a blockchain platform for changemakers, innovators, and visionaries, with the tools and technologies required to create possibility for the many, as well as the few, and bring about positive global change.',
  },
  {
    id: 'tron',
    name: 'TRON',
    symbol: 'TRX',
    logo: 'https://cryptologos.cc/logos/tron-trx-logo.svg',
    description: 'TRON is a blockchain-based decentralized platform that aims to build a free, global digital content entertainment system with distributed storage technology, and allows easy and cost-effective sharing of digital content.',
  }
]

/**
 * Checks if a given string is a valid crypto symbol.
 * @param crypto The crypto symbol to check.
 * @returns True if the crypto symbol is valid, false otherwise.
 */
export function isCrypto(crypto: string) {
  if (cryptos.find(c => c.id === crypto)) return true
  throw new Error(`Invalid crypto: ${crypto}`)
}
