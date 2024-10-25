export enum Role {
  Admin = 'admin',
  User = 'user',
}

export type UserWatchlist = {
  id: number;
  userId: number;
  cryptoId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: Role;
  authToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  watchlist: UserWatchlist[];
};

export type UpdateUserDto = {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
};
