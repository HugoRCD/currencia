export type Crypto = {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCryptoDto = {
  name: string;
  symbol: string;
  logo: string;
  description: string;
  visible: boolean;
};
