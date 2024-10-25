type Crypto = {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
};

export const cryptos = [
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
  }
] as Crypto[]

export const cryptoMap = Object.fromEntries(
  cryptos.map(crypto => [crypto.id, crypto])
) as Record<string, Crypto>
