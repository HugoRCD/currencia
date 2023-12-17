import type { UpsertCryptoDto } from "~/types/Crypto";
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

export async function upsertCrypto(upsertCryptoDto: UpsertCryptoDto) {
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

export async function getCryptoData(symbol: string, from: string, to: string) {
  const runtimeConfig = useRuntimeConfig().private.finageApiKey;
  const response = await fetch(
    `https://api.finage.co.uk/history/crypto/depth/${symbol}usd/${from}/${to}?apikey=${runtimeConfig}`
  );
  console.log(response);
}