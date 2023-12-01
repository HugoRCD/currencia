export type Crypto = {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCryptoDto = {
  name: string;
  symbol: string;
  logo: string;
  description: string;
  visible: boolean;
};

export type UpdateCryptoDto = {
  name?: string;
  symbol?: string;
  description?: string;
  visible?: boolean;
};
