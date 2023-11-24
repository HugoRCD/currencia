export type Crypto = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCryptoDto = {
  name: string;
  symbol: string;
  description: string;
};

export type UpdateCryptoDto = {
  name?: string;
  symbol?: string;
  description?: string;
};
