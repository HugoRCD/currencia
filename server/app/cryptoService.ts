import type { CreateCryptoDto } from "~/types/Crypto";
import prisma from "~/server/database/client";

export async function getAllCryptos(all: boolean = false) {
  if (!all) {
    return prisma.crypto.findMany({
      where: {
        visible: true,
      },
    });
  } else {
    return prisma.crypto.findMany();
  }
}

export async function upsertCrypto(upsertCryptoDto: CreateCryptoDto) {
  return prisma.crypto.upsert({
    where: {
      name: upsertCryptoDto.name,
    },
    update: upsertCryptoDto,
    create: upsertCryptoDto,
  });
}

export async function deleteCrypto(cryptoId: number) {
  return prisma.crypto.delete({
    where: {
      id: cryptoId,
    },
  });
}
