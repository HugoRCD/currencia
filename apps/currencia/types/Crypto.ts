export type Crypto = {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UpsertCryptoDto = {
  name: string;
  symbol: string;
  logo: string;
  description: string;
  visible: boolean;
};

export type PriceDataRecord = { date: Date, price: number }
