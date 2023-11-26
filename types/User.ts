export enum Role {
  Admin = "admin",
  User = "user",
}

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: Role;
  authToken: string;
  createdAt: Date;
  updatedAt: Date;
};

export type publicUser = {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: Role;
  authToken: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserDto = {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  role?: Role;
};

export type UpdateUserDto = {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  role?: Role;
};

export type LoginUserDto = {
  username: string;
  password: string;
};