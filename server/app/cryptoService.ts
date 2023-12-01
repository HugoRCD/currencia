import type { CreateCryptoDto, UpdateCryptoDto } from "~/types/Crypto";
import prisma from "~/server/database/client";

export async function getAllCryptos() {
  return prisma.crypto.findMany();
}

export async function createCrypto(createCryptoDto: CreateCryptoDto) {
  return prisma.crypto.create({
    data: createCryptoDto,
  });
}

export async function updateCrypto(cryptoId: number, updateCryptoDto: UpdateCryptoDto) {
  return prisma.crypto.update({
    where: {
      id: cryptoId,
    },
    data: updateCryptoDto,
  });
}
